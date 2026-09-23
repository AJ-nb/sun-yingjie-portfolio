import { useState, type Dispatch, type MouseEvent, type SetStateAction } from 'react'
import { ArrowUpRight, Copy, Download, Plus } from 'lucide-react'
import { asset, getWorkDoc, type Lang } from '../data/workDocs'
import { profileCopy } from '../data/profile'
import { CaseLink } from './Studio'
import { OriginalVideo } from './OriginalVideo'
import { CareerTimeline } from './CareerShowcase'

type Props = { lang: Lang; visit: (slug: string) => void }
function EvidenceLinks({ slugs, lang, visit, prefix }: Props & { slugs: string[]; prefix: string }) {
  return <div className="evidence-links">{slugs.map(slug => <CaseLink key={slug} slug={slug} visit={visit} focusKey={`${prefix}:${slug}`}>{getWorkDoc(slug, lang)?.title}<ArrowUpRight size={14}/></CaseLink>)}</div>
}
export function StudioProfile({ lang }: Props & { openCapabilities: string[]; setOpenCapabilities: Dispatch<SetStateAction<string[]>> }) {
  const p = profileCopy[lang]
  return <section id="about" className="v7-profile" aria-labelledby="profile-title" tabIndex={-1} data-motion-anchor>
    <div className="v7-profile-intro"><img data-photo-source="graphite-1x1" src={asset('/media/v7/resume-portrait.png')} alt={lang === 'zh' ? '孙英杰身穿石墨灰立领上衣的肖像' : 'Portrait of Yingjie Sun in a graphite funnel-collar sweater'} loading="lazy"/><div><span>{lang === 'zh' ? '关于我' : 'About'}</span><h2 id="profile-title">{p.name}</h2><p>{p.lead}</p><dl>{p.facts.slice(0, 2).map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl></div></div>
    <CareerTimeline lang={lang}/>
    <details className="v7-education"><summary>{lang === 'zh' ? '教育与设计训练' : 'Education & design foundation'}</summary><h3>{p.education.place}</h3><p>{p.education.period} / {p.education.role}</p><p>{p.education.description}</p>{p.education.details.map(detail => <p key={detail}>{detail}</p>)}</details>
  </section>
}

export function StudioProfileDetails({ lang, visit, openCapabilities, setOpenCapabilities }: Props & { openCapabilities: string[]; setOpenCapabilities: Dispatch<SetStateAction<string[]>> }) {
  const p = profileCopy[lang]
  return <section id="profile-details" className="v7-capabilities" aria-labelledby="capabilities-title" data-motion-anchor>
    <header className="v7-heading"><div><span>{lang === 'zh' ? '能力与对应项目' : 'Skills connected to projects'}</span><h2 id="capabilities-title">{lang === 'zh' ? '设计能力' : 'Capabilities'}</h2></div><p>{lang === 'zh' ? '展开查看工作方式、使用工具与对应案例。' : 'Explore working approaches, tools and the projects where they are applied.'}</p></header>
    <div className="capability-list">{p.capabilities.map(capability => <details key={capability.id} open={openCapabilities.includes(capability.id)} onToggle={event => { const open = event.currentTarget.open; setOpenCapabilities(previous => previous.includes(capability.id) === open ? previous : open ? [...previous, capability.id] : previous.filter(id => id !== capability.id)) }}><summary><span>{capability.title}</span><Plus size={20}/></summary><div><p>{capability.body}</p><div className="capability-tools">{capability.tools.join(' / ')}</div><EvidenceLinks slugs={capability.caseSlugs} lang={lang} visit={visit} prefix={`capability:${capability.id}`}/></div></details>)}</div>
  </section>
}
export function DesignMethod({ lang, visit, index, setIndex }: Props & { index: number; setIndex: (value: number) => void }) {
  const methods = profileCopy[lang].methods, selected = methods[index]
  return <section id="process" className="studio-method" aria-labelledby="method-title" data-motion-anchor>
    <div className="studio-section-heading v7-heading"><div><span className="studio-eyebrow">{lang === 'zh' ? '目标 / 决策 / 协作 / 交付' : 'Objectives / Decisions / Coordination / Delivery'}</span><h2 id="method-title">{lang === 'zh' ? '项目统筹与设计方法' : 'Design direction & delivery'}</h2></div><p>{lang === 'zh' ? '将目标与约束转为设计判断，再以整体设计稿、模型、原型和版本记录，衔接评审、生产与开发。' : 'Turn objectives and constraints into design decisions. Connect review, production and development through proposals, models, prototypes and version records.'}</p></div>
    <div className="method-layout"><div className="method-selector" role="group" aria-label={lang === 'zh' ? '设计方法步骤' : 'Design process steps'}>{methods.map((method, i) => <button key={method.id} aria-pressed={index === i} onClick={() => setIndex(i)}><span>{String(i + 1).padStart(2, '0')}</span><span>{method.title.replace(/^\d+\s*\/\s*/, '')}</span><ArrowUpRight size={18}/></button>)}</div><div className="method-content" aria-live="polite"><span className="method-number" aria-hidden="true">0{index + 1}</span><span className="studio-eyebrow">{lang === 'zh' ? '判断依据 → 设计推进' : 'DESIGN REASONING → EXECUTION'}</span><h3>{selected.title}</h3><p className="method-description" key={selected.id}>{selected.body}</p><div className="method-image">{selected.caseSlugs.slice(0, 2).map(slug => <CaseLink key={slug} slug={slug} visit={visit} focusKey={`method:${selected.id}:${slug}`}><img src={asset(`/thumbnails/${slug}.webp`)} alt="" loading="lazy"/><span>{getWorkDoc(slug, lang)?.title}<ArrowUpRight size={15}/></span></CaseLink>)}</div></div></div>
  </section>
}
export function StudioContact({ lang, reduced, anchor }: { lang: Lang; reduced: boolean; anchor: (event: MouseEvent<HTMLAnchorElement>) => void }) {
  const p = profileCopy[lang], [copied, setCopied] = useState<'yes' | 'no' | null>(null)
  async function copyEmail() {
    try { await navigator.clipboard.writeText(p.contact.email); setCopied('yes') } catch { setCopied('no') }
  }
  const nav = lang === 'zh'
    ? [['#selected', '品牌设计'], ['#works', '全部作品'], ['#about', '关于我'], ['#process', '设计方法']]
    : [['#selected', 'Brand design'], ['#works', 'All work'], ['#about', 'About'], ['#process', 'Process']]
  return <footer id="contact" className="studio-contact" aria-labelledby="contact-title" data-motion-anchor>
    <OriginalVideo kind="footer" lang={lang} reduced={reduced}/>
    <nav className="footer-column footer-works" aria-label={lang === 'zh' ? '页脚作品导航' : 'Footer work navigation'}>
      <span className="footer-label">{lang === 'zh' ? '浏览' : 'Explore'}</span>
      {nav.map(([href, label]) => <a key={href} href={href} onClick={anchor}>{label}<ArrowUpRight size={14}/></a>)}
    </nav>
    <div className="footer-wordmark">
      <p className="footer-name">孙英杰<span>Yingjie Sun</span></p>
      <p>{lang === 'zh' ? p.position : p.position}</p>
      <p className="footer-copyright">© 2026</p>
    </div>
    <div className="footer-column footer-contact">
      <span className="footer-label">{lang === 'zh' ? '联系与下载' : 'Contact & downloads'}</span>
      <h2 id="contact-title">{lang === 'zh' ? '期待交流下一项设计。' : 'Let’s discuss your next project.'}</h2>
      <a className="footer-email" href={`mailto:${p.contact.email}`}>{p.contact.email}<ArrowUpRight size={16}/></a>
      <div className="footer-contact-actions"><a href={`tel:+86${p.contact.phone}`}>{p.contact.phoneDisplay}</a><a href={p.contact.githubUrl} target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={13}/></a><button className="contact-copy" onClick={copyEmail}><Copy size={13}/>{lang === 'zh' ? '复制邮箱' : 'Copy email'}</button></div>
      <p className="copy-status" role="status">{copied === 'yes' ? (lang === 'zh' ? '邮箱已复制。' : 'Email copied.') : copied === 'no' ? (lang === 'zh' ? '复制不可用，请选择邮箱地址。' : 'Copy unavailable. Select the email address.') : ''}</p>
      {copied === 'no' && <input
        className="email-fallback"
        aria-label={lang === 'zh' ? '选择并复制邮箱' : 'Select and copy email'}
        readOnly
        value={p.contact.email}
        onFocus={event => event.currentTarget.select()}
      />}
      <div className="footer-downloads"><a href={asset('/downloads/sun-yingjie-selected-portfolio.pdf')} download>{lang === 'zh' ? '综合精选作品集 PDF' : 'Overview portfolio PDF'}<Download size={14}/></a><a href={asset('/downloads/sun-yingjie-resume.pdf')} download>{lang === 'zh' ? '综合简历 PDF' : 'Overview résumé PDF'}<Download size={14}/></a><a href="#downloads" onClick={anchor}>{lang === 'zh' ? '查看全部下载版本' : 'See all editions'}<ArrowUpRight size={14}/></a></div>
      <a className="footer-reference" href={asset('/OPEN_SOURCE_REFERENCES.md')} target="_blank" rel="noreferrer">{lang === 'zh' ? '开源项目与参考资料' : 'Open-source projects & references'}<ArrowUpRight size={12}/></a>
    </div>
  </footer>
}
