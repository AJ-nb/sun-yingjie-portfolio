import { renderToString } from 'react-dom/server'
import { resolvePathname } from './data/routeResolver'
import { DesignOSRoutes } from './ui/DesignOSRoutes'
import { HomeDesignOS } from './ui/HomePortfolio'
import { routeLocale } from './data/locale'

export function renderStaticRoute(pathname: string): string {
  const route = resolvePathname(pathname)
  const lang = routeLocale(pathname)
  // Retain React's text boundaries so the generated HTML can hydrate unchanged.
  return renderToString(route ? <DesignOSRoutes route={route} lang={lang} /> : <HomeDesignOS lang={lang} />)
}
