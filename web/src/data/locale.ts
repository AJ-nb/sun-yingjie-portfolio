import { sitePath, stripBase } from './sitePaths'
import type { Lang } from './workDocs'

export function routeLocale(pathname: string): Lang {
  return /^\/en(?:\/|$)/.test(stripBase(pathname)) ? 'en' : 'zh'
}

export function unlocalizedPath(pathname: string): string {
  return (stripBase(pathname).replace(/^\/en(?=\/|$)/, '').replace(/\/+$/, '') || '/').replace(/\/+/g, '/')
}

export function localePath(pathname: string, lang: Lang): string {
  const url = new URL(pathname, 'https://portfolio.invalid')
  const clean = unlocalizedPath(url.pathname)
  url.searchParams.delete('lang')
  return sitePath(`${lang === 'en' ? `/en${clean === '/' ? '/' : clean}` : clean}${url.search}${url.hash}`)
}

export function languageAlternates(pathname: string, origin: string) {
  return { 'zh-CN': origin + localePath(pathname, 'zh'), en: origin + localePath(pathname, 'en'), 'x-default': origin + localePath(pathname, 'zh') }
}
