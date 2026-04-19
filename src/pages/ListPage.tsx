import { useState } from 'react'
import { useEvents } from '@/db/events'
import { useArtists } from '@/db/artists'
import { todayJST } from '@/lib/timezone'

export default function ListPage() {
  const [showPast, setShowPast] = useState(false)
  const events = useEvents()
  const artists = useArtists()
  const artistById = new Map(artists.map((a) => [a.id, a]))

  const today = todayJST()
  const upcoming = events.filter((e) => e.date >= today)
  const past = events.filter((e) => e.date < today).reverse()

  return (
    <div className="p-4">
      <header className="mb-6 pt-2">
        <h1 className="text-2xl font-semibold tracking-tight">清單</h1>
        <p className="mt-1 text-sm text-zinc-500">
          今後 {upcoming.length} 筆 · 過去 {past.length} 筆 · JST {today}
        </p>
      </header>

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 p-6 text-center text-zinc-500">
          <p className="text-sm">還沒有任何活動</p>
          <p className="mt-1 text-xs">
            到「設定」按「載入 demo 資料」，或自己到「團體」加一個推し
          </p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 ? (
            <ul className="space-y-2">
              {upcoming.map((ev) => (
                <EventRow key={ev.id} ev={ev} artistById={artistById} />
              ))}
            </ul>
          ) : (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 text-center text-sm text-zinc-500">
              今後沒有排定的活動
            </div>
          )}

          {past.length > 0 && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowPast((v) => !v)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800"
              >
                {showPast
                  ? `收起過去活動`
                  : `顯示過去活動（${past.length} 筆）`}
              </button>

              {showPast && (
                <ul className="mt-3 space-y-2">
                  {past.map((ev) => (
                    <EventRow
                      key={ev.id}
                      ev={ev}
                      artistById={artistById}
                      muted
                    />
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

interface EventRowProps {
  ev: {
    id: string
    artistIds: string[]
    title: string
    date: string
    startTime?: string
    venue?: string
  }
  artistById: Map<string, { id: string; name: string; color: string }>
  muted?: boolean
}

function EventRow({ ev, artistById, muted }: EventRowProps) {
  return (
    <li
      className={`rounded-lg border border-zinc-800 p-3 ${
        muted ? 'bg-zinc-900/20 opacity-60' : 'bg-zinc-900/50'
      }`}
    >
      <div className="text-xs text-zinc-500">
        {ev.date}
        {ev.startTime ? ` · ${ev.startTime} 開演` : ''}
      </div>
      <div className="mt-0.5 font-medium">{ev.title}</div>
      {ev.venue && (
        <div className="mt-0.5 text-xs text-zinc-400">{ev.venue}</div>
      )}
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
  )
}
