import type { Lang } from '../data/workDocs'

export const BRAND_CASES = ['hermes', 'arcteryx', 'periastra', 'yelisi'] as const
export type PortfolioDiscipline = 'brand' | 'product'
export type PortfolioFilter = PortfolioDiscipline | 'all'
export const PORTFOLIO_FILTERS: Record<Lang, Record<PortfolioFilter, string>> = {
  zh: { all: '全部作品', brand: '品牌设计', product: '产品设计' },
  en: { all: 'All work', brand: 'Brand design', product: 'Product design' },
}
export function portfolioDiscipline(slug: string): PortfolioDiscipline {
  return (BRAND_CASES as readonly string[]).includes(slug) ? 'brand' : 'product'
}
export function restorePortfolioFilter(value: unknown): PortfolioFilter {
  if (value === 'brand' || value === 'product' || value === 'all') return value
  // Earlier history entries used digital / experiments as top-level categories.
  return value === 'digital' || value === 'experiments' ? 'product' : 'all'
}
