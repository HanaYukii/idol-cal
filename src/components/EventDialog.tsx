import { useEffect, useState } from 'react'
import type { Artist, IdolEvent } from '@/db/schema'
import { createEvent, updateEvent, deleteEvent } from '@/db/events'

interface EventDialogProps {
  open: boolean
  onClose: () => void
  event: IdolEvent | null
  artists: Artist[]
  defaultDate?: string
}

const INPUT_CLASS =
  'w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200'

export default function EventDialog({
  open,
  onClose,
  event,
  artists,
  defaultDate,
}: EventDialogProps) {
  const isEdit = !!event

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [venue, setVenue] = useState('')
  const [note, setNote] = useState('')
  const [url, setUrl] = useState('')
  const [artistIds, setArtistIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (event) {
      setTitle(event.title)
      setDate(event.date)
      setStartTime(event.startTime ?? '')
      setVenue(event.venue ?? '')
      setNote(event.note ?? '')
      setUrl(event.url ?? '')
      setArtistIds(event.artistIds)
    } else {
      setTitle('')
      setDate(defaultDate ?? '')
      setStartTime('')
      setVenue('')
      setNote('')
      setUrl('')
      setArtistIds([])
    }
  }, [open, event, defaultDate])

  // ESC to close + body scroll lock
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  function toggleArtist(id: string) {
    setArtistIds((curr) =>
      curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id],
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !date || artistIds.length === 0) return
    setSaving(true)
    try {
      const payload = {
        title: title.trim(),
        date,
        startTime: startTime || undefined,
        venue: venue.trim() || undefined,
        note: note.trim() || undefined,
        url: url.trim() || undefined,
        artistIds,
      }
      if (event) {
        await updateEvent(event.id, payload)
      } else {
        await createEvent(payload)
      }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!event) return
    if (!confirm(`確定要刪除「${event.title}」？`)) return
    setSaving(true)
    try {
      await deleteEvent(event.id)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const canSubmit = !!title.trim() && !!date && artistIds.length > 0

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
      <form
        onSubmit={handleSubmit}
        className="relative z-10 my-auto w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl"
      >
        <h2 className="text-lg font-semibold text-zinc-900">
          {isEdit ? '編輯活動' : '新增活動'}
        </h2>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-600">
              標題 <span className="text-rose-500">*</span>
            </span>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={INPUT_CLASS}
              autoFocus
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-zinc-600">
                日期 <span className="text-rose-500">*</span>
              </span>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={INPUT_CLASS}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-zinc-600">
                開演時間
              </span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={INPUT_CLASS}
              />
            </label>
          </div>

          <div className="block">
            <span className="mb-1.5 block text-xs font-medium text-zinc-600">
              團體 <span className="text-rose-500">*</span>
            </span>
            {artists.length === 0 ? (
              <p className="text-xs text-zinc-500">
                還沒有團體，先到「團體」頁新增
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {artists.map((a) => {
                  const selected = artistIds.includes(a.id)
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggleArtist(a.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition ${
                        selected
                          ? 'border-zinc-900 bg-zinc-900 text-white'
                          : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: a.color }}
                      />
                      {a.name}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-600">
              場地
            </span>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className={INPUT_CLASS}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-600">
              連結
            </span>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className={INPUT_CLASS}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-600">
              備註
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className={`${INPUT_CLASS} resize-none`}
            />
          </label>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          {isEdit ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="text-sm text-rose-600 hover:text-rose-700 disabled:opacity-50"
            >
              刪除
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving || !canSubmit}
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              {saving ? '儲存中…' : '儲存'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
