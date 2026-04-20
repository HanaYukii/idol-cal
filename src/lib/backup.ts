import { createEvents, type EventAttributes } from 'ics'
import { db, type Artist, type IdolEvent } from '@/db/schema'

interface BackupFile {
  version: 1
  exportedAt: string
  app: 'idol-cal'
  artists: Artist[]
  events: IdolEvent[]
}

// ── JSON ──────────────────────────────────────────────────────────

export async function exportJSONText(): Promise<string> {
  const [artists, events] = await Promise.all([
    db.artists.toArray(),
    db.events.toArray(),
  ])
  const data: BackupFile = {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: 'idol-cal',
    artists,
    events,
  }
  return JSON.stringify(data, null, 2)
}

export async function downloadJSONBackup(): Promise<void> {
  const text = await exportJSONText()
  const today = new Date().toISOString().slice(0, 10)
  triggerDownload(text, `idol-cal-${today}.json`, 'application/json')
}

interface ImportResult {
  artistsAdded: number
  eventsAdded: number
}

export async function importJSONText(
  text: string,
  mode: 'replace' | 'merge',
): Promise<ImportResult> {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('JSON 格式錯誤')
  }
  if (!data || typeof data !== 'object') {
    throw new Error('不是有效的備份檔')
  }
  const d = data as Partial<BackupFile>
  if (d.version !== 1) {
    throw new Error(`不支援的備份版本：${d.version}`)
  }
  if (!Array.isArray(d.artists) || !Array.isArray(d.events)) {
    throw new Error('備份檔缺少 artists 或 events')
  }

  // Basic shape check
  for (const a of d.artists) {
    if (typeof a.id !== 'string' || typeof a.name !== 'string' || typeof a.color !== 'string') {
      throw new Error('artists 格式錯誤')
    }
  }
  for (const e of d.events) {
    if (
      typeof e.id !== 'string' ||
      typeof e.title !== 'string' ||
      typeof e.date !== 'string' ||
      !Array.isArray(e.artistIds)
    ) {
      throw new Error('events 格式錯誤')
    }
  }

  await db.transaction('rw', db.artists, db.events, async () => {
    if (mode === 'replace') {
      await db.events.clear()
      await db.artists.clear()
    }
    // bulkPut overwrites by primary key, so merge mode effectively
    // updates existing records with same id
    await db.artists.bulkPut(d.artists as Artist[])
    await db.events.bulkPut(d.events as IdolEvent[])
  })

  return {
    artistsAdded: d.artists.length,
    eventsAdded: d.events.length,
  }
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
