import { Component, Suspense, lazy, useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { asset, CATEGORIES, getWorkDoc, getWorks, type Category, type Lang, type WorkDoc } from './data/workDocs'
import { SenIntroduction, SenGallery } from './ui/SenExperience'
import profile from './data/profile.json'
import './styles.css'
import './sen.css'
import './editorial.css'
import { ArrowUpRight, Download, Layers3 } from 'lucide-react'
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
  const [active, setActive] = useState(true)
  const [sceneReady, setSceneReady] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (reduced) return
    const timer = window.setTimeout(() => setEnabled(true), 900)
    return () => window.clearTimeout(timer)
  }, [reduced])
  useEffect(() => {
    const update = () => {
      const gallery = document.querySelector<HTMLElement>('.wk-gallery')
      const top = gallery?.getBoundingClientRect().top ?? innerHeight
      container.current?.style.setProperty('--works-fog', String(Math.max(0, Math.min(.78, (1 - top / innerHeight) * 1.1))))
      // Keep the camera tail synchronized until it has completed behind the work panel.
      setActive(!document.hidden && top > -innerWidth)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    document.addEventListener('visibilitychange', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); document.removeEventListener('visibilitychange', update) }
  }, [])
  const showScene = requested || (!reduced && enabled)
  const stopScene = () => { setRequested(false); setEnabled(false); setSceneReady(false) }
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
  const [page, setPage] = useState(readPageLocation), [category, setCategory] = useState<Category | 'all'>(savedCatalog?.category ?? 'all'), [query, setQuery] = useState(savedCatalog?.query ?? '')
  const [displayedIsCase, setDisplayedIsCase] = useState(() => caseSlug(location.hash) !== null)
  const [lightbox, setLightbox] = useState<{ photos: Photo[]; index: number } | null>(null)
  const reduced = useReducedMotion(), t = copy[lang], hash = page.hash
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
    if (!isCase) history.replaceState({ ...history.state, portfolioCatalog: { category, query } }, '', location.href)
  }, [category, query, isCase])
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
    if (replace) history.replaceState(null, '', target)
    else history.pushState(null, '', target)
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
  const renderCard = (work: WorkDoc, featured = false) => <a className={`work-card ${featured ? 'featured-card' : ''}`} key={work.slug} data-return-focus={`catalog:${work.slug}`} href={`#/work/${work.slug}`} onClick={event => { if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); visit(work.slug) }}>
    <div className="work-image"><img src={asset(`/thumbnails/${work.slug}.webp`)} alt={work.title} loading="lazy" /><span className="read-label">{t.read} <span aria-hidden="true">↗</span></span></div><div className="work-caption"><h3>{work.title}{DEEP_CASES.includes(work.slug) && <Layers3 size={14} aria-label={lang === 'zh' ? '可交互案例' : 'Interactive case'} />}</h3><span>{CATEGORIES[lang][work.category]}</span></div>{featured && <p>{work.summary}</p>}
  </a>
  return <>
    <a className="skip-link" href={isCase ? '#case-start' : '#works'} onClick={isCase ? event => { event.preventDefault(); document.querySelector<HTMLElement>('.case-page')?.focus() } : homeAnchor}>{t.skip}</a>
    <header className={`site-header ${displayedIsCase ? 'on-case' : ''}`}><a href="#top" onClick={homeAnchor} className="signature">Sun Yingjie<span>孙英杰</span></a><nav aria-label={lang === 'zh' ? '主导航' : 'Main navigation'}><a href="#works" onClick={homeAnchor}>{t.works}</a><a href="#about" onClick={homeAnchor}>{t.about}</a><a href="#contact" onClick={homeAnchor}>{t.contact}</a></nav><button className="language" onClick={toggleLanguage} aria-label="切换语言 / Switch language">{lang === 'zh' ? 'EN' : '中'}</button></header>
    {/* Mount the destination immediately: lazy experiments must not hold route exits. */}
    {isCase ? <motion.div key={hash} className="case-transition">
      <motion.div className="case-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .3 }} aria-hidden="true" />
      <Suspense fallback={<main className="case-page experiment-loading" aria-busy="true">{lang === 'zh' ? '正在打开案例…' : 'Opening the case…'}</main>}><CasePage work={getWorkDoc(slug!, lang)} lang={lang} reduced={reduced} back={back} visit={visit} openPhoto={(photos, index) => setLightbox({ photos, index })} /><RestoreScroll page={page} onRouteMount={setDisplayedIsCase} /></Suspense>
    </motion.div> : <motion.main key="home" id="top" exit={{ opacity: 1 }} transition={{ duration: 0 }}>
      <RestoreScroll page={page} onRouteMount={setDisplayedIsCase} />
      <SenIntroduction lang={lang} reduced={reduced} portrait={<Portrait lang={lang} reduced={reduced} />} anchor={homeAnchor} />
      <section className="exhibition-intro" aria-labelledby="exhibition-title"><div className="editorial-kicker">01—06 / {lang === 'zh' ? '作品与设计判断' : 'WORK & DESIGN DECISIONS'}</div><h2 id="exhibition-title">{lang === 'zh' ? <>设计，<br /><em>如何形成。</em></> : <>How design<br /><em>takes shape.</em></>}</h2><div className="exhibition-note"><p>{lang === 'zh' ? '从空间、物件到屏幕，观察一个想法怎样经过材料、结构与使用情境，成为具体的设计。' : 'From spaces and objects to screens: follow an idea through materials, structure and use.'}</p><ol><li>{lang === 'zh' ? '看见作品' : 'See the work'}</li><li>{lang === 'zh' ? '理解判断' : 'Understand the decisions'}</li><li>{lang === 'zh' ? '动手探索' : 'Try the interaction'}</li></ol><a href="#works" onClick={homeAnchor}>{lang === 'zh' ? '直接打开完整目录' : 'Open the full index'} <ArrowUpRight size={17}/></a></div></section>
      <SenGallery works={works} lang={lang} reduced={reduced} visit={visit} catalogue={homeAnchor} />
      <section className="work-index" id="works" aria-labelledby="index-title"><div className="index-heading"><div><h2 id="index-title">{t.catalog}</h2><p>{t.catalogText}</p></div><span>{String(works.length).padStart(2, '0')} {t.count}</span></div><div className="filters"><div className="category-list" role="group" aria-label={lang === 'zh' ? '作品分类' : 'Work category'}>{Object.entries(CATEGORIES[lang]).map(([value, label]) => <button key={value} aria-pressed={category === value} onClick={() => setCategory(value as Category | 'all')}>{label}</button>)}</div><label className="search"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t.search} aria-label={t.search} /></label></div><p className="result-count" aria-live="polite">{shown.length} / {works.length} {t.count}</p>{shown.length ? <div className="catalog-grid">{shown.map(work => renderCard(work))}</div> : <div className="empty-state"><h3>{t.empty}</h3><p>{t.emptyText}</p><button className="primary" onClick={() => { setCategory('all'); setQuery('') }}>{t.clear}</button></div>}</section>
      <section className="about-section" id="about"><div className="about-heading"><span>{t.about}</span><h2>{t.aboutTitle}</h2></div><div className="about-body"><p>{profile.summary[lang]}</p><div className="skill-list">{['Rhino', 'KeyShot', 'Blender', 'Figma', 'CMF', 'AIGC'].map(skill => <span key={skill}>{skill}</span>)}</div><a className="download-link" href={asset('/downloads/sun-yingjie-selected-portfolio.pdf')} download><span>{lang === 'zh' ? '精选作品集' : 'Selected portfolio'}<small>{lang === 'zh' ? '八个案例 · 设计判断与过程' : 'Eight cases · Decisions and process'}</small></span><Download size={22}/></a><a className="download-link" href={asset('/downloads/sun-yingjie-full-portfolio.pdf')} download><span>{lang === 'zh' ? '完整作品档案' : 'Complete portfolio'}<small>{lang === 'zh' ? '全部33个案例与原稿入口' : 'All 33 cases and source material'}</small></span><Download size={22}/></a><a className="download-link" href={asset('/downloads/sun-yingjie-resume.pdf')} download><span>{t.cv}<small>{t.cvNote}</small></span><span aria-hidden="true">↓</span></a><a className="resume-editable" href={asset('/downloads/sun-yingjie-resume.docx')} download>{lang === 'zh' ? '可编辑 Word 版本' : 'Editable Word version'} <ArrowUpRight size={14} /></a></div></section>
      <section className="contact-section" id="contact"><span>{t.contact}</span><h2>{t.contactTitle}</h2><p>{t.contactText}</p><a className="email-link" href={`mailto:${profile.email}`}>{profile.email}<span aria-hidden="true">↗</span></a><div className="contact-actions"><a href={`mailto:${profile.email}`}>{t.email}</a><a href={`tel:+86${profile.phone}`}>{t.phone} · {profile.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')}</a><a href="https://github.com/AJ-nb" target="_blank" rel="noreferrer">GitHub ↗</a></div></section>
    </motion.main>}
    <footer><span>© 2026 孙英杰 / Yingjie Sun</span><a href={asset('/THIRD_PARTY_NOTICES.md')} target="_blank" rel="noreferrer">{lang === 'zh' ? '开源致谢' : 'Open-source credits'} ↗</a><a href={isCase ? '#works' : '#top'} onClick={homeAnchor}>{isCase ? t.works : t.top} ↑</a></footer>
    {!displayedIsCase && <nav className="mobile-nav" aria-label={lang === 'zh' ? '快捷导航' : 'Quick navigation'}><a href="#works" onClick={homeAnchor}>{t.works}</a><a href="#about" onClick={homeAnchor}>{t.about}</a><a href="#contact" onClick={homeAnchor}>{t.contact}</a></nav>}
    {lightbox && <Suspense fallback={null}><MediaViewer {...lightbox} reduced={reduced} lang={lang} onClose={() => setLightbox(null)} onIndex={index => setLightbox({ ...lightbox, index })} /></Suspense>}
  </>
}
