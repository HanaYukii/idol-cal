import { NavLink } from 'react-router-dom'
import { Calendar, List, Users, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { to: '/', label: '月曆', icon: Calendar, end: true },
  { to: '/list', label: '清單', icon: List, end: false },
  { to: '/artists', label: '團體', icon: Users, end: false },
  { to: '/settings', label: '設定', icon: Settings, end: false },
] as const

export default function TopNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-sm bg-gradient-to-br from-pink-400 to-violet-500" />
          <span className="text-sm font-semibold tracking-tight">idol-cal</span>
        </div>
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {TABS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'inline-flex flex-shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100',
                )
              }
            >
              <Icon size={16} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
