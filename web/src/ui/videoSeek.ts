// Calibrated against the supplied cover footage at 24 fps: left, front, right.
export const HERO_POSES = { left: 18 / 24, center: 32 / 24, right: 72 / 24 } as const

/** Absolute pointer position always resolves to the same pose, regardless of its path. */
export function heroPoseTime(position: number) {
  const x = Number.isFinite(position) ? Math.max(0, Math.min(1, position)) : .5
  return x <= .5
    ? HERO_POSES.left + x * 2 * (HERO_POSES.center - HERO_POSES.left)
    : HERO_POSES.center + (x - .5) * 2 * (HERO_POSES.right - HERO_POSES.center)
}

/** Serialize seeks: retain the latest target while the decoder completes its current seek. */
export function createSeekController(video: HTMLVideoElement) {
  let target = 0, pending = false, disposed = false
  const flush = () => {
    if (disposed || pending || video.seeking || !Number.isFinite(video.duration) || video.duration <= 0) return
    const next = Math.max(0, Math.min(video.duration - 1 / 24, target))
    if (Math.abs(video.currentTime - next) < 1 / 48) return
    pending = true
    try { video.currentTime = next } catch { pending = false }
  }
  const seeked = () => { pending = false; flush() }
  video.addEventListener('seeked', seeked)
  video.addEventListener('loadedmetadata', flush)
  return { seek(time: number) { target = time; flush() }, dispose() { disposed = true; video.removeEventListener('seeked', seeked); video.removeEventListener('loadedmetadata', flush) } }
}
