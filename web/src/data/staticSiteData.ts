import { getPublicProjectRoutes } from './projectRegistry'
import { resolvePathname } from './routeResolver'
import { getPageMetadata, getStructuredData, SITE_ORIGIN } from './siteMetadata'
import { localePath, routeLocale } from './locale'
import { stripBase } from './sitePaths'

const baseRoutes = ['/', '/work', '/systems', '/systems/ai-video-methods', '/lab', '/tools', '/research', '/about', '/resume', '/contact', '/404']

export function getStaticSiteData() {
  const routes = [...new Set([...baseRoutes, ...getPublicProjectRoutes()].flatMap(path => [stripBase(localePath(path, 'zh')), stripBase(localePath(path, 'en'))]))].sort()
  const metadata = Object.fromEntries(routes.map(pathname => {
    const route = resolvePathname(pathname)
    const lang = routeLocale(pathname)
    const page = getPageMetadata(route, lang)
    return [pathname, { ...page, title: page.title, description: page.description, robots: page.noindex ? 'noindex,follow' : 'index,follow', ogImage: page.image, lang: lang === 'zh' ? 'zh-CN' : 'en', structuredData: getStructuredData(page, lang) }]
  }))
  return { origin: SITE_ORIGIN, routes, metadata }
}
