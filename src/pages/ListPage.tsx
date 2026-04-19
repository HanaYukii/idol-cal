import { useEvents } from '@/db/events'
import { useArtists } from '@/db/artists'

export default function ListPage() {
  const events = useEvents()
  const artists = useArtists()
  const artistById = new Map(artists.map((a) => [a.id, a]))

  return (
    <div className="p-4">
      <header className="mb-6 pt-2">
        <h1 className="text-2xl font-semibold tracking-tight">清單</h1>
        <p className="mt-1 text-sm text-zinc-500">
          共 {events.length} 筆活動
        </p>
      </header>

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 p-6 text-center text-zinc-500">
          <p className="text-sm">還沒有任何活動</p>
          <p className="mt-1 text-xs">到「團體」加一個推し，再回來新增活動</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {events.map((ev) => (
            <li
              key={ev.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3"
            >
              <div className="text-xs text-zinc-500">{ev.date}</div>
              <div className="mt-0.5 font-medium">{ev.title}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {ev.artistIds.map((id) => {
                  const a = artistById.get(id)
                  if (!a) return null
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-0.5 text-xs"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: a.color }}
                      />
                      {a.name}
                    </span>
                  )
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
