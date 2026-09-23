import { usePortfolioReducedMotion } from './MotionPreference'
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy, Download, Mail, Printer, ZoomIn } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { asset, getWorkDoc, type Lang } from '../data/workDocs'
import { getDesignOSFeaturedProjects, getProject, getProjectLabel, filterProjects, getRelatedProjects, isLabProject, isResearchProject, isToolProject, LAB_CATEGORIES, TOOL_CATEGORIES, orderProjectsByPrimaryWork, type Category, type ProjectEntry } from '../data/projectRegistry'
import { profileCopy } from '../data/profile'
import downloads from '../data/downloads.json'
import { getWorkflow } from '../data/workflowRegistry'
import type { DesignOSRoute } from '../data/routeResolver'
import { DesignOSSeo } from './DesignOSSeo'
import { SiteHeader, SiteFooter } from './SiteChrome'
import { localePath } from '../data/locale'
import AIVideoMethods, { MethodsLink } from './AIVideoMethods'

type Props = { route: DesignOSRoute; lang: Lang }
const b = <T,>(lang: Lang, value: { zh: T; en: T }) => value[lang]
const MediaViewer = lazy(() => import('./MediaViewer'))
const routeHref = localePath
const maturityLabels: Record<ProjectEntry['maturity'], { zh: string; en: string }> = {
  research: { zh: '研究', en: 'RESEARCH' },
  experiment: { zh: '实验', en: 'EXPERIMENT' },
  prototype: { zh: '原型', en: 'PROTOTYPE' },
  'functional-prototype': { zh: '可运行原型', en: 'FUNCTIONAL PROTOTYPE' },
  'production-ready-prototype': { zh: '生产就绪原型', en: 'PRODUCTION-READY PROTOTYPE' },
  live: { zh: '可用工具', en: 'LIVE' },
  'commercial-work': { zh: '商业项目', en: 'COMMERCIAL WORK' },
}
function categoriesForMode(mode: DesignOSRoute['name']): Category[] | undefined {
  if (mode === 'research' || mode === 'research-detail') return ['research']
  if (mode === 'lab' || mode === 'lab-detail') return [...LAB_CATEGORIES]
  if (mode === 'tools' || mode === 'tools-detail') return [...TOOL_CATEGORIES]
  return undefined
}

function modeAllowsProject(route: DesignOSRoute['name'], project: ProjectEntry): boolean {
  if (route === 'work-detail') return true
  const categories = categoriesForMode(route)
  return Boolean(categories?.includes(project.category))
}

function baseAllowsProject(basePath: string, project: ProjectEntry): boolean {
  if (basePath === '/work') return true
  if (basePath === '/tools') return isToolProject(project)
  if (basePath === '/research') return isResearchProject(project)
  return isLabProject(project)
}

export function DesignOSRoutes({ route, lang }: Props) {
  const main = useRef<HTMLElement>(null)
  const profile = profileCopy[lang]
  useEffect(() => {
    main.current?.focus({ preventScroll: true })
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  }, [route.pathname, lang])
  return <div className="design-os-shell">
    <DesignOSSeo route={route} lang={lang} />
    <a className="design-os-skip" href="#design-os-main">{lang === 'zh' ? '跳到主要内容' : 'Skip to main content'}</a>
    <SiteHeader lang={lang} pathname={route.pathname}/>
    <main id="design-os-main" className="design-os-main" ref={main} tabIndex={-1}>
      <RouteContent route={route} lang={lang} profile={profile} />
    </main>
    <SiteFooter lang={lang}/>
  </div>
}


