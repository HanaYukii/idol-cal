import { useState } from 'react'
import { useEvents } from '@/db/events'
import { useArtists } from '@/db/artists'
import { todayJST } from '@/lib/timezone'
import EventCard from '@/components/EventCard'

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
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white/60 p-6 text-center text-zinc-500">
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
                <li key={ev.id}>
                  <EventCard event={ev} artistById={artistById} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-lg border border-zinc-200 bg-white/60 p-4 text-center text-sm text-zinc-500">
              今後沒有排定的活動
            </div>
          )}

          {past.length > 0 && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowPast((v) => !v)}
                className="w-full rounded-md border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-600 hover:bg-white"
              >
                {showPast
                  ? `收起過去活動`
                  : `顯示過去活動（${past.length} 筆）`}
              </button>

              {showPast && (
                <ul className="mt-3 space-y-2">
                  {past.map((ev) => (
                    <li key={ev.id}>
                      <EventCard event={ev} artistById={artistById} muted />
                    </li>
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
