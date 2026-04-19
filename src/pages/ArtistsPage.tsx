import { useArtists } from '@/db/artists'

export default function ArtistsPage() {
  const artists = useArtists()

  return (
    <div className="p-4">
      <header className="mb-6 flex items-center justify-between pt-2">
        <h1 className="text-2xl font-semibold tracking-tight">團體</h1>
        <button
          type="button"
          className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          + 新增
        </button>
      </header>

      {artists.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white/60 p-6 text-center text-zinc-500">
          <p className="text-sm">還沒有任何團體 / 推し</p>
          <p className="mt-1 text-xs">點右上「新增」開始</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {artists.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm"
            >
              <span
                className="h-6 w-6 flex-shrink-0 rounded-full ring-1 ring-zinc-200"
                style={{ background: a.color }}
              />
              <span className="flex-1 font-medium text-zinc-900">
                {a.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