function RouteContent({ route, lang, profile }: Props & { profile: typeof profileCopy.zh }) {
  if (route.name === 'video-methods') return <AIVideoMethods lang={lang}/>
  if (route.name === 'systems') return <Systems lang={lang}/>
  if (route.name === '404') return <NotFound lang={lang} pathname={route.pathname} />
  if (route.name === 'about') return <About lang={lang} profile={profile} />
  if (route.name === 'resume') return <Resume lang={lang} />
  if (route.name === 'contact') return <Contact lang={lang} profile={profile} />
  if (route.name === 'work-detail' || route.name === 'lab-detail' || route.name === 'tools-detail' || route.name === 'research-detail') {
    const project = getProject(route.slug)
    const allowed = project && modeAllowsProject(route.name, project)
    const basePath = route.name === 'lab-detail' ? '/lab' : route.name === 'tools-detail' ? '/tools' : route.name === 'research-detail' ? '/research' : '/work'
    return allowed ? <ProjectDetail project={project} lang={lang} basePath={basePath} /> : <NotFound lang={lang} pathname={route.pathname} />
  }
  const categories = categoriesForMode(route.name)
  const entries = categories ? filterProjects().filter(project => categories.includes(project.category)) : orderProjectsByPrimaryWork(filterProjects())
  return <ProjectIndex key={route.name} entries={entries} lang={lang} mode={route.name} basePath={route.name === 'lab' ? '/lab' : route.name === 'tools' ? '/tools' : route.name === 'research' ? '/research' : '/work'} />
}

function ProjectIndex({ entries, lang, mode, basePath }: { entries: ProjectEntry[]; lang: Lang; mode: DesignOSRoute['name']; basePath: string }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const labels = mode === 'lab' ? { zh: '实验与方法', en: 'Lab & methods' } : mode === 'tools' ? { zh: '工具与原型', en: 'Tools & prototypes' } : mode === 'research' ? { zh: '研究档案', en: 'Research archive' } : { zh: '作品档案', en: 'Work archive' }
  const intro = mode === 'lab' ? { zh: '把探索、评估与未完成的方向保持在清楚的证据边界内。', en: 'Keep exploration, evaluation and unfinished directions within clear evidence boundaries.' } : mode === 'tools' ? { zh: '可操作的数字工具与产品原型，展示输入、判断、编辑和恢复。', en: 'Operable digital tools and product prototypes for input, judgment, editing and recovery.' } : mode === 'research' ? { zh: '记录研究问题、来源与方法边界，让观察和试验保持可追溯。', en: 'Record research questions, sources and method boundaries so observations and experiments remain traceable.' } : { zh: '从商业空间、品牌识别到实体与数字产品，按项目阶段阅读设计判断。', en: 'Read design decisions across commercial spaces, identity, physical and digital products.' }
  const availableCategories = [...new Set(entries.map(entry => entry.category))]
  const shown = useMemo(() => {
    const normalized = query.normalize('NFKC').toLocaleLowerCase().trim()
    return entries.filter(entry => {
      if (category !== 'all' && entry.category !== category) return false
      if (!normalized) return true
      return `${b(lang, entry.title)} ${b(lang, entry.summary)} ${entry.skills.join(' ')} ${entry.maturity}`.normalize('NFKC').toLocaleLowerCase().includes(normalized)
    })
  }, [category, entries, lang, query])
  return <RouteFrame eyebrow={b(lang, labels)} title={b(lang, labels)} intro={b(lang, intro)} lang={lang}>
    {mode==='research'&&<MethodsLink lang={lang}/>}
    <div className="design-os-index-tools">
      <div className="design-os-filters" role="group" aria-label={lang === 'zh' ? '筛选项目分类' : 'Filter project category'}>
        <button type="button" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>{lang === 'zh' ? '全部' : 'All'}</button>
        {availableCategories.map(value => <button type="button" key={value} aria-pressed={category === value} onClick={() => setCategory(value)}>{getProjectLabel({ category: value } as ProjectEntry, lang)}</button>)}
      </div>
      <label className="design-os-search"><span>{lang === 'zh' ? '查找' : 'Search'}</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={lang === 'zh' ? '项目、能力或成熟度' : 'Project, skill or maturity'} /></label>
    </div>
    <p className="design-os-result-count" aria-live="polite">{shown.length} / {entries.length} {lang === 'zh' ? '项' : 'projects'}</p>
    {shown.length ? <div className="design-os-grid">{shown.map(project => <ProjectCard key={project.slug} project={project} lang={lang} basePath={basePath} />)}</div> : <p className="design-os-empty">{lang === 'zh' ? '没有匹配的公开项目。' : 'No public projects match this search.'}</p>}
  </RouteFrame>
}

