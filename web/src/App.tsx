import { Component, Suspense, lazy, useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { asset, CATEGORIES, getWorkDoc, getWorks, type Category, type Lang, type WorkDoc } from './data/workDocs'
import { SenIntroduction, SenGallery } from './ui/SenExperience'
import profile from './data/profile.json'
import './styles.css'
import './sen.css'

const PortraitScene = lazy(() => import('./scene/PortraitScene'))
const copy = {
  zh: {
    works: '作品', about: '关于', contact: '联系', skip: '直接浏览作品', profession: '品牌与产品设计＋AI',
    hero: '形与意，从概念到实现。', intro: '以工业设计为起点，连接商业空间、品牌视觉与数字产品。让想法在材料、结构和体验中成为具体的作品。',
    explore: '浏览作品', view3d: '查看三维人物', still: '静态观看', scroll: '向下探索',
    selected: '在不同尺度中，找到设计的秩序。', catalog: '作品目录', catalogText: '从空间与产品，到视觉与屏幕。',
    search: '搜索作品、关键词', empty: '还没有找到相关作品。', emptyText: '换一个关键词，或清除筛选继续浏览。', clear: '清除筛选',
    back: '返回作品', role: '本人职责', credits: '合作署名', status: '项目阶段', read: '阅读案例',
    aboutTitle: '我关心的不只是形式，还有它如何成立。',
    aboutText: '我是孙英杰，产品设计专业背景的跨媒介创作者。我的实践从产品形态与结构出发，延伸到商业空间、品牌识别、三维表达与数字工具。',
    resume: '下载作品集 PDF', resumeNote: '完整目录与重点项目，适合离线阅读', cv: '下载个人简历', cvNote: '一页 A4 · 工作经历、项目与能力',
    contactTitle: '让下一个想法，成为具体的作品。', contactText: '求职沟通、设计合作或项目交流，欢迎联系。', email: '发送邮件', phone: '拨打电话',
    next: '继续浏览', prev: '上一张', nextImage: '下一张', close: '关闭', enlarge: '放大图片', zoom: '切换图片大小',
    notFound: '这个案例暂时没有收录。', top: '回到顶部', count: '件作品', all: '查看全部作品',
  },
  en: {
    works: 'Work', about: 'About', contact: 'Contact', skip: 'Go directly to work', profession: 'Brand & product design + AI',
    hero: 'Form and meaning, made tangible.', intro: 'Rooted in industrial design, I work across commercial spaces, visual identities and digital products. Ideas take shape through materials, structure and experience.',
    explore: 'Explore work', view3d: 'View 3D portrait', still: 'Still view', scroll: 'Explore below',
    selected: 'Finding order, across scales.', catalog: 'Work index', catalogText: 'From spaces and objects to identities and screens.',
    search: 'Search projects or keywords', empty: 'No matching work yet.', emptyText: 'Try another keyword or clear the filters to keep exploring.', clear: 'Clear filters',
    back: 'Back to work', role: 'My role', credits: 'Credits', status: 'Project stage', read: 'Read case study',
    aboutTitle: 'Beyond how it looks, I care about how it works.',
    aboutText: 'I’m Yingjie Sun, a multidisciplinary maker with a background in product design. My practice moves from form and structure into commercial spaces, visual identities, 3D expression and digital tools.',
    resume: 'Download portfolio PDF', resumeNote: 'Project index and selected work for offline reading', cv: 'Download résumé', cvNote: 'One A4 page · Experience, projects and skills',
    contactTitle: 'Let’s give the next idea a form.', contactText: 'For opportunities, design collaborations or a conversation about your project.', email: 'Send an email', phone: 'Call me',
    next: 'Keep exploring', prev: 'Previous image', nextImage: 'Next image', close: 'Close', enlarge: 'Enlarge image', zoom: 'Toggle image size',
    notFound: 'This case is not in the collection.', top: 'Back to top', count: 'projects', all: 'View all work',
  },
}
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
function Lightbox({ photos, index, onClose, onIndex, lang }: { photos: Photo[]; index: number; onClose: () => void; onIndex: (index: number) => void; lang: Lang }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [zoomed, setZoomed] = useState(false)
  const startX = useRef(0)
  const t = copy[lang], photo = photos[index]
  useEffect(() => {
    const node = dialog.current
    if (!node) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    node.showModal()
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = old; node.close(); if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true }) }
  }, [])
  function move(delta: number) { setZoomed(false); onIndex((index + delta + photos.length) % photos.length) }
  return <dialog ref={dialog} className={`lightbox ${zoomed ? 'is-zoomed' : ''}`} onCancel={event => { event.preventDefault(); onClose() }} onKeyDown={event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1) }
  }} aria-label={photo.alt || t.enlarge}>
    <div className="lightbox-bar"><span>{index + 1} / {photos.length}</span><button onClick={() => setZoomed(!zoomed)}>{t.zoom}</button><button onClick={onClose} autoFocus>{t.close} <span aria-hidden="true">×</span></button></div>
    <div className="lightbox-image" onTouchStart={event => { startX.current = event.touches[0].clientX }} onTouchEnd={event => {
      if (!zoomed) { const distance = event.changedTouches[0].clientX - startX.current; if (Math.abs(distance) > 60) move(distance < 0 ? 1 : -1) }
    }}><img src={asset(photo.src)} alt={photo.alt} /></div>
    <div className="lightbox-caption"><button onClick={() => move(-1)} aria-label={t.prev}>←</button><p>{photo.alt}</p><button onClick={() => move(1)} aria-label={t.nextImage}>→</button></div>
  </dialog>
}
function CasePage({ work, lang, openPhoto, back, visit }: { work: WorkDoc | null; lang: Lang; openPhoto: (photos: Photo[], index: number) => void; back: () => void; visit: (slug: string) => void }) {
  const t = copy[lang], main = useRef<HTMLElement>(null)
  useEffect(() => { main.current?.focus({ preventScroll: true }) }, [work?.slug])
  if (!work) return <main className="not-found" ref={main} tabIndex={-1}><h1>{t.notFound}</h1><button className="primary" onClick={back}>{t.back}</button></main>
  const photos = [...work.body.matchAll(/!\[([^\]]*)\]\(([^\s)]+)(?:\s+[^)]*)?\)/g)].map(match => ({ alt: match[1], src: match[2] }))
  if (!photos.some(photo => photo.src === work.cover)) photos.unshift({ src: work.cover, alt: work.title })
  const candidates = getWorks(lang), next = candidates[(candidates.findIndex(item => item.slug === work.slug) + 1) % candidates.length]
  return <main className="case-page" ref={main} tabIndex={-1}>
    <div className="case-toolbar"><button onClick={back}>← {t.back}</button><span>{CATEGORIES[lang][work.category]}</span></div>
    <header className="case-header"><div className="case-kicker">{work.status}</div><h1>{work.title}</h1><p className="case-summary">{work.summary}</p><dl className="case-facts"><div><dt>{t.role}</dt><dd>{work.role}</dd></div><div><dt>{t.credits}</dt><dd>{work.credits}</dd></div><div><dt>{t.status}</dt><dd>{work.status}</dd></div></dl></header>
    <button className="case-cover media-button" onClick={() => openPhoto(photos, Math.max(0, photos.findIndex(photo => photo.src === work.cover)))} aria-label={`${t.enlarge}: ${work.title}`}><img src={asset(work.cover)} alt={work.title} /></button>
    <article className="case-body"><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={{
      img: ({ src = '', alt = '' }) => <button className="media-button article-image" aria-label={`${t.enlarge}: ${alt}`} onClick={() => openPhoto(photos, Math.max(0, photos.findIndex(photo => photo.src === src)))}><img src={asset(src)} alt={alt} loading="lazy" /><span className="image-caption">{alt}<span aria-hidden="true"> ⤢</span></span></button>,
      video: ({ src, poster }) => <video src={src ? asset(src) : undefined} poster={poster ? asset(poster) : undefined} controls playsInline preload="metadata" />,
      a: ({ href = '', children }) => <a href={asset(href)} target={href.startsWith('https:') ? '_blank' : undefined} rel={href.startsWith('https:') ? 'noreferrer' : undefined}>{children}</a>,
    }}>{work.body}</ReactMarkdown></article>
    {next && <aside className="next-case"><span>{t.next}</span><a href={`#/work/${next.slug}`} onClick={event => { event.preventDefault(); visit(next.slug) }}>{next.title}<span aria-hidden="true">↗</span></a></aside>}
    <button className="case-back-bottom" onClick={back}>← {t.back}</button>
  </main>
}
function caseSlug(hash: string): string | null {
  if (!hash.startsWith('#/work/')) return null
  try { return decodeURIComponent(hash.slice(7)) } catch { return '' }
}
function readPageLocation() {
  const position = history.state?.portfolioPosition
  return { hash: location.hash, top: position?.hash === location.hash && Number.isFinite(position.top) ? position.top as number : null }
}
function savePagePosition() {
  history.replaceState({ ...history.state, portfolioPosition: { hash: location.hash, top: window.scrollY } }, '', location.href)
}
export default function App() {
  const [lang, setLang] = useState<Lang>(() => new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'zh')
  const [page, setPage] = useState(readPageLocation), [category, setCategory] = useState<Category | 'all'>('all'), [query, setQuery] = useState('')
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
    const frame = requestAnimationFrame(() => {
      if (page.top !== null) window.scrollTo({ top: page.top, behavior: 'instant' })
      else if (isCase || !page.hash || page.hash === '#top') window.scrollTo({ top: 0, behavior: 'instant' })
      else document.getElementById(page.hash.slice(1))?.scrollIntoView({ behavior: 'instant' })
    })
    return () => cancelAnimationFrame(frame)
  }, [isCase, page])
  function visit(id: string) {
    const target = `#/work/${encodeURIComponent(id)}`
    if (isCase) history.replaceState({ ...history.state, portfolioPosition: null }, '', target)
    else { savePagePosition(); history.pushState({ caseNavigation: true }, '', target) }
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
  const renderCard = (work: WorkDoc, featured = false) => <a className={`work-card ${featured ? 'featured-card' : ''}`} key={work.slug} href={`#/work/${work.slug}`} onClick={event => { event.preventDefault(); visit(work.slug) }}>
    <div className="work-image"><img src={asset(`/thumbnails/${work.slug}.webp`)} alt={work.title} loading="lazy" /><span className="read-label">{t.read} <span aria-hidden="true">↗</span></span></div><div className="work-caption"><h3>{work.title}</h3><span>{CATEGORIES[lang][work.category]}</span></div>{featured && <p>{work.summary}</p>}
  </a>
  return <>
    <a className="skip-link" href={isCase ? '#case-start' : '#works'} onClick={isCase ? event => { event.preventDefault(); document.querySelector<HTMLElement>('.case-page')?.focus() } : homeAnchor}>{t.skip}</a>
    <header className={`site-header ${isCase ? 'on-case' : ''}`}><a href="#top" onClick={homeAnchor} className="signature">Sun Yingjie<span>孙英杰</span></a><nav aria-label={lang === 'zh' ? '主导航' : 'Main navigation'}><a href="#works" onClick={homeAnchor}>{t.works}</a><a href="#about" onClick={homeAnchor}>{t.about}</a><a href="#contact" onClick={homeAnchor}>{t.contact}</a></nav><button className="language" onClick={toggleLanguage} aria-label="切换语言 / Switch language">{lang === 'zh' ? 'EN' : '中'}</button></header>
    {isCase ? <CasePage work={getWorkDoc(slug!, lang)} lang={lang} back={back} visit={visit} openPhoto={(photos, index) => setLightbox({ photos, index })} /> : <main id="top">
      <SenIntroduction lang={lang} reduced={reduced} portrait={<Portrait lang={lang} reduced={reduced} />} anchor={homeAnchor} />
      <SenGallery works={works} lang={lang} reduced={reduced} visit={visit} catalogue={homeAnchor} />
      <section className="work-index" id="works" aria-labelledby="index-title"><div className="index-heading"><div><h2 id="index-title">{t.catalog}</h2><p>{t.catalogText}</p></div><span>{String(works.length).padStart(2, '0')} {t.count}</span></div><div className="filters"><div className="category-list" role="group" aria-label={lang === 'zh' ? '作品分类' : 'Work category'}>{Object.entries(CATEGORIES[lang]).map(([value, label]) => <button key={value} aria-pressed={category === value} onClick={() => setCategory(value as Category | 'all')}>{label}</button>)}</div><label className="search"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t.search} aria-label={t.search} /></label></div><p className="result-count" aria-live="polite">{shown.length} / {works.length} {t.count}</p>{shown.length ? <div className="catalog-grid">{shown.map(work => renderCard(work))}</div> : <div className="empty-state"><h3>{t.empty}</h3><p>{t.emptyText}</p><button className="primary" onClick={() => { setCategory('all'); setQuery('') }}>{t.clear}</button></div>}</section>
      <section className="about-section" id="about"><div className="about-heading"><span>{t.about}</span><h2>{t.aboutTitle}</h2></div><div className="about-body"><p>{profile.summary[lang]}</p><div className="skill-list">{['Rhino', 'KeyShot', 'Blender', 'Figma', 'CMF', 'AIGC'].map(skill => <span key={skill}>{skill}</span>)}</div><a className="download-link" href={asset('/downloads/sun-yingjie-selected-portfolio.pdf')} download><span>{t.resume}<small>{t.resumeNote}</small></span><span aria-hidden="true">↓</span></a><a className="download-link" href={asset('/downloads/sun-yingjie-resume.pdf')} download><span>{t.cv}<small>{t.cvNote}</small></span><span aria-hidden="true">↓</span></a></div></section>
      <section className="contact-section" id="contact"><span>{t.contact}</span><h2>{t.contactTitle}</h2><p>{t.contactText}</p><a className="email-link" href="mailto:2950884508@qq.com">2950884508@qq.com<span aria-hidden="true">↗</span></a><div className="contact-actions"><a href="mailto:2950884508@qq.com">{t.email}</a><a href="tel:+8613515249897">{t.phone} · 135 1524 9897</a><a href="https://github.com/AJ-nb" target="_blank" rel="noreferrer">GitHub ↗</a></div></section>
    </main>}
    <footer><span>© 2026 孙英杰 / Yingjie Sun</span><span>{lang === 'zh' ? '用设计连接想法与现实。' : 'Connecting ideas and reality through design.'}</span><a href={isCase ? '#works' : '#top'} onClick={homeAnchor}>{isCase ? t.works : t.top} ↑</a></footer>
    {!isCase && <nav className="mobile-nav" aria-label={lang === 'zh' ? '快捷导航' : 'Quick navigation'}><a href="#works" onClick={homeAnchor}>{t.works}</a><a href="#about" onClick={homeAnchor}>{t.about}</a><a href="#contact" onClick={homeAnchor}>{t.contact}</a></nav>}
    {lightbox && <Lightbox {...lightbox} lang={lang} onClose={() => setLightbox(null)} onIndex={index => setLightbox({ ...lightbox, index })} />}
  </>
}
