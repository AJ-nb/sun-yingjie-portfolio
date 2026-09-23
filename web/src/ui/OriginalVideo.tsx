import { useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { createSeekController, HERO_POSES, heroPoseTime } from './videoSeek'
import { asset, type Lang } from '../data/workDocs'

export type PortfolioFilm = { desktop?: string; mobile?: string; poster: string; label: { zh: string; en: string } }
// Input capability is independent of layout width, including narrow desktop panels.
const pointerQuery = '(any-hover: hover) and (any-pointer: fine)'
const films: Record<'hero' | 'footer', PortfolioFilm> = {
  hero: { desktop: '/media/v7/hero-follow.mp4', mobile: '/media/v5/hero-original.mp4', poster: '/media/v5/hero-poster.webp', label: { zh: '交互封面影像', en: 'Interactive cover film' } },
  footer: { desktop: '/media/v7/films/arcteryx-process.mp4', mobile: '/media/v7/films/arcteryx-process.mp4', poster: '/works/legacy/arcteryx/cb880134dd55b4ea48ac6a2c188bf65b.webp', label: { zh: 'Arc’teryx 空间设计', en: 'Arc’teryx spatial design' } },
}

export function OriginalVideo({ kind, lang, reduced, film = films[kind] }: { kind: 'hero' | 'footer'; lang: Lang; reduced: boolean; film?: PortfolioFilm }) {
  const [mobile, setMobile] = useState(() => typeof matchMedia === 'undefined' || !matchMedia(pointerQuery).matches)
  useEffect(() => {
    const query = matchMedia(pointerQuery), change = () => setMobile(!query.matches)
    query.addEventListener('change', change)
    return () => query.removeEventListener('change', change)
  }, [])
  const source = mobile ? film.mobile ?? film.desktop : film.desktop
  return <FilmSurface key={`${kind}:${source ?? 'still'}:${mobile}`} kind={kind} lang={lang} reduced={reduced} mobile={mobile} source={source} film={film}/>
}

function FilmSurface({ kind, lang, reduced, mobile, source, film }: { kind: 'hero' | 'footer'; lang: Lang; reduced: boolean; mobile: boolean; source?: string; film: PortfolioFilm }) {
  const container = useRef<HTMLDivElement>(null), video = useRef<HTMLVideoElement>(null)
  const pointerPosition = useRef<number | null>(null)
  const [visible, setVisible] = useState(false), [requested, setRequested] = useState(false), [playing, setPlaying] = useState(false)
  const [loaded, setLoaded] = useState(false), [ready, setReady] = useState(false), [failed, setFailed] = useState(false), [attempt, setAttempt] = useState(0)
  const [seekSource, setSeekSource] = useState<string>()
  const followOnly = kind === 'hero'
  // The cover has one interaction: a direct response to a fine pointer. Other
  // motion still follows the system preference; touch keeps the cover poster.
  const allowed = Boolean(source) && !failed && (followOnly ? !mobile && !reduced : !reduced && (!mobile || requested))
  const fetchSource = allowed && (visible || requested || ready) ? asset(source!) : undefined
  const mountedSource = fetchSource ? kind === 'hero' && !mobile ? seekSource : fetchSource : undefined
  useEffect(() => {
    if (!fetchSource || kind !== 'hero' || mobile) return
    const request = new AbortController()
    let objectURL: string | undefined
    setSeekSource(undefined)
    // Static hosting may return 200 for Range requests. A complete local Blob keeps
    // seeking reliable even when the HTTP media resource reports seekable [0, 0].
    void fetch(fetchSource, { signal: request.signal }).then(async response => {
      if (!response.ok) throw new Error(`Cover request failed: ${response.status}`)
      const blob = await response.blob()
      if (request.signal.aborted) return
      objectURL = URL.createObjectURL(blob)
      setSeekSource(objectURL)
    }).catch(() => { if (!request.signal.aborted) { setFailed(true); setPlaying(false) } })
    return () => { request.abort(); if (objectURL) URL.revokeObjectURL(objectURL) }
  }, [fetchSource, kind, mobile, attempt])
  useEffect(() => {
    let intersects = false
    const update = () => setVisible(intersects && !document.hidden)
    const observer = new IntersectionObserver(entries => { intersects = entries[0].isIntersecting; update() })
    const element = container.current
    if (element) observer.observe(kind === 'hero' ? element.closest('.mainframe-hero') ?? element : element)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [kind])
  useEffect(() => {
    if (!followOnly || mobile || reduced || !visible) return
    const remember = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') pointerPosition.current = event.clientX / innerWidth
    }
    const clear = () => { pointerPosition.current = null }
    window.addEventListener('pointermove', remember, { passive: true })
    document.documentElement.addEventListener('pointerleave', clear)
    window.addEventListener('blur', clear)
    return () => { window.removeEventListener('pointermove', remember); document.documentElement.removeEventListener('pointerleave', clear); window.removeEventListener('blur', clear); clear() }
  }, [followOnly, mobile, reduced, visible])
  useEffect(() => {
    const media = video.current
    if (!media) return
    if (followOnly || !visible || !playing || !allowed) { media.pause(); return }
    void media.play().catch(() => setPlaying(false))
    return () => media.pause()
  }, [followOnly, visible, playing, allowed, mountedSource, attempt])
  useEffect(() => {
    const media = video.current, element = container.current
    if (!media || !element || !visible || mobile || !loaded || (!followOnly && (reduced || playing))) return
    const controller = createSeekController(media)
    const surface = kind === 'hero' ? window : element
    const exitSurface = kind === 'hero' ? document.documentElement : element
    let frame = 0, target = followOnly ? heroPoseTime(pointerPosition.current ?? .5) : media.currentTime
    let current = target, previousX: number | null = null, lastFrame = 0
    if (kind === 'hero') controller.seek(target)
    const update = (now: number) => {
      frame = 0
      const elapsed = Math.min(64, now - lastFrame)
      lastFrame = now
      current += (target - current) * (1 - Math.exp(-elapsed / 70))
      if (Math.abs(target - current) < 1 / 96) current = target
      controller.seek(current)
      if (current !== target) frame = requestAnimationFrame(update)
    }
    const schedule = () => {
      if (reduced) { current = target; controller.seek(target); return }
      if (!frame) { lastFrame = performance.now(); frame = requestAnimationFrame(update) }
    }
    const move = (event: Event) => {
      if (!(event instanceof PointerEvent) || event.pointerType === 'touch' || !Number.isFinite(media.duration)) return
      if (document.querySelector('#main-navigation.is-open, .yarl__portal')) return
      const width = kind === 'hero' ? window.innerWidth : element.getBoundingClientRect().width
      if (width <= 0) return
      if (kind === 'hero') target = heroPoseTime(event.clientX / width)
      else if (previousX !== null) target = Math.max(0, Math.min(media.duration - 1 / 24, target + (event.clientX - previousX) / width * .8 * media.duration))
      previousX = event.clientX
      schedule()
    }
    const leave = () => { previousX = null; if (kind === 'hero') { target = HERO_POSES.center; schedule() } }
    surface.addEventListener('pointermove', move, { passive: true })
    exitSurface.addEventListener('pointerleave', leave)
    window.addEventListener('blur', leave)
    return () => { controller.dispose(); cancelAnimationFrame(frame); surface.removeEventListener('pointermove', move); exitSurface.removeEventListener('pointerleave', leave); window.removeEventListener('blur', leave) }
  }, [visible, mobile, reduced, loaded, playing, mountedSource, attempt, kind, followOnly])
  function requestPlayback() { setRequested(true); setPlaying(value => !value) }
  return <div ref={container} className={`original-video original-video-${kind}${visible ? ' is-visible' : ''}`} data-film-source={source ?? 'still'}>
    <img className="original-poster" src={asset(film.poster)} alt={film.label[lang]} loading={kind === 'hero' ? 'eager' : 'lazy'} decoding="async"/>
    {mountedSource && <video ref={video} key={attempt} src={mountedSource} poster={asset(film.poster)} muted playsInline loop={!followOnly} controls={!followOnly && mobile && requested} disablePictureInPicture={followOnly} tabIndex={followOnly ? -1 : undefined} preload={mobile ? 'none' : visible ? 'auto' : 'metadata'} className={ready ? 'is-ready' : ''} aria-label={film.label[lang]} onLoadedData={() => { setLoaded(true); if (!followOnly) setReady(true) }} onSeeked={() => { if (followOnly) setReady(true) }} onPlay={event => { if (followOnly) event.currentTarget.pause(); else setPlaying(true) }} onPause={() => setPlaying(false)} onError={() => { setFailed(true); setPlaying(false) }} onEnded={() => setPlaying(false)}/>}
    {followOnly && !mobile && !reduced && !failed && <span className="video-follow-hint" role="status">{lang === 'zh' ? !ready ? '正在载入交互封面…' : '移动鼠标，影像随之转向' : !ready ? 'Loading interactive cover…' : 'Move your pointer to turn the figure'}</span>}
    {!followOnly && source && !reduced && !failed && <button className="video-play" type="button" onClick={requestPlayback} aria-pressed={playing}>{playing ? <Pause size={16} aria-hidden="true"/> : <Play size={16} aria-hidden="true"/>}{lang === 'zh' ? playing ? '暂停短片' : '播放短片' : playing ? 'Pause film' : 'Play film'}</button>}
    {source && failed && <button className="video-play" type="button" onClick={() => { setFailed(false); setLoaded(false); setReady(false); setRequested(true); setPlaying(!followOnly); setAttempt(value => value + 1) }}><RotateCcw size={16} aria-hidden="true"/>{lang === 'zh' ? followOnly ? '重试封面' : '重新加载短片' : followOnly ? 'Retry cover' : 'Retry film'}</button>}
  </div>
}
