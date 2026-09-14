import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { useEvents } from '@/db/events'
import { useArtists } from '@/db/artists'
import {
  createPlan,
  deletePlan,
  setPlanEvents,
  updatePlan,
  usePlans,
} from '@/db/plans'
import { todayJST, parseISODate } from '@/lib/timezone'
import { cn } from '@/lib/utils'
import EventCard from '@/components/EventCard'
import EventDialog from '@/components/EventDialog'
import EventPickerDialog from '@/components/EventPickerDialog'
import type { Artist, IdolEvent, Plan } from '@/db/schema'

const WEEKDAYS_JA = ['日', '月', '火', '水', '木', '金', '土']

/** "Zepp Sapporo (北海道 苫小牧)" → "北海道"; undefined when the venue has no region. */
function regionOf(venue?: string): string | undefined {
  if (!venue) return undefined
  const m = venue.match(/[(（]([^()（）]+)[)）]\s*$/)
  if (!m) return undefined
  return m[1].trim().split(/[\s/／]/)[0]
}

function minutesOf(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

interface DayGroup {
  date: string
  events: IdolEvent[]
  warnings: string[]
}

function groupPlanDays(events: IdolEvent[]): DayGroup[] {
  const byDay = new Map<string, IdolEvent[]>()
  for (const ev of events) {
    const bucket = byDay.get(ev.date)
    if (bucket) bucket.push(ev)
    else byDay.set(ev.date, [ev])
  }
  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dayEvents]) => {
      const sorted = [...dayEvents].sort((a, b) =>
        (a.startTime ?? '99:99').localeCompare(b.startTime ?? '99:99'),
      )
      const warnings: string[] = []
      for (let i = 1; i < sorted.length; i += 1) {
        const prev = sorted[i - 1]
        const curr = sorted[i]
        if (!prev.startTime || !curr.startTime) continue
        const gap = minutesOf(curr.startTime) - minutesOf(prev.startTime)
        if (gap < 180) {
          warnings.push(
            `${prev.startTime} 與 ${curr.startTime} 只相隔 ${gap} 分，前一場可能還沒散`,
          )
        }
      }
      const regions = [...new Set(sorted.map((ev) => regionOf(ev.venue)).filter(Boolean))]
      if (regions.length > 1) warnings.push(`同日跨縣：${regions.join(' → ')}`)
      return { date, events: sorted, warnings }
    })
}

interface PlanDetailProps {
  plan: Plan
  events: IdolEvent[]
  artists: Artist[]
  today: string
}

