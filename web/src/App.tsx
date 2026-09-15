import { Component, Suspense, lazy, useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { asset, CATEGORIES, getWorkDoc, getWorks, type Category, type Lang, type WorkDoc } from './data/workDocs'
import { SenGallery } from './ui/SenExperience'
import { StudioIntroduction, StudioMarquee, StudioSelected } from './ui/Studio'
import { StudioProfile, DesignMethod, StudioContact } from './ui/StudioProfile'
import './styles.css'
import './sen.css'
import './editorial.css'
import './studio.css'
import { Grid2X2, List, Pause, Play, Layers3 } from 'lucide-react'
import { DEEP_CASES } from './data/editorial'
import { copy } from './data/copy'
const CasePage = lazy(() => import('./ui/CasePage'))
const MediaViewer = lazy(() => import('./ui/MediaViewer'))

const PortraitScene = lazy(() => import('./scene/PortraitScene'))
class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onError() }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}
function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const changed = () => setReduced(query.matches)
    query.addEventListener('change', changed)
    return () => query.removeEventListener('change', changed)
  }, [])
  return reduced
}
function Portrait({ lang, reduced }: { lang: Lang; reduced: boolean }) {
  const [requested, setRequested] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [autoStart, setAutoStart] = useState(true)
  const [active, setActive] = useState(true)
  const [sceneReady, setSceneReady] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!autoStart || reduced || !active || matchMedia('(max-width: 640px), (pointer: coarse)').matches) return
    const timer = window.setTimeout(() => setEnabled(true), 900)
    return () => window.clearTimeout(timer)
  }, [autoStart, reduced, active])
  useEffect(() => {
    let visible = true
    const update = () => setActive(!document.hidden && visible)
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update() }, { rootMargin: '120px' })
    if (container.current) observer.observe(container.current)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [])
  const showScene = requested || (!reduced && enabled)
  const stopScene = () => { setAutoStart(false); setRequested(false); setEnabled(false); setSceneReady(false) }
  return <div ref={container} className={`portrait-stage ${showScene && sceneReady ? 'is-live' : 'is-static'}`} aria-label={lang === 'zh' ? '三维人物' : '3D portrait'}>
    <img className="portrait-poster" style={{ visibility: showScene && sceneReady ? 'hidden' : 'visible' }} src={asset('/avatar/portrait.webp')} alt={lang === 'zh' ? '孙英杰风格化三维半身像' : 'Stylized 3D bust of Yingjie Sun'} loading="eager" />
    {showScene && <SceneBoundary fallback={null} onError={stopScene}><Suspense fallback={null}><PortraitScene active={active} reduced={reduced} ready={sceneReady} onReady={setSceneReady} /></Suspense></SceneBoundary>}
    <div className="portrait-fog" aria-hidden="true" />
    <button className="scene-toggle" onClick={() => { if (showScene) stopScene(); else { setSceneReady(false); setRequested(true) } }}><span aria-hidden="true">{showScene ? '◉' : '◎'}</span> {showScene ? copy[lang].still : copy[lang].view3d}</button>
  </div>
}
type Photo = { src: string; alt: string }
function caseSlug(hash: string): string | null {
  if (!hash.startsWith('#/work/')) return null
  try { return decodeURIComponent(hash.slice(7)) } catch { return '' }
}
function readPageLocation() {
  const position = history.state?.portfolioPosition
  return { hash: location.hash, top: position?.hash === location.hash && Number.isFinite(position.top) ? position.top as number : null, focusKey: history.state?.portfolioFocus as string | undefined }
}
function savePagePosition() {
  history.replaceState({ ...history.state, portfolioPosition: { hash: location.hash, top: window.scrollY } }, '', location.href)
}
function RestoreScroll({ page, onRouteMount }: { page: ReturnType<typeof readPageLocation>; onRouteMount: (isCase: boolean) => void }) {
  useLayoutEffect(() => { onRouteMount(caseSlug(page.hash) !== null) }, [page.hash, onRouteMount])
  useEffect(() => {
    let lastSaved = -Infinity
    let trailing: number | undefined
    const save = () => {
      if (location.hash !== page.hash) return
      savePagePosition()
      lastSaved = performance.now()
    }
    const scroll = () => {
      clearTimeout(trailing)
      const remaining = 600 - (performance.now() - lastSaved)
      if (remaining <= 0) save()
      else trailing = window.setTimeout(save, remaining)
    }
    const settled = () => { clearTimeout(trailing); save() }
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('scrollend', settled, { passive: true })
    return () => { clearTimeout(trailing); window.removeEventListener('scroll', scroll); window.removeEventListener('scrollend', settled) }
  }, [page.hash])
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (page.top !== null) window.scrollTo({ top: page.top, behavior: 'instant' })
      else if (caseSlug(page.hash) !== null || !page.hash || page.hash === '#top') window.scrollTo({ top: 0, behavior: 'instant' })
      else document.getElementById(page.hash.slice(1))?.scrollIntoView({ behavior: 'instant' })
      if (caseSlug(page.hash) === null && page.focusKey) document.querySelector<HTMLElement>(`[data-return-focus="${CSS.escape(page.focusKey)}"]`)?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [page])
  return null
}
export default function App() {
  const [lang, setLang] = useState<Lang>(() => new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'zh')
  const savedCatalog = history.state?.portfolioCatalog
  const savedStudio = history.state?.portfolioStudio
  const [page, setPage] = useState(readPageLocation), [category, setCategory] = useState<Category | 'all'>(savedCatalog?.category ?? 'all'), [query, setQuery] = useState(savedCatalog?.query ?? '')
  const [displayedIsCase, setDisplayedIsCase] = useState(() => caseSlug(location.hash) !== null)
  const [lightbox, setLightbox] = useState<{ photos: Photo[]; index: number } | null>(null)
  const [catalogView, setCatalogView] = useState<'grid' | 'list'>(savedCatalog?.view === 'list' ? 'list' : 'grid')
  const [heroSelection, setHeroSelection] = useState<number>(savedStudio?.hero ?? 0)
  const [methodIndex, setMethodIndex] = useState<number>(savedStudio?.method ?? 0)
  const [openCapabilities, setOpenCapabilities] = useState<string[]>(savedStudio?.capabilities ?? ['product-system'])
  const [motionPaused, setMotionPaused] = useState(() => { try { return localStorage.getItem('portfolio:motion-paused') === 'true' } catch { return false } })
  const motionAnchor = useRef<{ node: HTMLElement; top: number } | null>(null)
  const systemReduced = useReducedMotion(), reduced = systemReduced || motionPaused, t = copy[lang], hash = page.hash
  const slug = caseSlug(hash), isCase = slug !== null
  const works = getWorks(lang), normalizedQuery = query.normalize('NFKC').toLocaleLowerCase().trim()
  const shown = works.filter(work => (category === 'all' || work.category === category) && `${work.title} ${work.summary} ${work.tags.join(' ')}`.normalize('NFKC').toLocaleLowerCase().includes(normalizedQuery))
  useEffect(() => {
    const previousRestoration = history.scrollRestoration
    history.scrollRestoration = 'manual'
    const change = () => {
      setPage(readPageLocation())
      setLang(new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'zh')
      if (caseSlug(location.hash) === null && history.state?.portfolioCatalog) {
        setCategory(history.state.portfolioCatalog.category)
        setQuery(history.state.portfolioCatalog.query)
        setCatalogView(history.state.portfolioCatalog.view === 'list' ? 'list' : 'grid')
      }
      if (caseSlug(location.hash) === null && history.state?.portfolioStudio) {
        setHeroSelection(history.state.portfolioStudio.hero ?? 0)
        setMethodIndex(history.state.portfolioStudio.method ?? 0)
        setOpenCapabilities(history.state.portfolioStudio.capabilities ?? ['product-system'])
      }
      setLightbox(null)
    }
    window.addEventListener('hashchange', change); window.addEventListener('popstate', change)
    return () => { history.scrollRestoration = previousRestoration; window.removeEventListener('hashchange', change); window.removeEventListener('popstate', change) }
  }, [])
  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    const work = getWorkDoc(slug ?? undefined, lang)
    document.title = `${work ? work.title + ' | ' : ''}${lang === 'zh' ? '孙英杰 — 设计作品集' : 'Yingjie Sun — Design portfolio'}`
  }, [lang, slug])
  useEffect(() => {
    document.documentElement.classList.toggle('reading-case', isCase)
    return () => document.documentElement.classList.remove('reading-case')
  }, [isCase])
  useEffect(() => {
    if (!isCase) history.replaceState({ ...history.state, portfolioCatalog: { category, query, view: catalogView } }, '', location.href)
  }, [category, query, catalogView, isCase])
  useEffect(() => {
    if (!isCase) history.replaceState({ ...history.state, portfolioStudio: { hero: heroSelection, method: methodIndex, capabilities: openCapabilities } }, '', location.href)
  }, [heroSelection, methodIndex, openCapabilities, isCase])
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('motion-paused', reduced)
    const position = motionAnchor.current
    if (position?.node.isConnected) window.scrollBy({ top: position.node.getBoundingClientRect().top - position.top, behavior: 'instant' })
    motionAnchor.current = null
  }, [reduced])
  function toggleMotion() {
    const candidates = [...document.querySelectorAll<HTMLElement>('.wk-card,[data-motion-anchor],.studio-statement,.studio-hero')]
    const node = candidates.find(element => { const box = element.getBoundingClientRect(); return box.top <= innerHeight * .4 && box.bottom > innerHeight * .4 && box.right > 0 && box.left < innerWidth })
    if (node) motionAnchor.current = { node, top: node.getBoundingClientRect().top }
    try { localStorage.setItem('portfolio:motion-paused', String(!motionPaused)) } catch { /* Browsing remains available when storage is restricted. */ }
    setMotionPaused(value => !value)
  }
  function visit(id: string) {
    const target = `#/work/${encodeURIComponent(id)}`
    if (isCase) history.replaceState({ ...history.state, portfolioPosition: null }, '', target)
    else {
      savePagePosition()
      const focusKey = (document.activeElement as HTMLElement | null)?.dataset.returnFocus
      history.replaceState({ ...history.state, portfolioFocus: focusKey }, '', location.href)
      history.pushState({ caseNavigation: true }, '', target)
    }
    setPage(readPageLocation()); setLightbox(null)
  }
  function navigateHome(target: string, replace = false) {
    savePagePosition()
    const state = {
      portfolioCatalog: { category, query, view: catalogView },
      portfolioStudio: { hero: heroSelection, method: methodIndex, capabilities: openCapabilities },
    }
    if (replace) history.replaceState(state, '', target)
    else history.pushState(state, '', target)
    setPage(readPageLocation()); setLightbox(null)
  }
  function homeAnchor(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault(); navigateHome(event.currentTarget.hash)
  }
  function back() {
    if (history.state?.caseNavigation) { savePagePosition(); history.back() }
    else navigateHome('#works', true)
  }
  function toggleLanguage() {
    const next = lang === 'zh' ? 'en' : 'zh', url = new URL(location.href)
    if (next === 'en') url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang')
    history.replaceState(history.state, '', url); setLang(next)
  }
  const renderCard = (work: WorkDoc, index: number) => <a className="work-card" key={work.slug} data-return-focus={`catalog:${work.slug}`} href={`#/work/${work.slug}`} onClick={event => { if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); visit(work.slug) }}>
    <div className="work-image"><img src={asset(`/thumbnails/${work.slug}.webp`)} alt={work.title} loading="lazy" /><span className="read-label">{t.read} <span aria-hidden="true">↗</span></span></div><div className="work-caption"><h3>{work.title}</h3><span>{CATEGORIES[lang][work.category]}</span></div><p className="catalog-summary">{work.summary}</p><div className="catalog-meta"><span>{String(index + 1).padStart(2, '0')}</span><span>{DEEP_CASES.includes(work.slug) ? <><Layers3 size={12}/>{lang === 'zh' ? '可交互案例' : 'Interactive case'}</> : (lang === 'zh' ? '作品档案 ↗' : 'Case archive ↗')}</span></div>
  </a>
  return <>
    <a className="skip-link" href={isCase ? '#case-start' : '#works'} onClick={isCase ? event => { event.preventDefault(); document.querySelector<HTMLElement>('.case-page')?.focus() } : event => { homeAnchor(event); if (event.defaultPrevented) document.getElementById('works')?.focus({ preventScroll: true }) }}>{t.skip}</a>
    <header className={`site-header ${displayedIsCase ? 'on-case' : ''}`}><a href="#top" onClick={homeAnchor} className="signature">SYJ<span>孙英杰 / YINGJIE SUN</span></a><nav aria-label={lang === 'zh' ? '主导航' : 'Main navigation'}><a href="#works" onClick={homeAnchor}>{t.works}</a><a href="#about" onClick={homeAnchor}>{t.about}</a><a href="#contact" onClick={homeAnchor}>{t.contact}</a></nav><div className="header-controls"><button className="motion-toggle" onClick={toggleMotion} aria-pressed={reduced} disabled={systemReduced} title={systemReduced ? (lang === 'zh' ? '已遵循系统的减少动态效果设置' : 'Following your system’s reduced motion preference') : undefined} aria-label={lang === 'zh' ? '静态浏览模式' : 'Still browsing mode'}>{reduced ? <Play size={14}/> : <Pause size={14}/>}<span>{reduced ? (lang === 'zh' ? '静态浏览' : 'Still mode') : (lang === 'zh' ? '暂停动效' : 'Pause motion')}</span></button><button className="language" onClick={toggleLanguage} aria-label="切换语言 / Switch language">{lang === 'zh' ? 'EN' : '中'}</button></div></header>
    {/* Mount the destination immediately: lazy experiments must not hold route exits. */}
    {isCase ? <motion.div key={hash} className="case-transition">
      <motion.div className="case-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .3 }} aria-hidden="true" />
      <Suspense fallback={<main className="case-page experiment-loading" aria-busy="true">{lang === 'zh' ? '正在打开案例…' : 'Opening the case…'}</main>}><CasePage work={getWorkDoc(slug!, lang)} lang={lang} reduced={reduced} back={back} visit={visit} openPhoto={(photos, index) => setLightbox({ photos, index })} /><RestoreScroll page={page} onRouteMount={setDisplayedIsCase} /></Suspense>
    </motion.div> : <motion.main key="home" id="top" exit={{ opacity: 1 }} transition={{ duration: 0 }}>
      <RestoreScroll page={page} onRouteMount={setDisplayedIsCase} />
      <StudioIntroduction lang={lang} reduced={reduced} portrait={<Portrait lang={lang} reduced={reduced} />} anchor={homeAnchor} visit={visit} selection={heroSelection} setSelection={setHeroSelection} />
      <StudioMarquee lang={lang} reduced={reduced}/>
      <StudioSelected works={works} lang={lang} reduced={reduced} visit={visit}/>
      <SenGallery works={works} lang={lang} reduced={reduced} visit={visit} catalogue={homeAnchor} />
      <section className="work-index" id="works" aria-labelledby="index-title" tabIndex={-1} data-motion-anchor>
        <div className="index-heading"><div><span className="studio-eyebrow">03 / THE COMPLETE INDEX</span><h2 id="index-title">{t.catalog}</h2><p>{lang === 'zh' ? '每一个项目，都是一次具体的提问。按领域筛选，或切换为列表，找到你想深入了解的部分。' : 'Every project begins with a particular question. Filter by discipline or switch to the list to find your way into the work.'}</p></div><span>{String(works.length).padStart(2, '0')}<small>{t.count}</small></span></div>
        <div className="filters"><div className="category-list" role="group" aria-label={lang === 'zh' ? '作品分类' : 'Work category'}>{Object.entries(CATEGORIES[lang]).map(([value, label]) => <button key={value} aria-pressed={category === value} onClick={() => setCategory(value as Category | 'all')}>{label}</button>)}</div><label className="search"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t.search} aria-label={t.search} /></label></div>
        <div className="catalog-toolbar"><p className="result-count" aria-live="polite">{shown.length} / {works.length} {t.count}</p><div className="view-switch" role="group" aria-label={lang === 'zh' ? '目录显示方式' : 'Catalogue view'}><button aria-pressed={catalogView === 'grid'} onClick={() => setCatalogView('grid')}><Grid2X2 size={16}/>{lang === 'zh' ? '画廊' : 'Gallery'}</button><button aria-pressed={catalogView === 'list'} onClick={() => setCatalogView('list')}><List size={16}/>{lang === 'zh' ? '列表' : 'List'}</button></div></div>
        {shown.length ? <div className={`catalog-grid ${catalogView === 'list' ? 'catalog-list' : ''}`}>{shown.map((work, index) => renderCard(work, index))}</div> : <div className="empty-state"><h3>{t.empty}</h3><p>{t.emptyText}</p><button className="primary" onClick={() => { setCategory('all'); setQuery('') }}>{t.clear}</button></div>}
      </section>
      <StudioProfile lang={lang} visit={visit} openCapabilities={openCapabilities} setOpenCapabilities={setOpenCapabilities}/>
      <DesignMethod lang={lang} visit={visit} index={methodIndex} setIndex={setMethodIndex}/>
      <StudioContact lang={lang}/>
    </motion.main>}
    <footer><span>© 2026 孙英杰 / Yingjie Sun</span><a href={asset('/THIRD_PARTY_NOTICES.md')} target="_blank" rel="noreferrer">{lang === 'zh' ? '开源致谢' : 'Open-source credits'} ↗</a><a href={isCase ? '#works' : '#top'} onClick={homeAnchor}>{isCase ? t.works : t.top} ↑</a></footer>
    {!displayedIsCase && <nav className="mobile-nav" aria-label={lang === 'zh' ? '快捷导航' : 'Quick navigation'}><a href="#works" onClick={homeAnchor}>{t.works}</a><a href="#about" onClick={homeAnchor}>{t.about}</a><a href="#contact" onClick={homeAnchor}>{t.contact}</a></nav>}
    {lightbox && <Suspense fallback={null}><MediaViewer {...lightbox} reduced={reduced} lang={lang} onClose={() => setLightbox(null)} onIndex={index => setLightbox({ ...lightbox, index })} /></Suspense>}
  </>
}
