import { createEvents, type EventAttributes } from 'ics'
import { db, type Artist, type IdolEvent, type Plan } from '@/db/schema'

interface BackupFile {
  /** 2 = artists + events (with attended flags) + plans. */
  version: 2
  exportedAt: string
  app: 'idol-cal'
  artists: Artist[]
  events: IdolEvent[]
  plans: Plan[]
}

// ── JSON ──────────────────────────────────────────────────────────

export async function exportJSONText(): Promise<string> {
  const [artists, events, plans] = await Promise.all([
    db.artists.toArray(),
    db.events.toArray(),
    db.plans.toArray(),
  ])
  const data: BackupFile = {
    version: 2,
    exportedAt: new Date().toISOString(),
    app: 'idol-cal',
    artists,
    events,
    plans,
  }
  return JSON.stringify(data, null, 2)
}

export async function downloadJSONBackup(): Promise<void> {
  const text = await exportJSONText()
  const today = new Date().toISOString().slice(0, 10)
  triggerDownload(text, `idol-cal-${today}.json`, 'application/json')
}

// ── iCal ──────────────────────────────────────────────────────────

type DateArray =
  | [number, number, number]
  | [number, number, number, number, number]

function eventToICS(ev: IdolEvent, artistById: Map<string, Artist>): EventAttributes {
  const [y, m, d] = ev.date.split('-').map(Number)
  const artistNames = ev.artistIds
    .map((id) => artistById.get(id)?.name)
    .filter((n): n is string => !!n)
    .join(' / ')

  const descriptionParts: string[] = []
  if (artistNames) descriptionParts.push(artistNames)
  if (ev.note) descriptionParts.push(ev.note)

  if (ev.startTime) {
    const [h, mi] = ev.startTime.split(':').map(Number)
    return {
      uid: `${ev.id}@idol-cal`,
      title: ev.title,
      description: descriptionParts.join('\n') || undefined,
      location: ev.venue,
      url: ev.url,
      start: [y, m, d, h, mi] as DateArray,
      startOutputType: 'local',
      duration: { hours: 2 },
      calName: 'idol-cal',
    }
  }

  return {
    uid: `${ev.id}@idol-cal`,
    title: ev.title,
    description: descriptionParts.join('\n') || undefined,
    location: ev.venue,
    url: ev.url,
    start: [y, m, d] as DateArray,
    duration: { days: 1 },
    calName: 'idol-cal',
  }
}

export async function exportICSText(): Promise<string> {
  const [artists, events] = await Promise.all([
    db.artists.toArray(),
    db.events.toArray(),
  ])
  const artistById = new Map(artists.map((a) => [a.id, a]))
  const icsEvents = events.map((ev) => eventToICS(ev, artistById))

  const { value, error } = createEvents(icsEvents)
  if (error) throw error
  return value ?? ''
}

export async function downloadICSBackup(): Promise<void> {
  const text = await exportICSText()
  const today = new Date().toISOString().slice(0, 10)
  triggerDownload(text, `idol-cal-${today}.ics`, 'text/calendar')
}

// ── helpers ───────────────────────────────────────────────────────

function triggerDownload(text: string, filename: string, mime: string): void {
  const blob = new Blob([text], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
