import { useRef, useState } from 'react'
import { loadSeedData } from '@/lib/seedData'
import {
  downloadJSONBackup,
  downloadICSBackup,
  importJSONText,
} from '@/lib/backup'
import { db } from '@/db/schema'

export default function SettingsPage() {
  const [busy, setBusy] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  function handleLoadDemo() {
    return withBusy('載入 demo', async () => {
      const r = await loadSeedData()
      return `載入完成：新增 ${r.artistsAdded} 組推し、${r.eventsAdded} 筆活動`
    })
  }

  function handleClearAll() {
    if (!confirm('確定要清空所有推し和活動？此動作無法復原。')) return
    return withBusy('清空', async () => {
      await db.transaction('rw', db.artists, db.events, async () => {
        await db.events.clear()
        await db.artists.clear()
      })
      return '已清空所有資料'
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

  function pickImportFile() {
    fileInputRef.current?.click()
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-picking same file
    if (!file) return
    if (!confirm('匯入將覆蓋所有現有資料（推し + 活動），確定繼續？')) return
    await withBusy('匯入 JSON', async () => {
      const text = await file.text()
      const r = await importJSONText(text, 'replace')
      return `匯入完成：${r.artistsAdded} 組推し、${r.eventsAdded} 筆活動`
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
          <h2 className="text-sm font-medium text-zinc-900">Demo 資料</h2>
          <p className="mt-1 text-xs text-zinc-500">
            載入 2026 年 2〜8 月 5 組推し的 live
            範例（=LOVE、TrySail、エビ中、ukka、高嶺のなでしこ）。
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleLoadDemo}
              disabled={loading}
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              {busy === '載入 demo' ? '載入中…' : '載入 demo 資料'}
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              disabled={loading}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
            >
              {busy === '清空' ? '清空中…' : '清空所有資料'}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-300 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
          <h2 className="text-sm font-medium text-zinc-900">資料匯出 / 匯入</h2>
          <p className="mt-1 text-xs text-zinc-500">
            JSON 備份含完整資料可還原；iCal (.ics) 單向輸出，方便匯入 Google
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
              onClick={pickImportFile}
              disabled={loading}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
            >
              {busy === '匯入 JSON' ? '匯入中…' : '匯入 JSON'}
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
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleFile}
          />
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
