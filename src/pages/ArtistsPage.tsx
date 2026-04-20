import { useState } from 'react'
import { useArtists } from '@/db/artists'
import ArtistDialog from '@/components/ArtistDialog'
import type { Artist } from '@/db/schema'

export default function ArtistsPage() {
  const artists = useArtists()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Artist | null>(null)

  function openNew() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(a: Artist) {
    setEditing(a)
    setDialogOpen(true)
  }

  return (
    <div className="p-4">
      <header className="mb-6 flex items-end justify-between gap-3 pt-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">推し</h1>
          <p className="mt-1 text-sm text-zinc-500">{artists.length} 組</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          + 新增推し
        </button>
      </header>

      {artists.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white/60 p-6 text-center text-zinc-500">
          <p className="text-sm">還沒有任何推し</p>
          <p className="mt-1 text-xs">
            點右上「新增推し」開始，或到「設定」載入 demo 資料
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {artists.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => openEdit(a)}
                className="flex w-full items-center gap-3 rounded-lg border border-zinc-300 bg-white/70 p-3 text-left shadow-sm backdrop-blur-sm transition hover:border-zinc-400 hover:bg-white/90 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              >
                <span
                  className="h-6 w-6 flex-shrink-0 rounded-full ring-1 ring-zinc-200"
                  style={{ background: a.color }}
                />
                <span className="flex-1 font-medium text-zinc-900">
                  {a.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <ArtistDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        artist={editing}
      />
    </div>
  )
}
