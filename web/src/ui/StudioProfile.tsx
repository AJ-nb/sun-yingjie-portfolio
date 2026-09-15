import { useState, type Dispatch, type SetStateAction } from 'react'
import { ArrowUpRight, Copy, Download, Plus } from 'lucide-react'
import { asset, getWorkDoc, type Lang } from '../data/workDocs'
import { profileCopy, type ProfileExperience } from '../data/profile'
import { CaseLink } from './Studio'

type Props = { lang: Lang; visit: (slug: string) => void }
function EvidenceLinks({ slugs, lang, visit, prefix }: Props & { slugs: string[]; prefix: string }) {
  return <div className="evidence-links">{slugs.map(slug => <CaseLink key={slug} slug={slug} visit={visit} focusKey={`${prefix}:${slug}`}>{getWorkDoc(slug, lang)?.title}<ArrowUpRight size={14}/></CaseLink>)}</div>
}
function Experience({ entry, lang, visit }: Props & { entry: ProfileExperience }) {
  return <article className="profile-entry" data-experience={entry.id}><span className="profile-period">{entry.period}</span><div className="profile-entry-heading"><h4>{entry.place}</h4><span>{entry.role}</span></div><p>{entry.description}</p><ul>{entry.details.map(detail => <li key={detail}>{detail}</li>)}</ul><EvidenceLinks slugs={entry.caseSlugs} lang={lang} visit={visit} prefix={`experience:${entry.id}`}/></article>
}
export function StudioProfile({ lang, visit, openCapabilities, setOpenCapabilities }: Props & { openCapabilities: string[]; setOpenCapabilities: Dispatch<SetStateAction<string[]>> }) {
  const p = profileCopy[lang]
  const sections = lang === 'zh' ? ['经历与教育', '可以一起解决的问题', '独立实践与设计原则', '带走一份作品'] : ['Experience & education', 'What I can contribute', 'Practice & principles', 'Take the work with you']
  return <section id="about" className="studio-profile" aria-labelledby="profile-title" data-motion-anchor>
    <div className="profile-heading"><div><span className="studio-eyebrow">04 / THE PERSON BEHIND THE WORK</span><h2 id="profile-title">{lang === 'zh' ? '孙英杰' : 'Yingjie Sun'}<span>{lang === 'zh' ? 'Yingjie Sun' : '孙英杰'}</span></h2></div><div>{p.lead}</div></div>
    <div className="profile-lead"><dl className="profile-facts">{p.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl><div className="profile-narrative">{p.narrative.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></div>
    <div className="profile-section"><div className="profile-section-title"><span>01</span><h3>{sections[0]}</h3><p>{lang === 'zh' ? '每一段实践，都让设计的关注点多一层。' : 'Each part of my practice adds another perspective.'}</p></div><div className="profile-timeline">{[...p.experience, p.education].map(entry => <Experience key={entry.id} entry={entry} lang={lang} visit={visit}/>)}</div></div>
    <div className="profile-section"><div className="profile-section-title"><span>02</span><h3>{sections[1]}</h3><p>{lang === 'zh' ? '展开一个方向，阅读我的方法与对应作品。' : 'Open a discipline to read the approach and its project evidence.'}</p></div><div className="capability-list">{p.capabilities.map((capability, index) => <details key={capability.id} open={openCapabilities.includes(capability.id)} onToggle={event => { const open = event.currentTarget.open; setOpenCapabilities(previous => previous.includes(capability.id) === open ? previous : open ? [...previous, capability.id] : previous.filter(id => id !== capability.id)) }}><summary><span><small>{String(index + 1).padStart(2, '0')}</small>{capability.title}</span><Plus size={20}/></summary><div><p>{capability.body}</p><div className="capability-tools">{capability.tools.join(' / ')}</div><EvidenceLinks slugs={capability.caseSlugs} lang={lang} visit={visit} prefix={`capability:${capability.id}`}/></div></details>)}</div></div>
    <div className="profile-section"><div className="profile-section-title"><span>03</span><h3>{sections[2]}</h3><p>{p.statement}</p></div><div><Experience entry={p.practice} lang={lang} visit={visit}/><div className="profile-principles">{p.principles.map(principle => <article key={principle.id}><h4>{principle.title}</h4><p>{principle.body}</p></article>)}</div></div></div>
    <div className="profile-section"><div className="profile-section-title"><span>04</span><h3>{sections[3]}</h3><p>{lang === 'zh' ? '网页适合探索，文档适合认真阅读与交流。' : 'Explore on the web; keep the documents for a closer read.'}</p></div><div className="profile-downloads">{[
      { path: 'selected-portfolio.pdf', title: lang === 'zh' ? '精选作品集' : 'Selected portfolio', note: lang === 'zh' ? '28 页 / 八个重点案例' : '28 pages / Eight featured cases' },
      { path: 'full-portfolio.pdf', title: lang === 'zh' ? '完整作品集' : 'Complete portfolio', note: lang === 'zh' ? '116 页 / 33 个案例档案' : '116 pages / 33 case archives' },
      { path: 'resume.pdf', title: lang === 'zh' ? '个人简历 PDF' : 'Résumé PDF', note: lang === 'zh' ? '一页 A4 / 便于分享' : 'One A4 page / Ready to share' },
      { path: 'resume.docx', title: lang === 'zh' ? '可编辑简历 Word' : 'Editable résumé', note: lang === 'zh' ? 'DOCX / 可编辑文档' : 'DOCX / Editable document' },
    ].map(file => <a className="download-link" key={file.path} href={asset(`/downloads/sun-yingjie-${file.path}`)} download><span>{file.title}<small>{file.note}</small></span><Download size={21}/></a>)}</div></div>
    <p className="profile-asof">{p.asOf}</p>
  </section>
}
export function DesignMethod({ lang, visit, index, setIndex }: Props & { index: number; setIndex: (value: number) => void }) {
  const methods = profileCopy[lang].methods, selected = methods[index]
  return <section id="process" className="studio-method" aria-labelledby="method-title" data-motion-anchor>
    <div className="studio-section-heading"><div><span className="studio-eyebrow">05 / HOW I THINK & MAKE</span><h2 id="method-title">{lang === 'zh' ? <>视觉吸引之后，<br /><em>让逻辑接住。</em></> : <>After the first impression,<br /><em>let the logic hold.</em></>}</h2></div><p>{lang === 'zh' ? '设计不止于一个结果。我更想展示：如何理解问题、做出选择，以及让方案经得起进一步的讨论。' : 'There is more to design than a final image. Here is how I understand a problem, make choices and build something that can be examined.'}</p></div>
    <div className="method-layout"><div className="method-selector" role="group" aria-label={lang === 'zh' ? '设计方法步骤' : 'Design process steps'}>{methods.map((method, i) => <button key={method.id} aria-pressed={index === i} onClick={() => setIndex(i)}><span>{String(i + 1).padStart(2, '0')}</span><span>{method.title.replace(/^\d+\s*\/\s*/, '')}</span><ArrowUpRight size={18}/></button>)}</div><div className="method-content" aria-live="polite"><span className="method-number" aria-hidden="true">0{index + 1}</span><span className="studio-eyebrow">{lang === 'zh' ? '思考 → 实践' : 'THINKING → PRACTICE'}</span><h3>{selected.title}</h3><p className="method-description" key={selected.id}>{selected.body}</p><div className="method-image">{selected.caseSlugs.slice(0, 2).map(slug => <CaseLink key={slug} slug={slug} visit={visit} focusKey={`method:${selected.id}:${slug}`}><img src={asset(`/thumbnails/${slug}.webp`)} alt="" loading="lazy"/><span>{getWorkDoc(slug, lang)?.title}<ArrowUpRight size={15}/></span></CaseLink>)}</div></div></div>
  </section>
}
export function StudioContact({ lang }: { lang: Lang }) {
  const p = profileCopy[lang], [copied, setCopied] = useState<'yes' | 'no' | null>(null)
  async function copyEmail() {
    try { await navigator.clipboard.writeText(p.contact.email); setCopied('yes') } catch { setCopied('no') }
  }
  return <section id="contact" className="studio-contact" aria-labelledby="contact-title" data-motion-anchor><span className="studio-eyebrow">06 / THE NEXT CONVERSATION</span><div className="contact-display" aria-hidden="true">LET’S MAKE<br/>IT <em>MATTER.</em></div><div className="contact-content"><div><h2 id="contact-title">{p.collaboration.title}</h2><p>{p.collaboration.body}</p><div className="contact-topics">{p.collaboration.items.map(item => <span key={item}>{item}</span>)}</div></div><div><a className="email-link" href={`mailto:${p.contact.email}`}>{p.contact.email}<ArrowUpRight size={25}/></a><div className="contact-actions"><a href={`tel:+86${p.contact.phone}`}>{p.contact.phoneDisplay}</a><a href={p.contact.githubUrl} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14}/></a><button className="contact-copy" onClick={copyEmail}><Copy size={14}/>{lang === 'zh' ? '复制邮箱' : 'Copy email'}</button></div><p className="copy-status" role="status">{copied === 'yes' ? (lang === 'zh' ? '邮箱已复制。' : 'Email copied.') : copied === 'no' ? (lang === 'zh' ? '暂时无法复制，请选择上方邮箱文字。' : 'Copy unavailable. Select the email address above.') : ''}</p><p>{p.contact.body}</p></div></div></section>
}
