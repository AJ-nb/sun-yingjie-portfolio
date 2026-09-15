export const FPS = 24
export const FRAMES_PER_NODE = 50
export const WORKS_ENTRANCE = 50
const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n))
export function dwell(t: number, amount = .35): number {
  const d = clamp(amount, 0, .49), x = clamp((t - d) / (1 - 2 * d))
  return x * x * (3 - 2 * x)
}
/** Document-coordinate nodes keep reverse scrolling and viewport changes deterministic. */
export function scrollFrame({ scroll, height, width, tops, galleryTop, totalFrames }: { scroll: number; height: number; width: number; tops: number[]; galleryTop: number; totalFrames: number }): number {
  const resumeEnd = tops.length * FRAMES_PER_NODE, reference = scroll + height * .3
  let node = 0
  if (tops.length) {
    if (reference <= tops[0]) node = dwell(scroll / Math.max(1, tops[0] - height * .3))
    else if (reference >= tops[tops.length - 1]) node = tops.length
    else for (let i = 0; i < tops.length - 1; i++) {
      if (reference <= tops[i + 1]) { node = i + 1 + dwell((reference - tops[i]) / Math.max(1, tops[i + 1] - tops[i])); break }
    }
  }
  let frame = clamp(node * FRAMES_PER_NODE, 0, resumeEnd)
  if (galleryTop < height) {
    const entranceEnd = Math.min(resumeEnd + WORKS_ENTRANCE, totalFrames)
    frame = galleryTop > 0 ? resumeEnd + (entranceEnd - resumeEnd) * clamp(1 - galleryTop / height) : entranceEnd + (totalFrames - entranceEnd) * clamp(-galleryTop / Math.max(1, width))
  }
  return clamp(frame, 0, totalFrames)
}
