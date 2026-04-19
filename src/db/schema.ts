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
