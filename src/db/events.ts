import { useLiveQuery } from 'dexie-react-hooks'
import { db, type IdolEvent } from './schema'

export interface EventFilter {
  artistIds?: string[]
  from?: string
  to?: string
}

export function useEvents(filter?: EventFilter): IdolEvent[] {
  return useLiveQuery(
    async () => {
      const events = await db.events.orderBy('date').toArray()
      return events.filter((ev) => {
        if (filter?.from && ev.date < filter.from) return false
        if (filter?.to && ev.date > filter.to) return false
        if (filter?.artistIds && filter.artistIds.length > 0) {
          const hit = ev.artistIds.some((a) => filter.artistIds!.includes(a))
          if (!hit) return false
        }
        return true
      })
    },
    [filter?.artistIds?.join(','), filter?.from, filter?.to],
    [],
  )
}

export function useEvent(id: string | undefined) {
  return useLiveQuery(
    () => (id ? db.events.get(id) : Promise.resolve(undefined)),
    [id],
  )
}

export async function createEvent(
  data: Omit<IdolEvent, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<IdolEvent> {
  const now = Date.now()
  const event: IdolEvent = {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...data,
  }
  await db.events.add(event)
  return event
}

export async function updateEvent(
  id: string,
  patch: Partial<Omit<IdolEvent, 'id' | 'createdAt'>>,
): Promise<void> {
  await db.events.update(id, { ...patch, updatedAt: Date.now() })
}

export async function deleteEvent(id: string): Promise<void> {
  await db.events.delete(id)
}
