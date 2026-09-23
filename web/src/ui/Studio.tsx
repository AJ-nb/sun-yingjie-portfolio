import { useEffect, useState, type MouseEvent, type ReactNode } from 'react'
import { ArrowDown, ArrowUpRight, Copy, FileText } from 'lucide-react'
import { asset, type Lang, type WorkDoc } from '../data/workDocs'
import { profileCopy } from '../data/profile'
import publication from '../data/publication.json'
import { OriginalVideo } from './OriginalVideo'

type AnchorHandler = (event: MouseEvent<HTMLAnchorElement>) => void
export function CaseLink({ slug, children, visit, className, focusKey, ariaLabel }: { slug: string; children: ReactNode; visit: (slug: string) => void; className?: string; focusKey: string; ariaLabel?: string }) {
  return <a className={className} href={`#/work/${slug}`} data-return-focus={focusKey} aria-label={ariaLabel} onClick={event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault(); visit(slug)
  }}>{children}</a>
}

export function StudioIntroduction({ lang, reduced, visit: _visit, anchor }: { lang: Lang; reduced: boolean; visit: (slug: string) => void; anchor: AnchorHandler }) {
  const p = profileCopy[lang]
  const [copied, setCopied] = useState<'copied' | 'manual' | null>(null)
  const statement = lang === 'zh' ? '以品牌与产品设计为主线，连接实体产品、品牌系统、3D/CMF 与制造语境；AI 工作流作为辅助能力，推进方案、协作与交付。' : 'I work across brand and product design, connecting physical products, brand systems, 3D/CMF and manufacturing contexts; AI workflows support proposals, coordination and delivery.'
  const [typed, setTyped] = useState(reduced ? statement : '')
  useEffect(() => {
    if (reduced) { setTyped(statement); return }
    setTyped('')
    const characters = Array.from(statement)
    let count = 0, next: number | undefined
    const type = () => {
      count += 1
      setTyped(characters.slice(0, count).join(''))
      if (count < characters.length) next = window.setTimeout(type, 38)
    }
    next = window.setTimeout(type, 600)
    return () => clearTimeout(next)
  }, [statement, reduced])
  async function copyEmail() {
    try { await navigator.clipboard.writeText(p.contact.email); setCopied('copied') }
    catch { setCopied('manual') }
  }
  return <div className="v5-intro">
    <section className={`v5-hero mainframe-hero${reduced ? ' is-still' : ''}`} aria-labelledby="hero-name" data-motion-anchor>
      <OriginalVideo kind="hero" lang={lang} reduced={reduced}/>
      <div className="v5-hero-copy">
        <div className="hero-intro-echo" aria-hidden="true"><span>{lang === 'zh' ? '你好，我是 Yingjie Sun。' : 'Hello, meet Yingjie Sun.'}</span><span>Brand, product & design direction.</span></div>
        <p className="hero-role">{p.position}</p>
        <h1 id="hero-name">{p.name}<span>{lang === 'zh' ? 'Yingjie Sun' : '孙英杰'}</span></h1>
        <p className={`hero-typewriter${!reduced && typed.length < statement.length ? ' is-typing' : ''}`}><span className="sr-only">{statement}</span><span className="hero-typewriter-space" aria-hidden="true">{statement}</span><span className="hero-typewriter-reveal" aria-hidden="true">{typed || '\u00a0'}</span></p>
        <nav className="hero-pills" aria-label={lang === 'zh' ? '作品与联系入口' : 'Work and contact shortcuts'}>
          <a href="#selected" onClick={anchor}>{lang === 'zh' ? '品牌设计' : 'Brand design'}<ArrowDown size={15} aria-hidden="true"/></a>
          <a href="#products" onClick={anchor}>{lang === 'zh' ? '产品设计' : 'Product design'}<ArrowDown size={15} aria-hidden="true"/></a>
          <a href="#downloads" onClick={anchor}>{lang === 'zh' ? '简历与作品集' : 'Résumé & portfolio'}<FileText size={15} aria-hidden="true"/></a>
          <a href="#contact" onClick={anchor}>{lang === 'zh' ? '联系' : 'Contact'}<ArrowUpRight size={15} aria-hidden="true"/></a>
        </nav>
        <div className="hero-email"><button type="button" onClick={copyEmail} aria-label={`${lang === 'zh' ? '复制邮箱' : 'Copy email'} ${p.contact.email}`}><span>{lang === 'zh' ? '联系我：' : 'Reach me: '}<u>{p.contact.email}</u></span><Copy size={13} aria-hidden="true"/></button><span role="status">{copied === 'copied' ? lang === 'zh' ? '邮箱已复制' : 'Email copied' : copied === 'manual' ? lang === 'zh' ? '请选择邮箱复制' : 'Select the address to copy' : ''}</span></div>
      </div>
      <div className="v5-hero-foot"><span>{lang === 'zh' ? '品牌 · 产品 · 设计统筹' : 'Brand · Product · Design direction'}</span><a href="#selected" onClick={anchor} aria-label={lang === 'zh' ? '向下浏览作品' : 'Scroll to selected work'}><ArrowDown size={20} aria-hidden="true"/></a></div>
    </section>

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
