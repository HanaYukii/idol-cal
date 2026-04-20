import { useEffect, useState } from 'react'
import { parseICS, type ParsedICSEvent } from '@/lib/icsImport'
import { useArtists } from '@/db/artists'
import { db, type IdolEvent } from '@/db/schema'

interface ICSImportDialogProps {
  open: boolean
  file: File | null
  onClose: () => void
  onImported: (count: number) => void
}

export default function ICSImportDialog({
  open,
  file,
  onClose,
  onImported,
}: ICSImportDialogProps) {
  const artists = useArtists()
  const [events, setEvents] = useState<ParsedICSEvent[]>([])
  const [error, setError] = useState<string | null>(null)
  const [artistId, setArtistId] = useState<string>('')
  const [importing, setImporting] = useState(false)

  useEffect(() => {
    if (!open || !file) return
    setError(null)
    setEvents([])
    setArtistId('')
    file
      .text()
      .then((text) => {
        try {
          const parsed = parseICS(text)
          setEvents(parsed)
          if (parsed.length === 0) {
            setError('沒有解析到任何事件')
          }
        } catch (e) {
          setError(
            `iCal 格式解析失敗：${e instanceof Error ? e.message : String(e)}`,
          )
        }
      })
      .catch((e) => {
        setError(`讀檔失敗：${e instanceof Error ? e.message : String(e)}`)
      })
  }, [open, file])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  async function handleConfirm() {
    if (!artistId || events.length === 0) return
    setImporting(true)
    try {
      const now = Date.now()
      const rows: IdolEvent[] = events.map((ev) => ({
        id: crypto.randomUUID(),
        artistIds: [artistId],
        title: ev.title,
        date: ev.date,
        startTime: ev.startTime,
        venue: ev.venue,
        note: ev.note,
        url: ev.url,
        createdAt: now,
        updatedAt: now,
      }))
      await db.events.bulkAdd(rows)
      onImported(rows.length)
      onClose()
    } finally {
      setImporting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="關閉"
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
      />
      <div className="relative z-10 my-auto w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-zinc-900">匯入 iCal (.ics)</h2>
        <p className="mt-1 text-xs text-zinc-500">
          TimeTree / Google Calendar / iOS 行事曆匯出的檔案都能吃。時區會自動轉成 JST。
        </p>

        {error ? (
          <div className="mt-5">
            <p className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
              >
                關閉
              </button>
            </div>
          </div>
        ) : events.length === 0 ? (
          <p className="mt-5 text-sm text-zinc-500">解析中…</p>
        ) : (
          <>
            <div className="mt-5 space-y-3">
              <p className="text-sm text-zinc-700">
                解析到 <strong>{events.length}</strong> 筆事件：
              </p>
              <ul className="max-h-40 space-y-0.5 overflow-y-auto rounded-md border border-zinc-200 bg-zinc-50 p-2 text-xs text-zinc-700">
                {events.slice(0, 10).map((ev, i) => (
                  <li key={i} className="truncate">
                    <span className="font-mono text-zinc-500">{ev.date}</span>
                    {ev.startTime && (
                      <span className="font-mono text-zinc-500">
                        {' '}
                        {ev.startTime}
                      </span>
                    )}
                    <span className="ml-2">{ev.title}</span>
                  </li>
                ))}
                {events.length > 10 && (
                  <li className="text-zinc-400">
                    …還有 {events.length - 10} 筆
                  </li>
                )}
              </ul>

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-zinc-600">
                  全部指定給 <span className="text-rose-500">*</span>
                </span>
                <select
                  value={artistId}
                  onChange={(e) => setArtistId(e.target.value)}
                  className="w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                  required
                >
                  <option value="">── 請選擇 ──</option>
                  {artists.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
                {artists.length === 0 && (
                  <p className="mt-1 text-xs text-rose-500">
                    還沒有推し，先到「推し」頁新增後再試
                  </p>
                )}
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={importing}
                className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={importing || !artistId || events.length === 0}
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
              >
                {importing ? '匯入中…' : `匯入 ${events.length} 筆`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
