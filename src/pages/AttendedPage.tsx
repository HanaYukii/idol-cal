import { useMemo, useState } from 'react'
import { CircleCheck, X } from 'lucide-react'
import { db } from '@/db/schema'
import { useEvents, updateEvent } from '@/db/events'
import { useArtists } from '@/db/artists'
import { todayJST, parseISODate } from '@/lib/timezone'
import EventCard from '@/components/EventCard'
import EventDialog from '@/components/EventDialog'
import EventPickerDialog from '@/components/EventPickerDialog'
import type { IdolEvent } from '@/db/schema'

const WEEKDAYS_JA = ['日', '月', '火', '水', '木', '金', '土']
const NONE: string[] = []

interface MonthGroup {
  key: string
  year: number
  month: number
  events: IdolEvent[]
}

function groupByMonthDesc(events: IdolEvent[]): MonthGroup[] {
  const byMonth = new Map<string, IdolEvent[]>()
  for (const ev of events) {
    const k = ev.date.slice(0, 7)
    const bucket = byMonth.get(k)
    if (bucket) bucket.push(ev)
    else byMonth.set(k, [ev])
  }
  return [...byMonth.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, list]) => {
      const [year, month] = key.split('-').map(Number)
      return {
        key,
        year,
        month,
        events: [...list].sort(
          (a, b) =>
            b.date.localeCompare(a.date) ||
            (b.startTime ?? '').localeCompare(a.startTime ?? ''),
        ),
      }
    })
}

export default function AttendedPage() {
  const events = useEvents()
  const artists = useArtists()
  const artistById = useMemo(() => new Map(artists.map((a) => [a.id, a])), [artists])
  const today = todayJST()

  const attended = events.filter((ev) => ev.attended)
  const months = groupByMonthDesc(attended)
  const thisYear = today.slice(0, 4)
  const thisYearCount = attended.filter((ev) => ev.date.startsWith(thisYear)).length

  const counts = new Map<string, number>()
  for (const ev of attended) {
    for (const id of ev.artistIds) counts.set(id, (counts.get(id) ?? 0) + 1)
  }
  const perArtist = [...counts.entries()]
    .map(([id, n]) => ({ artist: artistById.get(id), n }))
    .filter((x): x is { artist: NonNullable<typeof x.artist>; n: number } => !!x.artist)
    .sort((a, b) => b.n - a.n || a.artist.name.localeCompare(b.artist.name))

  // Past shows the user hasn't marked yet.
  const candidates = events.filter((ev) => ev.date <= today && !ev.attended)

  const [pickerOpen, setPickerOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<IdolEvent | null>(null)

  async function markAttended(ids: string[]) {
    const now = Date.now()
    await db.transaction('rw', db.events, async () => {
      for (const id of ids) await db.events.update(id, { attended: true, updatedAt: now })
    })
  }

  function openEdit(ev: IdolEvent) {
    setEditingEvent(ev)
    setDialogOpen(true)
  }

  return (
    <div className="p-4">
      <header className="mb-4 flex items-end justify-between gap-3 pt-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">去過</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {attended.length === 0
              ? '還沒標記任何去過的場次'
              : `共 ${attended.length} 場 · ${thisYear} 年 ${thisYearCount} 場`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          <CircleCheck size={14} /> 標記去過
        </button>
      </header>

      {perArtist.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-1.5 rounded-lg border border-zinc-300 bg-white/70 p-3 shadow-sm backdrop-blur-sm">
          <span className="text-xs text-zinc-500">各推し</span>
          {perArtist.map(({ artist, n }) => (
            <span
              key={artist.id}
              className="inline-flex items-center gap-1 rounded-full border border-zinc-300 bg-white px-2 py-0.5 text-xs text-zinc-700"
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: artist.color }} />
              {artist.name}
              <span className="font-semibold text-zinc-900">{n}</span>
            </span>
          ))}
        </div>
      )}

      {attended.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white/60 p-6 text-center text-zinc-500">
          <p className="text-sm">去過的場次會列在這裡</p>
          <p className="mt-1 text-xs">
            按右上「標記去過」從過去的活動裡勾選，或在編輯活動時勾「去過了」
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {months.map(({ key, year, month, events: monthEvents }) => (
            <section key={key}>
              <h2 className="sticky top-[52px] z-10 -mx-4 mb-4 border-y border-zinc-200/70 bg-white/75 px-4 py-2 text-sm font-semibold tracking-tight text-zinc-700 backdrop-blur-md sm:-mx-6 sm:px-6">
                {year} 年 {month} 月
                <span className="ml-2 font-normal text-zinc-400">{monthEvents.length} 場</span>
              </h2>
              <ol className="space-y-2">
                {monthEvents.map((ev) => {
                  const parsed = parseISODate(ev.date)
                  const [, , d] = ev.date.split('-').map(Number)
                  return (
                    <li key={ev.id} className="flex items-start gap-3">
                      <div className="w-10 flex-shrink-0 pt-2 text-right text-zinc-600">
                        <div className="text-base font-semibold leading-none">{d}</div>
                        <div className="mt-0.5 text-[11px]">({WEEKDAYS_JA[parsed.getDay()]})</div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <EventCard
                          event={ev}
                          artistById={artistById}
                          hideDate
                          onClick={() => openEdit(ev)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => updateEvent(ev.id, { attended: false })}
                        className="mt-2 rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-rose-600"
                        aria-label="取消去過"
                        title="取消去過"
                      >
                        <X size={16} />
                      </button>
                    </li>
                  )
                })}
              </ol>
            </section>
          ))}
        </div>
      )}

      <EventPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="標記去過的場次"
        events={candidates}
        artists={artists}
        initialSelected={NONE}
        confirmLabel="標記為去過"
        onConfirm={markAttended}
      />

      <EventDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        event={editingEvent}
        artists={artists}
      />
    </div>
  )
}
