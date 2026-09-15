import { useEffect, useState } from 'react'
import type { Lang } from '../data/workDocs'

export default function CaseOutline({ headings, lang, reduced }: { headings: string[]; lang: Lang; reduced: boolean }) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const update = () => {
      let current = 0
      headings.forEach((_, index) => { if ((document.getElementById(`case-section-${index}`)?.getBoundingClientRect().top ?? Infinity) < innerHeight * .35) current = index })
      setActive(current)
    }
    update(); window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [headings])
  return <nav className="case-outline" aria-label={lang === 'zh' ? '案例阅读目录' : 'Case contents'}>
    <span className="outline-label">{lang === 'zh' ? '阅读路径' : 'Reading path'}</span>
    <div>{headings.map((heading, index) => <button key={heading} aria-current={active === index ? 'step' : undefined} onClick={() => {
      const node = document.getElementById(`case-section-${index}`)
      if (node) { window.scrollTo({ top: scrollY + node.getBoundingClientRect().top - 105, behavior: reduced ? 'instant' : 'smooth' }); node.focus({ preventScroll: true }) }
    }}><span>{String(index + 1).padStart(2, '0')}</span>{heading}</button>)}</div>
  </nav>
}
