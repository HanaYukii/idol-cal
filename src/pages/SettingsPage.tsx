import { useState } from 'react'
import { loadSeedData } from '@/lib/seedData'
import { downloadJSONBackup, downloadICSBackup } from '@/lib/backup'
import { db } from '@/db/schema'
import { useArtists } from '@/db/artists'
import { useEvents } from '@/db/events'
import { usePlans } from '@/db/plans'

export default function SettingsPage() {
  const [busy, setBusy] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const artists = useArtists()
  const events = useEvents()
  const plans = usePlans()
  const attended = events.filter((ev) => ev.attended).length

  async function withBusy(tag: string, fn: () => Promise<string | null>) {
    setBusy(tag)
    setMessage(null)
    try {
      const msg = await fn()
      if (msg) setMessage(msg)
    } catch (err) {
      setMessage(
        `${tag} 失敗：${err instanceof Error ? err.message : String(err)}`,
      )
    } finally {
      setBusy(null)
    }
  }

  function handleResync() {
    return withBusy('同步', async () => {
      const r = await loadSeedData()
      return r.eventsAdded === 0 && r.artistsAdded === 0
        ? '已是最新：內建資料沒有新增的場次'
        : `同步完成：新增 ${r.artistsAdded} 組推し、${r.eventsAdded} 筆活動`
    })
  }

  function handleReset() {
    if (
      !confirm(
        '確定要重設？會刪除你自訂的活動、所有安排和「去過」標記，然後重新載入內建資料。此動作無法復原。',
      )
    ) {
      return
    }
    return withBusy('重設', async () => {
      await db.transaction('rw', db.artists, db.events, db.plans, async () => {
        await db.plans.clear()
        await db.events.clear()
        await db.artists.clear()
      })
      const r = await loadSeedData()
      return `已重設：載入 ${r.artistsAdded} 組推し、${r.eventsAdded} 筆活動`
    })
  }

  function handleExportJSON() {
    return withBusy('匯出 JSON', async () => {
      await downloadJSONBackup()
      return 'JSON 備份已下載'
    })
  }

  function handleExportICS() {
    return withBusy('匯出 iCal', async () => {
      await downloadICSBackup()
      return 'iCal (.ics) 已下載'
    })
  }

  const loading = !!busy

  return (
    <div className="p-4">
      <header className="mb-6 pt-2">
        <h1 className="text-2xl font-semibold tracking-tight">設定</h1>
      </header>

      <section className="space-y-3">
        <div className="rounded-lg border border-zinc-300 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
          <h2 className="text-sm font-medium text-zinc-900">內建資料</h2>
          <p className="mt-1 text-xs text-zinc-500">
            每次開啟網頁都會自動同步最新的內建活動，只補入缺少的場次，
            你的自訂活動、備註、安排與「去過」標記都會保留。
          </p>
          <p className="mt-2 text-xs text-zinc-600">
            目前 {artists.length} 組推し · {events.length} 筆活動 · {plans.length} 個安排 · 去過 {attended} 場
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleResync}
              disabled={loading}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
            >
              {busy === '同步' ? '同步中…' : '立即同步'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50 disabled:opacity-50"
            >
              {busy === '重設' ? '重設中…' : '重設為內建資料'}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-300 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
          <h2 className="text-sm font-medium text-zinc-900">匯出</h2>
          <p className="mt-1 text-xs text-zinc-500">
            JSON 含完整資料（活動、安排、去過標記）；iCal (.ics) 可匯入 Google
            Calendar、iOS 行事曆做額外提醒用。
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExportJSON}
              disabled={loading}
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              {busy === '匯出 JSON' ? '匯出中…' : '匯出 JSON'}
            </button>
            <button
              type="button"
              onClick={handleExportICS}
              disabled={loading}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
            >
              {busy === '匯出 iCal' ? '匯出中…' : '匯出 iCal'}
            </button>
          </div>
        </div>

        {message && (
          <div className="rounded-lg border border-zinc-200 bg-white/60 p-3 text-xs text-zinc-700 shadow-sm backdrop-blur-sm">
            {message}
          </div>
        )}

        <div className="rounded-lg border border-zinc-300 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
          <h2 className="text-sm font-medium text-zinc-900">關於</h2>
          <p className="mt-1 text-xs text-zinc-500">
            idol-cal · 個人用偶像活動追蹤 · 資料存在你的瀏覽器 (IndexedDB)
          </p>
        </div>
      </section>
    </div>
  )
}
