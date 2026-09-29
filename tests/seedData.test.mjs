import 'fake-indexeddb/auto'
import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { after, beforeEach, test } from 'node:test'
import Dexie from 'dexie'

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/')) {
      return nextResolve(new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url).href, context)
    }
    if (specifier.startsWith('.') && context.parentURL?.endsWith('.ts') && !specifier.endsWith('.ts')) {
      return nextResolve(`${specifier}.ts`, context)
    }
    return nextResolve(specifier, context)
  },
})
const { db } = await import('../src/db/schema.ts')
const { loadSeedData, currentSeedSignatures, seedSignature } = await import('../src/lib/seedData.ts')
const { RETIRED_SEED_EVENTS } = await import('../src/db/retiredSeedEvents.ts')
const SEED_COUNT = currentSeedSignatures().length
const artistId = async (name) => (await db.artists.where('name').equals(name).first()).id
const { createPlan, setPlanEvents, togglePlanEvent } = await import('../src/db/plans.ts')
const { exportJSONText } = await import('../src/lib/backup.ts')
beforeEach(async () => { await db.delete(); await db.open() })
after(async () => { await db.delete() })

test('repeat and concurrent loads add each artist and show only once', async () => {
  const results = await Promise.all([loadSeedData(), loadSeedData()])
  assert.equal(results.reduce((n, r) => n + r.artistsAdded, 0), 8)
  const count = await db.events.count()
  assert.equal(count, SEED_COUNT)
  assert.equal(results.reduce((n, r) => n + r.eventsAdded, 0), count)
  const again = await loadSeedData()
  assert.deepEqual(again, { artistsAdded: 0, eventsAdded: 0, eventsSkipped: count })
  const shows = await db.events.filter(e => e.title.includes('as mona')).toArray()
  assert.equal(shows.length, 3)
  assert.equal(shows.filter(e => e.date === '2026-12-13').length, 2)
  assert.equal(await db.artists.where('name').equals('僕が見たかった青空').count(), 0)
  // Stage plays / reading theatre are out of scope for the demo data.
  assert.equal(await db.events.filter(e => /舞台|リーディング|朗読/.test(e.title)).count(), 0)
})

test('legacy random IDs and missing times are recognized without overwriting edits', async () => {
  await loadSeedData()
  const all = await db.events.toArray()
  const sweet = all.find(e => e.date === '2026-09-07' && e.title.includes('SWEET STEP'))
  const currentCount = all.length
  // Model a database imported with the old loader, before seedKey existed.
  for (const e of all) delete e.seedKey
  sweet.title = sweet.title.replace('池袋', '都内某所')
  delete sweet.startTime
  sweet.note = '我的備註'
  await db.events.bulkPut(all)
  const artist = await db.artists.toCollection().first()
  await db.artists.update(artist.id, { color: '#123456' })
  const result = await loadSeedData()
  assert.equal(result.eventsAdded, 0)
  assert.equal(await db.events.count(), currentCount)
  assert.equal((await db.events.get(sweet.id)).note, '我的備註')
  assert.equal((await db.artists.get(artist.id)).color, '#123456')
  // Identity is retained even after title/date/time edits on subsequent loads.
  await db.events.update(sweet.id, { title: '我的活動名稱', date: '2027-07-01', startTime: '21:30' })
  assert.equal((await loadSeedData()).eventsAdded, 0)
  assert.equal((await db.events.get(sweet.id)).title, '我的活動名稱')
})

test('partial data keeps manual events and distinct show times', async () => {
  await loadSeedData()
  const shows = await db.events.toArray()
  const first = shows[0]
  await db.events.clear()
  delete first.seedKey
  await db.events.add(first)
  const manual = { ...first, id: 'manual', title: '自訂活動', note: '保留我' }
  await db.events.add(manual)
  const result = await loadSeedData()
  assert.equal(result.eventsAdded, shows.length - 1)
  assert.deepEqual(await db.events.get('manual'), manual)
  assert.equal((await loadSeedData()).eventsAdded, 0)
})

test('failed imports roll back artists and events', async () => {
  const original = db.events.add
  let calls = 0
  db.events.add = function (...args) {
    if (++calls === 3) throw new Error('simulated write failure')
    return original.apply(this, args)
  }
  try { await assert.rejects(loadSeedData(), /simulated write failure/) }
  finally { db.events.add = original }
  assert.equal(await db.artists.count(), 0)
  assert.equal(await db.events.count(), 0)
  assert((await loadSeedData()).eventsAdded > 200)
})

