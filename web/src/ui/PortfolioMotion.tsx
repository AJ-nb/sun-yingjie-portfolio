import { usePortfolioReducedMotion as useReducedMotion } from './MotionPreference'
import { useEffect, useRef, useState, type RefObject, type ReactNode } from 'react'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { asset, type Lang } from '../data/workDocs'
import { heroPoseTime } from './videoSeek'

export function TurningFigure({ hero, lang }: { hero: RefObject<HTMLElement | null>; lang: Lang }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const x = useSpring(0, { stiffness: 100, damping: 22 }), y = useSpring(0, { stiffness: 100, damping: 22 })
  useEffect(() => {
    const surface = hero.current, targetCanvas = canvas.current
    targetCanvas?.classList.remove('is-ready')
    if (!surface || !targetCanvas || reduced || !matchMedia('(any-hover:hover) and (any-pointer:fine)').matches) return
    const context = targetCanvas.getContext('2d')
    if (!context) return
    let disposed = false, active = true, target = 32, current = 32, raf = 0, last = 0
    const frames = new Map<number, HTMLImageElement>()
    const paint = (frame: number) => {
      const image = frames.get(frame)
      if (!image || disposed) return
      context.clearRect(0, 0, 800, 722); context.drawImage(image, 0, 0, 800, 722)
      targetCanvas.dataset.pose = String(frame)
      targetCanvas.classList.add('is-ready')
    }
    const animate = (now: number) => {
      raf = 0
      current += (target - current) * (1 - Math.exp(-Math.min(64, now - last) / 70)); last = now
      if (Math.abs(target-current) < .1) current = target
      paint(Math.round(current))
      if (current !== target && active) raf = requestAnimationFrame(animate)
    }
    const schedule = () => { if (!raf && active) { last = performance.now(); raf = requestAnimationFrame(animate) } }
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !active) return
      const rect = surface.getBoundingClientRect(), px = Math.max(0, Math.min(1, (event.clientX-rect.left)/rect.width))
      target = Math.round(heroPoseTime(px)*24)
      x.set((px-.5)*36); y.set(Math.max(-12, Math.min(12, ((event.clientY-rect.top)/rect.height-.5)*24))); schedule()
    }
    const reset = () => { target = 32; x.set(0); y.set(0); schedule() }
    // Load centre first, then interleave left/right poses. Failed frames leave the
    // last rendered pose (or the static foreground) in place.
    const order = [32,18,72,...Array.from({ length:55 },(_,i)=>i+18).filter(i=>![32,18,72].includes(i))]
    let cursor = 0
    const loadNext = () => {
      if (disposed || cursor >= order.length) return
      const frame = order[cursor++], image = new Image()
      image.onload = () => { if (!disposed) { frames.set(frame,image); if (frame===Math.round(current)) paint(frame); loadNext() } }
      image.onerror = loadNext; image.src = asset(`/media/v10/hero/${frame}.webp`)
    }
    const observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting && !document.hidden; if (active) schedule(); else { cancelAnimationFrame(raf); raf=0 } })
    observer.observe(surface)
    const visibility = () => { active = !document.hidden && surface.getBoundingClientRect().bottom > 0; if (active) reset(); else { cancelAnimationFrame(raf); raf=0 } }
    for (let i=0;i<4;i++) loadNext()
    surface.addEventListener('pointermove',move,{passive:true}); surface.addEventListener('pointerleave',reset)
    window.addEventListener('blur',reset);document.addEventListener('visibilitychange',visibility)
    return () => { disposed=true; cancelAnimationFrame(raf); observer.disconnect(); frames.clear();surface.removeEventListener('pointermove',move);surface.removeEventListener('pointerleave',reset);window.removeEventListener('blur',reset);document.removeEventListener('visibilitychange',visibility) }
  }, [hero,reduced,x,y])
  return <div className="home-tv-stage"><motion.div className="home-tv-figure" style={reduced ? undefined : {x,y}}>
    <img src={asset('/media/v10/hero/poster.webp')} width="800" height="722" alt={lang==='zh'?'灰色西装与粉色眼睛的电视头角色':'TV-head character in a grey jacket with pink eyes'}/>
    <canvas ref={canvas} width="800" height="722" aria-hidden="true"/>
  </motion.div></div>
}

function Character({ children, progress, start, end }: {children:string;progress:MotionValue<number>;start:number;end:number}) {
  const opacity = useTransform(progress,[start,end],[.2,1])
  return <motion.span style={{opacity}}>{children}</motion.span>
}
export function ScrollParagraph({ children }: {children:string}) {
  const ref = useRef<HTMLParagraphElement>(null), reduced = useReducedMotion()
  const [enabled,setEnabled]=useState(false)
  const {scrollYProgress}=useScroll({target:ref,offset:['start 0.8','end 0.2']})
  useEffect(()=>{setEnabled(true)},[])
  const characters=Array.from(children)
  return <p className="home-about-text" ref={ref}><span className="sr-only">{children}</span><span aria-hidden="true">{!enabled||reduced?children:characters.map((char,i)=><Character key={i} progress={scrollYProgress} start={i/characters.length*.85} end={(i+1)/characters.length*.85+.15}>{char}</Character>)}</span></p>
}
export function Reveal({ children, className='', delay=0 }: {children:ReactNode;className?:string;delay?:number}) {
  const ref=useRef<HTMLDivElement>(null),reduced=useReducedMotion()
  useEffect(()=>{
    const node=ref.current;if(!node||reduced)return
    let animation:Animation|undefined
    const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){animation=node.animate([{transform:'translateY(28px)',opacity:.3},{transform:'translateY(0)',opacity:1}],{duration:700,delay:delay*1000,easing:'cubic-bezier(.25,.1,.25,1)',fill:'backwards'});observer.disconnect()}},{rootMargin:'0px 0px -20px 0px'})
    observer.observe(node);return()=>{observer.disconnect();animation?.cancel()}
  },[reduced,delay])
  return <div ref={ref} className={className}>{children}</div>
}