function ProjectCard({ project, lang, basePath }: { project: ProjectEntry; lang: Lang; basePath: string }) {
  const links = [
    project.liveDemoUrl && [project.liveDemoUrl, project.demoLabel ? b(lang, project.demoLabel) : lang === 'zh' ? '查看演示' : 'View demo'],
    project.githubUrl && [project.githubUrl, 'GitHub'],
  ].filter(Boolean) as Array<[string, string]>
  return <article className="design-os-card">
    <a className="design-os-card-main" href={routeHref(`${basePath}/${project.slug}`, lang)}>
      <div className="design-os-card-image"><img src={asset(project.cover)} alt={b(lang, project.title)} loading="lazy" /></div>
      <div className="design-os-card-meta"><span>{getProjectLabel(project, lang)}</span><span>{maturityLabels[project.maturity][lang]}</span></div>
      <h2>{b(lang, project.title)}</h2><p>{b(lang, project.summary)}</p><span className="design-os-card-link">{lang === 'zh' ? '打开档案' : 'Open archive'} <ArrowUpRight size={15}/></span>
    </a>
    {links.length > 0 && <div className="design-os-card-entries">{links.map(([href, label]) => <a key={href} href={href} target="_blank" rel="noreferrer">{label} <ArrowUpRight size={13}/></a>)}</div>}
  </article>
}

function displayProjectValue(value: string | undefined, _lang: Lang): string {
  const normalized = value?.trim()
  return normalized || '—'
}

function projectTypeLabel(project: ProjectEntry, lang: Lang): string {
  const tracks: Record<ProjectEntry['track'], { zh: string; en: string }> = {
    physical: { zh: '实体产品', en: 'Physical product' },
    digital: { zh: '数字产品', en: 'Digital product' },
    spatial: { zh: '空间体验', en: 'Spatial experience' },
    service: { zh: '服务系统', en: 'Service system' },
  }
  return `${getProjectLabel(project, lang)} · ${b(lang, tracks[project.track])}`
}

function projectPhotos(project: ProjectEntry, lang: Lang, markdown = ''): Array<{ src: string; alt: string }> {
  const photos = [{ src: project.cover, alt: b(lang, project.title) }]
  for (const match of markdown.matchAll(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g)) {
    const [, altText, src] = match
    if (!photos.some(photo => photo.src === src)) photos.push({ src, alt: altText || b(lang, project.title) })
  }
  for (const match of markdown.matchAll(/<img\b(?=[^>]*\bsrc=["']([^"']+)["'])(?=[^>]*\balt=["']([^"']*)["'])[^>]*>/g)) {
    const [, src, altText] = match
    if (!photos.some(photo => photo.src === src)) photos.push({ src, alt: altText || b(lang, project.title) })
  }
  return photos
}