test('v1 upgrade removes Bokuao only, retaining shared appearances and other data', async () => {
  await db.delete()
  const legacy = new Dexie('idol-cal')
  legacy.version(1).stores({ artists: 'id, name, createdAt', events: 'id, date, createdAt, *artistIds' })
  await legacy.table('artists').bulkAdd([
    { id: 'bokuao', name: '僕が見たかった青空', color: '#fff', createdAt: 1 },
    { id: 'keep', name: 'TrySail', color: '#123456', createdAt: 1 },
  ])
  const event = { title: '出演', date: '2027-01-01', createdAt: 1, updatedAt: 1, note: '保留' }
  await legacy.table('events').bulkAdd([
    { ...event, id: 'solo', artistIds: ['bokuao'] },
    { ...event, id: 'shared', artistIds: ['bokuao', 'keep'] },
    { ...event, id: 'unrelated', artistIds: ['keep'] },
  ])
  legacy.close()
  await db.open()
  assert.equal(await db.artists.get('bokuao'), undefined)
  assert.equal(await db.events.get('solo'), undefined)
  assert.deepEqual((await db.events.get('shared')).artistIds, ['keep'])
  assert.equal((await db.events.get('shared')).note, '保留')
  assert.equal((await db.events.get('unrelated')).updatedAt, 1)
  await loadSeedData()
  assert.equal(await db.artists.where('name').equals('僕が見たかった青空').count(), 0)
})

test('upgrading an old install clears seeded drama shows but keeps everything else', async () => {
  await db.delete()
  const legacy = new Dexie('idol-cal')
  legacy.version(2).stores({ artists: 'id, name, createdAt', events: 'id, date, createdAt, *artistIds' })
  await legacy.table('artists').add({ id: 'ebi', name: '私立恵比寿中学', color: '#fff', createdAt: 1 })
  const base = { artistIds: ['ebi'], createdAt: 1, updatedAt: 1 }
  await legacy.table('events').bulkAdd([
    { ...base, id: 'play', date: '2026-12-04', title: '舞台「けものフレンズ」×私立恵比寿中学' },
    { ...base, id: 'tosca', date: '2026-09-09', title: '【公演延期】リーディング・オペラ Op.4「トスカ」DAY1 昼公演' },
    { ...base, id: 'mine', date: '2026-12-04', title: '我自己的活動', attended: true, note: '保留' },
  ])
  legacy.close()
  await db.open()
  assert.equal(db.verno, 4)
  await loadSeedData()
  assert.equal(await db.events.get('play'), undefined)
  assert.equal(await db.events.get('tosca'), undefined)
  assert.deepEqual(await db.events.get('mine'), { ...base, id: 'mine', date: '2026-12-04', title: '我自己的活動', attended: true, note: '保留' })
  assert.equal(await db.artists.get('ebi').then(a => a.color), '#fff')
})

test('reloading demo data clears retired titles even after the migration already ran', async () => {
  await loadSeedData()
  const before = await db.events.count()
  // Model the very first demo (2026-08) still sitting in a browser: 2 Tosca rows, old spelling.
  const base = { artistIds: [await artistId('私立恵比寿中学')], createdAt: 1, updatedAt: 1 }
  await db.events.bulkAdd([
    { ...base, id: 'old1', title: 'リーディング・オペラ Op.4「トスカ」DAY1', date: '2026-09-09' },
    { ...base, id: 'old2', title: 'リーディング・オペラ Op.4「トスカ」DAY2', date: '2026-09-10' },
  ])
  const r = await loadSeedData()
  assert.equal(r.eventsAdded, 0)
  assert.equal(await db.events.count(), before)
  assert.equal(await db.events.get('old1'), undefined)
})

test('JSON export carries plans and attended flags', async () => {
  await loadSeedData()
  const [a, b, c] = await db.events.orderBy('date').limit(3).toArray()
  await db.events.update(a.id, { attended: true })
  const plan = await createPlan('9月東京')
  await setPlanEvents(plan.id, [a.id, b.id])
  await togglePlanEvent(plan.id, c.id)
  await togglePlanEvent(plan.id, a.id)
  assert.deepEqual((await db.plans.get(plan.id)).eventIds, [b.id, c.id])

  const parsed = JSON.parse(await exportJSONText())
  assert.equal(parsed.version, 2)
  assert.equal(parsed.app, 'idol-cal')
  assert.deepEqual(parsed.plans.map(p => p.eventIds), [[b.id, c.id]])
  assert.equal(parsed.events.find(e => e.id === a.id).attended, true)
  assert.equal(parsed.events.length, await db.events.count())
})

test('a renamed event leaves no duplicate and keeps its attended mark and plan slot', async () => {
  await loadSeedData()
  const ss = await artistId('SWEET STEADY')
  const current = await db.events.filter(e => e.date === '2026-12-18' && e.artistIds.includes(ss)).first()
  // What an August install still holds: the tour under its first title, marked as attended and planned.
  await db.events.add({ id: 'old-tour', title: 'SWEET STEADY JAPAN HALL TOUR 2026 — 有明', date: '2026-12-18',
    artistIds: [ss], attended: true, createdAt: 1, updatedAt: 1 })
  const plan = await createPlan('12月')
  await setPlanEvents(plan.id, ['old-tour', current.id])

  await loadSeedData()
  assert.equal(await db.events.get('old-tour'), undefined)
  assert.equal(await db.events.count(), SEED_COUNT)
  assert.equal((await db.events.get(current.id)).attended, true)
  assert.deepEqual((await db.plans.get(plan.id)).eventIds, [current.id])
})

