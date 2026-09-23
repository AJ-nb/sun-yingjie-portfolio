import { MotionPreference } from './MotionPreference'
import { asset } from '../data/workDocs'
import { useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy, Menu } from 'lucide-react'
import { localePath } from '../data/locale'
import { profileCopy } from '../data/profile'
import type { Lang } from '../data/workDocs'
import './design-os-v9.css'

export function SiteHeader({ lang, pathname = '/' }: { lang: Lang; pathname?: string }) {
  const menu = useRef<HTMLDetailsElement>(null)
  const nav = [['/work', '作品', 'Work'], ['/systems', '系统', 'Systems'], ['/lab', '实验', 'Lab'], ['/about', '关于', 'About'], ['/resume', '简历', 'Résumé']]
  const links = nav.map(([path, zh, en]) => <a key={path} href={localePath(path, lang)} aria-current={pathname === path || pathname.startsWith(path + '/') ? 'page' : undefined}>{lang === 'zh' ? zh : en}</a>)
  return <><header className="site-header">
    <a className="site-name" href={localePath('/', lang)} aria-label={lang === 'zh' ? '孙英杰首页' : 'Yingjie Sun home'}>YINGJIE SUN<span>{lang === 'zh' ? '工业与产品设计师' : 'Industrial & Product Designer'}</span></a>
    <nav className="site-nav" aria-label={lang === 'zh' ? '主导航' : 'Main navigation'}>{links}</nav>
    <a className="site-language" href={localePath(pathname, lang === 'zh' ? 'en' : 'zh')} hrefLang={lang === 'zh' ? 'en' : 'zh-CN'} aria-label={lang === 'zh' ? 'Switch to English' : '切换至中文'}>{lang === 'zh' ? 'EN' : '中文'}</a>
    <a className="contact-pill header-contact" href={localePath('/contact', lang)}>{lang === 'zh' ? '联系我' : 'Contact'}<ArrowUpRight size={16}/></a>
    <details className="site-mobile-menu" ref={menu} onKeyDown={event => { if (event.key === 'Escape' && menu.current) { menu.current.open = false; menu.current.querySelector('summary')?.focus() } }}><summary aria-label={lang === 'zh' ? '打开导航' : 'Open navigation'}><Menu size={21}/></summary><nav aria-label={lang === 'zh' ? '移动导航' : 'Mobile navigation'}>{links}<a href={localePath('/contact', lang)}>{lang === 'zh' ? '联系' : 'Contact'}</a></nav></details>
  </header><MotionPreference lang={lang}/></>
}

export function ContactBlock({ lang }: { lang: Lang }) {
  const [copied, setCopied] = useState<'idle' | 'done' | 'error'>('idle')
  const email = profileCopy[lang].contact.email
  async function copy() { try { await navigator.clipboard.writeText(email); setCopied('done') } catch { setCopied('error') } }
  return <section className="site-contact" id="contact" aria-labelledby="contact-heading">
    <div><p>{lang === 'zh' ? '下一次合作，从一次交流开始。' : 'Every good project starts with a conversation.'}</p><h2 id="contact-heading">{lang === 'zh' ? '一起，让想法成形。' : 'Let’s give it form.'}</h2></div>
    <div className="site-contact-actions"><a className="contact-pill" href={`mailto:${email}`}>{lang === 'zh' ? '联系我' : 'Get in touch'}<ArrowUpRight size={19}/></a><a className="contact-email" href={`mailto:${email}`}>{email}</a><button className="copy-email" onClick={copy}>{copied === 'done' ? <Check size={16}/> : <Copy size={16}/>}<span aria-live="polite">{copied === 'done' ? (lang === 'zh' ? '已复制' : 'Copied') : copied === 'error' ? (lang === 'zh' ? '请直接选择邮箱复制' : 'Select the email to copy') : (lang === 'zh' ? '复制邮箱' : 'Copy email')}</span></button><a className="text-link" href={localePath('/resume', lang)}>{lang === 'zh' ? '简历与作品集下载' : 'Résumé & portfolio downloads'}<ArrowUpRight size={16}/></a></div>
  </section>
}

export function SiteFooter({ lang }: { lang: Lang }) {
  return <footer className="site-footer"><span>© 2026 Yingjie Sun</span><span>{lang === 'zh' ? '从形态到系统。' : 'From form to system.'}</span><a href={asset("/THIRD_PARTY_NOTICES.md")}>{lang === 'zh' ? '署名与来源' : 'Credits & sources'}</a></footer>
}
