import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Lang } from '../data/workDocs'
import { focusCaseHeading } from './caseNavigation'

export default function CaseOutline({ headings, lang, reduced }: { headings: string[]; lang: Lang; reduced: boolean }) {
  const [active, setActive] = useState(0), [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      let current = 0
      headings.forEach((_, index) => { if ((document.getElementById(`case-section-${index}`)?.getBoundingClientRect().top ?? Infinity) < innerHeight * .35) current = index })
      setActive(current)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update(); window.addEventListener('scroll', schedule, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule) }
  }, [headings])
  if (!headings.length) return null
  return <nav className={`case-outline${open ? ' is-open' : ''}`} aria-label={lang === 'zh' ? '案例阅读目录' : 'Case contents'} onKeyDown={event => {
    if (event.key !== 'Escape' || !open) return
    event.preventDefault(); event.stopPropagation(); setOpen(false); toggle.current?.focus({ preventScroll: true })
  }}>
    <span className="outline-label">{lang === 'zh' ? '阅读路径' : 'Reading path'}</span>
    <button ref={toggle} className="outline-toggle" type="button" aria-expanded={open} aria-controls="case-outline-links" onClick={() => setOpen(value => !value)}><span>{lang === 'zh' ? '案例目录' : 'Case contents'}<small>{headings[active]}</small></span><ChevronDown size={18} aria-hidden="true"/></button>
    <div id="case-outline-links">{headings.map((heading, index) => <button key={`${index}:${heading}`} aria-current={active === index ? 'step' : undefined} onClick={() => { setOpen(false); requestAnimationFrame(() => focusCaseHeading(index, reduced)) }}><span>{String(index + 1).padStart(2, '0')}</span>{heading}</button>)}</div>
  </nav>
}
