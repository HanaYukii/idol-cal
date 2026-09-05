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
const { loadSeedData } = await import('../src/lib/seedData.ts')
beforeEach(async () => { await db.delete(); await db.open() })
after(async () => { await db.delete() })

test('repeat and concurrent loads add each artist and show only once', async () => {
  const results = await Promise.all([loadSeedData(), loadSeedData()])
  assert.equal(results.reduce((n, r) => n + r.artistsAdded, 0), 8)
  const count = await db.events.count()
  assert.equal(count, 285)
  assert.equal(results.reduce((n, r) => n + r.eventsAdded, 0), count)
  const again = await loadSeedData()
  assert.deepEqual(again, { artistsAdded: 0, eventsAdded: 0, eventsSkipped: count })
  const shows = await db.events.filter(e => e.title.includes('as mona')).toArray()
  assert.equal(shows.length, 3)
  assert.equal(shows.filter(e => e.date === '2026-12-13').length, 2)
  assert.equal(await db.artists.where('name').equals('僕が見たかった青空').count(), 0)
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
