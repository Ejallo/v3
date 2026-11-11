import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Stars } from "@react-three/drei"
import * as THREE from "three"
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js"

// Draft hero: the VV monogram built from thousands of small beads that rise
// from the ground, settle on the letters, breathe, and scatter under the cursor.
// Everything is generated in code: no models or textures to download.

const BEADS = 16000
const BEAD_RADIUS = 0.022
const pointer = { x: 0, y: 0, active: false }

function vvGeometry() {
  const v = (dx: number) => {
    const s = new THREE.Shape()
    const pts: [number, number][] = [
      [-0.78, 1], [-0.36, 1], [0, -0.32], [0.36, 1], [0.78, 1], [0.22, -1], [-0.22, -1],
    ]
    pts.forEach(([x, y], i) => (i ? s.lineTo(x + dx, y) : s.moveTo(x + dx, y)))
    s.closePath()
    return s
  }
  const g = new THREE.ExtrudeGeometry([v(-0.72), v(0.72)], {
    depth: 0.6,
    bevelEnabled: true,
    bevelSize: 0.06,
    bevelThickness: 0.06,
    bevelSegments: 4,
  })
  g.center()
  return g
}

function rockGeometry(seed: number) {
  const g = new THREE.IcosahedronGeometry(1, 5)
  const p = g.attributes.position
  const n = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) {
    n.fromBufferAttribute(p, i).normalize()
    const r =
      1 +
      0.22 * Math.sin(n.x * 3.1 + seed) * Math.sin(n.y * 4.3 + seed * 2) +
      0.12 * Math.sin(n.z * 7.7 + seed * 3) +
      0.06 * Math.sin((n.x + n.y) * 13 + seed)
    p.setXYZ(i, n.x * r, n.y * r, n.z * r)
  }
  g.computeVertexNormals()
  return g
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

