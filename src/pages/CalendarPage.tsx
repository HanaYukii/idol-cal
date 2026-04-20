import { useEffect, useRef, useState } from 'react'
import { useEvents } from '@/db/events'
import { useArtists } from '@/db/artists'
import { todayJST, parseISODate } from '@/lib/timezone'
import { useEventFilter, filterEvents } from '@/lib/filters'
import EventCard from '@/components/EventCard'
import EventDialog from '@/components/EventDialog'
import FilterBar from '@/components/FilterBar'
import type { IdolEvent } from '@/db/schema'

const WEEKDAYS_JA = ['日', '月', '火', '水', '木', '金', '土']

interface MonthGroup {
  key: string
  year: number
  month: number
  days: { date: string; events: IdolEvent[] }[]
}

function groupByMonth(events: IdolEvent[]): MonthGroup[] {
  const byMonth = new Map<string, Map<string, IdolEvent[]>>()
  for (const ev of events) {
    const monthKey = ev.date.slice(0, 7)
    let byDay = byMonth.get(monthKey)
    if (!byDay) {
      byDay = new Map()
      byMonth.set(monthKey, byDay)
    }
    const dayBucket = byDay.get(ev.date)
    if (dayBucket) dayBucket.push(ev)
    else byDay.set(ev.date, [ev])
  }
  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, byDay]) => {
      const [year, month] = key.split('-').map(Number)
      return {
        key,
        year,
        month,
        days: [...byDay.entries()]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, dayEvents]) => ({ date, events: dayEvents })),
      }
    })
}

export default function CalendarPage() {
  const events = useEvents()
  const artists = useArtists()
  const artistById = new Map(artists.map((a) => [a.id, a]))

  const filter = useEventFilter()
  const filtered = filterEvents(events, filter)

  const today = todayJST()
  const anchorRef = useRef<HTMLLIElement>(null)
  const hasEvents = filtered.length > 0

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<IdolEvent | null>(null)

  const months = groupByMonth(filtered)
  // If today exists in filtered set, scroll to it; else scroll to the
  // first event in range so the user starts where the data is.
  const hasToday = filtered.some((e) => e.date === today)
  const anchorDate = hasToday
    ? today
    : (filtered[0]?.date ?? '')

  useEffect(() => {
    if (!hasEvents || !anchorRef.current) return
    const el = anchorRef.current
    requestAnimationFrame(() => {
      const y = window.scrollY + el.getBoundingClientRect().top - 110
      window.scrollTo({ top: y, behavior: 'instant' })
    })
  }, [hasEvents, anchorDate])

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
          <h1 className="text-2xl font-semibold tracking-tight">月曆</h1>
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
        <div className="space-y-8">
          {months.map(({ key, year, month, days }) => (
            <section key={key}>
              <h2 className="sticky top-[52px] z-10 -mx-4 mb-4 border-y border-zinc-200/70 bg-white/75 px-4 py-2 text-sm font-semibold tracking-tight text-zinc-700 backdrop-blur-md sm:-mx-6 sm:px-6">
                {year} 年 {month} 月
              </h2>
              <ol className="space-y-5">
                {days.map(({ date, events: dayEvents }) => {
                  const parsed = parseISODate(date)
                  const weekday = WEEKDAYS_JA[parsed.getDay()]
                  const [, m, d] = date.split('-').map(Number)
                  const isToday = date === today
                  const isPast = date < today
                  const isAnchor = date === anchorDate
                  const isWeekend =
                    parsed.getDay() === 0 || parsed.getDay() === 6

                  return (
                    <li
                      key={date}
                      ref={isAnchor ? anchorRef : undefined}
                      className="flex scroll-mt-28 gap-4"
                    >
                      <div
                        className={`w-14 flex-shrink-0 pt-1 text-right ${
                          isToday
                            ? 'text-pink-600'
                            : isPast
                              ? 'text-zinc-400'
                              : isWeekend
                                ? 'text-rose-500'
                                : 'text-zinc-700'
                        }`}
                      >
                        <div
                          className={`text-lg leading-none ${
                            isToday ? 'font-bold' : 'font-semibold'
                          }`}
                        >
                          {m}/{d}
                        </div>
                        <div className="mt-0.5 text-xs">({weekday})</div>
                        {isToday && (
                          <div className="mt-1 inline-block rounded-full bg-pink-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                            今日
                          </div>
                        )}
                      </div>
                      <ol className="flex-1 space-y-2">
                        {dayEvents.map((ev) => (
                          <li key={ev.id}>
                            <EventCard
                              event={ev}
                              artistById={artistById}
                              hideDate
                              muted={isPast}
                              onClick={() => openEdit(ev)}
                            />
                          </li>
                        ))}
                      </ol>
                    </li>
                  )
                })}
              </ol>
            </section>
          ))}
        </div>
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
