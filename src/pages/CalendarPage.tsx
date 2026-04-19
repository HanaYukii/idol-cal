import { useEffect, useRef } from 'react'
import { useEvents } from '@/db/events'
import { useArtists } from '@/db/artists'
import { todayJST, parseISODate } from '@/lib/timezone'
import EventCard from '@/components/EventCard'
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
  const today = todayJST()
  const todayRef = useRef<HTMLLIElement>(null)
  const hasEvents = events.length > 0

  const months = groupByMonth(events)

  useEffect(() => {
    if (!hasEvents || !todayRef.current) return
    const el = todayRef.current
    requestAnimationFrame(() => {
      const y =
        window.scrollY + el.getBoundingClientRect().top - 110 /* nav + month header + gap */
      window.scrollTo({ top: y, behavior: 'instant' })
    })
  }, [hasEvents])

  return (
    <div className="p-4">
      <header className="mb-6 pt-2">
        <h1 className="text-2xl font-semibold tracking-tight">月曆</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {events.length} 筆活動 · JST {today}
        </p>
      </header>

      {!hasEvents ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white/60 p-6 text-center text-zinc-500">
          <p className="text-sm">還沒有任何活動</p>
          <p className="mt-1 text-xs">
            到「設定」按「載入 demo 資料」，或自己到「團體」加一個推し
          </p>
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
                  const isWeekend =
                    parsed.getDay() === 0 || parsed.getDay() === 6

                  return (
                    <li
                      key={date}
                      ref={isToday ? todayRef : undefined}
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
    </div>
  )
}
