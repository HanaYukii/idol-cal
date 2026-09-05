import { useSearchParams } from 'react-router-dom'
import type { IdolEvent } from '@/db/schema'
import { todayJST } from './timezone'

export type DateRange = 'all' | 'upcoming' | 'this-month' | 'custom'

export interface EffectiveRange {
  from?: string
  to?: string
}

function endOfMonth(ym: string): string {
  const [y, m] = ym.split('-').map(Number)
  const last = new Date(y, m, 0).getDate()
  return `${ym}-${String(last).padStart(2, '0')}`
}

export function computeEffective(
  range: DateRange,
  from: string | undefined,
  to: string | undefined,
): EffectiveRange {
  switch (range) {
    case 'upcoming':
      return { from: todayJST(), to: undefined }
    case 'this-month': {
      const ym = todayJST().slice(0, 7)
      return { from: `${ym}-01`, to: endOfMonth(ym) }
    }
    case 'custom':
      return { from, to }
    case 'all':
    default:
      return {}
  }
}

export interface EventFilter {
  artistIds: string[]
  range: DateRange
  from?: string
  to?: string
  effective: EffectiveRange
  hasActive: boolean
  setArtistIds: (ids: string[]) => void
  toggleArtist: (id: string) => void
  setRange: (r: DateRange) => void
  setFrom: (v: string | undefined) => void
  setTo: (v: string | undefined) => void
  reset: () => void
}

export function useEventFilter(): EventFilter {
  const [params, setParams] = useSearchParams()

  const artistIds = params.get('a')?.split(',').filter(Boolean) ?? []
  const requestedRange = params.get('r')
  const range: DateRange = requestedRange === 'all' || requestedRange === 'this-month' || requestedRange === 'custom'
    ? requestedRange
    : 'upcoming'
  const from = params.get('from') ?? undefined
  const to = params.get('to') ?? undefined

  function patch(updates: Record<string, string | undefined>) {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(updates)) {
      if (v === undefined || v === '') next.delete(k)
      else next.set(k, v)
    }
    setParams(next, { replace: true })
  }

  return {
    artistIds,
    range,
    from,
    to,
    effective: computeEffective(range, from, to),
    hasActive:
      artistIds.length > 0 || range !== 'all' || !!from || !!to,
    setArtistIds(ids) {
      patch({ a: ids.length > 0 ? ids.join(',') : undefined })
    },
    toggleArtist(id) {
      const next = artistIds.includes(id)
        ? artistIds.filter((x) => x !== id)
        : [...artistIds, id]
      patch({ a: next.length > 0 ? next.join(',') : undefined })
    },
    setRange(r) {
      patch({ r: r === 'upcoming' ? undefined : r, from: undefined, to: undefined })
    },
    setFrom(v) {
      patch({ from: v })
    },
    setTo(v) {
      patch({ to: v })
    },
    reset() {
      setParams(new URLSearchParams(), { replace: true })
    },
  }
}

export function filterEvents(
  events: IdolEvent[],
  { artistIds, effective }: Pick<EventFilter, 'artistIds' | 'effective'>,
): IdolEvent[] {
  return events.filter((ev) => {
    if (effective.from && ev.date < effective.from) return false
    if (effective.to && ev.date > effective.to) return false
    if (artistIds.length > 0) {
      const hit = ev.artistIds.some((a) => artistIds.includes(a))
      if (!hit) return false
    }
    return true
  })
}
