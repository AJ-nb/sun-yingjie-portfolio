import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { DepthOfField, EffectComposer, SMAA } from '@react-three/postprocessing'
import { DepthOfFieldEffect } from 'postprocessing'
import * as THREE from 'three'
import { asset } from '../data/workDocs'

function Character({ reduced, onReady, focus, onSlow }: { reduced: boolean; onReady: (ready: boolean) => void; focus: THREE.Vector3; onSlow: () => void }) {
  const { scene, animations } = useGLTF(asset('/models/avatar.glb'))
  const camera = useThree(state => state.camera) as THREE.PerspectiveCamera
  const size = useThree(state => state.size)
  const canvas = useThree(state => state.gl.domElement)
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
  const pointer = useRef(new THREE.Vector2()), smoothPointer = useRef(new THREE.Vector2())
  const revealFrame = useRef<number | null>(null)
  const performance = useRef({ count: 0, elapsed: 0, notified: false })
  const temporary = useMemo(() => ({ position: new THREE.Vector3(), quaternion: new THREE.Quaternion(), euler: new THREE.Euler(0, 0, 0, 'YXZ'), orbit: new THREE.Quaternion(), gaze: new THREE.Quaternion() }), [])
  useEffect(() => () => {
    if (revealFrame.current !== null) cancelAnimationFrame(revealFrame.current)
    onReady(false)
  }, [onReady])
  useEffect(() => {
    const actions = animations.map(clip => { const action = mixer.clipAction(clip); action.setLoop(THREE.LoopOnce, 1); action.clampWhenFinished = true; action.play(); return action })
    // The v4 portrait is a bounded identity object, independent of résumé layout.
    // Keep the original opening pose and camera; pointer motion is local to its frame.
    mixer.setTime(0)
    model.updateMatrixWorld(true)
    model.getObjectByName('focus-start')?.getWorldPosition(focus)
    invalidate()
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || matchMedia('(pointer: coarse)').matches) return
      const box = canvas.getBoundingClientRect()
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) pointer.current.set(0, 0)
      else pointer.current.set((event.clientX - box.left) / box.width * 2 - 1, (event.clientY - box.top) / box.height * 2 - 1)
      invalidate()
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => { actions.forEach(action => action.stop()); window.removeEventListener('pointermove', move) }
  }, [animations, mixer, model, focus, canvas, invalidate])
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
    const mobile = matchMedia('(max-width: 640px), (pointer: coarse)').matches
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
    <DepthOfField ref={dof} target={[0, 2, 0]} worldFocusRange={1.6} bokehScale={mobile ? .15 : .4} height={mobile ? 360 : 540} />
    <SMAA />
  </EffectComposer>
}
export default function PortraitScene({ active, reduced, ready, onReady }: { active: boolean; reduced: boolean; ready: boolean; onReady: (ready: boolean) => void }) {
  const [lowPerformance, setLowPerformance] = useState(false)
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 640px)').matches)
  useEffect(() => {
    const query = window.matchMedia('(max-width: 640px)')
    const change = () => setMobile(query.matches)
    query.addEventListener('change', change)
    return () => query.removeEventListener('change', change)
  }, [])
  const focus = useMemo(() => new THREE.Vector3(0, 2, 0), [])
  return <div className="canvas-shell" style={{ opacity: ready ? 1 : 0 }} aria-hidden="true"><Canvas dpr={mobile || lowPerformance ? 1 : [1, 1.5]} frameloop={active ? (reduced || lowPerformance ? 'demand' : 'always') : 'never'} camera={{ position: [0, 1.9, 6], fov: 36 }} gl={{ antialias: false, alpha: true, powerPreference: 'low-power', toneMapping: THREE.ACESFilmicToneMapping }}>
    <hemisphereLight args={['#fff5e5', '#526855', .95]} /><ambientLight intensity={.2} />
    <directionalLight position={[-3, 4, 6]} intensity={2} color="#fff3df" /><directionalLight position={[3, 2.4, 5]} intensity={.55} color="#e5edff" /><directionalLight position={[-4, 4, -3]} intensity={.8} color="#eff5e6" />
    <Suspense fallback={null}><Character reduced={reduced || lowPerformance} onReady={onReady} focus={focus} onSlow={() => setLowPerformance(true)} />
      <FocusEffects focus={focus} mobile={mobile} enabled={!lowPerformance && !reduced} />
    </Suspense>
  </Canvas></div>
}
