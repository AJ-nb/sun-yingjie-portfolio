import { Grid2X2, Mail, FileText, PanelsTopLeft } from 'lucide-react'
import type { MouseEvent } from 'react'
import type { Lang } from '../data/workDocs'

export function MobileDock({ lang, anchor }: { lang: Lang; anchor: (event: MouseEvent<HTMLAnchorElement>) => void }) {
  const items = [
    { href: '#selected', label: lang === 'zh' ? '作品' : 'Work', icon: PanelsTopLeft },
    { href: '#works', label: lang === 'zh' ? '目录' : 'Archive', icon: Grid2X2 },
    { href: '#downloads', label: lang === 'zh' ? '简历' : 'Résumé', icon: FileText },
    { href: '#contact', label: lang === 'zh' ? '联系' : 'Contact', icon: Mail },
  ]
  return <nav className="mobile-dock" aria-label={lang === 'zh' ? '手机快捷导航' : 'Mobile shortcuts'}>{items.map(item => <a key={item.href} href={item.href} onClick={anchor}><item.icon size={18} aria-hidden="true"/><span>{item.label}</span></a>)}</nav>
}