test('an event that gained an artist leaves no single-artist copy behind', async () => {
  await loadSeedData()
  const cs = await artistId('CUTIE STREET')
  await db.events.add({ id: 'cs-only', date: '2026-10-12', artistIds: [cs], createdAt: 1, updatedAt: 1,
    title: 'KAWAII LAB. COLLECTION produced by TGC 〜KAWAIIっちゃ in KITAKYUSHU〜' })
  await loadSeedData()
  assert.equal(await db.events.get('cs-only'), undefined)
  assert.equal(await db.events.count(), SEED_COUNT)
})

test('exact copies from the old loader collapse into one row', async () => {
  await loadSeedData()
  const all = await db.events.toArray()
  await db.events.bulkAdd(all.map(({ seedKey, seedSnapshot, ...e }) => ({ ...e, id: 'copy-' + e.id, createdAt: 1 })))
  assert.equal(await db.events.count(), SEED_COUNT * 2)
  await loadSeedData()
  assert.equal(await db.events.count(), SEED_COUNT)
})

test('hand-made events are never swept up, even when they look like demo data', async () => {
  await loadSeedData()
  const ss = await artistId('SWEET STEADY')
  const mine = { id: 'mine', title: 'SWEET STEADY JAPAN HALL TOUR 2026 — 有明', date: '2026-12-18',
    artistIds: [ss], createdAt: Date.now(), updatedAt: Date.now(), note: '我自己加的' }
  await db.events.add(mine)
  await loadSeedData()
  assert.deepEqual(await db.events.get('mine'), mine)
})

test('unedited demo rows pick up newer details; edited ones keep the user\'s values', async () => {
  await loadSeedData()
  const ss = await artistId('SWEET STEADY')
  const budokan = await db.events.filter(e => e.date === '2027-03-04' && e.artistIds.includes(ss)).first()
  const fresh = { ...budokan }
  // An install from before snapshots: no time yet, older note.
  await db.events.update(budokan.id, { startTime: undefined, note: '初の武道館', seedSnapshot: undefined })
  // A row the user edited after the loader wrote it.
  const other = await db.events.filter(e => e.date === '2026-12-18' && e.artistIds.includes(ss)).first()
  await db.events.update(other.id, { note: '抽到了 A 區' })

  await loadSeedData()
  const refreshed = await db.events.get(budokan.id)
  assert.equal(refreshed.startTime, fresh.startTime)
  assert.equal(refreshed.note, fresh.note)
  assert.equal(refreshed.seedSnapshot, fresh.seedSnapshot)
  assert.equal((await db.events.get(other.id)).note, '抽到了 A 區')
})

test('artists dropped from the roster go, shared events keep the rest', async () => {
  await db.delete()
  const legacy = new Dexie('idol-cal')
  legacy.version(3).stores({ artists: 'id, name, createdAt', events: 'id, date, createdAt, *artistIds', plans: 'id, createdAt' })
  await legacy.table('artists').bulkAdd([
    { id: 'eq', name: '=LOVE', color: '#fff', createdAt: 1 },
    { id: 'uk', name: 'ukka', color: '#fff', createdAt: 1 },
    { id: 'ebi', name: '私立恵比寿中学', color: '#fff', createdAt: 1 },
  ])
  const e = { createdAt: 1, updatedAt: 1, date: '2026-05-12' }
  await legacy.table('events').bulkAdd([
    { ...e, id: 'solo', artistIds: ['eq'], title: '=LOVE STADIUM LIVE' },
    { ...e, id: 'two-man', artistIds: ['ebi', 'uk'], title: '私立恵比寿中学 × ukka ツーマンライブ' },
  ])
  legacy.close()
  await db.open()
  assert.equal(await db.artists.get('eq'), undefined)
  assert.equal(await db.artists.get('uk'), undefined)
  assert.equal(await db.events.get('solo'), undefined)
  assert.deepEqual((await db.events.get('two-man')).artistIds, ['ebi'])
})

test('no retired signature is something the demo still ships', () => {
  const current = new Set(currentSeedSignatures())
  assert.equal(current.size, SEED_COUNT, 'every seed event needs a distinct date/title/artists')
  for (const [date, title, names] of RETIRED_SEED_EVENTS) {
    assert(!current.has(seedSignature(date, title, [...names])), `still shipped: ${date} ${title}`)
  }
})
