export interface PresetColor {
  label: string
  value: string
}

// 常見推し圈通稱色 reference（參考，非官方授權色卡）：
// =LOVE: 銀白 / ≠ME (ノイミー): 櫻桃粉 / ≒JOY: 深紫
// 乃木坂46: 深紫 / 櫻坂46: 少女粉 / 日向坂46: 天空藍
// AKB48: 櫻桃粉 / SKE48: 深藍 / NMB48: 金黃
export const PRESET_COLORS: PresetColor[] = [
  // 亮色（中飽和）
  { label: '櫻桃粉', value: '#FF6FA8' },
  { label: '熱情紅', value: '#FF2E4C' },
  { label: '橘', value: '#FB923C' },
  { label: '金黃', value: '#FACC15' },
  { label: '青檸', value: '#A3E635' },
  { label: '翠綠', value: '#22C55E' },
  { label: '天空藍', value: '#60A5FA' },
  { label: '深藍', value: '#2563EB' },
  { label: '深紫', value: '#8B5CF6' },
  { label: '洋紅', value: '#E879F9' },
  // 柔和亮色（pastel, Tailwind 300 系）
  { label: '柔粉', value: '#FFB6D9' },
  { label: '柔珊瑚', value: '#FDA4AF' },
  { label: '柔桃', value: '#FDBA74' },
  { label: '柔薄荷', value: '#5EEAD4' },
  { label: '柔水藍', value: '#67E8F9' },
  { label: '柔天空', value: '#93C5FD' },
  { label: '柔薰衣草', value: '#D8B4FE' },
  // 中性
  { label: '金', value: '#D4AF37' },
  { label: '銀白', value: '#F1F5F9' },
  { label: '炭黑', value: '#1E293B' },
]

export function isValidHexColor(v: string): boolean {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '')
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

export function textColorOn(bg: string): '#000000' | '#FFFFFF' {
  const { r, g, b } = hexToRgb(bg)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#000000' : '#FFFFFF'
}
