import { todayJST } from '@/lib/timezone'

export default function CalendarPage() {
  return (
    <div className="p-4">
      <header className="mb-6 pt-2">
        <h1 className="text-2xl font-semibold tracking-tight">月曆</h1>
        <p className="mt-1 text-sm text-zinc-500">JST · {todayJST()}</p>
      </header>
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white/60 p-6 text-center text-zinc-500">
        <p className="text-sm">月曆視圖尚未實作</p>
        <p className="mt-1 text-xs">目前可以先使用「清單」頁面</p>
      </div>
    </div>
  )
}