function ProjectDetail({ project, lang, basePath }: { project: ProjectEntry; lang: Lang; basePath: string }) {
  const work = getWorkDoc(project.slug, lang)
  const normalizeCopy = (value: string) => value.replace(/\s+/g, ' ').trim().replace(/[.。;；]+$/, '')
  // The page header already provides context and role. Keep longer editorial
  // sections, but avoid repeating a section containing only the same sentence.
  const headerCopy = [b(lang, project.summary), b(lang, project.roleScope)].map(normalizeCopy)
  const body = (work?.body ?? '').split(/(?=^## )/m).filter(section => {
    const introduction = section.match(/^## (?:项目背景|Context|本人职责|My role)\r?\n+([\s\S]*)$/)
    return !introduction || !headerCopy.includes(normalizeCopy(introduction[1]))
  }).join('')
  const bodyParagraphs = body.split(/\r?\n\s*\r?\n/).map(normalizeCopy)
  const creditCopy = [...new Set([b(lang, project.credits), b(lang, project.provenance), b(lang, project.publicBoundary)])]
    .filter(value => value.trim() && !bodyParagraphs.includes(normalizeCopy(value)))
  const photos = useMemo(() => projectPhotos(project, lang, work?.body), [lang, project, work?.body])
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const lastMediaTrigger = useRef<{ element: HTMLButtonElement; id: string } | null>(null)
  const reducedMotion = usePortfolioReducedMotion()
  const openViewer = (index: number, trigger: HTMLButtonElement) => {
    lastMediaTrigger.current = { element: trigger, id: trigger.dataset.mediaTrigger ?? '' }
    setViewerIndex(index)
  }
  const closeViewer = () => {
    setViewerIndex(null)
    // Yet Another React Lightbox performs its own cleanup after React has
    // unmounted it. Return focus after that cleanup so keyboard users resume
    // on the image that opened the viewer rather than on <body>.
    window.setTimeout(() => {
      const trigger = lastMediaTrigger.current
      if (!trigger) return
      const currentButton = trigger.element.isConnected
        ? trigger.element
        : document.querySelector<HTMLButtonElement>(`[data-media-trigger="${trigger.id}"]`)
      currentButton?.focus()
    }, 800)
  }
  const headings = [...body.matchAll(/^## (.+)$/gm)].map(match => match[1])
  const projectLinks = project.links ?? {}
  const workflow = getWorkflow(project.slug)
  const links = [
    ['caseStudyUrl', project.caseStudyUrl ?? projectLinks.caseStudyUrl, lang === 'zh' ? '案例' : 'Case study'],
    ['liveDemoUrl', project.liveDemoUrl ?? projectLinks.liveDemoUrl, project.demoLabel ? b(lang, project.demoLabel) : lang === 'zh' ? '在线演示' : 'Live demo'],
    ['githubUrl', project.githubUrl ?? projectLinks.githubUrl, 'GitHub'],
    ['documentationUrl', project.documentationUrl ?? projectLinks.documentationUrl, lang === 'zh' ? '文档' : 'Documentation'],
    ['researchUrl', project.researchUrl ?? projectLinks.researchUrl, lang === 'zh' ? '研究来源' : 'Research source'],
    ['figmaUrl', project.figmaUrl ?? projectLinks.figmaUrl, 'Figma'],
    ['externalUrl', project.externalUrl ?? projectLinks.externalUrl, lang === 'zh' ? '外部链接' : 'External link'],
  ].filter(([, href]) => typeof href === 'string' && href.trim()) as Array<[string, string, string]>
  const related = getRelatedProjects(project.slug, lang).filter(item => baseAllowsProject(basePath, item)).slice(0, 2)
  const quickSummary = [
    [lang === 'zh' ? '职责' : 'Role', displayProjectValue(project.roleScope?.[lang], lang)],
    [lang === 'zh' ? '年份' : 'Year', displayProjectValue(project.year, lang)],
    [lang === 'zh' ? '类型' : 'Type', projectTypeLabel(project, lang)],
    [lang === 'zh' ? '工具' : 'Tools', displayProjectValue(project.tools?.join(' · '), lang)],
    [lang === 'zh' ? '贡献' : 'Contribution', displayProjectValue(project.contribution?.[lang], lang)],
    [lang === 'zh' ? '状态' : 'Status', displayProjectValue(project.status?.[lang], lang)],
  ] as const
  return <RouteFrame eyebrow={`${getProjectLabel(project, lang)} · ${maturityLabels[project.maturity][lang]}`} title={b(lang, project.title)} intro={b(lang, project.summary)} lang={lang}>
    <dl className="design-os-detail-meta design-os-quick-summary" aria-label={lang === 'zh' ? '项目摘要' : 'Project quick summary'}>{quickSummary.filter(([, value], index, items) => value !== '—' && items.findIndex(([, other]) => normalizeCopy(other) === normalizeCopy(value)) === index).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <figure className="design-os-detail-cover"><button type="button" data-media-trigger="media-0" onClick={event => openViewer(0, event.currentTarget)} aria-label={lang === 'zh' ? '放大项目封面' : 'Enlarge project cover'}><img src={asset(project.cover)} alt={b(lang, project.title)} /><span><ZoomIn size={16}/>{lang === 'zh' ? '查看大图' : 'View image'}</span></button></figure>
    {work && <article className="design-os-detail-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={{
        h2: ({ children }) => <h2 id={`design-os-section-${headings.indexOf(String(children))}`}>{children}</h2>,
        img: ({ src = '', alt = '' }) => {
          const index = photos.findIndex(photo => photo.src === src)
          return <span className="design-os-inline-media"><button type="button" data-media-trigger={`media-${Math.max(index, 0)}`} onClick={event => openViewer(Math.max(index, 0), event.currentTarget)} aria-label={`${lang === 'zh' ? '放大图片' : 'Enlarge image'}：${alt || b(lang, project.title)}`}><img src={asset(src)} alt={alt || b(lang, project.title)} loading="lazy" /></button><span className="design-os-inline-caption">{alt}</span></span>
        },
        track: ({ src, ...props }) => <track {...props} src={src ? asset(src) : undefined}/>,
        video: ({ src, poster, children }) => <video src={src ? asset(src) : undefined} poster={poster ? asset(poster) : undefined} controls playsInline preload="metadata" aria-label={lang === 'zh' ? '项目视频，提供原生播放控制与视觉说明轨道' : 'Project video with native playback controls and visual-description track'}>{children}</video>,
        a: ({ href = '', children }) => <a href={href.startsWith('/') && !/^\/(works|media|downloads)\//.test(href) ? localePath(href, lang) : asset(href)} target={href.startsWith('https:') ? '_blank' : undefined} rel={href.startsWith('https:') ? 'noreferrer' : undefined}>{children}</a>,
      }}>{body}</ReactMarkdown>
    </article>}
    <section className="design-os-detail-credit"><span>{lang === 'zh' ? '资料与使用边界' : 'Evidence & public context'}</span>{creditCopy.map(value => <p key={value}>{value}</p>)}<p>{lang === 'zh' ? '资料等级' : 'Evidence'}: Level {project.evidenceLevel} · {project.sourceKind}</p><p>AI / Human: {b(lang, project.aiRole)} {b(lang, project.humanGates).join('; ')}</p></section>
    {links.length > 0 && <div className="design-os-detail-source"><span>{lang === 'zh' ? '相关链接' : 'Links'}</span><div>{links.map(([key, href, label]) => <a key={key} href={href} target="_blank" rel="noreferrer">{label} <ArrowUpRight size={14}/></a>)}</div></div>}
    {workflow && <div className="design-os-detail-source design-os-workflow-record"><span>{lang === 'zh' ? '工作流记录' : 'Workflow record'}</span><ol>{workflow.workflow[lang].map(step => <li key={step}>{step}</li>)}</ol></div>}
    {related.length > 0 && <section className="design-os-related" aria-labelledby="design-os-related-title"><header><span>{lang === 'zh' ? '关联项目' : 'Related work'}</span><h2 id="design-os-related-title">{lang === 'zh' ? '沿着相近的问题继续阅读。' : 'Continue through adjacent questions.'}</h2></header><div>{related.map(item => <a key={item.slug} href={routeHref(`${basePath}/${item.slug}`, lang)}><img src={asset(item.cover)} alt="" loading="lazy"/><span>{b(lang, item.title)} <ArrowUpRight size={14}/></span><small>{item.relation.reason}</small></a>)}</div></section>}
    <a className="design-os-text-link" href={routeHref(basePath, lang)}>← {lang === 'zh' ? '返回档案' : 'Back to archive'}</a>
    {viewerIndex !== null && <Suspense fallback={null}><MediaViewer photos={photos.map(photo => ({ ...photo, alt: photo.alt || b(lang, project.title) }))} index={viewerIndex} onClose={closeViewer} onIndex={setViewerIndex} lang={lang} reduced={reducedMotion} /></Suspense>}
  </RouteFrame>
}

function About({ lang, profile }: { lang: Lang; profile: typeof profileCopy.zh }) {
  return <RouteFrame eyebrow={profile.eyebrow} title={profile.title} intro={profile.lead} lang={lang}>
    <div className="design-os-about"><figure className="design-os-about-portrait"><img src={asset('/media/v7/profile-portrait-cutout.png')} alt={lang === 'zh' ? '孙英杰身穿深灰色高领上衣的肖像' : 'Portrait of Yingjie Sun in a graphite funnel-collar sweater'} loading="lazy" decoding="async" /><figcaption>孙英杰 / Yingjie Sun</figcaption></figure><div>{profile.narrative.map(text => <p key={text}>{text}</p>)}</div><aside><h2>{lang === 'zh' ? '能力' : 'Capabilities'}</h2>{profile.capabilities.map(capability => <div className="design-os-capability" key={capability.id}><strong>{capability.title}</strong><p>{capability.body}</p></div>)}</aside></div>
  </RouteFrame>
}

function Resume({ lang }: { lang: Lang }) {
  const profile = profileCopy[lang]
  const files = downloads.items.filter(item => item.lang === lang)
  const selected = getDesignOSFeaturedProjects()
  const timeline = [...profile.experience, profile.education, profile.practice]
  return <RouteFrame eyebrow={lang === 'zh' ? '职业档案 / 简历与精选作品' : 'Professional record / résumé & selected work'} title={lang === 'zh' ? '孙英杰 / YINGJIE SUN' : 'YINGJIE SUN'} intro={profile.position + ' · 3D · CMF · ' + (lang === 'zh' ? '品牌。' : 'Brand. ') + profile.asOf} lang={lang}>
    <div className="design-os-resume-actions"><button type="button" onClick={() => window.print()}><Printer size={16}/>{lang === 'zh' ? '打印 / 保存 PDF' : 'Print / save PDF'}</button></div>
    <div className="design-os-resume-layout">
      <div className="design-os-resume-main">
        <section className="design-os-resume-section"><span>{lang === 'zh' ? '经历与教育' : 'Experience & education'}</span>{timeline.map(entry => <article key={entry.id}><div><time>{entry.period}</time><h2>{entry.place}</h2><p>{entry.role}</p></div><div><ul>{entry.details.map(detail => <li key={detail}>{detail}</li>)}</ul></div></article>)}</section>
        <section className="design-os-resume-section"><span>{lang === 'zh' ? '精选项目' : 'Selected work'}</span><div className="design-os-resume-projects">{selected.map(project => <a key={project.slug} href={routeHref(`/work/${project.slug}`, lang)}><strong>{b(lang, project.title)}</strong><small>{getProjectLabel(project, lang)} · {maturityLabels[project.maturity][lang]}</small><ArrowUpRight size={15}/></a>)}</div></section>
      </div>
      <aside className="design-os-resume-side"><section><span>{lang === 'zh' ? '能力' : 'Capabilities'}</span>{profile.capabilities.map(item => <div key={item.id}><strong>{item.title}</strong><p>{item.body}</p><small>{item.tools.join(' · ')}</small></div>)}</section></aside>
    </div>
    <section className="download-library" id="downloads"><h2>{lang === 'zh' ? '简历与作品集下载' : 'Résumé and portfolio downloads'}</h2><p>{lang === 'zh' ? '四个方向的单页简历与精选作品，以及保留全部公开案例的完整档案。' : 'Four focused résumés and selected portfolios, plus an archive of all public cases.'}</p><div className="download-grid">{files.filter(file => file.format === 'pdf').map(file => { const editable = files.find(other => other.format === 'docx' && other.variant === file.variant && file.type === 'resume'); return <article key={file.id}><a href={asset(file.path)} aria-label={file.label[lang]}><img src={asset(file.preview)} alt={lang === 'zh' ? file.label.zh + '首页预览' : 'First-page preview of ' + file.label.en} loading="lazy" width="640" height={file.type === 'resume' ? 905 : 400}/></a><h3>{file.label[lang]}</h3><p>{file.pages} {lang === 'zh' ? '页' : file.pages === 1 ? 'page' : 'pages'} · {(file.bytes / 1048576).toFixed(1)} MB · {lang === 'zh' ? '中文' : 'English'}</p><div><a href={asset(file.path)} download>PDF <Download size={15}/></a>{editable && <a href={asset(editable.path)} download>{lang === 'zh' ? '可编辑 Word' : 'Editable Word'} <Download size={15}/></a>}</div></article> })}</div></section>
  </RouteFrame>
}

function Contact({ lang, profile }: { lang: Lang; profile: typeof profileCopy.zh }) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  const email = profile.contact.email.trim()
  const phone = profile.contact.phone.trim()
  const phoneDisplay = profile.contact.phoneDisplay.trim()
  const portfolioUrl = profile.contact.portfolioUrl.trim()
  const githubUrl = profile.contact.githubUrl.trim()
  const copyEmail = async () => {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(email)
      else {
        const textarea = document.createElement('textarea')
        textarea.value = email
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        if (!document.execCommand('copy')) throw new Error('copy failed')
        textarea.remove()
      }
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 1800)
    } catch { setCopyState('error') }
  }
  return <RouteFrame eyebrow={lang === 'zh' ? '联系' : 'Contact'} title={profile.contact.title} intro={profile.contact.body} lang={lang}><div className="design-os-contact">
    {email && <div className="design-os-contact-email"><a className="design-os-email" href={`mailto:${email}`}><Mail size={20}/>{email}</a><button type="button" onClick={copyEmail}>{copyState === 'copied' ? <Check size={15}/> : <Copy size={15}/>} {copyState === 'copied' ? (lang === 'zh' ? '已复制' : 'Copied') : copyState === 'error' ? (lang === 'zh' ? '复制失败' : 'Copy failed') : (lang === 'zh' ? '复制邮箱' : 'Copy email')}</button><span className="design-os-sr-only" aria-live="polite">{copyState === 'copied' ? (lang === 'zh' ? '邮箱已复制' : 'Email copied') : copyState === 'error' ? (lang === 'zh' ? '邮箱复制失败' : 'Email copy failed') : ''}</span></div>}
    {(phone || portfolioUrl || githubUrl) && <div>
      {phone && <a href={`tel:${phone}`}>{phoneDisplay || phone}</a>}
      {portfolioUrl && <a href={portfolioUrl} target="_blank" rel="noreferrer">{lang === 'zh' ? '作品集' : 'Portfolio'} <ArrowUpRight size={15}/></a>}
      {githubUrl && <a href={githubUrl} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15}/></a>}
    </div>}
  </div></RouteFrame>
}

