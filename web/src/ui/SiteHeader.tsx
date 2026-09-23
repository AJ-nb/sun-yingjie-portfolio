import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Asterisk } from 'lucide-react'
import { type Lang } from '../data/workDocs'
import { copy } from '../data/copy'

export function SiteHeader({ lang, isCase, anchor, toggleLanguage }: { lang: Lang; isCase: boolean; anchor: (event: MouseEvent<HTMLAnchorElement>) => void; toggleLanguage: () => void }) {
  const [open, setOpen] = useState(false), trigger = useRef<HTMLButtonElement>(null), navigation = useRef<HTMLElement>(null), header = useRef<HTMLElement>(null)
  const [overHero, setOverHero] = useState(() => window.scrollY < window.innerHeight - 90)
  const [activeSection, setActiveSection] = useState('')
  const t = copy[lang]
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const boundary = (header.current?.getBoundingClientRect().height ?? 84) + 24
      const hero = document.querySelector('.mainframe-hero')
      setOverHero(Boolean(hero && hero.getBoundingClientRect().bottom > boundary))
      const sections = [...document.querySelectorAll<HTMLElement>('main [id]')].filter(node => ['selected', 'products', 'open-source', 'process', 'about', 'profile-details', 'works', 'downloads', 'contact'].includes(node.id))
      const passed = sections.filter(node => node.getBoundingClientRect().top <= boundary)
      const current = passed[passed.length - 1]
      const currentId = current?.id ?? ''
      const parentSection: Record<string, string> = { 'open-source': 'products', process: 'about', 'profile-details': 'about' }
      setActiveSection(isCase ? '' : parentSection[currentId] ?? currentId)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [isCase])
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    navigation.current?.querySelector<HTMLAnchorElement>('a')?.focus()
    const close = () => { setOpen(false); trigger.current?.focus() }
    const keys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); close(); return }
      if (event.key !== 'Tab') return
      const controls = [...(header.current?.querySelectorAll<HTMLElement>('a, button:not([disabled])') ?? [])].filter(node => node.getClientRects().length > 0)
      const first = controls[0], last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    const outside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) setOpen(false) }
    const resize = () => { if (innerWidth > 768) setOpen(false) }
    document.addEventListener('keydown', keys)
    document.addEventListener('pointerdown', outside)
    window.addEventListener('resize', resize)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', keys); document.removeEventListener('pointerdown', outside); window.removeEventListener('resize', resize) }
  }, [open])
  const go = (event: MouseEvent<HTMLAnchorElement>) => {
    anchor(event)
    if (!event.defaultPrevented) return
    setOpen(false)
  }
  return <header ref={header} className={`site-header v5-header mainframe-header ${isCase ? 'on-case' : ''} ${isCase || !overHero ? 'on-paper' : 'over-hero'}`}>
    <a href="#top" onClick={go} className="signature" aria-label={lang === 'zh' ? '孙英杰 · 返回首页' : 'Yingjie Sun · Home'}><span>{lang === 'zh' ? '孙英杰' : 'Yingjie Sun'}</span><Asterisk className="signature-mark" size={30} strokeWidth={1.4} aria-hidden="true"/></a>
    <nav ref={navigation} id="main-navigation" className={open ? 'is-open' : ''} aria-label={lang === 'zh' ? '主导航' : 'Main navigation'} onBlur={event => { if (open && event.relatedTarget && !header.current?.contains(event.relatedTarget as Node)) setOpen(false) }}>
      <a href="#selected" onClick={go} aria-current={activeSection === 'selected' ? 'location' : undefined}>{lang === 'zh' ? '品牌设计' : 'Brand'}</a><a href="#products" onClick={go} aria-current={activeSection === 'products' ? 'location' : undefined}>{lang === 'zh' ? '产品设计' : 'Products'}</a><a href="#works" onClick={go} aria-current={activeSection === 'works' ? 'location' : undefined}>{lang === 'zh' ? '全部作品' : 'All work'}</a><a href="#about" onClick={go} aria-current={activeSection === 'about' ? 'location' : undefined}>{t.about}</a>
      <a href="#downloads" onClick={go} className="nav-download" aria-current={activeSection === 'downloads' ? 'location' : undefined}>{lang === 'zh' ? '下载简历' : 'Résumé'}</a>
    </nav>
    <a className="header-contact-link" href="#contact" onClick={go} aria-current={activeSection === 'contact' ? 'location' : undefined}>{t.contact}<span aria-hidden="true">↗</span></a>
    <div className="header-controls"><button className="language" onClick={toggleLanguage} aria-label="切换语言 / Switch language">{lang === 'zh' ? 'EN' : '中'}</button><button ref={trigger} className="menu-toggle" aria-expanded={open} aria-controls="main-navigation" aria-label={lang === 'zh' ? (open ? '关闭菜单' : '打开菜单') : (open ? 'Close menu' : 'Open menu')} onClick={() => setOpen(value => !value)}><span className="menu-bars" aria-hidden="true"><i/><i/><i/></span></button></div>
  </header>
}
