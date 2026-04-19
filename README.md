# idol-cal

個人用偶像活動 / ライブ行程追蹤工具。手機優先、本地儲存、單人部署。

> 為什麼自己寫：Google Calendar 不適合跨月瀏覽、Eventernote 介面不夠好、想要不同團上色。

## Features

- 月曆視圖（跨月捲動、今日標示）
- 清單視圖（日期排序、sticky header）
- 多團上色（內建推し圈常見色卡 + 自訂 hex）
- Filter：Artist、日期區間
- Import / Export JSON；匯出 iCal
- Mobile-first、深色介面預設、PWA 可「加入主畫面」

## Tech

- Vite + React + TypeScript
- Tailwind CSS 4
- IndexedDB (Dexie.js) — 純前端，**無 backend / 無帳號系統**
- react-router-dom (HashRouter，配合 GitHub Pages)
- 時區：所有日期以 **JST (Asia/Tokyo)** 為準

## 本地開發

```bash
npm install
npm run dev
```

預設跑在 `http://localhost:5173`。

## 單人部署（GitHub Pages）

1. Fork 這個 repo
2. 修改 `vite.config.ts` 的 `base` 成你的 repo 名稱
3. 建立 `.github/workflows/deploy.yml`（或用 Vercel / Netlify 一鍵部署）
4. Settings → Pages → Source 選 GitHub Actions

資料存在瀏覽器本地。換裝置請從「設定 → 匯出 JSON」備份，到新裝置再「匯入」。

## Data Model

```ts
interface Artist {
  id: string
  name: string
  color: string        // hex e.g. "#FF6FA8"
  createdAt: number
}

interface IdolEvent {
  id: string
  artistIds: string[]  // 多團支援（聯合公演、対バン）
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

## 非目標

- 帳號系統、雲端同步、多使用者
- 推播通知
- 爬蟲自動匯入（手動輸入為主）
- 重複活動（recurring events）
- i18n（先繁中）

## License

MIT
