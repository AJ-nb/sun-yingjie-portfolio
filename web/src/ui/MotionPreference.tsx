import { useSyncExternalStore } from 'react'
import type { Lang } from '../data/workDocs'
import './motion-preference.css'

type Preference = 'full' | 'reduced'
const key = 'portfolio-motion'
let preference: Preference = 'full'
let reduced = false
let started = false
const listeners = new Set<() => void>()
const normalize = (value: unknown): Preference => value === 'reduced' ? 'reduced' : 'full'
function start() {
  if (started || typeof window === 'undefined') return
  started = true
  try {
    const stored = localStorage.getItem(key)
    preference = normalize(stored)
    if (stored === 'system') localStorage.setItem(key, preference)
  } catch { /* Session controls still work. */ }
  const update = () => {
    reduced = preference === 'reduced'
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full'
    listeners.forEach(listener => listener())
  }
  window.addEventListener('storage', event => { if (event.key === key) { preference = normalize(event.newValue); update() } })
  update()
}
function subscribe(listener: () => void) { listeners.add(listener); start(); return () => listeners.delete(listener) }
function choose(value: Preference) {
  preference = value
  try { localStorage.setItem(key, value) } catch { /* Do not disable the control when storage is blocked. */ }
  reduced = value === 'reduced'
  document.documentElement.dataset.motion = reduced ? 'reduced' : 'full'
  listeners.forEach(listener => listener())
}
export function usePortfolioReducedMotion() { return useSyncExternalStore(subscribe, () => reduced, () => false) }
export function MotionPreference({lang}: {lang: Lang}) {
  const value = useSyncExternalStore(subscribe, () => preference, () => 'full' as Preference)
  const isReduced = usePortfolioReducedMotion()
  return <div className="motion-preference">
    <label htmlFor="motion-preference">{lang === 'zh' ? '动效' : 'Motion'}</label>
    <select id="motion-preference" value={value} onChange={event => choose(event.target.value as Preference)}>
      <option value="full">{lang === 'zh' ? '完整动效' : 'Full motion'}</option>
      <option value="reduced">{lang === 'zh' ? '减少动效' : 'Reduced motion'}</option>
    </select>
    {isReduced && <button type="button" onClick={() => choose('full')}>{lang === 'zh' ? '开启完整动效' : 'Enable full motion'}</button>}
  </div>
}
