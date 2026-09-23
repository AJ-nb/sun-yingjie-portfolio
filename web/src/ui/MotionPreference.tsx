import { useSyncExternalStore } from 'react'
import type { Lang } from '../data/workDocs'
import './motion-preference.css'

type Preference = 'system' | 'full' | 'reduced'
const key = 'portfolio-motion'
let preference: Preference = 'system'
let reduced = true
let started = false
const listeners = new Set<() => void>()
const valid = (value: unknown): value is Preference => value === 'system' || value === 'full' || value === 'reduced'
function start() {
  if (started || typeof window === 'undefined') return
  started = true
  const query = matchMedia('(prefers-reduced-motion: reduce)')
  try { const stored = localStorage.getItem(key); if (valid(stored)) preference = stored } catch { /* Session controls still work. */ }
  const update = () => {
    reduced = preference === 'reduced' || (preference === 'system' && query.matches)
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full'
    listeners.forEach(listener => listener())
  }
  query.addEventListener('change', update)
  window.addEventListener('storage', event => { if (event.key === key) { preference = valid(event.newValue) ? event.newValue : 'system'; update() } })
  update()
}
function subscribe(listener: () => void) { listeners.add(listener); start(); return () => listeners.delete(listener) }
function choose(value: Preference) {
  preference = value
  try { localStorage.setItem(key, value) } catch { /* Do not disable the control when storage is blocked. */ }
  reduced = value === 'reduced' || (value === 'system' && matchMedia('(prefers-reduced-motion: reduce)').matches)
  document.documentElement.dataset.motion = reduced ? 'reduced' : 'full'
  listeners.forEach(listener => listener())
}
export function usePortfolioReducedMotion() { return useSyncExternalStore(subscribe, () => reduced, () => true) }
export function MotionPreference({lang}: {lang: Lang}) {
  const value = useSyncExternalStore(subscribe, () => preference, () => 'system' as Preference)
  const isReduced = usePortfolioReducedMotion()
  return <div className="motion-preference">
    <label htmlFor="motion-preference">{lang === 'zh' ? '动效' : 'Motion'}</label>
    <select id="motion-preference" value={value} onChange={event => choose(event.target.value as Preference)}>
      <option value="system">{lang === 'zh' ? '跟随系统' : 'System'}</option>
      <option value="full">{lang === 'zh' ? '完整动效' : 'Full motion'}</option>
      <option value="reduced">{lang === 'zh' ? '减少动效' : 'Reduced motion'}</option>
    </select>
    {isReduced && <button type="button" onClick={() => choose('full')}>{lang === 'zh' ? '开启完整动效' : 'Enable full motion'}</button>}
  </div>
}