/** Keyed by plan id by the parent, so per-plan drafts reset naturally on switch. */
function PlanDetail({ plan, events, artists, today }: PlanDetailProps) {
  const artistById = useMemo(() => new Map(artists.map((a) => [a.id, a])), [artists])
  const eventById = useMemo(() => new Map(events.map((e) => [e.id, e])), [events])

  const [renaming, setRenaming] = useState(false)
  const [nameDraft, setNameDraft] = useState(plan.name)
  const [noteDraft, setNoteDraft] = useState(plan.note ?? '')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<IdolEvent | null>(null)

  const planEvents = plan.eventIds
    .map((id) => eventById.get(id))
    .filter((e): e is IdolEvent => !!e)
  const days = groupPlanDays(planEvents)
  const candidates = events.filter((ev) => ev.date >= today || plan.eventIds.includes(ev.id))

  async function handleRename(e: React.FormEvent) {
    e.preventDefault()
    const name = nameDraft.trim()
    if (name && name !== plan.name) await updatePlan(plan.id, { name })
    setRenaming(false)
  }

  async function handleNoteBlur() {
    const note = noteDraft.trim() || undefined
    if (note !== plan.note) await updatePlan(plan.id, { note })
  }

  async function handleDelete() {
    if (!confirm(`確定要刪除安排「${plan.name}」？活動本身不會被刪除。`)) return
    await deletePlan(plan.id)
  }

  async function removeFromPlan(eventId: string) {
    await setPlanEvents(plan.id, plan.eventIds.filter((id) => id !== eventId))
  }

  function openEdit(ev: IdolEvent) {
    setEditingEvent(ev)
    setDialogOpen(true)
  }

  const firstDate = days[0]?.date
  const lastDate = days[days.length - 1]?.date
  const spanDays =
    firstDate && lastDate
      ? Math.round((parseISODate(lastDate).getTime() - parseISODate(firstDate).getTime()) / 86400000) + 1
      : 0
  const fmt = (iso: string) => {
    const [, m, d] = iso.split('-').map(Number)
    return `${m}/${d} (${WEEKDAYS_JA[parseISODate(iso).getDay()]})`
  }

  return (
    <section className="rounded-lg border border-zinc-300 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {renaming ? (
            <form onSubmit={handleRename} className="flex items-center gap-2">
              <input
                type="text"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-lg font-semibold focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                autoFocus
              />
              <button type="submit" className="text-sm text-zinc-700 underline">儲存</button>
              <button type="button" onClick={() => setRenaming(false)} className="text-sm text-zinc-500">取消</button>
            </form>
          ) : (
            <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900">
              {plan.name}
              <button
                type="button"
                onClick={() => { setNameDraft(plan.name); setRenaming(true) }}
                className="text-zinc-400 hover:text-zinc-700"
                aria-label="改名"
              >
                <Pencil size={14} />
              </button>
            </h2>
          )}
          <p className="mt-1 text-sm text-zinc-500">
            {planEvents.length === 0
              ? '還沒有活動'
              : `${fmt(firstDate!)} – ${fmt(lastDate!)} · ${spanDays} 天 · ${planEvents.length} 場`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            <Plus size={14} /> 加入活動
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50"
          >
            <Trash2 size={14} /> 刪除
          </button>
        </div>
      </div>

      <textarea
        value={noteDraft}
        onChange={(e) => setNoteDraft(e.target.value)}
        onBlur={handleNoteBlur}
        rows={2}
        placeholder="備註：航班、住宿、抽票狀況…"
        className="mt-3 w-full resize-none rounded-md border border-zinc-200 bg-white/80 px-3 py-1.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
      />

      {planEvents.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
          按「加入活動」從今後的活動裡勾選
        </div>
      ) : (
        <ol className="mt-5 space-y-5">
          {days.map(({ date, events: dayEvents, warnings }) => {
            const parsed = parseISODate(date)
            const [, m, d] = date.split('-').map(Number)
            const isWeekend = parsed.getDay() === 0 || parsed.getDay() === 6
            return (
              <li key={date} className="flex gap-4">
                <div className={cn('w-14 flex-shrink-0 pt-1 text-right', date < today ? 'text-zinc-400' : isWeekend ? 'text-rose-500' : 'text-zinc-700')}>
                  <div className="text-lg font-semibold leading-none">{m}/{d}</div>
                  <div className="mt-0.5 text-xs">({WEEKDAYS_JA[parsed.getDay()]})</div>
                  <div className="mt-1 text-[10px] text-zinc-400">{dayEvents.length} 場</div>
                </div>
                <div className="flex-1 space-y-2">
                  {warnings.map((w) => (
                    <div key={w} className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-800">
                      ⚠ {w}
                    </div>
                  ))}
                  {dayEvents.map((ev) => (
                    <div key={ev.id} className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <EventCard
                          event={ev}
                          artistById={artistById}
                          hideDate
                          muted={ev.date < today}
                          onClick={() => openEdit(ev)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromPlan(ev.id)}
                        className="mt-1 rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-rose-600"
                        aria-label="從安排移除"
                        title="從安排移除"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </li>
            )
          })}
        </ol>
      )}

      <EventPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title={`加入活動到「${plan.name}」`}
        events={candidates}
        artists={artists}
        initialSelected={plan.eventIds}
        confirmLabel="更新安排"
        onConfirm={(ids) => setPlanEvents(plan.id, ids)}
      />

      <EventDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        event={editingEvent}
        artists={artists}
      />
    </section>
  )
}

export default function PlansPage() {
  const plans = usePlans()
  const events = useEvents()
  const artists = useArtists()
  const today = todayJST()

  const [params, setParams] = useSearchParams()
  const selectedId = params.get('p') ?? undefined
  const plan = plans.find((p) => p.id === selectedId) ?? plans[0]

  // Keep the URL in sync so a refresh lands on the same plan.
  useEffect(() => {
    if (plan && plan.id !== selectedId) {
      const next = new URLSearchParams(params)
      next.set('p', plan.id)
      setParams(next, { replace: true })
    }
  }, [plan, selectedId, params, setParams])

  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')

  function selectPlan(id: string) {
    const next = new URLSearchParams(params)
    next.set('p', id)
    setParams(next, { replace: true })
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const name = newName.trim() || `安排 ${plans.length + 1}`
    const created = await createPlan(name)
    setNewName('')
    setCreating(false)
    selectPlan(created.id)
  }

  return (
    <div className="p-4">
      <header className="mb-4 flex items-end justify-between gap-3 pt-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">安排</h1>
          <p className="mt-1 text-sm text-zinc-500">
            自選活動排成一趟行程 · {plans.length} 個安排
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          <Plus size={14} /> 新增安排
        </button>
      </header>

      {creating && (
        <form
          onSubmit={handleCreate}
          className="mb-4 flex items-center gap-2 rounded-lg border border-zinc-300 bg-white/70 p-3 shadow-sm backdrop-blur-sm"
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="安排名稱，例如「9月東京」"
            className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
            autoFocus
          />
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            建立
          </button>
          <button
            type="button"
            onClick={() => { setCreating(false); setNewName('') }}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            取消
          </button>
        </form>
      )}

      {plans.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white/60 p-6 text-center text-zinc-500">
          <p className="text-sm">還沒有任何安排</p>
          <p className="mt-1 text-xs">
            按右上「+ 新增安排」建一趟，再從活動裡勾選要去的場次
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {plans.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPlan(p.id)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs transition',
                  plan?.id === p.id
                    ? 'border-zinc-900 bg-zinc-900 text-white'
                    : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50',
                )}
              >
                {p.name}
                <span className={cn('ml-1.5', plan?.id === p.id ? 'text-zinc-300' : 'text-zinc-400')}>
                  {p.eventIds.length}
                </span>
              </button>
            ))}
          </div>

          {plan && (
            <PlanDetail key={plan.id} plan={plan} events={events} artists={artists} today={today} />
          )}
        </>
      )}
    </div>
  )
}
