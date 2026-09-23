export type ChapterId = 'windows' | 'lighting' | 'products' | 'rendering' | 'brands' | 'ai'
export type DatePrecision = 'month' | 'year' | 'unknown'
export const CHAPTERS = [
  { id: 'windows', title: { zh: '商业橱窗', en: 'Commercial windows' }, note: { zh: '2025.04 起 · 空间、道具与商品', en: 'Since 2025.04 · Space, props & merchandise' }, featured: ['hermes', 'arcteryx'] },
  { id: 'lighting', title: { zh: '铝型材灯具', en: 'Aluminum lighting' }, note: { zh: '系列语言、结构与光', en: 'A family of forms, structures & light' }, featured: ['lighting'] },
  { id: 'products', title: { zh: '产品设计与模型', en: 'Products & models' }, note: { zh: '从使用情境到形态与结构', en: 'From use scenarios to form & structure' }, featured: ['plumber', 'huhu-care', 'lingmu', 'jimu-studio', 'plant-companion'] },
  { id: 'rendering', title: { zh: '三维渲染实践', en: '3D rendering practice' }, note: { zh: '材料、光线与构图', en: 'Material, light & composition' }, featured: ['rendering-studies', 'go-glow', 'lighting'] },
  { id: 'brands', title: { zh: '品牌孵化', en: 'Brand incubation' }, note: { zh: '2026.02—2026.10 · 品牌与产品关系', en: '2026.02–2026.10 · Brand & product relationships' }, featured: ['karimoku', 'biyuan', 'yelisi', 'periastra'] },
  { id: 'ai', title: { zh: 'AI 与数字产品', en: 'AI & digital products' }, note: { zh: '把判断转化为可运行的流程', en: 'Design judgment in working tools' }, featured: ['lensflow', 'yantai', 'xintiao', 'formline', 'resume-formatter', 'xhs-methods'] },
] as const

export interface EditorialMetadata { chapter: ChapterId; order: number; startDate?: string; endDate?: string; datePrecision: DatePrecision }
const sequence: Record<ChapterId, string[]> = {
  windows: ['hermes', 'arcteryx'], lighting: ['lighting'],
  products: ['plumber', 'huhu-care', 'lingmu', 'jimu-studio', 'plant-companion', 'go-glow', 'baobab-glow', 'cloudwing', 'bat-quad', 'little-orange', 'water-guardian', 'ecological-harvest', 'purewater-rolling-filter', 'polar-wing', 'construction-recycler', 'water-walking-bath'],
  rendering: ['rendering-studies'], brands: ['karimoku', 'biyuan', 'yelisi', 'periastra'],
  ai: ['ai-video-systems', 'lensflow', 'yantai', 'xintiao', 'formline', 'resume-formatter', 'visual-archive', 'aesthetic-atlas', 'image-2-5-xhs', 'xhs-methods', 'yuju'],
}
// Dates describe supported production periods, never inferred from filesystem mtime.
const dates: Record<string, Pick<EditorialMetadata, 'startDate' | 'endDate' | 'datePrecision'>> = {
  'ai-video-systems': { startDate: '2026-09', datePrecision: 'month' },
  biyuan: { startDate: '2026-03', datePrecision: 'month' },
  periastra: { startDate: '2026', datePrecision: 'year' }, yelisi: { startDate: '2026', datePrecision: 'year' },
  lensflow: { startDate: '2026-08', datePrecision: 'month' }, yantai: { startDate: '2026-08', datePrecision: 'month' },
  formline: { startDate: '2026-08', datePrecision: 'month' }, 'resume-formatter': { startDate: '2026-08', datePrecision: 'month' },
  xintiao: { startDate: '2026-09', datePrecision: 'month' }, 'image-2-5-xhs': { startDate: '2026-09', datePrecision: 'month' },
}
export function editorialMetadata(slug: string, category: string): EditorialMetadata {
  const chapter = (Object.keys(sequence) as ChapterId[]).find(id => sequence[id].includes(slug)) ?? (category === 'product' ? 'products' : category === 'brand' ? 'brands' : 'ai')
  const index = sequence[chapter].indexOf(slug)
  return { chapter, order: index < 0 ? 99 : index, ...(dates[slug] ?? { datePrecision: 'unknown' }) }
}
