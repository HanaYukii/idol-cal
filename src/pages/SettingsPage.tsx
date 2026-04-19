export default function SettingsPage() {
  return (
    <div className="p-4">
      <header className="mb-6 pt-2">
        <h1 className="text-2xl font-semibold tracking-tight">設定</h1>
      </header>

      <section className="space-y-3">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <h2 className="text-sm font-medium">資料匯出 / 匯入</h2>
          <p className="mt-1 text-xs text-zinc-500">
            還沒實作。未來可下載 JSON 備份、匯入到其他裝置，也支援 iCal 匯出。
          </p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <h2 className="text-sm font-medium">關於</h2>
          <p className="mt-1 text-xs text-zinc-500">
            idol-cal · 個人用偶像活動追蹤
          </p>
        </div>
      </section>
    </div>
  )
}
