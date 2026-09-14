export type Lang = 'zh' | 'en'
export type Category = 'commercial' | 'product' | 'brand' | 'digital' | 'experiments'
export interface WorkDoc {
  slug: string; lang: Lang; title: string; category: Category; summary: string; role: string
  credits: string; status: string; cover: string; tags: string[]; year?: string; body: string
}
const files = import.meta.glob('../content/works/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
function parse(raw: string): { data: Record<string, string>; body: string } {
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n'))
  if (!match) throw new Error('Case is missing frontmatter')
  const data: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const pair = /^([\w-]+):\s*(.*)$/.exec(line)
    if (pair) data[pair[1]] = pair[2].trim().replace(/^"(.*)"$/, '$1')
  }
  return { data, body: match[2].trim() }
}
const collection: Record<Lang, WorkDoc[]> = { zh: [], en: [] }
for (const [path, raw] of Object.entries(files)) {
  const name = /\/([^/]+)\.(zh|en)\.md$/.exec(path)
  if (!name) continue
  const { data, body } = parse(raw)
  const lang = name[2] as Lang
  collection[lang].push({ ...data, slug: name[1], lang, body, tags: data.tags ? JSON.parse(data.tags) as string[] : [] } as WorkDoc)
}
export const FEATURED = ['hermes', 'lighting', 'arcteryx', 'plumber', 'lensflow', 'periastra']
const order = (slug: string) => FEATURED.includes(slug) ? FEATURED.indexOf(slug) : 100
for (const lang of ['zh', 'en'] as const) collection[lang].sort((a, b) => order(a.slug) - order(b.slug) || a.slug.localeCompare(b.slug))
export function getWorks(lang: Lang): WorkDoc[] { return collection[lang] }
export function getWorkDoc(slug?: string, lang: Lang = 'zh'): WorkDoc | null { return collection[lang].find(work => work.slug === slug) ?? null }
export function asset(path: string): string { return path.startsWith('/') ? `${import.meta.env.BASE_URL}${path.slice(1)}` : path }
export const CATEGORIES: Record<Lang, Record<Category | 'all', string>> = {
  zh: { all: '全部作品', commercial: '商业空间', product: '工业与产品', brand: '品牌视觉', digital: '数字产品', experiments: '创作实验' },
  en: { all: 'All work', commercial: 'Spaces', product: 'Products', brand: 'Identity', digital: 'Digital', experiments: 'Experiments' },
}
