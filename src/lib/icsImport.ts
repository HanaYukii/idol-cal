import ICAL from 'ical.js'
import { JST } from './timezone'

export interface ParsedICSEvent {
  sourceUid: string
  title: string
  /** yyyy-MM-dd in JST */
  date: string
  /** HH:mm in JST, optional (all-day events have none) */
  startTime?: string
  venue?: string
  note?: string
  url?: string
}

/** In-JST yyyy-MM-dd */
function formatJSTDate(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: JST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

/** In-JST HH:mm */
function formatJSTTime(d: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: JST,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)
}

/**
 * Parse an .ics file's text into ParsedICSEvent[]. Handles:
 * - timed events with TZID → converted to JST wall-clock
 * - all-day events (VALUE=DATE) → date only, no startTime
 * - line folding, escapes (\, \n) — ical.js handles these
 */
export function parseICS(text: string): ParsedICSEvent[] {
  const jcal = ICAL.parse(text)
  const comp = new ICAL.Component(jcal)
  const vevents = comp.getAllSubcomponents('vevent')

  const parsed: ParsedICSEvent[] = []
  for (const vevent of vevents) {
    const ev = new ICAL.Event(vevent)
    if (!ev.startDate) continue

    const title = (ev.summary ?? '').trim()
    if (!title) continue

    const start = ev.startDate
    const isDate = start.isDate // true for all-day VALUE=DATE

    let date: string
    let startTime: string | undefined

    if (isDate) {
      // All-day — use the date parts as-is (no TZ conversion needed)
      const y = start.year
      const m = String(start.month).padStart(2, '0')
      const d = String(start.day).padStart(2, '0')
      date = `${y}-${m}-${d}`
    } else {
      // Timed: convert to JST wall-clock
      const jsDate = start.toJSDate()
      date = formatJSTDate(jsDate)
      startTime = formatJSTTime(jsDate)
    }

    const rawUid = ev.uid ?? ''
    parsed.push({
      sourceUid: rawUid,
      title,
      date,
      startTime,
      venue: ev.location?.trim() || undefined,
      note: vevent.getFirstPropertyValue('description')?.toString().trim() || undefined,
      url: vevent.getFirstPropertyValue('url')?.toString() || undefined,
    })
  }

  parsed.sort((a, b) =>
    (a.date + (a.startTime ?? '')).localeCompare(b.date + (b.startTime ?? '')),
  )
  return parsed
}
