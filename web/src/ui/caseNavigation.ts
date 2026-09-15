/** Both case entry points account for the actual sticky controls, including wrapping. */
export function focusCaseHeading(index: number, reduced: boolean) {
  const node = document.getElementById(`case-section-${index}`)
  if (!node) return
  const header = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
  const outline = document.querySelector('.case-outline')?.getBoundingClientRect().height ?? 0
  window.scrollTo({ top: Math.max(0, scrollY + node.getBoundingClientRect().top - header - outline - 20), behavior: reduced ? 'instant' : 'smooth' })
  node.focus({ preventScroll: true })
}
