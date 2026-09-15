import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Menu, Pause, Play, X } from 'lucide-react'
import { asset, type Lang } from '../data/workDocs'
import { copy } from '../data/copy'

export function SiteHeader({ lang, isCase, reduced, systemReduced, anchor, toggleMotion, toggleLanguage }: { lang: Lang; isCase: boolean; reduced: boolean; systemReduced: boolean; anchor: (event: MouseEvent<HTMLAnchorElement>) => void; toggleMotion: () => void; toggleLanguage: () => void }) {
  const [open, setOpen] = useState(false), trigger = useRef<HTMLButtonElement>(null), navigation = useRef<HTMLElement>(null), header = useRef<HTMLElement>(null)
  const t = copy[lang]
  useEffect(() => {
    if (!open) return
    navigation.current?.querySelector<HTMLAnchorElement>('a')?.focus()
    const close = () => { setOpen(false); trigger.current?.focus() }
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); close() } }
    const outside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) setOpen(false) }
    const resize = () => { if (innerWidth > 768) setOpen(false) }
    document.addEventListener('keydown', escape)
    document.addEventListener('pointerdown', outside)
    window.addEventListener('resize', resize)
    return () => { document.removeEventListener('keydown', escape); document.removeEventListener('pointerdown', outside); window.removeEventListener('resize', resize) }
  }, [open])
  const go = (event: MouseEvent<HTMLAnchorElement>) => {
    anchor(event)
    if (!event.defaultPrevented) return
    setOpen(false)
    const id = event.currentTarget.hash.slice(1)
    requestAnimationFrame(() => { const target = document.getElementById(id); if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }) } })
  }
  return <header ref={header} className={`site-header v5-header ${isCase ? 'on-case' : ''}`}>
    <a href="#top" onClick={go} className="signature">Y/S<span>{lang === 'zh' ? '孙英杰' : 'Yingjie Sun'}</span></a>
    <nav ref={navigation} id="main-navigation" className={open ? 'is-open' : ''} aria-label={lang === 'zh' ? '主导航' : 'Main navigation'} onBlur={event => { if (open && event.relatedTarget && !header.current?.contains(event.relatedTarget as Node)) setOpen(false) }}>
      <a href="#selected" onClick={go}>{lang === 'zh' ? '精选案例' : 'Selected work'}</a><a href="#works" onClick={go}>{t.catalog}</a><a href="#about" onClick={go}>{t.about}</a><a href="#contact" onClick={go}>{t.contact}</a>
      <a href={asset('/downloads/sun-yingjie-resume.pdf')} download className="nav-download">{lang === 'zh' ? '下载简历' : 'Résumé'}</a>
    </nav>
    <div className="header-controls"><button className="motion-toggle" onClick={toggleMotion} aria-pressed={reduced} disabled={systemReduced} title={systemReduced ? (lang === 'zh' ? '遵循系统的减少动态效果设置' : 'Following system reduced motion') : undefined} aria-label={lang === 'zh' ? '静态浏览模式' : 'Still browsing mode'}>{reduced ? <Play size={15}/> : <Pause size={15}/>}<span>{lang === 'zh' ? '动效' : 'Motion'}</span></button><button className="language" onClick={toggleLanguage} aria-label="切换语言 / Switch language">{lang === 'zh' ? 'EN' : '中'}</button><button ref={trigger} className="menu-toggle" aria-expanded={open} aria-controls="main-navigation" aria-label={lang === 'zh' ? (open ? '关闭菜单' : '打开菜单') : (open ? 'Close menu' : 'Open menu')} onClick={() => setOpen(value => !value)}>{open ? <X size={21}/> : <Menu size={21}/>}</button></div>
  </header>
}
