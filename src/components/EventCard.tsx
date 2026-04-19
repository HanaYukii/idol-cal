import type { Artist, IdolEvent } from '@/db/schema'

interface EventCardProps {
  event: IdolEvent
  artistById: Map<string, Artist>
  /** Dim the card (for past events) */
  muted?: boolean
  /** Hide the date line (when context already shows the date) */
  hideDate?: boolean
  /** If provided, card becomes a clickable button */
  onClick?: () => void
}

export default function EventCard({
  event,
  artistById,
  muted,
  hideDate,
  onClick,
}: EventCardProps) {
  const meta = hideDate
    ? event.startTime
      ? `${event.startTime} 開演`
      : ''
    : `${event.date}${event.startTime ? ` · ${event.startTime} 開演` : ''}`

  const clickable = !!onClick
  const Element = clickable ? 'button' : 'div'

  return (
    <Element
      type={clickable ? 'button' : undefined}
      onClick={onClick}
      className={`block w-full rounded-lg border border-zinc-300 bg-white/70 p-3 text-left shadow-sm backdrop-blur-sm transition ${
        muted ? 'opacity-60' : ''
      } ${clickable ? 'hover:border-zinc-400 hover:bg-white/90 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200' : ''}`}
    >
      {meta && <div className="text-xs text-zinc-500">{meta}</div>}
      <div className="mt-0.5 font-medium text-zinc-900">{event.title}</div>
      {event.venue && (
        <div className="mt-0.5 text-xs text-zinc-600">{event.venue}</div>
      )}
      <div className="mt-1 flex flex-wrap gap-1">
        {event.artistIds.map((id) => {
          const a = artistById.get(id)
          if (!a) return null
          return (
            <span
              key={id}
              className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-xs text-zinc-700 ring-1 ring-zinc-200"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: a.color }}
              />
              {a.name}
            </span>
          )
        })}
      </div>
    </Element>
  )
}
