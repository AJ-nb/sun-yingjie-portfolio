import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { CHAPTERS } from '../data/chapters'
import { chapterIdeas } from '../data/editorial'
import { asset, type Lang, type WorkDoc } from '../data/workDocs'

export function SenGallery({ works, lang, reduced, visit, catalogue }: { works: WorkDoc[]; lang: Lang; reduced: boolean; visit: (slug: string) => void; catalogue: (event: MouseEvent<HTMLAnchorElement>) => void }) {
  const gallery = useRef<HTMLElement>(null)
  const [viewport, setViewport] = useState({ width: innerWidth, height: innerHeight })
  const [active, setActive] = useState(0)
  const vertical = reduced || viewport.width <= 640
  const distance = viewport.width * (CHAPTERS.length - 1)
  const { scrollYProgress } = useScroll({ target: gallery, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])
  useMotionValueEvent(scrollYProgress, 'change', value => setActive(Math.round(value * (CHAPTERS.length - 1))))
  useEffect(() => {
    const resize = () => setViewport({ width: innerWidth, height: innerHeight })
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])
  function go(index: number) {
    if (!gallery.current) return
    const next = Math.max(0, Math.min(CHAPTERS.length - 1, index))
    const top = gallery.current.getBoundingClientRect().top + scrollY + next * viewport.width
    window.scrollTo({ top, behavior: reduced ? 'instant' : 'smooth' })
  }
  return <section ref={gallery} id="selected" className={`wk-gallery ${vertical ? 'wk-vertical' : ''}`} style={vertical ? undefined : { height: viewport.height + distance }} aria-label={lang === 'zh' ? '按章节浏览作品' : 'Browse work by chapter'}>
    <div className="wk-sticky">
      <motion.div className="wk-track" style={vertical ? undefined : { x }}>
        {CHAPTERS.map((chapter, index) => {
          const picks = chapter.featured.map(slug => works.find(work => work.slug === slug)).filter((work): work is WorkDoc => !!work)
          const cover = picks[0]
          const idea = chapterIdeas[chapter.id][lang]
          const tabIndex = vertical || index === active ? 0 : -1
          return <article className="wk-card" key={chapter.id} aria-label={chapter.title[lang]}>
            <header className="wk-card-head"><span className="wk-card-no">{String(index + 1).padStart(2, '0')}</span><h2>{chapter.title[lang]}</h2><span>{chapter.note[lang]}</span></header>
            {cover && <a className={`wk-cover wk-cover-${chapter.id}`} data-return-focus={`chapter:${chapter.id}:cover:${cover.slug}`} href={`#/work/${cover.slug}`} tabIndex={tabIndex} onClick={event => { if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); visit(cover.slug) }}><img src={asset(cover.cover)} alt={cover.title} loading="lazy" /></a>}
            <div className="wk-card-body"><p className="wk-chapter-note">{idea.word}</p><h3 className="chapter-question">{idea.question}</h3><p className="chapter-detail">{idea.detail}</p><ul className="wk-list">{picks.map(work => <li key={work.slug}><a data-return-focus={`chapter:${chapter.id}:list:${work.slug}`} href={`#/work/${work.slug}`} tabIndex={tabIndex} onClick={event => { if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); visit(work.slug) }}><span>{work.title}</span><span aria-hidden="true">↗</span></a></li>)}</ul><a className="wk-catalogue-link" href="#works" tabIndex={tabIndex} onClick={catalogue}>{lang === 'zh' ? '完整目录与更多项目' : 'Full index & more projects'} <span aria-hidden="true">↓</span></a></div>
          </article>
        })}
      </motion.div>
      {!vertical && <nav className="wk-progress" aria-label={lang === 'zh' ? '章节导航' : 'Chapter navigation'} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); go(active + (event.key === 'ArrowRight' ? 1 : -1)) } }}><button onClick={() => go(active - 1)} disabled={active === 0} aria-label={lang === 'zh' ? '上一章' : 'Previous chapter'}>←</button>{CHAPTERS.map((chapter, index) => <button key={chapter.id} aria-current={index === active ? 'step' : undefined} onClick={() => go(index)}><span>{String(index + 1).padStart(2, '0')}</span><span>{chapter.title[lang]}</span></button>)}<button onClick={() => go(active + 1)} disabled={active === CHAPTERS.length - 1} aria-label={lang === 'zh' ? '下一章' : 'Next chapter'}>→</button></nav>}
    </div>
  </section>
}
