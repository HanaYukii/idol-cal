export const JST = 'Asia/Tokyo'

const ISO_DATE_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: JST,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** Today's date as `yyyy-MM-dd` in JST */
export function todayJST(): string {
  return ISO_DATE_FORMATTER.format(new Date())
}

/** Parse `yyyy-MM-dd` to a local-midnight Date (for calendar grid math) */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Format a Date object as `yyyy-MM-dd` (using its local calendar day) */
export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