function NotFound({ lang, pathname }: { lang: Lang; pathname: string }) { return <RouteFrame eyebrow="404" title={lang === 'zh' ? '页面未找到' : 'Page not found'} intro={lang === 'zh' ? `没有找到 ${pathname}。` : `No public route matches ${pathname}.`} lang={lang}><a className="design-os-primary" href={routeHref('/', lang)}>{lang === 'zh' ? '返回首页' : 'Back to index'} <ArrowUpRight size={16}/></a></RouteFrame> }

function RouteFrame({ eyebrow, title, intro, lang, children }: { eyebrow: string; title: string; intro: string; lang: Lang; children: React.ReactNode }) { return <section className="design-os-frame"><header className="design-os-hero"><span>{eyebrow}</span><h1>{title}</h1><p>{intro}</p></header>{children}<div className="design-os-featured"><span>{lang === 'zh' ? '精选' : 'Selected'}</span>{getDesignOSFeaturedProjects().slice(0, 4).map(project => <a key={project.slug} href={routeHref(`/work/${project.slug}`, lang)}>{b(lang, project.title)} <ArrowUpRight size={14}/></a>)}</div></section> }

function Systems({ lang }: { lang: Lang }) {
  const slugs = ['ai-video-systems', 'resume-formatter', 'lensflow', 'formline', 'xintiao']
  return <RouteFrame eyebrow={lang === 'zh' ? '系统与工作流' : 'Systems & workflows'} title={lang === 'zh' ? '让方法可以复用。' : 'Make the method reusable.'} intro={lang === 'zh' ? '从故事与镜头控制，到可审阅的内容改写和可恢复的任务流程。工具服务于设计判断。' : 'From story and camera control to reviewable writing and recoverable tasks. Tools support design judgment.'} lang={lang}>
    <MethodsLink lang={lang}/><div className="systems-grid">{slugs.map(slug => {
      const project = getProject(slug)!
      return <article key={slug}>
        <a href={routeHref('/work/' + slug, lang)}>
          <img src={asset(project.cover)} alt={project.title[lang]} loading="lazy"/>
          <div className="systems-card-copy"><h2>{project.title[lang]}</h2><p>{project.summary[lang]}</p><span className="design-os-card-link">{lang === 'zh' ? '阅读方法与案例' : 'Explore the method'}<ArrowUpRight size={16}/></span>
            <p>{maturityLabels[project.maturity][lang]} · {project.demoMode === 'precomputed' ? (lang === 'zh' ? '预计算演示' : 'Precomputed demo') : project.roleScope[lang]}</p>
          </div>
        </a>
      </article>
    })}</div>
    <a className="design-os-text-link" href={routeHref('/research', lang)}>{lang === 'zh' ? '继续阅读研究档案' : 'Explore the research archive'}<ArrowUpRight size={16}/></a>
  </RouteFrame>
}
