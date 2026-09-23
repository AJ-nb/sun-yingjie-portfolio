import { MotionPreference, usePortfolioReducedMotion as useReducedMotion } from './ui/MotionPreference'
import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { asset, getWorkDoc, getWorks, type Lang, type WorkDoc } from './data/workDocs'
import { StudioIntroduction } from './ui/Studio'
import { StudioProfile, StudioProfileDetails, DesignMethod, StudioContact } from './ui/StudioProfile'
import { CareerShowcase, ProductEvidence } from './ui/CareerShowcase'
import { OpenSourcePractice } from './ui/OpenSourcePractice'
import { CapabilityMatrix } from './ui/CapabilityMatrix'
import { MobileDock } from './ui/MobileDock'
import { DisciplinePaths } from './ui/DisciplinePaths'
import { Downloads, type DownloadVariant } from './ui/Downloads'
import { PORTFOLIO_FILTERS, portfolioDiscipline, restorePortfolioFilter, type PortfolioFilter } from './ui/portfolioTaxonomy'
import './styles.css'
import './sen.css'
import './editorial.css'
import './studio.css'
import './v5.css'
import './v6.css'
import './v7.css'
import './mainframe-v7.css'
import { SiteHeader } from './ui/SiteHeader'
import { Grid2X2, List, Layers3 } from 'lucide-react'
import { DEEP_CASES } from './data/editorial'
import { copy } from './data/copy'
const CasePage = lazy(() => import('./ui/CasePage'))
const MediaViewer = lazy(() => import('./ui/MediaViewer'))

