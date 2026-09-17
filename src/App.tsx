import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { loadSeedData } from '@/lib/seedData'
import TopNav from '@/components/TopNav'
import CalendarPage from '@/pages/CalendarPage'
import ListPage from '@/pages/ListPage'
import ArtistsPage from '@/pages/ArtistsPage'
import PlansPage from '@/pages/PlansPage'
import AttendedPage from '@/pages/AttendedPage'
import SettingsPage from '@/pages/SettingsPage'

export default function App() {
  // The built-in event list is the data source: merge it on every launch so a
  // deploy is all it takes to update. Safe to run twice (StrictMode) — the
  // loader is transactional and skips rows that already exist.
  useEffect(() => {
    loadSeedData().catch((err) => console.error('內建資料同步失敗', err))
  }, [])

  return (
    <HashRouter>
      <div className="min-h-svh text-zinc-900">
        <TopNav />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <Routes>
            <Route path="/" element={<CalendarPage />} />
            <Route path="/list" element={<ListPage />} />
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/attended" element={<AttendedPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}
