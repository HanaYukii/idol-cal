import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Artist } from './schema'

export function useArtists(): Artist[] {
  return useLiveQuery(() => db.artists.orderBy('name').toArray(), [], [])
}

export function useArtist(id: string | undefined) {
  return useLiveQuery(
    () => (id ? db.artists.get(id) : Promise.resolve(undefined)),
    [id],
  )
}

export async function createArtist(
  data: Omit<Artist, 'id' | 'createdAt'>,
): Promise<Artist> {
  const artist: Artist = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    ...data,
  }
  await db.artists.add(artist)
  return artist
}

export async function updateArtist(
  id: string,
  patch: Partial<Omit<Artist, 'id' | 'createdAt'>>,
): Promise<void> {
  await db.artists.update(id, patch)
}

export async function deleteArtist(id: string): Promise<void> {
  await db.transaction('rw', db.artists, db.events, async () => {
    await db.artists.delete(id)
    const affected = await db.events.where('artistIds').equals(id).toArray()
    for (const ev of affected) {
      await db.events.update(ev.id, {
        artistIds: ev.artistIds.filter((x) => x !== id),
        updatedAt: Date.now(),
      })
    }
  })
}

export async function countEventsUsingArtist(id: string): Promise<number> {
  return db.events.where('artistIds').equals(id).count()
}
