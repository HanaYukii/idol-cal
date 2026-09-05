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
- **Backup** — export / import JSON, plus iCal (.ics) export and import (TimeTree, Google Calendar, iOS Calendar files all work)
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

Runs on `http://localhost:5173` by default. Settings → "load demo data" merges the built-in events for 8 groups into your existing data. Repeat loads skip matching events and preserve your edits and artist colors; no clearing is needed. Previously created duplicates are not deleted automatically. Calendar and list views default to upcoming events (including today, JST); select All to see the past.

Database version 2 removes 僕が見たかった青空 and its exclusive events from existing installations, preserving other artists on shared events.

## Self-hosting (GitHub Pages)

1. Fork this repo
2. Change `base` in `vite.config.ts` to match your repo name
3. In the repo's Settings → Pages, set Source to "GitHub Actions"

The included `.github/workflows/deploy.yml` builds and deploys on every push to `main`. (Vercel / Netlify also work with zero config.)

Data lives in your browser (IndexedDB) and never leaves the device. To move between devices, use Settings → export JSON, then import on the other device.

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