type Photo = { src: string; alt: string }
function restoreDownloadVariant(value: unknown): DownloadVariant {
  return value === 'brand' || value === 'physical' || value === 'digital' ? value : 'overview'
}
function caseSlug(hash: string): string | null {
  if (!hash.startsWith('#/work/')) return null
  try { return decodeURIComponent(hash.slice(7)) } catch { return '' }
}
function readPageLocation() {
  const position = history.state?.portfolioPosition
  return { hash: location.hash, top: position?.hash === location.hash && Number.isFinite(position.top) ? position.top as number : null, focusKey: history.state?.portfolioFocus as string | undefined, behavior: 'instant' as ScrollBehavior }
}
function savePagePosition() {
  history.replaceState({ ...history.state, portfolioPosition: { hash: location.hash, top: window.scrollY } }, '', location.href)
}
function RestoreScroll({ page, onRouteMount }: { page: ReturnType<typeof readPageLocation>; onRouteMount: (isCase: boolean) => void }) {
  useLayoutEffect(() => { onRouteMount(caseSlug(page.hash) !== null) }, [page.hash, onRouteMount])
  useLayoutEffect(() => {
    let lastSaved = -Infinity
    let trailing: number | undefined
    let cancelled = false
    const save = () => {
      if (cancelled || location.hash !== page.hash) return
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
    const frame = requestAnimationFrame(() => {
      if (cancelled || location.hash !== page.hash) return
      if (page.top !== null) window.scrollTo({ top: page.top, behavior: 'instant' })
      else if (caseSlug(page.hash) !== null || !page.hash || page.hash === '#top') window.scrollTo({ top: 0, behavior: page.behavior })
      else document.getElementById(page.hash.slice(1))?.scrollIntoView({ behavior: page.behavior })
      if (caseSlug(page.hash) === null && page.focusKey) document.querySelector<HTMLElement>(`[data-return-focus="${CSS.escape(page.focusKey)}"]`)?.focus({ preventScroll: true })
      else if (caseSlug(page.hash) === null && page.top === null && page.hash) {
        const target = document.getElementById(page.hash.slice(1))
        if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }) }
      }
      // Route layout can clamp the previous page's scroll before this frame.
      // Start saving only after restoration so it cannot replace the destination.
      window.addEventListener('scroll', scroll, { passive: true })
      window.addEventListener('scrollend', settled, { passive: true })
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      clearTimeout(trailing)
      window.removeEventListener('scroll', scroll)
      window.removeEventListener('scrollend', settled)
    }
  }, [page])
  return null
}
export default function LegacyApp() {
  const [lang, setLang] = useState<Lang>(() => new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'zh')
  const savedCatalog = history.state?.portfolioCatalog
  const savedStudio = history.state?.portfolioStudio
  const [page, setPage] = useState(readPageLocation), [category, setCategory] = useState<PortfolioFilter>(restorePortfolioFilter(savedCatalog?.category)), [query, setQuery] = useState(savedCatalog?.query ?? '')
  const [displayedIsCase, setDisplayedIsCase] = useState(() => caseSlug(location.hash) !== null)
  const [lightbox, setLightbox] = useState<{ photos: Photo[]; index: number } | null>(null)
  const [catalogView, setCatalogView] = useState<'grid' | 'list'>(savedCatalog?.view === 'list' ? 'list' : 'grid')
  const [archiveExpanded, setArchiveExpanded] = useState(Boolean(savedCatalog?.expanded))
  const [downloadVariant, setDownloadVariant] = useState(() => restoreDownloadVariant(history.state?.portfolioDownload))
  const [methodIndex, setMethodIndex] = useState<number>(savedStudio?.method ?? 0)
  const [openCapabilities, setOpenCapabilities] = useState<string[]>(savedStudio?.capabilities ?? ['product-system'])
  const revealedSections = useRef(new Set<string>())
  const reduced = useReducedMotion(), t = copy[lang], hash = page.hash
  const slug = caseSlug(hash), isCase = slug !== null
  const works = getWorks(lang), normalizedQuery = query.normalize('NFKC').toLocaleLowerCase().trim()
  const shown = works.filter(work => (category === 'all' || portfolioDiscipline(work.slug) === category) && `${work.title} ${work.summary} ${work.tags.join(' ')}`.normalize('NFKC').toLocaleLowerCase().includes(normalizedQuery))
  const archiveOpen = archiveExpanded || category !== 'all' || normalizedQuery.length > 0
  const visibleWorks = archiveOpen ? shown : shown.slice(0, 8)
  useEffect(() => {
    const previousRestoration = history.scrollRestoration
    history.scrollRestoration = 'manual'
    const change = () => {
      setPage(readPageLocation())
      setLang(new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'zh')
      if (caseSlug(location.hash) === null && history.state?.portfolioCatalog) {
        setCategory(restorePortfolioFilter(history.state.portfolioCatalog.category))
        setQuery(history.state.portfolioCatalog.query)
        setCatalogView(history.state.portfolioCatalog.view === 'list' ? 'list' : 'grid')
        setArchiveExpanded(Boolean(history.state.portfolioCatalog.expanded))
      }
      if (caseSlug(location.hash) === null && history.state?.portfolioStudio) {
        setMethodIndex(history.state.portfolioStudio.method ?? 0)
        setOpenCapabilities(history.state.portfolioStudio.capabilities ?? ['product-system'])
      }
      if (caseSlug(location.hash) === null) setDownloadVariant(restoreDownloadVariant(history.state?.portfolioDownload))
      setLightbox(null)
    }
    window.addEventListener('hashchange', change); window.addEventListener('popstate', change)
    return () => { history.scrollRestoration = previousRestoration; window.removeEventListener('hashchange', change); window.removeEventListener('popstate', change) }
  }, [])
  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    const work = getWorkDoc(slug ?? undefined, lang)
    document.title = `${work ? work.title + ' | ' : ''}${lang === 'zh' ? '孙英杰 — 工业与产品设计师' : 'Yingjie Sun — Industrial & Product Designer'}`
  }, [lang, slug])
  useEffect(() => {
    document.documentElement.classList.toggle('reading-case', isCase)
    return () => document.documentElement.classList.remove('reading-case')
  }, [isCase])
  useEffect(() => {
    if (!isCase) history.replaceState({ ...history.state, portfolioCatalog: { category, query, view: catalogView, expanded: archiveExpanded } }, '', location.href)
  }, [category, query, catalogView, archiveExpanded, isCase])
  useEffect(() => {
    if (!isCase) history.replaceState({ ...history.state, portfolioStudio: { method: methodIndex, capabilities: openCapabilities } }, '', location.href)
  }, [methodIndex, openCapabilities, isCase])
  useEffect(() => {
    if (!isCase) history.replaceState({ ...history.state, portfolioDownload: downloadVariant }, '', location.href)
  }, [downloadVariant, isCase])
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('motion-paused', reduced)
  }, [reduced])
  useEffect(() => {
    if (reduced || isCase || !('IntersectionObserver' in window)) return
    const animations = new Set<Animation>()
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        observer.unobserve(entry.target)
        const id = entry.target.closest('[data-motion-anchor]')?.id
        if (id) revealedSections.current.add(id)
        const animation = entry.target.animate(
          [{ opacity: .35, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
          { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' },
        )
        animations.add(animation)
        animation.onfinish = () => animations.delete(animation)
      }
    }, { threshold: .1, rootMargin: '0px 0px -24px 0px' })
    document.querySelectorAll<HTMLElement>('section[data-motion-anchor]:not(.mainframe-hero)').forEach(section => {
      const heading = section.querySelector<HTMLElement>(':scope > header, :scope > .index-heading, :scope > .studio-section-heading')
      if (heading && !revealedSections.current.has(section.id) && heading.getBoundingClientRect().top >= innerHeight) observer.observe(heading)
    })
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()) }
  }, [isCase, reduced])
  function visit(id: string) {
    const target = `#/work/${encodeURIComponent(id)}`
    if (isCase) history.replaceState({ ...history.state, portfolioPosition: null }, '', target)
    else {
      savePagePosition()
      const focusKey = (document.activeElement as HTMLElement | null)?.dataset.returnFocus
      history.replaceState({ ...history.state, portfolioFocus: focusKey, portfolioCatalog: { category, query, view: catalogView, expanded: archiveExpanded }, portfolioStudio: { method: methodIndex, capabilities: openCapabilities }, portfolioDownload: downloadVariant }, '', location.href)
      history.pushState({ caseNavigation: true }, '', target)
    }
    setPage(readPageLocation()); setLightbox(null)
  }
  function navigateHome(target: string, replace = false) {
    savePagePosition()
    const state = {
      portfolioCatalog: { category, query, view: catalogView, expanded: archiveExpanded },
      portfolioStudio: { method: methodIndex, capabilities: openCapabilities },
      portfolioDownload: downloadVariant,
    }
    if (replace || location.hash === target) history.replaceState(state, '', target)
    else history.pushState(state, '', target)
    setPage({ ...readPageLocation(), behavior: reduced || isCase ? 'instant' : 'smooth' }); setLightbox(null)
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
    <div className="work-image"><img src={asset(`/thumbnails/${work.slug}.webp`)} alt={work.title} loading="lazy" /><span className="read-label">{t.read} <span aria-hidden="true">↗</span></span></div><div className="work-caption"><h3>{work.title}</h3><span>{PORTFOLIO_FILTERS[lang][portfolioDiscipline(work.slug)]}</span></div><p className="catalog-summary">{work.summary}</p><div className="catalog-meta"><span>{String(index + 1).padStart(2, '0')}</span><span>{DEEP_CASES.includes(work.slug) ? <><Layers3 size={12}/>{lang === 'zh' ? '可交互案例' : 'Interactive case'}</> : (lang === 'zh' ? '作品档案 ↗' : 'Case archive ↗')}</span></div>
  </a>
  return <>
    <a className="skip-link" href={isCase ? '#case-start' : '#works'} onClick={isCase ? event => { event.preventDefault(); document.querySelector<HTMLElement>('.case-page')?.focus() } : event => { homeAnchor(event); if (event.defaultPrevented) document.getElementById('works')?.focus({ preventScroll: true }) }}>{t.skip}</a>
    <SiteHeader lang={lang} isCase={displayedIsCase} anchor={homeAnchor} toggleLanguage={toggleLanguage} /><MotionPreference lang={lang}/>
    {/* Mount the destination immediately: lazy experiments must not hold route exits. */}
    {isCase ? <motion.div key={hash} className="case-transition">
      <motion.div className="case-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .3 }} aria-hidden="true" />
      <Suspense fallback={<main className="case-page experiment-loading" aria-busy="true">{lang === 'zh' ? '正在打开案例…' : 'Opening the case…'}</main>}><CasePage work={getWorkDoc(slug!, lang)} lang={lang} reduced={reduced} back={back} visit={visit} openPhoto={(photos, index) => setLightbox({ photos, index })} /><RestoreScroll page={page} onRouteMount={setDisplayedIsCase} /></Suspense>
    </motion.div> : <motion.main key="home" id="top" className="final-career-home" data-career-evidence="Hermès / Arc’teryx" aria-label={lang === 'zh' ? '职业叙述作品集：工业与产品设计师' : 'Career-led portfolio: Industrial & Product Designer'} exit={{ opacity: 1 }} transition={{ duration: 0 }}>
      <RestoreScroll page={page} onRouteMount={setDisplayedIsCase} />
      <StudioIntroduction lang={lang} reduced={reduced} anchor={homeAnchor} visit={visit} />
      <DisciplinePaths lang={lang} anchor={homeAnchor}/>
      <CareerShowcase works={works} lang={lang} visit={visit}/>
      <ProductEvidence works={works} lang={lang} visit={visit} anchor={homeAnchor}/>
      <OpenSourcePractice works={works} lang={lang} visit={visit}/>
      <CapabilityMatrix lang={lang} visit={visit}/>
      <section className="work-index" id="works" aria-labelledby="index-title" tabIndex={-1} data-motion-anchor>
        <div className="index-heading"><div><span className="studio-eyebrow">{lang === 'zh' ? '完整档案' : 'Full archive'}</span><h2 id="index-title">{t.catalog}</h2><p>{lang === 'zh' ? '按品牌或产品方向筛选，搜索项目与关键词，或切换列表查看。进入案例，了解职责、设计过程与成果阶段。' : 'Filter by brand or product design, search projects and keywords, or switch to the list. Open a case to review responsibilities, design decisions and the stage reached.'}</p></div><span>{String(works.length).padStart(2, '0')}<small>{t.count}</small></span></div>
        <div className="filters"><div className="category-list" role="group" aria-label={lang === 'zh' ? '作品分类' : 'Work category'}>{Object.entries(PORTFOLIO_FILTERS[lang]).map(([value, label]) => <button key={value} aria-pressed={category === value} onClick={() => setCategory(value as PortfolioFilter)}>{label}</button>)}</div><label className="search"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t.search} aria-label={t.search} /></label></div>
        <div className="catalog-toolbar"><p className="result-count" aria-live="polite">{visibleWorks.length} / {shown.length} {t.count}</p><div className="view-switch" role="group" aria-label={lang === 'zh' ? '目录显示方式' : 'Catalogue view'}><button aria-pressed={catalogView === 'grid'} onClick={() => setCatalogView('grid')}><Grid2X2 size={16}/>{lang === 'zh' ? '画廊' : 'Gallery'}</button><button aria-pressed={catalogView === 'list'} onClick={() => setCatalogView('list')}><List size={16}/>{lang === 'zh' ? '列表' : 'List'}</button></div></div>
        {shown.length ? <div className={`catalog-grid ${catalogView === 'list' ? 'catalog-list' : ''}`}>{visibleWorks.map((work, index) => renderCard(work, index))}</div> : <div className="empty-state"><h3>{t.empty}</h3><p>{t.emptyText}</p><button className="primary" onClick={() => { setCategory('all'); setQuery('') }}>{t.clear}</button></div>}
        {shown.length > 8 && category === 'all' && !normalizedQuery && <button type="button" className="archive-expand" aria-expanded={archiveExpanded} onClick={() => { setArchiveExpanded(value => !value); if (archiveExpanded) { const index = document.getElementById('works'); index?.scrollIntoView({ behavior: 'instant' }); index?.focus({ preventScroll: true }) } }}>{archiveExpanded ? (lang === 'zh' ? '收起完整目录' : 'Show fewer projects') : (lang === 'zh' ? `展开全部 ${shown.length} 项作品` : `View all ${shown.length} projects`)}</button>}
      </section>
      <DesignMethod lang={lang} visit={visit} index={methodIndex} setIndex={setMethodIndex}/>
      <StudioProfile lang={lang} visit={visit} openCapabilities={openCapabilities} setOpenCapabilities={setOpenCapabilities}/>
      <StudioProfileDetails lang={lang} visit={visit} openCapabilities={openCapabilities} setOpenCapabilities={setOpenCapabilities}/>
      <Downloads lang={lang} variant={downloadVariant} setVariant={setDownloadVariant}/>
      <StudioContact lang={lang} reduced={reduced} anchor={homeAnchor}/>
      <MobileDock lang={lang} anchor={homeAnchor}/>
    </motion.main>}
    {isCase && <footer className="case-footer"><span>© 2026 孙英杰 / Yingjie Sun</span><a href={asset('/OPEN_SOURCE_REFERENCES.md')} target="_blank" rel="noreferrer">{lang === 'zh' ? '开源项目与参考资料' : 'Open-source projects & references'} ↗</a><a href="#works" onClick={homeAnchor}>{t.works} ↑</a></footer>}

    {lightbox && <Suspense fallback={null}><MediaViewer {...lightbox} reduced={reduced} lang={lang} onClose={() => setLightbox(null)} onIndex={index => setLightbox({ ...lightbox, index })} /></Suspense>}
  </>
}

import './interaction-v73.css'
import './design-system-v74.css'
import './final-career-home.css'
