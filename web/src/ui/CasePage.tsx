import { Suspense, lazy, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { asset, CATEGORIES, getWorkDoc, getWorks, type Lang, type WorkDoc } from '../data/workDocs'
import { copy } from '../data/copy'
import { DEEP_CASES, mediaLabel, relatedCases } from '../data/editorial'
import CaseOutline from './CaseOutline'
const CaseExperiment = lazy(() => import('./CaseExperiment'))
type Photo = { src: string; alt: string }

export default function CasePage({ work, lang, reduced, openPhoto, back, visit }: { work: WorkDoc | null; lang: Lang; reduced: boolean; openPhoto: (photos: Photo[], index: number) => void; back: () => void; visit: (slug: string) => void }) {
  const t = copy[lang], main = useRef<HTMLElement>(null)
  useEffect(() => { main.current?.focus({ preventScroll: true }) }, [work?.slug])
  if (!work) return <main className="not-found" ref={main} tabIndex={-1}><h1>{t.notFound}</h1><button className="primary" onClick={back}>{t.back}</button></main>
  const headings = [...work.body.matchAll(/^## (.+)$/gm)].map(match => match[1])
  const related = relatedCases(work.slug).map(id => getWorkDoc(id, lang)).filter((item): item is WorkDoc => !!item)
  const photos = [...work.body.matchAll(/!\[([^\]]*)\]\(([^\s)]+)(?:\s+[^)]*)?\)/g)].map(match => ({ alt: match[1], src: match[2] }))
  if (!photos.some(photo => photo.src === work.cover)) photos.unshift({ src: work.cover, alt: work.title })
  const candidates = getWorks(lang), next = candidates[(candidates.findIndex(item => item.slug === work.slug) + 1) % candidates.length]
  return <motion.main className="case-page" ref={main} tabIndex={-1} initial={reduced ? false : { opacity: 0, scale: .985, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .99, y: 6 }} transition={{ duration: reduced ? 0 : .28, ease: [.22, 1, .36, 1] }}>
    <div className="case-toolbar"><button onClick={back}>← {t.back}</button><span>{CATEGORIES[lang][work.category]}</span></div>
    <header className="case-header"><div className="case-kicker"><span>{work.status}</span><span>{DEEP_CASES.includes(work.slug) ? (lang === 'zh' ? '设计过程 · 可交互案例' : 'Design process · Interactive case') : (lang === 'zh' ? '作品档案' : 'Project archive')}</span></div><h1>{work.title}</h1><p className="case-summary">{work.summary}</p><dl className="case-facts"><div><dt>{t.role}</dt><dd>{work.role}</dd></div><div><dt>{t.credits}</dt><dd>{work.credits}</dd></div><div><dt>{t.status}</dt><dd>{work.status}</dd></div></dl></header>
    <button className="case-cover media-button" onClick={() => openPhoto(photos, Math.max(0, photos.findIndex(photo => photo.src === work.cover)))} aria-label={`${t.enlarge}: ${work.title}`}><img src={asset(work.cover)} alt={work.title} /></button>
    <CaseOutline headings={headings} lang={lang} reduced={reduced} />
    {DEEP_CASES.includes(work.slug) && <Suspense fallback={<p className="experiment-loading">{lang === 'zh' ? '设计实验正在准备，正文可继续阅读。' : 'Preparing the design experiment. Continue reading below.'}</p>}><CaseExperiment key={work.slug} slug={work.slug} lang={lang} reduced={reduced} /></Suspense>}
    <article className="case-body"><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={{
      h2: ({ children }) => <h2 id={`case-section-${headings.indexOf(String(children))}`} tabIndex={-1}>{children}</h2>,
      img: ({ src = '', alt = '' }) => <button className="media-button article-image" aria-label={`${t.enlarge}: ${alt}`} onClick={() => openPhoto(photos, Math.max(0, photos.findIndex(photo => photo.src === src)))}><img src={asset(src)} alt={alt} loading="lazy" /><span className="image-caption"><span>{alt}</span><small>{mediaLabel(src, lang)} <span aria-hidden="true">↗</span></small></span></button>,
      video: ({ src, poster }) => <video src={src ? asset(src) : undefined} poster={poster ? asset(poster) : undefined} controls playsInline preload="metadata" />,
      a: ({ href = '', children }) => <a href={asset(href)} target={href.startsWith('https:') ? '_blank' : undefined} rel={href.startsWith('https:') ? 'noreferrer' : undefined}>{children}</a>,
    }}>{work.body}</ReactMarkdown></article>
    <section className="related-work"><div><span>{lang === 'zh' ? '继续追问' : 'Keep exploring'}</span><h2>{lang === 'zh' ? '同一个问题，不同的尺度。' : 'One question. Different scales.'}</h2></div><div>{related.map(item => <a key={item.slug} href={`#/work/${item.slug}`} onClick={event => { if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); visit(item.slug) }}><img src={asset(`/thumbnails/${item.slug}.webp`)} alt="" loading="lazy" /><span>{item.title}<ArrowUpRight size={18} /></span><p>{item.summary}</p></a>)}</div></section>
    {next && <aside className="next-case"><span>{t.next}</span><a href={`#/work/${next.slug}`} onClick={event => { if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); visit(next.slug) }}>{next.title}<span aria-hidden="true">↗</span></a></aside>}
    <button className="case-back-bottom" onClick={back}>← {t.back}</button>
  </motion.main>
}
