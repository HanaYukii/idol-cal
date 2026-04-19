import { HashRouter, Routes, Route } from 'react-router-dom'
import TopNav from '@/components/TopNav'
import CalendarPage from '@/pages/CalendarPage'
import ListPage from '@/pages/ListPage'
import ArtistsPage from '@/pages/ArtistsPage'
import SettingsPage from '@/pages/SettingsPage'

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-svh bg-zinc-950 text-zinc-100">
        <TopNav />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <Routes>
            <Route path="/" element={<CalendarPage />} />
            <Route path="/list" element={<ListPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}
