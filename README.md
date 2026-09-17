# idol-cal

A personal tool for tracking idol events / live schedules. Desktop-first, works on mobile, stores everything locally, self-hosted per user.

**Live:** https://hanayukii.github.io/idol-cal/

> Why build it: Google Calendar isn't great for browsing across months, Eventernote's UI gets in the way, and I wanted each group in its own color.

## Features

- **Agenda calendar** — one continuous scroll across months, sticky month headers, today marker, auto-scrolls to today
- **List view** — sorted by date, upcoming-first with past events collapsed
- **Per-artist colors** — a preset palette of idol-scene pastels plus custom hex
- **Multi-artist events** — two-man lives / joint shows show every group's color
- **Filters** — by artist and by date range (all / upcoming / this month / custom); filter state lives in the URL
- **Plans (安排)** — build a trip itinerary by hand-picking events; grouped by day with warnings for tight gaps and same-day cross-prefecture hops
- **Attended (去過)** — mark shows you went to; per-artist counts and a month-by-month history
- **Built-in data** — the event list ships with the app and syncs into your browser on every launch; edits, plans and attended marks are preserved
- **Export** — JSON (events, plans, attended flags) and iCal (.ics) for Google Calendar / iOS Calendar reminders
- Dark-on-pastel UI, PWA-installable ("Add to Home Screen")

## Tech

- Vite + React + TypeScript
- Tailwind CSS 4
- IndexedDB (Dexie.js) — pure front-end, **no backend, no accounts**
- react-router-dom (HashRouter, for GitHub Pages)
- Timezone: all dates are treated as **JST (Asia/Tokyo)**

## Local development

```bash
npm install
npm run dev
```

Use Node.js 24 for local development and `npm test` (database merge and migration regression checks).

Runs on `http://localhost:5173` by default. The built-in events for 8 groups are merged into your browser's data automatically every time the app starts (Settings → "立即同步" forces it), so publishing a new build is all it takes to update everyone's calendar. Only missing rows are added; your edits, artist colors, plans and attended marks are kept. "重設為內建資料" wipes everything and reloads. There is no import — the built-in list is the source of truth. Calendar and list views default to upcoming events (including today, JST); select All to see the past.

Database version 2 removes 僕が見たかった青空 and its exclusive events from existing installations, preserving other artists on shared events. Version 3 adds the plans table and clears the stage-play / reading-theatre entries that were dropped from the demo data (events whose official title is still unannounced stay in as「タイトル未定」placeholders).

## Self-hosting (GitHub Pages)

1. Fork this repo
2. Change `base` in `vite.config.ts` to match your repo name
3. In the repo's Settings → Pages, set Source to "GitHub Actions"

The included `.github/workflows/deploy.yml` builds and deploys on every push to `main`. (Vercel / Netlify also work with zero config.)

Data lives in your browser (IndexedDB) and never leaves the device. Every device syncs the same built-in list on launch; plans and attended marks are per device (export JSON to keep a copy).

## Data model

```ts
interface Artist {
  id: string
  name: string
  color: string        // hex, e.g. "#FF6FA8"
  createdAt: number
}

interface IdolEvent {
  id: string
  artistIds: string[]  // multi-artist support (joint shows, 対バン)
  title: string
  date: string         // "2026-05-15" (JST)
  startTime?: string   // "18:30"
  venue?: string
  note?: string
  url?: string
  createdAt: number
  updatedAt: number
}
```

## Non-goals

- Accounts, cloud sync, multi-user
- Push notifications
- Scraping / auto-import (manual entry is the model; .ics import is the assist)
- Recurring events
- i18n (UI is Traditional Chinese for now)

## License

MIT
