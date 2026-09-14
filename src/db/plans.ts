import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Plan } from './schema'

export function usePlans(): Plan[] {
  return useLiveQuery(() => db.plans.orderBy('createdAt').toArray(), [], [])
}

export function usePlan(id: string | undefined) {
  return useLiveQuery(
    () => (id ? db.plans.get(id) : Promise.resolve(undefined)),
    [id],
  )
}

export async function createPlan(name: string): Promise<Plan> {
  const now = Date.now()
  const plan: Plan = {
    id: crypto.randomUUID(),
    name,
    eventIds: [],
    createdAt: now,
    updatedAt: now,
  }
  await db.plans.add(plan)
  return plan
}

export async function updatePlan(
  id: string,
  patch: Partial<Omit<Plan, 'id' | 'createdAt'>>,
): Promise<void> {
  await db.plans.update(id, { ...patch, updatedAt: Date.now() })
}

export async function deletePlan(id: string): Promise<void> {
  await db.plans.delete(id)
}

/** Replace the plan's event list; order doesn't matter, views sort by date. */
export async function setPlanEvents(id: string, eventIds: string[]): Promise<void> {
  await updatePlan(id, { eventIds: [...new Set(eventIds)] })
}

export async function togglePlanEvent(id: string, eventId: string): Promise<void> {
  await db.transaction('rw', db.plans, async () => {
    const plan = await db.plans.get(id)
    if (!plan) return
    const has = plan.eventIds.includes(eventId)
    const eventIds = has
      ? plan.eventIds.filter((x) => x !== eventId)
      : [...plan.eventIds, eventId]
    await db.plans.update(id, { eventIds, updatedAt: Date.now() })
  })
}
