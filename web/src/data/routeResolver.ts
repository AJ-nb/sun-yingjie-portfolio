import { unlocalizedPath, routeLocale } from './locale'
import type { Lang } from './workDocs'
export type DesignOSRouteName = 'work' | 'work-detail' | 'lab' | 'lab-detail' | 'tools' | 'tools-detail' | 'research' | 'research-detail' | 'systems' | 'video-methods' | 'about' | 'resume' | 'contact' | '404'

export interface DesignOSRoute {
  name: DesignOSRouteName
  lang?: Lang
  slug?: string
  pathname: string
}

/** Returns null for the legacy root/hash application so its URL state remains untouched. */
export function resolvePathname(pathname: string): DesignOSRoute | null {
  const route = resolveBasePathname(unlocalizedPath(pathname))
  return route ? { ...route, lang: routeLocale(pathname) } : null
}

function resolveBasePathname(pathname: string): DesignOSRoute | null {
  const normalized = pathname.replace(/\/+/g, '/').replace(/\/$/, '') || '/'
  if (normalized === '/') return null
  if (normalized === '/work') return { name: 'work', pathname: normalized }
  if (normalized === '/systems') return { name: 'systems', pathname: normalized }
  if (normalized === '/systems/ai-video-methods') return { name: 'video-methods', pathname: normalized }
  if (normalized.startsWith('/work/')) return { name: 'work-detail', slug: decodeSegment(normalized.slice(6)), pathname: normalized }
  if (normalized === '/lab') return { name: 'lab', pathname: normalized }
  if (normalized.startsWith('/lab/')) return { name: 'lab-detail', slug: decodeSegment(normalized.slice(5)), pathname: normalized }
  if (normalized === '/tools') return { name: 'tools', pathname: normalized }
  if (normalized.startsWith('/tools/')) return { name: 'tools-detail', slug: decodeSegment(normalized.slice(7)), pathname: normalized }
  if (normalized === '/research') return { name: 'research', pathname: normalized }
  if (normalized.startsWith('/research/')) return { name: 'research-detail', slug: decodeSegment(normalized.slice(10)), pathname: normalized }
  if (normalized === '/about' || normalized === '/resume' || normalized === '/contact') return { name: normalized.slice(1) as DesignOSRouteName, pathname: normalized }
  return { name: '404', pathname: normalized }
}

function decodeSegment(value: string): string {
  try { return decodeURIComponent(value).split('/')[0] } catch { return '' }
}
