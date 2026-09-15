import { type MouseEvent, type ReactNode } from 'react'
import { ArrowDown, ArrowUpRight, Download } from 'lucide-react'
import { asset, type Lang, type WorkDoc } from '../data/workDocs'
import { profileCopy } from '../data/profile'
import publication from '../data/publication.json'
import { OriginalVideo } from './OriginalVideo'

type AnchorHandler = (event: MouseEvent<HTMLAnchorElement>) => void
export function CaseLink({ slug, children, visit, className, focusKey }: { slug: string; children: ReactNode; visit: (slug: string) => void; className?: string; focusKey: string }) {
  return <a className={className} href={`#/work/${slug}`} data-return-focus={focusKey} onClick={event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault(); visit(slug)
  }}>{children}</a>
}

export function StudioIntroduction({ lang, reduced, visit: _visit, anchor }: { lang: Lang; reduced: boolean; visit: (slug: string) => void; anchor: AnchorHandler }) {
  const p = profileCopy[lang]
  return <div className="v5-intro">
    <section className="v5-hero" aria-labelledby="hero-name">
      <OriginalVideo kind="hero" lang={lang} reduced={reduced}/>
      <div className="v5-hero-copy">
        <p className="hero-role">{p.position}</p>
        <h1 id="hero-name">{p.name}<span>{lang === 'zh' ? 'Yingjie Sun' : '孙英杰'}</span></h1>
        <p className="v5-hero-summary">{p.lead}</p>
        <nav className="hero-pills" aria-label={lang === 'zh' ? '作品与联系入口' : 'Work and contact shortcuts'}>
          <a href="#selected" onClick={anchor}>{lang === 'zh' ? '精选作品' : 'Selected work'}<ArrowDown size={15}/></a>
          <a href={asset('/downloads/sun-yingjie-selected-portfolio.pdf')} download>{lang === 'zh' ? '精选作品集 PDF' : 'Selected portfolio PDF'}<Download size={15}/></a>
          <a href={asset('/downloads/sun-yingjie-resume.pdf')} download>{lang === 'zh' ? '简历 PDF' : 'Résumé PDF'}<Download size={15}/></a>
          <a href="#contact" onClick={anchor}>{lang === 'zh' ? '联系' : 'Contact'}<ArrowDown size={15}/></a>
        </nav>
      </div>
      <div className="v5-hero-foot"><span className={`typewriter ${reduced ? 'is-still' : ''}`} aria-hidden="true">{lang === 'zh' ? '从一个想法，到可以使用的体验。' : 'From an idea to an experience.'}</span><a href="#selected" onClick={anchor} aria-label={lang === 'zh' ? '向下浏览作品' : 'Scroll to selected work'}><ArrowDown size={20}/></a></div>
    </section>
    <section className="v5-introduction" id="introduction" aria-labelledby="statement-title"><h2 id="statement-title">{lang === 'zh' ? <>在品牌、物件与界面之间，<br/>让设计彼此连贯。</> : <>Across identities, objects and interfaces,<br/>make design connect.</>}</h2><div><p>{p.narrative[0]}</p><a className="studio-text-link" href="#about" onClick={anchor}>{lang === 'zh' ? '认识我与我的工作方式' : 'About my work and approach'}<ArrowUpRight size={18}/></a></div></section>
  </div>
}

export function StudioSelected({ works, lang, visit }: { works: WorkDoc[]; lang: Lang; reduced: boolean; visit: (slug: string) => void }) {
  const ids = publication.selected.map(item => item.slug)
  const labels: Record<string, { zh: string; en: string }> = {
    biyuan: { zh: '品牌与数字体验', en: 'Brand & digital experience' },
    periastra: { zh: '品牌识别', en: 'Visual identity' },
    yelisi: { zh: '品牌研究与应用', en: 'Brand research & applications' },
    lighting: { zh: '产品与三维表达', en: 'Product & visualization' },
    hermes: { zh: '商业空间', en: 'Commercial space' },
    lensflow: { zh: 'AI 辅助工作流', en: 'AI-assisted workflow' },
  }
  return <section id="selected" className="v5-selected" aria-labelledby="selected-title" tabIndex={-1}>
    <div className="v5-section-heading"><h2 id="selected-title">{lang === 'zh' ? '精选作品' : 'Selected work'}<span>2025—2026</span></h2><p>{lang === 'zh' ? '六个案例，记录从设计判断到具体呈现的过程。' : 'Six cases following design decisions into tangible outcomes.'}</p></div>
    <div className="v5-selected-grid">{ids.map(id => {
      const work = works.find(item => item.slug === id)
      if (!work) return null
      const thumbnail = id === 'periastra' ? '/works/brand/periastra/final-wordmark.png' : `/thumbnails/${id}.webp`
      return <article key={id} className={`v5-selected-case case-${id}`}>
        <CaseLink className="v5-case-image" slug={id} visit={visit} focusKey={`selected:${id}`}><img src={asset(thumbnail)} alt={work.title} loading="lazy"/><span className="v5-case-open"><ArrowUpRight size={24}/><span className="sr-only">{lang === 'zh' ? '阅读案例' : 'Read case'}</span></span></CaseLink>
        <div className="v5-case-copy"><span>{labels[id]?.[lang]}</span><h3><CaseLink slug={id} visit={visit} focusKey={`selected:text:${id}`}>{work.title}</CaseLink></h3><p>{work.summary}</p><dl><div><dt>{lang === 'zh' ? '职责' : 'Role'}</dt><dd>{work.role}</dd></div><div><dt>{lang === 'zh' ? '阶段' : 'Stage'}</dt><dd>{work.status}</dd></div></dl></div>
      </article>
    })}</div>
  </section>
}
