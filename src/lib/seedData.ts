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
  { name: 'TrySail', color: '#93C5FD' },
  { name: '私立恵比寿中学', color: '#67E8F9' },
  { name: '高嶺のなでしこ', color: '#FDBA74' },
  { name: '僕が見たかった青空', color: '#5EEAD4' },
  { name: '超ときめき♡宣伝部', color: '#E879F9' },
  { name: 'SWEET STEADY', color: '#86EFAC' },
  { name: 'CUTIE STREET', color: '#FB7185' },
  { name: 'Juice=Juice', color: '#FDE047' },
  { name: 'ももいろクローバーZ', color: '#FCA5A5' },
]

const CUTIE_ARENA_TOUR = 'CUTIE STREET JAPAN ARENA TOUR 2026 -AUTUMN-'

const EBICHU_TOUR = '私立恵比寿中学 Spring Tour 2026 〜SuGuilty Train〜'
const TOKISEN_TOUR = '超ときめき♡宣伝部のきみのハートにロックオンTOUR 2026'
const JJ_5ROOMS = 'Juice=Juice Room Tour 2026 「5ROOMS」'
const JJ_5ROOMS_URL =
  'https://helloproject.com/event/ac7ec0bd437f3af1f9fcdc9c579f31312e9112fe13471d9fbae91c755990d6f2/'
const TRYSAIL_TRICK = 'LAWSON presents TrySail Event 2026「コワイセイルのTrick運動会」'
const MOMOCLO_XMAS = 'ももいろクローバーZ クリスマスツアー2026「ももクリDelivery」'
const MOMOCLO_XMAS_URL = 'https://www.momoclo.net/archives/news/260727_03'
const SWESTE_HALL_TOUR = 'SWEET STEADY JAPAN HALL TOUR 2026'
const SOUND_OF_EBICHU = 'SOUND OF EBICHU 2026 -Band Edition-'

