export const BASE_PATH = import.meta.env.BASE_URL || '/'
export const SITE_HOST = (import.meta.env.VITE_SITE_ORIGIN || 'https://aj-nb.github.io').replace(/\/+$/, '')
export function stripBase(path: string): string {
  const prefix = BASE_PATH.replace(/\/$/, '')
  return prefix && (path === prefix || path.startsWith(prefix + '/')) ? path.slice(prefix.length) || '/' : path
}
export function sitePath(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path
  return BASE_PATH + stripBase(path).slice(1)
}
export const SITE_ROOT = SITE_HOST + BASE_PATH.replace(/\/$/, '')
