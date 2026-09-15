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

