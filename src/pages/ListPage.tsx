import { useState } from 'react'
import { useEvents } from '@/db/events'
import { useArtists } from '@/db/artists'
import { todayJST } from '@/lib/timezone'
import { useEventFilter, filterEvents } from '@/lib/filters'
import EventCard from '@/components/EventCard'
import EventDialog from '@/components/EventDialog'
import FilterBar from '@/components/FilterBar'
import type { IdolEvent } from '@/db/schema'

export default function ListPage() {
  const events = useEvents()
  const artists = useArtists()
  const artistById = new Map(artists.map((a) => [a.id, a]))

  const filter = useEventFilter()
  const filtered = filterEvents(events, filter)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<IdolEvent | null>(null)

  const today = todayJST()

  function openNew() {
    setEditingEvent(null)
    setDialogOpen(true)
  }

  function openEdit(ev: IdolEvent) {
    setEditingEvent(ev)
    setDialogOpen(true)
  }

  return (
    <div className="p-4">
      <header className="mb-4 flex items-end justify-between gap-3 pt-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">清單</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {filter.hasActive
              ? `${filtered.length} / ${events.length} 筆`
              : `${events.length} 筆活動`}{' '}
            · JST {today}
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          + 新增活動
        </button>
      </header>

      <FilterBar artists={artists} filter={filter} />

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white/60 p-6 text-center text-zinc-500">
          <p className="text-sm">還沒有任何活動</p>
          <p className="mt-1 text-xs">
            點右上「+ 新增活動」，或到「設定」按「載入 demo 資料」
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white/60 p-4 text-center text-sm text-zinc-500">
          沒有符合條件的活動
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((ev) => (
            <li key={ev.id}>
              <EventCard
                event={ev}
                artistById={artistById}
                muted={ev.date < today}
                onClick={() => openEdit(ev)}
              />
            </li>
          ))}
        </ul>
      )}

      <EventDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        event={editingEvent}
        artists={artists}
      />
    </div>
  )
}
