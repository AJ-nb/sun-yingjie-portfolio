import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { createSeekController } from './videoSeek'
import { asset, type Lang } from '../data/workDocs'

type GazeMap = { sourceWidth: number; sourceHeight: number; eyeCenter: [number, number]; samples: { angle: number; time: number }[] }
const mobileQuery = '(max-width: 768px), (pointer: coarse)'

export function OriginalVideo({ kind, lang, reduced }: { kind: 'hero' | 'footer'; lang: Lang; reduced: boolean }) {
  const container = useRef<HTMLDivElement>(null), video = useRef<HTMLVideoElement>(null)
  const [mobile, setMobile] = useState(() => matchMedia(mobileQuery).matches)
  const [visible, setVisible] = useState(false), [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false), [ready, setReady] = useState(false)
  const [gaze, setGaze] = useState<GazeMap | null>(null)
  const active = visible && !reduced && !failed
  // The footer original uses HEVC; its visually identical H.264 derivative also serves mobile playback.
  const src = asset(`/media/v5/${kind === 'hero' && mobile ? 'hero-original' : `${kind}-scrub`}.mp4`)
  useEffect(() => {
    const query = matchMedia(mobileQuery), change = () => setMobile(query.matches)
    query.addEventListener('change', change)
    return () => query.removeEventListener('change', change)
  }, [])
  useEffect(() => {
    let intersects = false
    const update = () => setVisible(intersects && !document.hidden)
    const observer = new IntersectionObserver(entries => { intersects = entries[0].isIntersecting; update() })
    if (container.current) observer.observe(container.current)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [])
  useEffect(() => {
    if (kind !== 'footer' || reduced || mobile) return
    const abort = new AbortController()
    fetch(asset('/media/v5/footer-gaze.json'), { signal: abort.signal }).then(response => {
      if (!response.ok) throw new Error('Gaze map unavailable')
      return response.json() as Promise<GazeMap>
    }).then(data => {
      if (data.sourceWidth > 0 && data.sourceHeight > 0 && Array.isArray(data.eyeCenter) && data.eyeCenter.length === 2 && data.eyeCenter.every(Number.isFinite) && data.samples?.length && data.samples.every(sample => Number.isFinite(sample.angle) && Number.isFinite(sample.time))) setGaze(data)
    }).catch(() => { /* The recorded poster remains the static fallback. */ })
    return () => abort.abort()
  }, [kind, reduced, mobile])
  useEffect(() => {
    const media = video.current
    if (!media) return
    if (!active || !mobile || (kind === 'hero' && !playing)) { media.pause(); return }
    media.play().catch(() => { /* Native play controls remain available when autoplay is blocked. */ })
    return () => media.pause()
  }, [active, mobile, playing, kind, src])
  useEffect(() => {
    const media = video.current, element = container.current
    if (!media || !element || !active || mobile || (kind === 'footer' && !gaze)) return
    media.pause()
    const controller = createSeekController(media)
    let frame = 0, pointer: { x: number; y: number } | null = null
    let previousX: number | null = null, heroTarget = media.currentTime
    const update = () => {
      frame = 0
      if (!pointer) return
      const box = element.getBoundingClientRect()
      if (kind === 'hero') {
        if (previousX !== null && Number.isFinite(media.duration)) heroTarget = Math.max(0, Math.min(media.duration - 1 / 24, heroTarget + (pointer.x - previousX) / box.width * media.duration * .8))
        previousX = pointer.x
        controller.seek(heroTarget)
      } else if (gaze) {
        const scale = Math.max(box.width / gaze.sourceWidth, box.height / gaze.sourceHeight)
        const eyeX = box.left + (box.width - gaze.sourceWidth * scale) / 2 + gaze.eyeCenter[0] * scale
        const eyeY = box.top + (box.height - gaze.sourceHeight * scale) / 2 + gaze.eyeCenter[1] * scale
        const dx = pointer.x - eyeX, dy = pointer.y - eyeY
        if (Math.hypot(dx, dy) < 8) return
        const angle = Math.atan2(dy, dx)
        const distance = (value: number) => Math.abs(Math.atan2(Math.sin(value - angle), Math.cos(value - angle)))
        const closest = gaze.samples.reduce((best, sample) => distance(sample.angle) < distance(best.angle) ? sample : best)
        controller.seek(closest.time + 1 / 240)
      }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const move = (event: PointerEvent) => { pointer = { x: event.clientX, y: event.clientY }; schedule() }
    const leave = () => { previousX = null }
    // Header and hero text must not interrupt the scrub surface; footer follows the viewport pointer.
    const surface = kind === 'hero' ? element.closest('section') ?? element : window
    surface.addEventListener('pointermove', move as EventListener)
    surface.addEventListener('pointerleave', leave)
    window.addEventListener('resize', schedule)
    window.addEventListener('scroll', schedule, { passive: true })
    return () => { controller.dispose(); cancelAnimationFrame(frame); surface.removeEventListener('pointermove', move as EventListener); surface.removeEventListener('pointerleave', leave); window.removeEventListener('resize', schedule); window.removeEventListener('scroll', schedule) }
  }, [active, mobile, kind, gaze])
  const displayVideo = !reduced && !failed && ready && (mobile ? kind === 'footer' || playing : kind === 'hero' || !!gaze)
  return <div ref={container} className={`original-video original-video-${kind}`}>
    <img className="original-poster" src={asset(`/media/v5/${kind}-poster.webp`)} alt="" loading={kind === 'hero' ? 'eager' : 'lazy'} />
    {!reduced && !failed && <video ref={video} key={src} src={src} poster={asset(`/media/v5/${kind}-poster.webp`)} muted playsInline loop={kind === 'footer'} controls={mobile && (kind === 'footer' || playing)} preload={visible ? 'auto' : 'none'} className={displayVideo ? 'is-ready' : ''} aria-label={lang === 'zh' ? '页面展示短片' : 'Portfolio presentation film'} onLoadedData={() => setReady(true)} onError={() => setFailed(true)} onEnded={() => setPlaying(false)} />}
    {kind === 'hero' && mobile && !playing && !reduced && !failed && <button className="video-play" onClick={() => { setPlaying(true); video.current?.play().catch(() => {}) }}><Play size={16}/>{lang === 'zh' ? '播放短片' : 'Play film'}</button>}
  </div>
}
