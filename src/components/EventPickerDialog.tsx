import { useEffect, useMemo, useState } from 'react'
import type { Artist, IdolEvent } from '@/db/schema'
import { cn } from '@/lib/utils'

interface EventPickerDialogProps {
  open: boolean
  onClose: () => void
  title: string
  /** Candidate events, any order; the list is sorted by date. */
  events: IdolEvent[]
  artists: Artist[]
  /** Ids already selected when the dialog opens. */
  initialSelected: string[]
  confirmLabel?: string
  onConfirm: (ids: string[]) => Promise<void> | void
}

const WEEKDAYS_JA = ['日', '月', '火', '水', '木', '金', '土']

function weekdayOf(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return WEEKDAYS_JA[new Date(y, m - 1, d).getDay()]
}

export default function EventPickerDialog(props: EventPickerDialogProps) {
  const { open, onClose } = props

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
  // Mounting the panel fresh on each open gives it clean state without effects.
  return <PickerPanel {...props} />
}

function PickerPanel({
  onClose,
  title,
  events,
  artists,
  initialSelected,
  confirmLabel = '確定',
  onConfirm,
}: EventPickerDialogProps) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initialSelected))
  const [query, setQuery] = useState('')
  const [artistIds, setArtistIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const artistById = useMemo(
    () => new Map(artists.map((a) => [a.id, a])),
    [artists],
  )

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return [...events]
      .filter((ev) => {
        if (artistIds.length > 0 && !ev.artistIds.some((id) => artistIds.includes(id))) {
          return false
        }
        if (!q) return true
        const [, m, d] = ev.date.split('-').map(Number)
        return (
          ev.title.toLowerCase().includes(q) ||
          (ev.venue ?? '').toLowerCase().includes(q) ||
          ev.date.includes(q) ||
          `${m}/${d}`.startsWith(q)
        )
      })
      .sort((a, b) =>
        a.date.localeCompare(b.date) ||
        (a.startTime ?? '').localeCompare(b.startTime ?? ''),
      )
  }, [events, query, artistIds])

  function toggle(id: string) {
    setSelected((curr) => {
      const next = new Set(curr)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleArtist(id: string) {
    setArtistIds((curr) =>
      curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id],
    )
  }

  async function handleConfirm() {
    setSaving(true)
    try {
      await onConfirm([...selected])
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const changed =
    selected.size !== initialSelected.length ||
    initialSelected.some((id) => !selected.has(id))

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="關閉"
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
      />
      <div className="relative z-10 flex max-h-[90svh] w-full max-w-2xl flex-col rounded-xl border border-zinc-200 bg-white shadow-2xl">
        <div className="border-b border-zinc-200 p-5 pb-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
            <span className="text-xs text-zinc-500">已選 {selected.size} 筆</span>
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜尋標題、場地或日期（9/20）…"
            className="mt-3 w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
            autoFocus
          />
          {artists.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {artists.map((a) => {
                const on = artistIds.includes(a.id)
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggleArtist(a.id)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition',
                      on
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50',
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: a.color }} />
                    {a.name}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <ul className="flex-1 divide-y divide-zinc-100 overflow-y-auto px-2">
          {visible.length === 0 ? (
            <li className="p-6 text-center text-sm text-zinc-500">沒有符合的活動</li>
          ) : (
            visible.map((ev) => {
              const on = selected.has(ev.id)
              const [, m, d] = ev.date.split('-').map(Number)
              return (
                <li key={ev.id}>
                  <label
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-md px-2 py-2.5 transition hover:bg-zinc-50',
                      on && 'bg-zinc-50',
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggle(ev.id)}
                      className="mt-1 h-4 w-4 accent-zinc-900"
                    />
                    <div className="w-16 flex-shrink-0 pt-0.5 text-xs leading-tight text-zinc-500">
                      <div className="font-medium text-zinc-700">
                        {m}/{d} ({weekdayOf(ev.date)})
                      </div>
                      {ev.startTime && <div>{ev.startTime}</div>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-zinc-900">{ev.title}</div>
                      {ev.venue && (
                        <div className="text-xs text-zinc-500">{ev.venue}</div>
                      )}
                      <div className="mt-1 flex flex-wrap gap-1">
                        {ev.artistIds.map((id) => {
                          const a = artistById.get(id)
                          if (!a) return null
                          return (
                            <span
                              key={id}
                              className="inline-flex items-center gap-1 text-[11px] text-zinc-600"
                            >
                              <span className="h-1.5 w-1.5 rounded-full" style={{ background: a.color }} />
                              {a.name}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  </label>
                </li>
              )
            })
          )}
        </ul>

        <div className="flex items-center justify-between gap-3 border-t border-zinc-200 p-4">
          <span className="text-xs text-zinc-500">顯示 {visible.length} / {events.length} 筆</span>
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
              type="button"
              onClick={handleConfirm}
              disabled={saving || !changed}
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              {saving ? '儲存中…' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
