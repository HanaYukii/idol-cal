import { useEffect, useState } from 'react'
import type { Artist } from '@/db/schema'
import {
  createArtist,
  updateArtist,
  deleteArtist,
  countEventsUsingArtist,
} from '@/db/artists'
import { PRESET_COLORS, isValidHexColor } from '@/lib/colors'

interface ArtistDialogProps {
  open: boolean
  onClose: () => void
  artist: Artist | null
}

const INPUT_CLASS =
  'w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200'

export default function ArtistDialog({
  open,
  onClose,
  artist,
}: ArtistDialogProps) {
  const isEdit = !!artist

  const [name, setName] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0].value)
  const [saving, setSaving] = useState(false)
  const [usageCount, setUsageCount] = useState(0)

  useEffect(() => {
    if (!open) return
    if (artist) {
      setName(artist.name)
      setColor(artist.color)
      countEventsUsingArtist(artist.id).then(setUsageCount)
    } else {
      setName('')
      setColor(PRESET_COLORS[0].value)
      setUsageCount(0)
    }
  }, [open, artist])

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !isValidHexColor(color)) return
    setSaving(true)
    try {
      if (artist) {
        await updateArtist(artist.id, { name: name.trim(), color })
      } else {
        await createArtist({ name: name.trim(), color })
      }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!artist) return
    const msg =
      usageCount > 0
        ? `確定要刪除「${artist.name}」？將從 ${usageCount} 筆活動中移除這個 artist（活動本體保留）。`
        : `確定要刪除「${artist.name}」？`
    if (!confirm(msg)) return
    setSaving(true)
    try {
      await deleteArtist(artist.id)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const canSubmit = !!name.trim() && isValidHexColor(color)

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
        className="relative z-10 my-auto w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl"
      >
        <h2 className="text-lg font-semibold text-zinc-900">
          {isEdit ? '編輯推し' : '新增推し'}
        </h2>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-600">
              名稱 <span className="text-rose-500">*</span>
            </span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT_CLASS}
              autoFocus
              placeholder="=LOVE / TrySail / 宮下愛菜 ..."
            />
          </label>

          <div className="block">
            <span className="mb-1.5 block text-xs font-medium text-zinc-600">
              代表色 <span className="text-rose-500">*</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_COLORS.map((p) => {
                const active = color.toLowerCase() === p.value.toLowerCase()
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setColor(p.value)}
                    title={`${p.label} ${p.value}`}
                    className={`h-8 w-8 rounded-full transition ${
                      active
                        ? 'ring-2 ring-zinc-900 ring-offset-2'
                        : 'ring-1 ring-zinc-200 hover:ring-zinc-400'
                    }`}
                    style={{ background: p.value }}
                  />
                )
              })}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span
                className="h-8 w-8 flex-shrink-0 rounded-full ring-1 ring-zinc-200"
                style={{ background: isValidHexColor(color) ? color : '#fff' }}
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#RRGGBB"
                className={`${INPUT_CLASS} flex-1 font-mono`}
                maxLength={7}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          {isEdit ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="text-sm text-rose-600 hover:text-rose-700 disabled:opacity-50"
            >
              刪除{usageCount > 0 ? `（${usageCount} 筆活動）` : ''}
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
