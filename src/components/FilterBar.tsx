import type { Artist } from '@/db/schema'
import { type DateRange, type EventFilter } from '@/lib/filters'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  artists: Artist[]
  filter: EventFilter
}

const RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'upcoming', label: '今後' },
  { value: 'this-month', label: '本月' },
  { value: 'custom', label: '自訂' },
]

export default function FilterBar({ artists, filter }: FilterBarProps) {
  return (
    <div className="mb-4 rounded-lg border border-zinc-300 bg-white/70 p-3 shadow-sm backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-zinc-500">期間</span>
        {RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => filter.setRange(opt.value)}
            className={cn(
              'rounded-md px-2.5 py-1 text-xs transition',
              filter.range === opt.value
                ? 'bg-zinc-900 text-white'
                : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50',
            )}
          >
            {opt.label}
          </button>
        ))}
        {filter.range === 'custom' && (
          <div className="flex items-center gap-1">
            <input
              type="date"
              value={filter.from ?? ''}
              onChange={(e) => filter.setFrom(e.target.value || undefined)}
              className="rounded border border-zinc-300 bg-white px-2 py-0.5 text-xs text-zinc-700"
            />
            <span className="text-xs text-zinc-400">—</span>
            <input
              type="date"
              value={filter.to ?? ''}
              onChange={(e) => filter.setTo(e.target.value || undefined)}
              className="rounded border border-zinc-300 bg-white px-2 py-0.5 text-xs text-zinc-700"
            />
          </div>
        )}
        {filter.hasActive && (
          <button
            type="button"
            onClick={filter.reset}
            className="ml-auto text-xs text-zinc-500 underline hover:text-zinc-800"
          >
            清除全部
          </button>
        )}
      </div>

      {artists.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-zinc-500">推し</span>
          {artists.map((a) => {
            const selected = filter.artistIds.includes(a.id)
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => filter.toggleArtist(a.id)}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition',
                  selected
                    ? 'border-zinc-900 bg-zinc-900 text-white'
                    : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50',
                )}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: a.color }}
                />
                {a.name}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
