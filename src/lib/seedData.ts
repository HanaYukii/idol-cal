import { createArtist } from '@/db/artists'
import { createEvent } from '@/db/events'

interface ArtistSeed {
  name: string
  color: string
}

interface EventSeed {
  artistNames: string[]
  title: string
  date: string
  venue?: string
  url?: string
  note?: string
}

// Artist 代表色：柔和亮色 (Tailwind 300 系列，低飽和度高明度)
const ARTISTS: ArtistSeed[] = [
  { name: '=LOVE', color: '#D8B4FE' },
  { name: 'TrySail', color: '#93C5FD' },
  { name: '私立恵比寿中学', color: '#67E8F9' },
  { name: 'ukka', color: '#FDA4AF' },
  { name: '高嶺のなでしこ', color: '#FDBA74' },
]

// 2026 年 2 月〜8 月主要 live / tour（依公開資料，日期 JST）
const EVENTS: EventSeed[] = [
  // ── 高嶺のなでしこ LIVE TOUR 2026 (Feb–Apr) ──
  {
    artistNames: ['高嶺のなでしこ'],
    title: '高嶺のなでしこ LIVE TOUR 2026 — Sapporo',
    date: '2026-02-14',
    venue: 'Zepp Sapporo (北海道)',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: '高嶺のなでしこ LIVE TOUR 2026 — Osaka',
    date: '2026-02-23',
    venue: 'Zepp Osaka Bayside (大阪)',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: '高嶺のなでしこ LIVE TOUR 2026 — Nagoya',
    date: '2026-03-01',
    venue: 'Zepp Nagoya (愛知)',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: '高嶺のなでしこ LIVE TOUR 2026 — Tokyo',
    date: '2026-03-07',
    venue: 'Zepp DiverCity TOKYO',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: '高嶺のなでしこ LIVE TOUR 2026 — Fukuoka',
    date: '2026-03-21',
    venue: 'Zepp Fukuoka (福岡)',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: '高嶺のなでしこ LIVE TOUR 2026 — Sendai',
    date: '2026-03-29',
    venue: '仙台PIT (宮城)',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: '高嶺のなでしこ Live Tour — Bouquet of 9 Flowers — in Seoul',
    date: '2026-04-12',
    venue: 'Seoul (Korea)',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: '高嶺のなでしこ @ 東京国際フォーラム ホールA',
    date: '2026-05-06',
    venue: '東京国際フォーラム ホールA (東京)',
  },

  // ── ukka フリーライブ & Spread Your WINGS (Apr–May, Last Message 解散) ──
  {
    artistNames: ['ukka'],
    title: 'ukka フリーライブツアー',
    date: '2026-04-11',
    venue: 'ららぽーと豊洲 (東京)',
  },
  {
    artistNames: ['ukka'],
    title: 'ukka フリーライブツアー',
    date: '2026-04-18',
    venue: '仙台駅前EBeanS (宮城)',
  },
  {
    artistNames: ['ukka'],
    title: 'ukka 東名阪ツアー "Spread Your WINGS" — Tokyo',
    date: '2026-04-27',
    venue: 'Spotify O-WEST (東京)',
  },
  {
    artistNames: ['ukka'],
    title: 'ukka 東名阪ツアー "Spread Your WINGS" — Nagoya',
    date: '2026-05-09',
    venue: 'Lives NAGOYA (愛知)',
  },
  {
    artistNames: ['ukka'],
    title: 'ukka 東名阪ツアー "Spread Your WINGS" — Osaka',
    date: '2026-05-16',
    venue: 'ESAKA MUSE (大阪)',
  },
  {
    artistNames: ['ukka'],
    title: 'ukka ~Last Message~ Final Live',
    date: '2026-05-24',
    note: '「ukka ラストプロジェクト」最終公演',
  },

  // ── =LOVE: Apr Tour FINAL + June Stadium Live ──
  {
    artistNames: ['=LOVE'],
    title: '=LOVE 8th ANNIVERSARY PREMIUM TOUR FINAL',
    date: '2026-04-18',
    venue: '横浜スタジアム (神奈川)',
    url: 'https://equal-love.jp/feature/specialsite_8thconcert',
  },
  {
    artistNames: ['=LOVE'],
    title: '=LOVE 8th ANNIVERSARY PREMIUM TOUR FINAL',
    date: '2026-04-19',
    venue: '横浜スタジアム (神奈川)',
    url: 'https://equal-love.jp/feature/specialsite_8thconcert',
  },
  {
    artistNames: ['=LOVE'],
    title: '=LOVE STADIUM LIVE',
    date: '2026-06-20',
    venue: 'MUFG スタジアム / 国立競技場 (東京)',
  },
  {
    artistNames: ['=LOVE'],
    title: '=LOVE STADIUM LIVE',
    date: '2026-06-21',
    venue: 'MUFG スタジアム / 国立競技場 (東京)',
  },
  {
    artistNames: ['=LOVE'],
    title: '=LOVE @ 幕張メッセ',
    date: '2026-06-28',
    venue: '幕張メッセ 国際展示場ホール (千葉)',
  },

  // ── TrySail 10th Anniversary Live "Cheers!!!" (May) ──
  {
    artistNames: ['TrySail'],
    title: 'TrySail 10th Anniversary Live 2026 "Cheers!!!"',
    date: '2026-05-10',
    venue: 'グランキューブ大阪 メインホール (大阪)',
    url: 'https://trysail.jp/contents/989829',
  },
  {
    artistNames: ['TrySail'],
    title: 'TrySail 10th Anniversary Live 2026 "Cheers!!!"',
    date: '2026-05-17',
    venue: 'パシフィコ横浜 国立大ホール (神奈川)',
    url: 'https://trysail.jp/contents/989829',
  },

  // ── 私立恵比寿中学: Spring Tour + Kanadevia + NHK大阪 + FAMIEN 2026 ──
  {
    artistNames: ['私立恵比寿中学'],
    title: 'エビ中 Spring Tour 2026',
    date: '2026-04-25',
    venue: '刈谷市総合文化センター (愛知)',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: 'エビ中 Spring Tour 2026',
    date: '2026-04-29',
    venue: '福岡国際会議場 (福岡)',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: 'エビ中 Spring Tour 2026',
    date: '2026-05-10',
    venue: '東京エレクトロンホール宮城 (宮城)',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: 'エビ中 @ Zepp Haneda',
    date: '2026-05-12',
    venue: 'Zepp Haneda (TOKYO)',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: 'エビ中 Spring Tour 2026',
    date: '2026-05-23',
    venue: '新潟県民会館 (新潟)',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: 'エビ中 @ Kanadevia Hall',
    date: '2026-06-06',
    venue: 'Kanadevia Hall (東京)',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: 'エビ中 @ Kanadevia Hall',
    date: '2026-06-07',
    venue: 'Kanadevia Hall (東京)',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: 'エビ中 @ NHK 大阪ホール',
    date: '2026-07-04',
    venue: 'NHK 大阪ホール (大阪)',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: 'エビ中 @ NHK 大阪ホール',
    date: '2026-07-05',
    venue: 'NHK 大阪ホール (大阪)',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: '夏のファミリー遠足 略してファミえん 2026',
    date: '2026-08-08',
    venue: '山中湖交流プラザきららシアターひびき (山梨)',
    note: 'FAMIEN 2026（同期間 LuckyFes 在茨城）',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: '夏のファミリー遠足 略してファミえん 2026',
    date: '2026-08-09',
    venue: '山中湖交流プラザきららシアターひびき (山梨)',
    note: 'FAMIEN 2026（同期間 LuckyFes 在茨城）',
  },
]

export async function loadSeedData(): Promise<{
  artistsAdded: number
  eventsAdded: number
}> {
  const nameToId: Record<string, string> = {}

  for (const spec of ARTISTS) {
    const artist = await createArtist(spec)
    nameToId[spec.name] = artist.id
  }

  let eventsAdded = 0
  for (const spec of EVENTS) {
    const artistIds = spec.artistNames
      .map((n) => nameToId[n])
      .filter((id): id is string => Boolean(id))
    if (artistIds.length === 0) continue
    await createEvent({
      artistIds,
      title: spec.title,
      date: spec.date,
      venue: spec.venue,
      url: spec.url,
      note: spec.note,
    })
    eventsAdded += 1
  }

  return { artistsAdded: ARTISTS.length, eventsAdded }
}
