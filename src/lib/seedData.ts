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
  startTime?: string
  venue?: string
  url?: string
  note?: string
}

// Artist 代表色：柔和亮色 (Tailwind 300 系列，低飽和度高明度)
const ARTISTS: ArtistSeed[] = [
  { name: '=LOVE', color: '#D8B4FE' },
  { name: 'TrySail', color: '#93C5FD' },
  { name: '私立恵比寿中学', color: '#67E8F9' },
  { name: 'ukka', color: '#FFB6D9' },
  { name: '高嶺のなでしこ', color: '#FDBA74' },
  { name: '僕が見たかった青空', color: '#5EEAD4' },
  { name: '超ときめき♡宣伝部', color: '#E879F9' },
  { name: 'SWEET STEADY', color: '#86EFAC' },
  { name: 'CUTIE STREET', color: '#FB7185' },
]

const CUTIE_ARENA_TOUR = 'CUTIE STREET JAPAN ARENA TOUR 2026 -AUTUMN-'

const EBICHU_TOUR = '私立恵比寿中学 Spring Tour 2026 〜SuGuilty Train〜'
const TOKISEN_TOUR = '超ときめき♡宣伝部のきみのハートにロックオンTOUR 2026'

// 2026 年 2 月〜10 月主要 live / tour（依公開資料，日期 JST）
const EVENTS: EventSeed[] = [
  // ── 高嶺のなでしこ Live Tour – Bouquet of 9 Flowers – (Feb–May) ──
  {
    artistNames: ['高嶺のなでしこ'],
    title: '高嶺のなでしこ Live Tour – Bouquet of 9 Flowers – in Sapporo',
    date: '2026-02-14',
    venue: 'Zepp Sapporo (北海道)',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: '高嶺のなでしこ Live Tour – Bouquet of 9 Flowers – in Osaka',
    date: '2026-02-23',
    venue: 'Zepp Osaka Bayside (大阪)',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: '高嶺のなでしこ Live Tour – Bouquet of 9 Flowers – in Nagoya',
    date: '2026-03-01',
    venue: 'Zepp Nagoya (愛知)',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: '高嶺のなでしこ Live Tour – Bouquet of 9 Flowers – in Tokyo',
    date: '2026-03-07',
    venue: 'Zepp DiverCity TOKYO',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: '高嶺のなでしこ Live Tour – Bouquet of 9 Flowers – in Fukuoka',
    date: '2026-03-21',
    venue: 'Zepp Fukuoka (福岡)',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: '高嶺のなでしこ Live Tour – Bouquet of 9 Flowers – in Sendai',
    date: '2026-03-29',
    venue: '仙台PIT (宮城)',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: '高嶺のなでしこ Live Tour – Bouquet of 9 Flowers – in Seoul',
    date: '2026-04-12',
    venue: 'Seoul (Korea)',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: '高嶺のなでしこ Live Tour – Bouquet of 9 Flowers – in Taipei 昼公演',
    date: '2026-04-18',
    startTime: '13:00',
    venue: 'MOONDOG (台北市松山區復興南路一段39号9F)',
    url: 'https://takanenonadeshiko.jp/bouquetof9flowers-taipei/',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: '高嶺のなでしこ Live Tour – Bouquet of 9 Flowers – in Taipei 夜公演',
    date: '2026-04-18',
    startTime: '19:00',
    venue: 'MOONDOG (台北市松山區復興南路一段39号9F)',
    url: 'https://takanenonadeshiko.jp/bouquetof9flowers-taipei/',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: '高嶺のなでしこ Live Tour – Bouquet of 9 Flowers – FINAL',
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
    startTime: '17:30',
    venue: 'MUFG スタジアム / 国立競技場 (東京)',
  },
  {
    artistNames: ['=LOVE'],
    title: '=LOVE STADIUM LIVE',
    date: '2026-06-21',
    startTime: '17:30',
    venue: 'MUFG スタジアム / 国立競技場 (東京)',
  },
  {
    artistNames: ['=LOVE'],
    title: '=LOVE 個別お話し会（20th single 劇薬中毒 発売記念）',
    date: '2026-05-03',
    startTime: '11:00',
    venue: '幕張メッセ 9 ホール (千葉)',
    note: '三部制 11:00 / 13:00 / 14:30',
  },
  {
    artistNames: ['=LOVE'],
    title: '=LOVE 個別お話し会',
    date: '2026-06-28',
    startTime: '11:00',
    venue: '幕張メッセ 7 ホール (千葉)',
    note: '三部制 11:00 / 13:00 / 14:30',
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

  // ── エビ中 Spring Tour 2026 〜SuGuilty Train〜 (Apr–Jul, 12 公演) ──
  {
    artistNames: ['私立恵比寿中学'],
    title: EBICHU_TOUR,
    date: '2026-04-18',
    venue: 'ザ・ヒロサワ・シティ会館 大ホール (茨城)',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: EBICHU_TOUR,
    date: '2026-04-25',
    venue: '刈谷市総合文化センター 大ホール (愛知)',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: EBICHU_TOUR,
    date: '2026-04-29',
    venue: '福岡国際会議場 メインホール (福岡)',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: EBICHU_TOUR,
    date: '2026-05-10',
    venue: '東京エレクトロンホール宮城 (宮城)',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: EBICHU_TOUR,
    date: '2026-05-17',
    venue: '大宮ソニックシティ 大ホール (埼玉)',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: EBICHU_TOUR,
    date: '2026-05-23',
    venue: '新潟県民会館 大ホール (新潟)',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: EBICHU_TOUR,
    date: '2026-06-06',
    venue: 'Kanadevia Hall (東京)',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: EBICHU_TOUR,
    date: '2026-06-07',
    venue: 'Kanadevia Hall (東京)',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: EBICHU_TOUR,
    date: '2026-07-04',
    venue: 'NHK 大阪ホール (大阪)',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: EBICHU_TOUR,
    date: '2026-07-05',
    venue: 'NHK 大阪ホール (大阪)',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: `${EBICHU_TOUR} 追加公演`,
    date: '2026-07-11',
    venue: '立川ステージガーデン (東京)',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: `${EBICHU_TOUR} 追加公演`,
    date: '2026-07-12',
    venue: '立川ステージガーデン (東京)',
  },

  // ── エビ中 × ukka ツーマンライブ ──
  {
    artistNames: ['私立恵比寿中学', 'ukka'],
    title: '私立恵比寿中学 × ukka ツーマンライブ',
    date: '2026-05-12',
    venue: 'Zepp Haneda (TOKYO)',
  },

  // ── エビ中 メンバー個人生誕ソロライブ ──
  {
    artistNames: ['私立恵比寿中学'],
    title: '仲村悠菜 生誕ソロライブ「純喫茶ミルクティー〜4杯目〜」',
    date: '2026-05-28',
    startTime: '19:00',
    venue: 'KT Zepp Yokohama (神奈川)',
    note: 'エビ中 仲村悠菜 個人生誕祭、4 回目',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: '風見和香 生誕ソロライブ',
    date: '2026-08-31',
    venue: 'Zepp DiverCity (TOKYO)',
    note: 'エビ中 風見和香 個人生誕祭',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: '桜井えま 生誕ソロライブ',
    date: '2026-09-08',
    venue: 'Zepp DiverCity (TOKYO)',
    note: 'エビ中 桜井えま 個人生誕祭',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: '桜木心菜 生誕ソロライブ',
    date: '2026-09-15',
    venue: 'Zepp DiverCity (TOKYO)',
    note: 'エビ中 桜木心菜 個人生誕祭',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: '中山莉子 生誕ソロライブ',
    date: '2026-10-26',
    venue: 'Zepp DiverCity (TOKYO)',
    note: 'エビ中 中山莉子 個人生誕祭',
  },

  // ── エビ中 真山りか 主演 リーディング・オペラ Op.4「トスカ」 ──
  {
    artistNames: ['私立恵比寿中学'],
    title: 'リーディング・オペラ Op.4「トスカ」DAY1',
    date: '2026-09-09',
    venue: 'ルーテル市ヶ谷ホール (東京)',
    note: 'エビ中 真山りか 主演（岸本勇太 / 石井雅登 / 今拓哉 出演）',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: 'リーディング・オペラ Op.4「トスカ」DAY2',
    date: '2026-09-10',
    venue: 'ルーテル市ヶ谷ホール (東京)',
    note: 'エビ中 真山りか 主演（岸本勇太 / 石井雅登 / 今拓哉 出演）',
  },

  // ── エビ中 FAMIEN 2026（8/8–9 @ 山中湖） ──
  {
    artistNames: ['私立恵比寿中学'],
    title: '夏のファミリー遠足 略してファミえん 2026',
    date: '2026-08-08',
    venue: '山中湖交流プラザきららシアターひびき (山梨)',
    note: 'FAMIEN 2026',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: '夏のファミリー遠足 略してファミえん 2026',
    date: '2026-08-09',
    venue: '山中湖交流プラザきららシアターひびき (山梨)',
    note: 'FAMIEN 2026',
  },

  // ── LuckyFes'26 (@ 国営ひたち海浜公園, 茨城) ──
  {
    artistNames: ['高嶺のなでしこ'],
    title: 'LuckyFes\'26 DAY2',
    date: '2026-08-09',
    startTime: '13:20',
    venue: '国営ひたち海浜公園 GARDEN STAGE (茨城)',
    url: 'https://luckyfes.com/',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: 'LuckyFes\'26 DAY3',
    date: '2026-08-10',
    venue: '国営ひたち海浜公園 (茨城)',
    url: 'https://luckyfes.com/',
  },

  // ── TIF 2026 (7/31–8/2 @ お台場・青海) ──
  {
    artistNames: [
      '私立恵比寿中学',
      '高嶺のなでしこ',
      'SWEET STEADY',
      'CUTIE STREET',
    ],
    title: 'TOKYO IDOL FESTIVAL 2026 DAY1',
    date: '2026-07-31',
    venue: 'お台場・青海エリア (東京)',
    url: 'https://official.idolfes.com/s/tif2026/',
  },
  {
    artistNames: ['高嶺のなでしこ', '僕が見たかった青空'],
    title: 'TOKYO IDOL FESTIVAL 2026 DAY2',
    date: '2026-08-01',
    venue: 'お台場・青海エリア (東京)',
    url: 'https://official.idolfes.com/s/tif2026/',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: 'TOKYO IDOL FESTIVAL 2026 DAY3',
    date: '2026-08-02',
    venue: 'お台場・青海エリア (東京)',
    url: 'https://official.idolfes.com/s/tif2026/',
  },

  // ── エビ中 夏フェス出演 ──
  {
    artistNames: ['私立恵比寿中学'],
    title: 'テレビ朝日・六本木ヒルズ SUMMER FES 音楽LIVE',
    date: '2026-08-14',
    venue: '六本木ヒルズ (東京)',
  },

  // ── 高嶺のなでしこ 4周年記念 ──
  {
    artistNames: ['高嶺のなでしこ'],
    title: '高嶺のなでしこ 4周年 Special LIVE',
    date: '2026-08-06',
    venue: 'KT Zepp Yokohama (神奈川)',
    url: 'https://takanenonadeshiko.jp/takaneko-4thanniversarylive/',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: '高嶺のなでしこ 4th ファンミーティング',
    date: '2026-08-07',
    venue: 'ヒューリックホール東京 (東京)',
    note: '詳細後日発表',
  },

  // ── 僕が見たかった青空 全国ツアー2026 + 音楽祭 + 3周年野外 + サマフェス ──
  {
    artistNames: ['僕が見たかった青空'],
    title: '僕が見たかった青空 全国ツアー2026 — 大阪 1部',
    date: '2026-05-02',
    startTime: '14:30',
    venue: 'GORILLA HALL OSAKA (大阪)',
    url: 'https://bokuao.com/feature/2026spring',
  },
  {
    artistNames: ['僕が見たかった青空'],
    title: '僕が見たかった青空 全国ツアー2026 — 大阪 2部',
    date: '2026-05-02',
    startTime: '18:00',
    venue: 'GORILLA HALL OSAKA (大阪)',
    url: 'https://bokuao.com/feature/2026spring',
  },
  {
    artistNames: ['僕が見たかった青空'],
    title: '僕が見たかった青空 全国ツアー2026 — 名古屋 1部',
    date: '2026-05-09',
    startTime: '14:30',
    venue: 'DIAMOND HALL (愛知)',
    url: 'https://bokuao.com/feature/2026spring',
  },
  {
    artistNames: ['僕が見たかった青空'],
    title: '僕が見たかった青空 全国ツアー2026 — 名古屋 2部',
    date: '2026-05-09',
    startTime: '18:00',
    venue: 'DIAMOND HALL (愛知)',
    url: 'https://bokuao.com/feature/2026spring',
  },
  {
    artistNames: ['僕が見たかった青空'],
    title: 'EARLY SUMMER FESTA 2026 僕青音楽祭 — 1部',
    date: '2026-05-06',
    startTime: '13:45',
    venue: 'うみかぜ公園 特設野外ステージ (神奈川 横須賀)',
    url: 'https://esfes.jp/music/260506/',
    note: 'OCEANS BAND 生演奏 / 海際野外ステージ',
  },
  {
    artistNames: ['僕が見たかった青空'],
    title: 'EARLY SUMMER FESTA 2026 僕青音楽祭 — 2部',
    date: '2026-05-06',
    startTime: '17:45',
    venue: 'うみかぜ公園 特設野外ステージ (神奈川 横須賀)',
    url: 'https://esfes.jp/music/260506/',
    note: 'OCEANS BAND 生演奏 / 海際野外ステージ',
  },
  {
    artistNames: ['僕が見たかった青空'],
    title: '僕が観たかった『青空野外』ライブ2026',
    date: '2026-06-20',
    venue: '河口湖ステラシアター (山梨)',
    note: '結成3周年記念 初の野外ワンマン',
  },

  // ── 高嶺のなでしこ たかねこフェスVol.6〜サマーセッション〜（高貓自辦 multi-artist フェス） ──
  {
    artistNames: ['高嶺のなでしこ'],
    title: 'たかねこフェスVol.6 〜サマーセッション〜',
    date: '2026-07-12',
    startTime: '12:00',
    venue: 'EX THEATER ROPPONGI (東京)',
    url: 'https://takanenonadeshiko.jp/takanekofes-vol6/',
    note: '高貓主催対バン、α+ / いぎなり東北産 / 22/7 / 可憐なアイボリー など 20 組',
  },
  {
    artistNames: ['僕が見たかった青空'],
    title: 'アオゾラサマーフェスティバル2026',
    date: '2026-08-30',
    venue: '豊洲PIT (東京)',
  },

  // ── 超ときめき♡宣伝部 きみのハートにロックオンTOUR 2026 (Jul–Oct, 16 公演) ──
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: `${TOKISEN_TOUR} — 仙台`,
    date: '2026-07-04',
    startTime: '17:00',
    venue: '仙台サンプラザホール (宮城)',
    url: 'https://toki-sen.com/contents/1061667',
  },
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: `${TOKISEN_TOUR} — 金沢`,
    date: '2026-07-12',
    startTime: '17:00',
    venue: '本多の森北電ホール (石川)',
  },
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: `${TOKISEN_TOUR} — 栃木`,
    date: '2026-07-26',
    startTime: '17:00',
    venue: '栃木県総合文化センター (栃木)',
  },
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: `${TOKISEN_TOUR} — 八王子`,
    date: '2026-08-02',
    startTime: '17:00',
    venue: 'J:COM ホール八王子 (東京)',
  },
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: `${TOKISEN_TOUR} — 札幌`,
    date: '2026-08-08',
    startTime: '17:00',
    venue: 'カナモトホール (北海道)',
  },
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: `${TOKISEN_TOUR} — 市川`,
    date: '2026-08-11',
    startTime: '17:00',
    venue: '市川市文化会館 (千葉)',
  },
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: `${TOKISEN_TOUR} — 大宮`,
    date: '2026-08-12',
    startTime: '18:00',
    venue: '大宮ソニックシティ 大ホール (埼玉)',
  },
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: `${TOKISEN_TOUR} — 有明 DAY1`,
    date: '2026-08-22',
    startTime: '17:00',
    venue: 'SGC ホール有明 (東京)',
  },
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: `${TOKISEN_TOUR} — 有明 DAY2`,
    date: '2026-08-23',
    startTime: '17:00',
    venue: 'SGC ホール有明 (東京)',
  },
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: `${TOKISEN_TOUR} — 福岡`,
    date: '2026-08-29',
    startTime: '16:00',
    venue: '福岡市民会館 大ホール (福岡)',
  },
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: `${TOKISEN_TOUR} — 名古屋`,
    date: '2026-08-30',
    startTime: '18:00',
    venue: 'Niterra 日本特殊陶業市民会館 (愛知)',
  },
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: `${TOKISEN_TOUR} — 神戸 DAY1`,
    date: '2026-09-12',
    startTime: '17:00',
    venue: 'GLION ARENA KOBE (兵庫)',
  },
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: `${TOKISEN_TOUR} — 神戸 DAY2`,
    date: '2026-09-13',
    startTime: '16:00',
    venue: 'GLION ARENA KOBE (兵庫)',
  },
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: `${TOKISEN_TOUR} — 日本武道館`,
    date: '2026-10-05',
    startTime: '18:00',
    venue: '日本武道館 (東京)',
  },
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: `${TOKISEN_TOUR} — 有明アリーナ DAY1`,
    date: '2026-10-24',
    startTime: '17:00',
    venue: '有明アリーナ (東京)',
  },
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: `${TOKISEN_TOUR} — 有明アリーナ FINAL`,
    date: '2026-10-25',
    startTime: '16:00',
    venue: '有明アリーナ (東京)',
  },

  // ── SWEET STEADY (KAWAII LAB. / ASOBISYSTEM) 2026 夏 ──
  {
    artistNames: ['SWEET STEADY'],
    title: 'KAWAII LAB. SESSION 2026 SUMMER DAY1',
    date: '2026-07-10',
    note: 'KAWAII LAB. 合同ライブ',
  },
  {
    artistNames: ['SWEET STEADY'],
    title: 'KAWAII LAB. SESSION 2026 SUMMER DAY2',
    date: '2026-07-11',
    note: 'KAWAII LAB. 合同ライブ',
  },
  {
    artistNames: ['SWEET STEADY'],
    title: 'JOIN ALIVE 2026',
    date: '2026-07-19',
    venue: '北海道 (岩見沢)',
    note: '夏フェス出演',
  },
  {
    artistNames: ['SWEET STEADY'],
    title: '栗田なつか 生誕LIVE',
    date: '2026-07-21',
    note: 'SWEET STEADY 栗田なつか 個人生誕祭',
  },
  {
    artistNames: ['SWEET STEADY'],
    title: 'Osaka Gigantic Music Festival 2026',
    date: '2026-07-26',
    venue: '大阪',
    note: '夏フェス出演',
  },
  {
    artistNames: ['SWEET STEADY'],
    title: '塩川莉世 生誕LIVE',
    date: '2026-07-28',
    note: 'SWEET STEADY 塩川莉世 個人生誕祭',
  },
  {
    artistNames: ['SWEET STEADY'],
    title: 'SWEET STEADY ARENA LIVE 2026 -SUMMER-',
    date: '2026-08-23',
    venue: 'ぴあアリーナMM (神奈川)',
    url: 'https://sweetsteady.asobisystem.com/',
    note: '初の単独アリーナ公演',
  },

  // ── CUTIE STREET (KAWAII LAB. / ASOBISYSTEM) 2026 夏 ──
  {
    artistNames: ['CUTIE STREET'],
    title: 'KAWAII LAB. SESSION 2026 SUMMER DAY1',
    date: '2026-07-10',
    venue: '国立代々木競技場 第一体育館 (東京)',
    note: 'KAWAII LAB. 合同ライブ',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: 'KAWAII LAB. SESSION 2026 SUMMER DAY2',
    date: '2026-07-11',
    venue: '国立代々木競技場 第一体育館 (東京)',
    note: 'KAWAII LAB. 合同ライブ',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: 'TOKYO GIRLS MUSIC Fes.',
    date: '2026-07-12',
    venue: 'LINE CUBE SHIBUYA (東京)',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: 'JOIN ALIVE 2026',
    date: '2026-07-19',
    venue: '北海道 (岩見沢)',
    note: '夏フェス出演',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: 'CUTIE STREET Live in Korea 2026 SUMMER DAY1',
    date: '2026-07-25',
    venue: 'Sejong University (Seoul)',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: 'CUTIE STREET Live in Korea 2026 SUMMER DAY2',
    date: '2026-07-26',
    venue: 'Sejong University (Seoul)',
  },

  // ── CUTIE STREET JAPAN ARENA TOUR 2026 -AUTUMN- (初アリーナツアー, 7都市13公演) ──
  {
    artistNames: ['CUTIE STREET'],
    title: `${CUTIE_ARENA_TOUR} — 横浜`,
    date: '2026-09-23',
    venue: '横浜アリーナ (神奈川)',
    url: 'https://cutiestreet.asobisystem.com/',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: `${CUTIE_ARENA_TOUR} — 有明 DAY1`,
    date: '2026-09-29',
    venue: '有明アリーナ (東京)',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: `${CUTIE_ARENA_TOUR} — 有明 DAY2`,
    date: '2026-09-30',
    venue: '有明アリーナ (東京)',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: `${CUTIE_ARENA_TOUR} — 宮城 DAY1`,
    date: '2026-10-03',
    venue: 'セキスイハイムスーパーアリーナ (宮城)',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: `${CUTIE_ARENA_TOUR} — 宮城 DAY2`,
    date: '2026-10-04',
    venue: 'セキスイハイムスーパーアリーナ (宮城)',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: `${CUTIE_ARENA_TOUR} — 福岡 DAY1`,
    date: '2026-10-28',
    venue: 'マリンメッセ福岡 A館 (福岡)',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: `${CUTIE_ARENA_TOUR} — 福岡 DAY2`,
    date: '2026-10-29',
    venue: 'マリンメッセ福岡 A館 (福岡)',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: `${CUTIE_ARENA_TOUR} — 神戸 DAY1`,
    date: '2026-10-31',
    venue: '神戸ワールド記念ホール (兵庫)',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: `${CUTIE_ARENA_TOUR} — 神戸 DAY2`,
    date: '2026-11-01',
    venue: '神戸ワールド記念ホール (兵庫)',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: `${CUTIE_ARENA_TOUR} — 広島 DAY1`,
    date: '2026-11-14',
    venue: '広島グリーンアリーナ (広島)',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: `${CUTIE_ARENA_TOUR} — 広島 DAY2`,
    date: '2026-11-15',
    venue: '広島グリーンアリーナ (広島)',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: `${CUTIE_ARENA_TOUR} — 名古屋 DAY1`,
    date: '2026-11-28',
    venue: 'IGアリーナ (愛知)',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: `${CUTIE_ARENA_TOUR} — 名古屋 FINAL`,
    date: '2026-11-29',
    venue: 'IGアリーナ (愛知)',
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
      startTime: spec.startTime,
      venue: spec.venue,
      url: spec.url,
      note: spec.note,
    })
    eventsAdded += 1
  }

  return { artistsAdded: ARTISTS.length, eventsAdded }
}
