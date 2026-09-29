import Dexie, { type EntityTable } from 'dexie'

export interface Artist {
  id: string
  name: string
  color: string
  createdAt: number
}

export interface IdolEvent {
  id: string
  artistIds: string[]
  title: string
  /** ISO date `yyyy-MM-dd` in JST */
  date: string
  startTime?: string
  venue?: string
  note?: string
  url?: string
  createdAt: number
  updatedAt: number
  /** Identity of an imported demo event, retained when the user edits it. */
  seedKey?: string
  /**
   * The demo fields (title, date, time, venue, url, note) as last written by
   * the loader. If the row still matches it, the user hasn't touched them and
   * the loader may refresh them from newer demo data.
   */
  seedSnapshot?: string
  /** The user went to this show. */
  attended?: boolean
}

/** A trip itinerary: a named, hand-picked set of events. */
export interface Plan {
  id: string
  name: string
  note?: string
  eventIds: string[]
  createdAt: number
  updatedAt: number
}

type DB = Dexie & {
  artists: EntityTable<Artist, 'id'>
  events: EntityTable<IdolEvent, 'id'>
  plans: EntityTable<Plan, 'id'>
}

export const db = new Dexie('idol-cal') as DB

db.version(1).stores({
  artists: 'id, name, createdAt',
  events: 'id, date, createdAt, *artistIds',
})

db.version(2).stores({
  artists: 'id, name, createdAt',
  events: 'id, date, createdAt, *artistIds',
}).upgrade(async (tx) => {
  const removed = await tx.table<Artist>('artists')
    .filter((artist) => artist.name.trim() === '僕が見たかった青空').toArray()
  const ids = new Set(removed.map((artist) => artist.id))
  if (ids.size === 0) return
  const events = await tx.table<IdolEvent>('events').toArray()
  for (const event of events) {
    if (!event.artistIds.some((id) => ids.has(id))) continue
    const artistIds = event.artistIds.filter((id) => !ids.has(id))
    if (artistIds.length === 0) await tx.table('events').delete(event.id)
    else await tx.table('events').update(event.id, { artistIds })
  }
  await tx.table('artists').bulkDelete([...ids])
})

/** Artists the roster dropped; their exclusive events go with them. */
export const REMOVED_ARTIST_NAMES = ['僕が見たかった青空', 'ukka', '=LOVE']

db.version(3).stores({
  artists: 'id, name, createdAt',
  events: 'id, date, createdAt, *artistIds',
  plans: 'id, createdAt',
})

// Drop the artists the roster no longer tracks, the same way version 2 did
// for Bokuao: shared events keep their remaining artists, exclusive ones go.
db.version(4).stores({
  artists: 'id, name, createdAt',
  events: 'id, date, createdAt, *artistIds',
  plans: 'id, createdAt',
}).upgrade(async (tx) => {
  const names = new Set(REMOVED_ARTIST_NAMES)
  const removed = await tx.table<Artist>('artists')
    .filter((artist) => names.has(artist.name.trim())).toArray()
  const ids = new Set(removed.map((artist) => artist.id))
  if (ids.size === 0) return
  for (const event of await tx.table<IdolEvent>('events').toArray()) {
    if (!event.artistIds.some((id) => ids.has(id))) continue
    const artistIds = event.artistIds.filter((id) => !ids.has(id))
    if (artistIds.length === 0) await tx.table('events').delete(event.id)
    else await tx.table('events').update(event.id, { artistIds })
  }
  await tx.table('artists').bulkDelete([...ids])
})
