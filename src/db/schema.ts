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
}

type DB = Dexie & {
  artists: EntityTable<Artist, 'id'>
  events: EntityTable<IdolEvent, 'id'>
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
