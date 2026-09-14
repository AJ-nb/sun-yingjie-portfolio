import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { asset } from '../data/workDocs'

function Character({ reduced, onReady }: { reduced: boolean; onReady: (ready: boolean) => void }) {
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
    model.traverse(object => {
      if (/^eye_(left|right)/.test(object.name)) result.push({ object, base: object.quaternion.clone() })
    })
    return result
  }, [model])
  const progress = useRef(0), desiredProgress = useRef(0), pointer = useRef({ x: 0, y: 0 })
  const revealFrame = useRef<number | null>(null)
  const temporary = useMemo(() => ({ position: new THREE.Vector3(), quaternion: new THREE.Quaternion(), euler: new THREE.Euler(), gaze: new THREE.Quaternion() }), [])
  useEffect(() => () => {
    if (revealFrame.current !== null) cancelAnimationFrame(revealFrame.current)
    revealFrame.current = null
    onReady(false)
  }, [onReady])
  useEffect(() => {
    const clip = animations.find(animation => animation.name === 'CameraAction')
    if (!clip) return
    mixer.clipAction(clip).setLoop(THREE.LoopOnce, 1).play()
    const scroll = () => {
      const intro = document.querySelector<HTMLElement>('.intro-scene')
      if (!intro) return
      desiredProgress.current = THREE.MathUtils.clamp(-intro.getBoundingClientRect().top / Math.max(1, intro.offsetHeight - innerHeight), 0, 1)
      invalidate()
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      pointer.current = { x: (event.clientX / innerWidth - 0.5) * 2, y: (event.clientY / innerHeight - 0.5) * 2 }
    }
    scroll()
    window.addEventListener('scroll', scroll, { passive: true }); window.addEventListener('resize', scroll); window.addEventListener('pointermove', move, { passive: true })
    return () => { mixer.stopAllAction(); window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll); window.removeEventListener('pointermove', move) }
  }, [animations, mixer, invalidate])
  useFrame((_, delta) => {
    // Reveal only after a loaded-model frame has finished rendering.
    if (revealFrame.current === null) revealFrame.current = requestAnimationFrame(() => onReady(true))
    progress.current = reduced ? 0 : THREE.MathUtils.damp(progress.current, desiredProgress.current, 4.5, Math.min(delta, 0.1))
    const duration = animations.find(animation => animation.name === 'CameraAction')?.duration ?? 8
    mixer.setTime(Math.min(progress.current * duration, duration - 0.001))
    model.updateMatrixWorld(true)
    if (sourceCamera) {
      const authoredCamera = sourceCamera as THREE.PerspectiveCamera
      authoredCamera.getWorldPosition(temporary.position); authoredCamera.getWorldQuaternion(temporary.quaternion)
      camera.position.copy(temporary.position); camera.quaternion.copy(temporary.quaternion)
      // A taller field of view keeps the entire bust readable on narrow screens.
      camera.fov = Math.max(authoredCamera.fov, size.width < 700 ? 40 : 36)
      camera.aspect = size.width / size.height
      camera.near = 0.05; camera.far = 80; camera.updateProjectionMatrix()
    }
    if (!reduced && size.width >= 700) {
      temporary.euler.set(-pointer.current.y * 0.028, pointer.current.x * 0.045, 0)
      temporary.gaze.setFromEuler(temporary.euler)
      for (const eye of eyes) eye.object.quaternion.copy(eye.base).multiply(temporary.gaze)
    }
  })
  return <primitive object={model} />
}
export default function PortraitScene({ active, reduced, ready, onReady }: { active: boolean; reduced: boolean; ready: boolean; onReady: (ready: boolean) => void }) {
  const mobile = window.matchMedia('(max-width: 700px)').matches
  return <div className="canvas-shell" style={{ opacity: ready ? 1 : 0 }} aria-hidden="true"><Canvas dpr={mobile ? 1 : [1, 1.5]} frameloop={active ? (reduced ? 'demand' : 'always') : 'never'} camera={{ position: [0, 1.9, 6], fov: 36 }} gl={{ antialias: true, alpha: true, powerPreference: 'low-power', toneMapping: THREE.ACESFilmicToneMapping }}>
    <hemisphereLight args={['#fcf8ee', '#607165', 1.2]} /><ambientLight intensity={0.5} /><directionalLight position={[-3, 5, 5]} intensity={2.4} color="#ffebd8" /><directionalLight position={[4, 3, -3]} intensity={2.8} color="#dce8de" />
    <Suspense fallback={null}><Character reduced={reduced} onReady={onReady} /></Suspense>
  </Canvas></div>
}