// 2026 年 2 月〜2027 年 1 月主要 live / tour（依公開資料，日期 JST）
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

  // ── TrySail コワイセイルのTrick運動会（運動会×ハロウィン企画イベント） ──
  {
    artistNames: ['TrySail'],
    title: `${TRYSAIL_TRICK} — 神戸`,
    date: '2026-10-18',
    venue: '神戸国際会館 こくさいホール (兵庫)',
    url: 'https://trysail.jp/contents/1074018',
    note: '開演時間未発表',
  },
  {
    artistNames: ['TrySail'],
    title: `${TRYSAIL_TRICK} — 東京 DAY1`,
    date: '2026-10-31',
    venue: 'Shibuya LOVEZ (東京)',
    url: 'https://trysail.jp/contents/1074018',
  },
  {
    artistNames: ['TrySail'],
    title: `${TRYSAIL_TRICK} — 東京 DAY2`,
    date: '2026-11-01',
    venue: 'Shibuya LOVEZ (東京)',
    url: 'https://trysail.jp/contents/1074018',
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

  // ── エビ中 × ukka ツーマンライブ（ukka は 2026 年 5 月解散） ──
  {
    artistNames: ['私立恵比寿中学'],
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
      '超ときめき♡宣伝部',
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

  // ── エビ中 SOUND OF EBICHU 2026（新ライブシリーズ、バンド編成。ちゅうおんの後継） ──
  {
    artistNames: ['私立恵比寿中学'],
    title: `${SOUND_OF_EBICHU} — 横浜`,
    date: '2026-10-11',
    startTime: '18:00',
    venue: 'パシフィコ横浜 国立大ホール (神奈川)',
    url: 'https://www.shiritsuebichu.jp/news/16044/',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: `${SOUND_OF_EBICHU} — 神戸`,
    date: '2026-11-08',
    startTime: '18:00',
    venue: '神戸国際会館 こくさいホール (兵庫)',
    url: 'https://www.shiritsuebichu.jp/news/16044/',
  },

  // ── エビ中 舞台「けものフレンズ」×私立恵比寿中学（全8人出演） ──
  {
    artistNames: ['私立恵比寿中学'],
    title: '舞台「けものフレンズ」×私立恵比寿中学',
    date: '2026-12-04',
    startTime: '12:00',
    venue: '品川プリンスホテル ステラボール (東京)',
    url: 'https://kemono-friends-butai.jp/schedule.html',
    note: '初日、2公演 12:00 / 18:00',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: '舞台「けものフレンズ」×私立恵比寿中学',
    date: '2026-12-05',
    startTime: '13:30',
    venue: '品川プリンスホテル ステラボール (東京)',
    url: 'https://kemono-friends-butai.jp/schedule.html',
    note: '2公演 13:30 / 16:30',
  },
  {
    artistNames: ['私立恵比寿中学'],
    title: '舞台「けものフレンズ」×私立恵比寿中学',
    date: '2026-12-06',
    startTime: '12:00',
    venue: '品川プリンスホテル ステラボール (東京)',
    url: 'https://kemono-friends-butai.jp/schedule.html',
    note: '千穐楽、2公演 12:00 / 16:30',
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

  // ── 高嶺のなでしこ 2026 夏〜秋（★8/25 星谷美来 卒業公演） ──
  {
    artistNames: ['高嶺のなでしこ'],
    title: 'ふぁぼフェス♡',
    date: '2026-08-22',
    startTime: '13:30',
    venue: 'Zepp Shinjuku (東京)',
    note: '対バンフェス出演',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: 'メ〜テレ MUSIC DAYS',
    date: '2026-08-23',
    venue: '東別院テラスホール (愛知)',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: '星谷美来 卒業公演〜ずっと恋の病でいてね〜',
    date: '2026-08-25',
    startTime: '18:30',
    venue: '恵比寿ガーデンホール (東京)',
    url: 'https://takanenonadeshiko.jp/hoshitanimikuru-0825/',
    note: '星谷美来 グループ卒業公演',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: '@JAM EXPO 2026 DAY1',
    date: '2026-08-29',
    venue: '横浜アリーナ (神奈川)',
    url: 'https://atjam.jp/expo2026',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: '24時間テレビ 日産チャリティーイベント',
    date: '2026-08-30',
    venue: '日産本社グローバルギャラリー (神奈川)',
    note: '無料イベント',
  },
  {
    artistNames: ['高嶺のなでしこ'],
    title: 'ジャムズセッション!!Vol.8',
    date: '2026-09-10',
    startTime: '16:30',
    venue: '品川プリンスホテル ステラボール (東京)',
    note: '対バン、たかねこ出演枠 19:45〜20:10',
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
  {
    artistNames: ['僕が見たかった青空'],
    title: '僕が見たかった青空 2026年ラストライブ（正式タイトル未発表）',
    date: '2026-12-14',
    venue: 'Kanadevia Hall (東京)',
    note: '河口湖3周年ライブでサプライズ発表、詳細後日',
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

  // ── 超ときめき♡宣伝部 その他（※2026年8月発表: 2027年春頃をもって活動終了） ──
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: 'ときめき♡夏のびっちょり祭り2026 ミニライブ',
    date: '2026-09-05',
    venue: '西武園ゆうえんち (埼玉)',
  },
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: '「大盛りハッピー」発売記念リアルイベント',
    date: '2026-09-22',
    venue: '有明セントラルタワーホールB (東京)',
    url: 'https://toki-sen.com/contents/1083047',
    note: '特典会形式（撮影 / おはなし会など）',
  },
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: '「大盛りハッピー」発売記念リアルイベント',
    date: '2026-09-23',
    venue: '有明セントラルタワーホールB (東京)',
    url: 'https://toki-sen.com/contents/1083047',
    note: '特典会形式（撮影 / おはなし会など）',
  },
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: '「大盛りハッピー」発売記念リアルイベント',
    date: '2026-10-11',
    venue: 'TODA HALL & CONFERENCE TOKYO ホールA (東京)',
    url: 'https://toki-sen.com/contents/1083047',
    note: '特典会形式',
  },
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: '「大盛りハッピー」発売記念リアルイベント',
    date: '2026-10-12',
    venue: 'シティホール＆ギャラリー五反田 (東京)',
    url: 'https://toki-sen.com/contents/1083047',
    note: '特典会形式',
  },
  {
    artistNames: ['超ときめき♡宣伝部', 'ももいろクローバーZ'],
    title: '氣志團万博2026 〜房総爆音リゾート〜 DAY2',
    date: '2026-11-08',
    venue: '幕張メッセ (千葉)',
    url: 'https://www.kishidanbanpaku.com/',
    note: 'フェスは 11/7-8 開催、とき宣・ももクロとも DAY2 出演',
  },

  // ── SWEET STEADY (KAWAII LAB. / ASOBISYSTEM) 2026 夏 ──
  {
    artistNames: ['SWEET STEADY', 'CUTIE STREET'],
    title: 'KAWAII LAB. SESSION 2026 SUMMER DAY1',
    date: '2026-07-10',
    venue: '国立代々木競技場 第一体育館 (東京)',
    note: 'KAWAII LAB. 合同ライブ',
  },
  {
    artistNames: ['SWEET STEADY', 'CUTIE STREET'],
    title: 'KAWAII LAB. SESSION 2026 SUMMER DAY2',
    date: '2026-07-11',
    venue: '国立代々木競技場 第一体育館 (東京)',
    note: 'KAWAII LAB. 合同ライブ',
  },
  {
    artistNames: ['SWEET STEADY', 'CUTIE STREET'],
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
    title: '3rdシングル『SWEET STEP』発売記念リリースイベント',
    date: '2026-08-02',
    startTime: '18:00',
    venue: 'セブンパークアリオ柏 屋外スマイルパーク (千葉)',
    url: 'https://sweetsteady.asobisystem.com/news/detail/85497',
    note: 'ミニライブ&特典会',
  },
  {
    artistNames: ['SWEET STEADY'],
    title: '3rdシングル『SWEET STEP』発売記念リリースイベント',
    date: '2026-08-09',
    startTime: '17:00',
    venue: 'ららぽーと豊洲 シーサイドデッキ メインステージ (東京)',
    url: 'https://sweetsteady.asobisystem.com/news/detail/85499',
    note: 'ミニライブ&特典会、CD購入者優先エリアあり・エリア外観覧可',
  },
  {
    artistNames: ['SWEET STEADY'],
    title: 'TOMAKOMAI MIRAI FEST 2026 DAY2',
    date: '2026-09-13',
    startTime: '11:00',
    venue: 'キラキラ公園 (北海道 苫小牧)',
    url: 'https://miraifest-tomakomai.jp',
    note: '野外フェス出演（DAY1 9/12 は CUTIE STREET）',
  },
  {
    artistNames: ['SWEET STEADY'],
    title: 'SWEET STEADY ARENA LIVE 2026 -SUMMER-',
    date: '2026-08-23',
    venue: 'ぴあアリーナMM (神奈川)',
    url: 'https://sweetsteady.asobisystem.com/',
    note: '初の単独アリーナ公演',
  },

  // ── SWEET STEADY JAPAN HALL TOUR 2026（初のホールツアー、開演時間未発表） ──
  {
    artistNames: ['SWEET STEADY'],
    title: `${SWESTE_HALL_TOUR} — 厚木`,
    date: '2026-11-13',
    venue: '厚木市文化会館 (神奈川)',
    url: 'https://prtimes.jp/main/html/rd/p/000000821.000017258.html',
  },
  {
    artistNames: ['SWEET STEADY'],
    title: `${SWESTE_HALL_TOUR} — 堺`,
    date: '2026-12-03',
    venue: 'フェニーチェ堺 大ホール (大阪)',
  },
  {
    artistNames: ['SWEET STEADY'],
    title: `${SWESTE_HALL_TOUR} — 名古屋`,
    date: '2026-12-06',
    venue: 'Niterra 日本特殊陶業市民会館 フォレストホール (愛知)',
  },
  {
    artistNames: ['SWEET STEADY'],
    title: `${SWESTE_HALL_TOUR} — 有明`,
    date: '2026-12-18',
    venue: 'SGC ホール有明 (東京)',
  },

  // ── CUTIE STREET (KAWAII LAB. / ASOBISYSTEM) 2026 夏 ──
  // KAWAII LAB. SESSION 7/10-11 と JOIN ALIVE 7/19 は SWEET STEADY の
  // エントリに合同で入れてある（同じイベント）
  {
    artistNames: ['CUTIE STREET'],
    title: 'TOKYO GIRLS MUSIC Fes.',
    date: '2026-07-12',
    venue: 'LINE CUBE SHIBUYA (東京)',
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

  // ── CUTIE STREET 2周年記念（初武道館） & 生誕祭 ──
  {
    artistNames: ['CUTIE STREET'],
    title: 'CUTIE STREET 2nd ANNIVERSARY LIVE 2026「8 TREASURES」DAY1',
    date: '2026-08-25',
    startTime: '18:00',
    venue: '日本武道館 (東京)',
    url: 'https://cutiestreet.asobisystem.com/news/detail/69020',
    note: '初武道館・2周年記念',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: 'CUTIE STREET 2nd ANNIVERSARY LIVE 2026「8 TREASURES」DAY2',
    date: '2026-08-26',
    startTime: '17:00',
    venue: '日本武道館 (東京)',
    url: 'https://cutiestreet.asobisystem.com/news/detail/69020',
    note: '初武道館・2周年記念',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: '梅田みゆ生誕祭2026',
    date: '2026-09-14',
    startTime: '19:00',
    venue: 'SGC ホール有明 (東京)',
    note: 'CUTIE STREET 梅田みゆ 個人生誕祭',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: '2nd ANNIVERSARY「すべての道はKAWAIIにつーず！展」',
    date: '2026-09-05',
    venue: '日本橋三井ホール (東京)',
    url: 'https://cutiestreet.asobisystem.com/news/detail/86474',
    note: '展覧会、会期 9/5〜9/23。時間指定チケット ¥2,700',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: 'TOMAKOMAI MIRAI FEST 2026 DAY1',
    date: '2026-09-12',
    venue: 'キラキラ公園 (北海道 苫小牧)',
    url: 'https://miraifest-tomakomai.jp',
    note: '野外フェス出演（DAY2 9/13 は SWEET STEADY）',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: 'ROCK IN JAPAN FESTIVAL 2026',
    date: '2026-09-19',
    venue: '千葉市蘇我スポーツ公園 (千葉)',
    note: 'フェス出演（ももクロは 9/21 出演）',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: 'STARフェス DAY2',
    date: '2026-10-11',
    startTime: '17:00',
    venue: 'ぴあアリーナMM (神奈川)',
    url: 'https://cutiestreet.asobisystem.com/news/detail/86976',
    note: 'フジテレビ主催、INI / THE RAMPAGE など出演',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: 'KAWAII LAB. COLLECTION produced by TGC 〜KAWAIIっちゃ in KITAKYUSHU〜',
    date: '2026-10-12',
    venue: '北九州メッセ (福岡)',
    note: 'KAWAII LAB. 合同イベント',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: 'MIYAKO ISLAND ROCK FESTIVAL 2026',
    date: '2026-10-17',
    venue: '宮古島コースタルリゾートヒララ (沖縄)',
    note: 'フェス出演',
  },
  {
    artistNames: ['CUTIE STREET'],
    title: 'CUTIE STREET Live in Korea 2027 WINTER',
    date: '2027-01-23',
    startTime: '18:00',
    venue: 'KINTEX Hall 9A (韓国 高陽)',
    url: 'https://cutiestreet.asobisystem.com/news/detail/86456',
    note: '初の韓国単独公演、18:00 KST',
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

  // ── KAWAII LAB. 合同イベント 2026 夏〜冬（SWEET STEADY / CUTIE STREET） ──
  {
    artistNames: ['SWEET STEADY', 'CUTIE STREET'],
    title: 'ASOBISYSTEM 19th Anniversary ASOBIEXPO 2026',
    date: '2026-08-18',
    startTime: '17:30',
    venue: 'TOYOTA ARENA TOKYO (東京)',
    url: 'https://asobisystem.com/news/72691/',
    note: 'KAWAII LAB. 全グループ含む全86組出演',
  },
  {
    artistNames: ['SWEET STEADY', 'CUTIE STREET'],
    title: 'KAWAII LAB. Christmas SESSION 2026 DAY1',
    date: '2026-12-12',
    startTime: '17:00',
    venue: '有明アリーナ (東京)',
    url: 'https://kawaiilab.asobisystem.com/news/detail/84218',
    note: 'KAWAII LAB. 合同ライブ',
  },
  {
    artistNames: ['SWEET STEADY', 'CUTIE STREET'],
    title: 'KAWAII LAB. Christmas SESSION 2026 DAY2',
    date: '2026-12-13',
    startTime: '16:00',
    venue: '有明アリーナ (東京)',
    url: 'https://kawaiilab.asobisystem.com/news/detail/84218',
    note: 'KAWAII LAB. 合同ライブ',
  },

  // ── GIFT 〜Girls Idol Festival Tokyo〜（テレ朝主催新フェス、11/27-29） ──
  {
    artistNames: ['超ときめき♡宣伝部', 'CUTIE STREET'],
    title: 'GIFT 〜Girls Idol Festival Tokyo〜 DAY1',
    date: '2026-11-27',
    startTime: '18:00',
    venue: 'SGC ホール有明 (東京)',
    url: 'https://gift-idol.jp/',
    note: '=LOVE / FRUITS ZIPPER / モーニング娘。\'26 なども出演',
  },
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: 'GIFT 〜Girls Idol Festival Tokyo〜 DAY2',
    date: '2026-11-28',
    startTime: '13:00',
    venue: 'SGC ホール有明 + TOYOTA ARENA TOKYO (東京)',
    url: 'https://gift-idol.jp/',
    note: '周遊型 2 会場、振り分け未発表。AKB48 / 日向坂46 なども出演',
  },
  {
    artistNames: ['私立恵比寿中学', 'SWEET STEADY', 'Juice=Juice'],
    title: 'GIFT 〜Girls Idol Festival Tokyo〜 DAY3',
    date: '2026-11-29',
    startTime: '13:00',
    venue: 'SGC ホール有明 + TOYOTA ARENA TOKYO (東京)',
    url: 'https://gift-idol.jp/',
    note: '周遊型 2 会場、振り分け未発表。乃木坂46 / FRUITS ZIPPER なども出演',
  },

  // ── MTV VMAJ 2026（超ときめき♡宣伝部 出演） ──
  {
    artistNames: ['超ときめき♡宣伝部'],
    title: 'MTV VMAJ 2026',
    date: '2026-10-29',
    startTime: '18:00',
    venue: '東京ドーム (東京)',
    url: 'https://www.mtvjapan.com/event/vmaj/2026/',
    note: 'アワード形式ライブ、=LOVE / ≠ME ほかも出演',
  },

  // ── ももいろクローバーZ 2026 秋〜年末（フェス出演・桃神祭・年末） ──
  // 氣志團万博 11/8 はとき宣のエントリに合同で入れてある（同じイベント）
  {
    artistNames: ['ももいろクローバーZ'],
    title: '黒フェス2026〜白黒歌合戦〜',
    date: '2026-09-06',
    startTime: '16:30',
    venue: '豊洲PIT (東京)',
    url: 'http://kurofes.net/',
    note: '松崎しげる主催フェス出演',
  },
  {
    artistNames: ['ももいろクローバーZ'],
    title: '中山秀征 HIDE LIVE 2026 ザ･歌謡ショー',
    date: '2026-09-17',
    startTime: '18:00',
    venue: 'EX THEATER ROPPONGI (東京)',
    note: 'ゲスト出演',
  },
  {
    artistNames: ['ももいろクローバーZ'],
    title: 'FEST. INAZUMA 2026',
    date: '2026-09-19',
    venue: '烏丸半島芝生広場 (滋賀)',
    url: 'https://fest-inazuma.com/',
    note: '旧イナズマロックフェス、出演枠時刻未発表',
  },
  {
    artistNames: ['ももいろクローバーZ'],
    title: 'ROCK IN JAPAN FESTIVAL 2026',
    date: '2026-09-21',
    startTime: '14:00',
    venue: '千葉市蘇我スポーツ公園 (千葉)',
    note: 'LOTUS STAGE 出演',
  },
  {
    artistNames: ['ももいろクローバーZ'],
    title: 'ももクロ秋の桃神祭2026 in千葉県長生村 DAY1「鬼になった桃神様」',
    date: '2026-10-17',
    startTime: '15:00',
    venue: '尼ヶ台総合公園 (千葉)',
    url: 'https://www.momoclo.net/tohjinsai2026/',
    note: '開催地公募型野外ライブ（春の一大事の代替）',
  },
  {
    artistNames: ['ももいろクローバーZ'],
    title: 'ももクロ秋の桃神祭2026 in千葉県長生村 DAY2「祀れ、われらの偶像」',
    date: '2026-10-18',
    startTime: '15:00',
    venue: '尼ヶ台総合公園 (千葉)',
    url: 'https://www.momoclo.net/tohjinsai2026/',
    note: '開催地公募型野外ライブ（春の一大事の代替）',
  },
  {
    artistNames: ['ももいろクローバーZ'],
    title: '第10回 ももいろ歌合戦',
    date: '2026-12-31',
    venue: '有明アリーナ (東京)',
    note: '有明アリーナ初開催、開演時刻・出演者未発表',
  },

  // ── ももクリDelivery（クリスマスホールツアー、全11公演。SSA改修のためツアー形式） ──
  {
    artistNames: ['ももいろクローバーZ'],
    title: `${MOMOCLO_XMAS} — 有明`,
    date: '2026-10-30',
    startTime: '19:00',
    venue: 'SGC ホール有明 (東京)',
    url: MOMOCLO_XMAS_URL,
  },
  {
    artistNames: ['ももいろクローバーZ'],
    title: `${MOMOCLO_XMAS} — 福山`,
    date: '2026-11-02',
    startTime: '19:00',
    venue: 'ふくやま芸術文化ホール リーデンローズ (広島)',
    url: MOMOCLO_XMAS_URL,
  },
  {
    artistNames: ['ももいろクローバーZ'],
    title: `${MOMOCLO_XMAS} — 神戸`,
    date: '2026-11-06',
    startTime: '19:00',
    venue: '神戸国際会館 こくさいホール (兵庫)',
    url: MOMOCLO_XMAS_URL,
  },
  {
    artistNames: ['ももいろクローバーZ'],
    title: `${MOMOCLO_XMAS} — 京都`,
    date: '2026-11-07',
    startTime: '17:30',
    venue: 'ロームシアター京都 (京都)',
    url: MOMOCLO_XMAS_URL,
  },
  {
    artistNames: ['ももいろクローバーZ'],
    title: `${MOMOCLO_XMAS} — 新潟`,
    date: '2026-11-22',
    startTime: '16:00',
    venue: '新潟テルサ (新潟)',
    url: MOMOCLO_XMAS_URL,
  },
  {
    artistNames: ['ももいろクローバーZ'],
    title: `${MOMOCLO_XMAS} — 一宮`,
    date: '2026-11-23',
    startTime: '17:30',
    venue: '一宮市民会館 (愛知)',
    url: MOMOCLO_XMAS_URL,
  },
  {
    artistNames: ['ももいろクローバーZ'],
    title: `${MOMOCLO_XMAS} — 福岡`,
    date: '2026-11-27',
    startTime: '19:00',
    venue: '福岡市民ホール 大ホール (福岡)',
    url: MOMOCLO_XMAS_URL,
  },
  {
    artistNames: ['ももいろクローバーZ'],
    title: `${MOMOCLO_XMAS} — 札幌 番外編`,
    date: '2026-12-03',
    startTime: '19:00',
    venue: 'Zepp Sapporo (北海道)',
    url: MOMOCLO_XMAS_URL,
    note: 'NORTHERN LIGHTS CHRISTMAS GIG、この日限りのライブハウス公演',
  },
  {
    artistNames: ['ももいろクローバーZ'],
    title: `${MOMOCLO_XMAS} — 有明 FINAL DAY1`,
    date: '2026-12-11',
    startTime: '19:00',
    venue: 'SGC ホール有明 (東京)',
    url: MOMOCLO_XMAS_URL,
  },
  {
    artistNames: ['ももいろクローバーZ'],
    title: `${MOMOCLO_XMAS} — 有明 FINAL DAY2`,
    date: '2026-12-12',
    startTime: '17:00',
    venue: 'SGC ホール有明 (東京)',
    url: MOMOCLO_XMAS_URL,
  },
  {
    artistNames: ['ももいろクローバーZ'],
    title: `${MOMOCLO_XMAS} — 有明 FINAL DAY3`,
    date: '2026-12-13',
    startTime: '16:00',
    venue: 'SGC ホール有明 (東京)',
    url: MOMOCLO_XMAS_URL,
  },

  // ── Juice=Juice (Hello! Project) 2026 夏〜秋 ──
  // ハロ！コン 2026 は 8/9 TOYOTA ARENA TOKYO で終了済みのため未収録
  {
    artistNames: ['Juice=Juice'],
    title: 'ナルチカ 2026 Juice=Juice in 高石 1回目',
    date: '2026-08-23',
    startTime: '13:30',
    venue: 'アプラたかいし 大ホール (大阪)',
    url: 'https://helloproject.com/event/65c7bca38a9204efa47e4e0ba5bace61297d7299/',
    note: '大阪府高石市×Juice=Juice 地域活性化コンサート、昼夜2公演',
  },
  {
    artistNames: ['Juice=Juice'],
    title: 'ナルチカ 2026 Juice=Juice in 高石 2回目',
    date: '2026-08-23',
    startTime: '16:30',
    venue: 'アプラたかいし 大ホール (大阪)',
    url: 'https://helloproject.com/event/65c7bca38a9204efa47e4e0ba5bace61297d7299/',
    note: '大阪府高石市×Juice=Juice 地域活性化コンサート、昼夜2公演',
  },
  {
    artistNames: ['Juice=Juice'],
    title: 'Kohmi EXPO 2026',
    date: '2026-09-03',
    startTime: '18:30',
    venue: 'LINE CUBE SHIBUYA (東京)',
    note: '広瀬香美プロデュースフェス出演',
  },
  {
    artistNames: ['Juice=Juice'],
    title: 'CDTVライブ！ライブ！秋の大感謝祭2026',
    date: '2026-09-11',
    startTime: '18:00',
    venue: '東京ガーデンシアター (東京)',
    note: 'TBS 有観客ライブ、NiziU / FRUITS ZIPPER と共演',
  },
  {
    artistNames: ['Juice=Juice'],
    title: '第4回 IDOL RUNWAY COLLECTION 2026 A/W',
    date: '2026-09-20',
    startTime: '12:00',
    venue: '横浜アリーナ (神奈川)',
    note: 'ハロプロ初出演、日向坂46 / FRUITS ZIPPER / ≒JOY ほか',
  },

  // ── Juice=Juice Room Tour 2026 「5ROOMS」 (9/18–11/25, 武道館含む) ──
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 厚木 初日`,
    date: '2026-09-18',
    startTime: '19:00',
    venue: '厚木市文化会館 大ホール (神奈川)',
    url: JJ_5ROOMS_URL,
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 厚木 昼公演`,
    date: '2026-09-19',
    startTime: '13:45',
    venue: '厚木市文化会館 大ホール (神奈川)',
    url: JJ_5ROOMS_URL,
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 厚木 夜公演`,
    date: '2026-09-19',
    startTime: '17:15',
    venue: '厚木市文化会館 大ホール (神奈川)',
    url: JJ_5ROOMS_URL,
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 広島 昼公演`,
    date: '2026-09-22',
    startTime: '15:30',
    venue: 'JMSアステールプラザ 大ホール (広島)',
    url: JJ_5ROOMS_URL,
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 広島 夜公演`,
    date: '2026-09-22',
    startTime: '19:00',
    venue: 'JMSアステールプラザ 大ホール (広島)',
    url: JJ_5ROOMS_URL,
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 京都`,
    date: '2026-09-24',
    startTime: '19:00',
    venue: 'ロームシアター京都 メインホール (京都)',
    url: JJ_5ROOMS_URL,
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 福岡 昼公演`,
    date: '2026-09-26',
    startTime: '15:30',
    venue: 'SAWARAPIA 大ホール (福岡)',
    url: JJ_5ROOMS_URL,
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 福岡 夜公演`,
    date: '2026-09-26',
    startTime: '19:00',
    venue: 'SAWARAPIA 大ホール (福岡)',
    url: JJ_5ROOMS_URL,
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 福岡 昼公演`,
    date: '2026-09-27',
    startTime: '13:15',
    venue: 'SAWARAPIA 大ホール (福岡)',
    url: JJ_5ROOMS_URL,
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 福岡 夜公演`,
    date: '2026-09-27',
    startTime: '16:45',
    venue: 'SAWARAPIA 大ホール (福岡)',
    url: JJ_5ROOMS_URL,
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 名古屋 昼公演`,
    date: '2026-10-03',
    startTime: '15:15',
    venue: 'Niterra日本特殊陶業市民会館 ビレッジホール (愛知)',
    url: JJ_5ROOMS_URL,
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 名古屋 夜公演`,
    date: '2026-10-03',
    startTime: '18:45',
    venue: 'Niterra日本特殊陶業市民会館 ビレッジホール (愛知)',
    url: JJ_5ROOMS_URL,
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 大阪 昼公演`,
    date: '2026-10-10',
    startTime: '14:30',
    venue: 'NHK大阪ホール (大阪)',
    url: JJ_5ROOMS_URL,
    note: '10月10日は Juice=Juice の日',
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 大阪 夜公演`,
    date: '2026-10-10',
    startTime: '18:00',
    venue: 'NHK大阪ホール (大阪)',
    url: JJ_5ROOMS_URL,
    note: '10月10日は Juice=Juice の日',
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 仙台 昼公演`,
    date: '2026-10-18',
    startTime: '15:30',
    venue: '東京エレクトロンホール宮城 (宮城)',
    url: JJ_5ROOMS_URL,
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 仙台 夜公演`,
    date: '2026-10-18',
    startTime: '19:00',
    venue: '東京エレクトロンホール宮城 (宮城)',
    url: JJ_5ROOMS_URL,
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 桐生 昼公演`,
    date: '2026-10-25',
    startTime: '15:15',
    venue: '美喜仁桐生文化会館 シルクホール (群馬)',
    url: JJ_5ROOMS_URL,
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 桐生 夜公演`,
    date: '2026-10-25',
    startTime: '18:45',
    venue: '美喜仁桐生文化会館 シルクホール (群馬)',
    url: JJ_5ROOMS_URL,
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 日本武道館 特別公演`,
    date: '2026-11-06',
    startTime: '18:00',
    venue: '日本武道館 (東京)',
    url: JJ_5ROOMS_URL,
    note: '追加公演（8/12 発表）',
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 大阪・オリックス劇場`,
    date: '2026-11-13',
    startTime: '19:00',
    venue: 'オリックス劇場 (大阪)',
    url: JJ_5ROOMS_URL,
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 東京 昼公演`,
    date: '2026-11-16',
    startTime: '15:15',
    venue: 'Kanadevia Hall (東京)',
    url: JJ_5ROOMS_URL,
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 東京 夜公演`,
    date: '2026-11-16',
    startTime: '19:00',
    venue: 'Kanadevia Hall (東京)',
    url: JJ_5ROOMS_URL,
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 東京 昼公演`,
    date: '2026-11-17',
    startTime: '15:00',
    venue: 'Kanadevia Hall (東京)',
    url: JJ_5ROOMS_URL,
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 東京 夜公演`,
    date: '2026-11-17',
    startTime: '18:45',
    venue: 'Kanadevia Hall (東京)',
    url: JJ_5ROOMS_URL,
  },
  {
    artistNames: ['Juice=Juice'],
    title: `${JJ_5ROOMS} — 横浜 FINAL`,
    date: '2026-11-25',
    startTime: '18:00',
    venue: 'ぴあアリーナMM (神奈川)',
    url: JJ_5ROOMS_URL,
    note: 'ツアーファイナル（追加公演）',
  },

  // ── Juice=Juice FC スペシャルライブ（10/10 は Juice=Juice の日） ──
  {
    artistNames: ['Juice=Juice'],
    title: 'Juice=Juiceスペシャルライブ2026 〜10月10日はJuice=Juiceの日〜 DAY1',
    date: '2026-10-20',
    venue: '都内近郊 (会場後日発表)',
    note: '生バンド編成 / FC会員限定 / 開演時間未発表',
  },
  {
    artistNames: ['Juice=Juice'],
    title: 'Juice=Juiceスペシャルライブ2026 〜10月10日はJuice=Juiceの日〜 DAY2',
    date: '2026-10-21',
    venue: '都内近郊 (会場後日発表)',
    note: '生バンド編成 / FC会員限定 / 開演時間未発表',
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
