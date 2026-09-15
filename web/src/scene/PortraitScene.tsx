import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Bloom, DepthOfField, EffectComposer, SMAA } from '@react-three/postprocessing'
import { DepthOfFieldEffect } from 'postprocessing'
import * as THREE from 'three'
import { asset } from '../data/workDocs'
import profile from '../data/profile.json'
import { FPS, FRAMES_PER_NODE, WORKS_ENTRANCE, scrollFrame } from './scrollTimeline'

const POINTS = ['focus-start', ...profile.timeline.map(entry => entry.point), 'focus-works']
const RESUME_END = profile.timeline.length * FRAMES_PER_NODE
function Character({ reduced, onReady, focus, onSlow }: { reduced: boolean; onReady: (ready: boolean) => void; focus: THREE.Vector3; onSlow: () => void }) {
  const { scene, animations } = useGLTF(asset('/models/avatar.glb'))
  const camera = useThree(state => state.camera) as THREE.PerspectiveCamera
  const size = useThree(state => state.size)
  const invalidate = useThree(state => state.invalidate)
  const model = useMemo(() => scene.clone(true), [scene])
  const mixer = useMemo(() => new THREE.AnimationMixer(model), [model])
  const sourceCamera = useMemo(() => {
    let found: THREE.PerspectiveCamera | null = null
    model.traverse(object => { if (object instanceof THREE.PerspectiveCamera) found = object })
    return found
  }, [model])
  const eyes = useMemo(() => {
    const result: { object: THREE.Object3D; base: THREE.Quaternion }[] = []
    // Iris and pupil children inherit the two roots; never rotate them a second time.
    model.traverse(object => {
      const originalName = object.userData.name ?? object.name
      if (originalName === 'eye_left | curved sclera' || originalName === 'eye_right | curved sclera' || object.name === 'eye_left_|_curved_sclera' || object.name === 'eye_right_|_curved_sclera') result.push({ object, base: object.quaternion.clone() })
    })
    return result
  }, [model])
  const anchors = useMemo(() => POINTS.map(name => model.getObjectByName(name)), [model])
  const frame = useRef(0), desired = useRef(0), pointer = useRef(new THREE.Vector2()), smoothPointer = useRef(new THREE.Vector2())
  const revealFrame = useRef<number | null>(null)
  const performance = useRef({ count: 0, elapsed: 0, notified: false })
  const duration = animations.find(animation => animation.name === 'CameraAction')?.duration ?? 350 / FPS
  const totalFrames = Math.round(duration * FPS)
  const temporary = useMemo(() => ({ position: new THREE.Vector3(), quaternion: new THREE.Quaternion(), euler: new THREE.Euler(0, 0, 0, 'YXZ'), orbit: new THREE.Quaternion(), a: new THREE.Vector3(), b: new THREE.Vector3(), gaze: new THREE.Quaternion() }), [])
  useEffect(() => () => {
    if (revealFrame.current !== null) cancelAnimationFrame(revealFrame.current)
    onReady(false)
  }, [onReady])
  useEffect(() => {
    const actions = animations.map(clip => { const action = mixer.clipAction(clip); action.setLoop(THREE.LoopOnce, 1); action.clampWhenFinished = true; action.play(); return action })
    const measure = () => {
      const nodes = profile.timeline.map(entry => document.querySelector<HTMLElement>(`[data-point="${entry.point}"]`))
      const gallery = document.querySelector<HTMLElement>('.wk-gallery')
      if (nodes.every(Boolean)) desired.current = scrollFrame({ scroll: scrollY, height: innerHeight, width: innerWidth, tops: nodes.map(node => node!.getBoundingClientRect().top + scrollY), galleryTop: gallery?.getBoundingClientRect().top ?? Infinity, totalFrames })
      invalidate()
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || matchMedia('(pointer: coarse)').matches) return
      pointer.current.set((event.clientX / innerWidth - .5) * 2, (event.clientY / innerHeight - .5) * 2)
    }
    measure()
    const observer = new ResizeObserver(measure)
    document.querySelectorAll('.intro-scene, .wk-gallery, .tl-entry').forEach(node => observer.observe(node))
    window.addEventListener('scroll', measure, { passive: true }); window.addEventListener('resize', measure); window.addEventListener('pointermove', move, { passive: true })
    return () => { actions.forEach(action => action.stop()); observer.disconnect(); window.removeEventListener('scroll', measure); window.removeEventListener('resize', measure); window.removeEventListener('pointermove', move) }
  }, [animations, mixer, invalidate, totalFrames])
  useFrame((_, dt) => {
    if (revealFrame.current === null) revealFrame.current = requestAnimationFrame(() => onReady(true))
    const stats = performance.current
    if (!reduced && !stats.notified && dt < .5) {
      stats.count++; stats.elapsed += dt
      if (stats.count >= 150) {
        if (stats.elapsed > 10) { stats.notified = true; onSlow() }
        stats.count = 0; stats.elapsed = 0
      }
    }
    const smoothOff = THREE.MathUtils.smoothstep(desired.current, RESUME_END, RESUME_END + WORKS_ENTRANCE)
    const amount = THREE.MathUtils.lerp(1 - Math.pow(.1, Math.min(dt, .1)), 1, smoothOff)
    frame.current = reduced ? 0 : frame.current + (desired.current - frame.current) * amount
    mixer.setTime(Math.min(frame.current / FPS, duration - .0001))
    model.updateMatrixWorld(true)
    const coordinate = Math.min(frame.current / FRAMES_PER_NODE, profile.timeline.length)
    const first = Math.floor(coordinate), second = Math.min(first + 1, profile.timeline.length)
    const a = anchors[first], b = anchors[second]
    if (a && b) { a.getWorldPosition(temporary.a); b.getWorldPosition(temporary.b); focus.lerpVectors(temporary.a, temporary.b, coordinate - first) }
    const worksFocus = anchors[anchors.length - 1]
    if (frame.current > RESUME_END && worksFocus) { worksFocus.getWorldPosition(temporary.b); focus.lerp(temporary.b, THREE.MathUtils.clamp((frame.current - RESUME_END) / WORKS_ENTRANCE, 0, 1)) }
    const mobile = size.width <= 640 || matchMedia('(pointer: coarse)').matches
    if (sourceCamera) {
      const authoredCamera = sourceCamera as THREE.PerspectiveCamera
      authoredCamera.getWorldPosition(temporary.position); authoredCamera.getWorldQuaternion(temporary.quaternion)
      smoothPointer.current.lerp(pointer.current, 1 - Math.pow(.1, Math.min(dt, .1)))
      const angle = reduced || mobile ? 0 : THREE.MathUtils.degToRad(4)
      temporary.euler.set(-smoothPointer.current.y * angle, -smoothPointer.current.x * angle, 0)
      temporary.orbit.setFromEuler(temporary.euler)
      temporary.position.sub(focus).applyQuaternion(temporary.orbit)
      if (mobile) temporary.position.multiplyScalar(1.2)
      camera.position.copy(temporary.position.add(focus)); camera.quaternion.multiplyQuaternions(temporary.orbit, temporary.quaternion)
      if (mobile) camera.translateX(-camera.position.distanceTo(focus) * .12 * THREE.MathUtils.smoothstep(coordinate, .2, 1.3) * (1 - smoothOff))
      camera.fov = authoredCamera.fov; camera.aspect = size.width / size.height; camera.near = .05; camera.far = 80; camera.updateProjectionMatrix()
    }
    temporary.euler.set(!reduced && !mobile ? -smoothPointer.current.y * .09 : 0, !reduced && !mobile ? smoothPointer.current.x * .16 : 0, 0)
    temporary.gaze.setFromEuler(temporary.euler)
    for (const eye of eyes) eye.object.quaternion.copy(eye.base).multiply(temporary.gaze)
  })
  return <primitive object={model} />
}
function FocusEffects({ focus, mobile, enabled }: { focus: THREE.Vector3; mobile: boolean; enabled: boolean }) {
  const dof = useRef<DepthOfFieldEffect>(null)
  useFrame(() => { dof.current?.target?.copy(focus) })
  return <EffectComposer multisampling={0} enabled={enabled}>
    <DepthOfField ref={dof} target={[0, 2, 0]} worldFocusRange={1.1} bokehScale={mobile ? .5 : 1.1} height={mobile ? 360 : 540} />
    <Bloom intensity={.35} luminanceThreshold={.82} luminanceSmoothing={.3} mipmapBlur /><SMAA />
  </EffectComposer>
}
export default function PortraitScene({ active, reduced, ready, onReady }: { active: boolean; reduced: boolean; ready: boolean; onReady: (ready: boolean) => void }) {
  const [lowPerformance, setLowPerformance] = useState(false)
  const mobile = window.matchMedia('(max-width: 640px)').matches
  const focus = useMemo(() => new THREE.Vector3(0, 2, 0), [])
  return <div className="canvas-shell" style={{ opacity: ready ? 1 : 0 }} aria-hidden="true"><Canvas dpr={mobile || lowPerformance ? 1 : [1, 1.5]} frameloop={active ? (reduced || lowPerformance ? 'demand' : 'always') : 'never'} camera={{ position: [0, 1.9, 6], fov: 36 }} gl={{ antialias: false, alpha: true, powerPreference: 'low-power', toneMapping: THREE.ACESFilmicToneMapping }}>
    <hemisphereLight args={['#ffffff', '#bfc5ca', 1.7]} /><ambientLight intensity={.6} />
    <directionalLight position={[-3, 4, 6]} intensity={1.35} color="#ffffff" /><directionalLight position={[3, 2.4, 5]} intensity={.9} color="#f5f7ff" /><directionalLight position={[-4, 4, -3]} intensity={.45} color="#e8efff" />
    <Suspense fallback={null}><Character reduced={reduced || lowPerformance} onReady={onReady} focus={focus} onSlow={() => setLowPerformance(true)} />
      <FocusEffects focus={focus} mobile={mobile} enabled={!lowPerformance} />
    </Suspense>
  </Canvas></div>
}
