import { stripBase } from './data/sitePaths'
import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import type { Lang } from './data/workDocs'
import { resolvePathname } from './data/routeResolver'
import { localePath, routeLocale } from './data/locale'
const LegacyApp = lazy(() => import('./LegacyApp'))
import { DesignOSRoutes } from './ui/DesignOSRoutes'
import { HomeDesignOS } from './ui/HomePortfolio'

export default function App() {
  const readRoute = () => resolvePathname(location.pathname)
  const readLang = (): Lang => routeLocale(location.pathname)
  // Hash routes under `#/` belong to the pre-Design OS app. Plain root URLs,
  // including anchor hashes such as `#top`, belong to the new home surface.
  // LegacyApp itself moves between #/work/*, #works and #top, so remember that
  // session when it returns to one of its own anchors.
  const readLegacyHash = () => stripBase(location.pathname) === '/' && (location.hash.startsWith('#/') || location.hash === '#works')
  const [route, setRoute] = useState(readRoute)
  const [lang, setLang] = useState<Lang>(readLang)
  const [legacyHash, setLegacyHash] = useState(readLegacyHash)
  const legacySession = useRef(legacyHash)
  useEffect(() => {
    if (new URLSearchParams(location.search).get('lang') === 'en' && !readLegacyHash()) {
      const query = new URLSearchParams(location.search)
      query.delete('lang')
      location.replace(localePath(location.pathname, 'en') + (query.size ? `?${query}` : '') + location.hash)
      return
    }
    const update = () => {
      const hash = location.hash
      const legacyAnchor = stripBase(location.pathname) === '/' && (hash === '#works' || (legacySession.current && hash === '#top'))
      const nextLegacyHash = readLegacyHash() || legacyAnchor
      if (nextLegacyHash) legacySession.current = true
      setRoute(readRoute()); setLang(readLang()); setLegacyHash(nextLegacyHash)
    }
    window.addEventListener('popstate', update)
    window.addEventListener('hashchange', update)
    return () => { window.removeEventListener('popstate', update); window.removeEventListener('hashchange', update) }
  }, [])
  if (legacyHash) return <Suspense fallback={<main className="route-loading" aria-busy="true">{lang === 'zh' ? '正在打开页面…' : 'Opening page…'}</main>}><LegacyApp /></Suspense>
  return route ? <DesignOSRoutes route={route} lang={lang} /> : <HomeDesignOS lang={lang} />
}