function Beads({ still }: { still: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const core = useRef<THREE.MeshStandardMaterial>(null!)
  const geometry = useMemo(vvGeometry, [])

  const data = useMemo(() => {
    const sampler = new MeshSurfaceSampler(new THREE.Mesh(geometry)).build()
    const target = new Float32Array(BEADS * 3)
    const normal = new Float32Array(BEADS * 3)
    const start = new Float32Array(BEADS * 3)
    const offset = new Float32Array(BEADS * 3)
    const delay = new Float32Array(BEADS)
    const size = new Float32Array(BEADS)
    const phase = new Float32Array(BEADS)
    const p = new THREE.Vector3()
    const n = new THREE.Vector3()
    for (let i = 0; i < BEADS; i++) {
      sampler.sample(p, n)
      target.set([p.x, p.y, p.z], i * 3)
      normal.set([n.x, n.y, n.z], i * 3)
      // Start as dust scattered low around the letters
      const a = Math.random() * Math.PI * 2
      const r = 1.5 + Math.random() * 3.5
      start.set([p.x + Math.cos(a) * r, -2.2 - Math.random() * 1.5, p.z + Math.sin(a) * r], i * 3)
      delay[i] = ((p.x + 1.5) / 3) * 1.3 + Math.random() * 0.5
      size[i] = BEAD_RADIUS * (0.7 + Math.random() * 0.7)
      phase[i] = Math.random() * Math.PI * 2
    }
    return { target, normal, start, offset, delay, size, phase }
  }, [geometry])

  useEffect(() => {
    const c = new THREE.Color()
    for (let i = 0; i < BEADS; i++) {
      c.setHSL(0.7 + Math.random() * 0.03, 0.42, 0.34 + Math.random() * 0.12)
      mesh.current.setColorAt(i, c)
    }
    mesh.current.instanceColor!.needsUpdate = true
  }, [])

  const ray = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const hit = useMemo(() => new THREE.Vector3(), [])
  const ndc = useMemo(() => new THREE.Vector2(), [])

  useFrame((state, dt) => {
    const t = still ? 99 : state.clock.elapsedTime
    const { target, normal, start, offset, delay, size, phase } = data
    const m = mesh.current.instanceMatrix.array as Float32Array

    // Cursor position in the letters' local space
    let hasHit = false
    if (pointer.active && !still) {
      ndc.set(pointer.x, -pointer.y)
      ray.setFromCamera(ndc, state.camera)
      if (ray.ray.intersectPlane(plane, hit)) {
        mesh.current.parent!.worldToLocal(hit)
        hasHit = true
      }
    }
    const R = 0.75
    const k = 1 - Math.exp(-7 * dt)

    for (let i = 0; i < BEADS; i++) {
      const j = i * 3
      const p = easeOut(THREE.MathUtils.clamp((t - delay[i]) / 1.7, 0, 1))
      const breathe = p === 1 && !still ? Math.sin(t * 1.4 + phase[i]) * 0.012 : 0

      let ox = 0, oy = 0, oz = 0
      if (hasHit && p === 1) {
        const dx = target[j] - hit.x
        const dy = target[j + 1] - hit.y
        const d = Math.hypot(dx, dy)
        if (d < R) {
          const f = (1 - d / R) ** 2 * 0.45
          ox = (dx / (d + 0.001)) * f + normal[j] * f * 0.6
          oy = (dy / (d + 0.001)) * f + normal[j + 1] * f * 0.6
          oz = normal[j + 2] * f * 0.6 + f * 0.5
        }
      }
      offset[j] += (ox - offset[j]) * k
      offset[j + 1] += (oy - offset[j + 1]) * k
      offset[j + 2] += (oz - offset[j + 2]) * k

      const s = size[i] * (0.2 + 0.8 * p)
      const o = i * 16
      m[o] = s; m[o + 5] = s; m[o + 10] = s; m[o + 15] = 1
      m[o + 12] = start[j] + (target[j] - start[j]) * p + normal[j] * breathe + offset[j]
      m[o + 13] = start[j + 1] + (target[j + 1] - start[j + 1]) * p + normal[j + 1] * breathe + offset[j + 1]
      m[o + 14] = start[j + 2] + (target[j + 2] - start[j + 2]) * p + normal[j + 2] * breathe + offset[j + 2]
    }
    mesh.current.instanceMatrix.needsUpdate = true
    core.current.opacity = THREE.MathUtils.clamp((t - 1.6) / 1.2, 0, 1)
  })

  return (
    <>
      {/* Dark core so gaps between beads never show the sky through the letters */}
      <mesh geometry={geometry} scale={0.965}>
        <meshStandardMaterial ref={core} color="#2c2459" roughness={0.9} transparent opacity={0} />
      </mesh>
      <instancedMesh ref={mesh} args={[undefined, undefined, BEADS]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial roughness={0.5} metalness={0.05} />
      </instancedMesh>
    </>
  )
}

function Rocks() {
  const rocks = useMemo(
    () => [
      { g: rockGeometry(1.3), p: [-2.4, -2.75, 0.2], s: [2.4, 0.9, 1.7], r: 0.3 },
      { g: rockGeometry(4.1), p: [1.8, -2.9, 0.5], s: [1.8, 0.8, 1.4], r: -0.5 },
      { g: rockGeometry(7.7), p: [0, -2.4, -0.5], s: [2.0, 0.75, 1.4], r: 1.2 },
    ] as const,
    []
  )
  return (
    <>
      {rocks.map((rock, i) => (
        <mesh key={i} geometry={rock.g} position={rock.p as any} scale={rock.s as any} rotation-y={rock.r}>
          <meshStandardMaterial color="#34304f" roughness={1} flatShading />
        </mesh>
      ))}
    </>
  )
}

function Stage({ still }: { still: boolean }) {
  const group = useRef<THREE.Group>(null!)
  const { width, height, aspect } = useThree((s) => s.viewport)
  const wide = aspect > 0.9
  // On phones the canvas is taller than the screen, so size by width and pin the letters to the top
  const scale = wide ? THREE.MathUtils.clamp(width / 8, 0.62, 1.05) : width / 4.9
  useFrame((_, dt) => {
    const g = group.current
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, (wide ? 0.32 : 0.18) + pointer.x * 0.18, 3, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, pointer.y * 0.08, 3, dt)
  })
  return (
    <group
      ref={group}
      position={wide ? [-width * 0.21, 0.15, 0] : [0, height / 2 - 2.1 * scale, 0]}
      scale={scale}
    >
      <group scale={1.25}>
        <Beads still={still} />
      </group>
      {wide && <Rocks />}
    </group>
  )
}

export function VVGrain() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
      pointer.active = true
    }
    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [])
  const still =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={still ? "demand" : "always"}
      camera={{ position: [0, 0, 8], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.35} color="#8f8cff" />
      <directionalLight position={[5, 6, 6]} intensity={2.2} color="#e8ecff" />
      <pointLight position={[1, -2.5, -3]} intensity={60} color="#ff5f9a" />
      <pointLight position={[6, 0, 2]} intensity={40} color="#3b7bff" />
      <Stars radius={40} depth={30} count={900} factor={2.2} saturation={0} fade speed={still ? 0 : 0.4} />
      <Stage still={still} />
    </Canvas>
  )
}
