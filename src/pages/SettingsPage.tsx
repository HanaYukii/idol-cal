import { useState } from 'react'
import { loadSeedData } from '@/lib/seedData'
import { db } from '@/db/schema'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleLoadDemo() {
    setLoading(true)
    setMessage(null)
    try {
      const r = await loadSeedData()
      setMessage(`載入完成：新增 ${r.artistsAdded} 個團體、${r.eventsAdded} 筆活動`)
    } catch (err) {
      setMessage(`載入失敗：${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleClearAll() {
    if (!confirm('確定要清空所有團體和活動？此動作無法復原。')) return
    setClearing(true)
    setMessage(null)
    try {
      await db.transaction('rw', db.artists, db.events, async () => {
        await db.events.clear()
        await db.artists.clear()
      })
      setMessage('已清空所有資料')
    } catch (err) {
      setMessage(`清空失敗：${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="p-4">
      <header className="mb-6 pt-2">
        <h1 className="text-2xl font-semibold tracking-tight">設定</h1>
      </header>

      <section className="space-y-3">
        <div className="rounded-lg border border-zinc-300 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
          <h2 className="text-sm font-medium text-zinc-900">Demo 資料</h2>
          <p className="mt-1 text-xs text-zinc-500">
            載入 2026 年 2〜8 月 5 個團體的 live
            範例（=LOVE、TrySail、エビ中、ukka、高嶺のなでしこ）。
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleLoadDemo}
              disabled={loading || clearing}
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              {loading ? '載入中…' : '載入 demo 資料'}
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              disabled={loading || clearing}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
            >
              {clearing ? '清空中…' : '清空所有資料'}
            </button>
          </div>
          {message && (
            <p className="mt-3 text-xs text-zinc-600">{message}</p>
          )}
        </div>

        <div className="rounded-lg border border-zinc-300 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
          <h2 className="text-sm font-medium text-zinc-900">資料匯出 / 匯入</h2>
          <p className="mt-1 text-xs text-zinc-500">
            未實作。未來可下載 JSON 備份、匯入到其他裝置，也會支援 iCal 匯出。
          </p>
        </div>

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
