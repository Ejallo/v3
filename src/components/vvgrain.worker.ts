/// <reference lib="webworker" />
// The VV hero scene, rendered in a worker on an OffscreenCanvas so the page's
// main thread stays free (taps, scrolling, Total Blocking Time). Plain three.js
// port of VVGrainScene.tsx; keep the two visually in sync.
import * as THREE from "three"
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js"

export type InitMsg = {
  type: "init"
  canvas: OffscreenCanvas
  width: number
  height: number
  tail: number
  dpr: number
  still: boolean
}
export type InMsg =
  | InitMsg
  | { type: "resize"; width: number; height: number; tail: number }
  | { type: "pointer"; x: number; y: number }
  | { type: "visible"; visible: boolean }

const INTRO_END = 2.4 // s, last bead lands at ~2.2 s
const SETTLE = 1500 // ms of frames after the last pointer move
const SPEED = 0.63
const FLY = 1.7 * SPEED
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

const raf: (cb: () => void) => void =
  typeof self.requestAnimationFrame === "function"
    ? (cb) => self.requestAnimationFrame(cb)
    : (cb) => setTimeout(cb, 16)

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
  const g = new THREE.ExtrudeGeometry([v(-0.9), v(0.9)], {
    depth: 0.6,
    bevelEnabled: true,
    bevelSize: 0.06,
    bevelThickness: 0.06,
    bevelSegments: 4,
  })
  g.center()
  g.scale(0.86, 0.86, 0.86)
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

// Same look as drei's <Stars radius={40} depth={30} count={900} factor={2.2} saturation={0} fade />
function stars(radius = 40, depth = 30, count = 900, factor = 2.2) {
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  const size = new Float32Array(count)
  const c = new THREE.Color()
  const v = new THREE.Vector3()
  let r = radius + depth
  const inc = depth / count
  for (let i = 0; i < count; i++) {
    r -= inc * Math.random()
    v.setFromSpherical(new THREE.Spherical(r, Math.acos(1 - Math.random() * 2), Math.random() * 2 * Math.PI))
    pos.set([v.x, v.y, v.z], i * 3)
    c.setHSL(i / count, 0, 0.9)
    col.set([c.r, c.g, c.b], i * 3)
    size[i] = (0.5 + 0.5 * Math.random()) * factor
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3))
  g.setAttribute("color", new THREE.BufferAttribute(col, 3))
  g.setAttribute("size", new THREE.BufferAttribute(size, 1))
  const m = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, fade: { value: 1 } },
    vertexShader: `
      uniform float time;
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 0.5);
        gl_PointSize = size * (30.0 / -mvPosition.z) * (3.0 + sin(time + 100.0));
        gl_Position = projectionMatrix * mvPosition;
      }`,
    fragmentShader: `
      uniform float fade;
      varying vec3 vColor;
      void main() {
        float opacity = 1.0;
        if (fade == 1.0) {
          float d = distance(gl_PointCoord, vec2(0.5, 0.5));
          opacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));
        }
        gl_FragColor = vec4(vColor, opacity);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    vertexColors: true,
  })
  return { points: new THREE.Points(g, m), material: m }
}

function start(init: InitMsg) {
  // Full bead count on every device: the work runs here, off the main thread
  const { canvas, still } = init
  const BEADS = 16000
  const BEAD_RADIUS = 0.022

  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  } catch {
    self.postMessage({ type: "fail" })
    return
  }
  // Match react-three-fiber's defaults so both renderers look the same
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.setPixelRatio(init.dpr)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 1000)
  camera.position.set(0, 0, 8)

  scene.add(new THREE.AmbientLight("#8f8cff", 0.35))
  const sun = new THREE.DirectionalLight("#e8ecff", 2.2)
  sun.position.set(5, 6, 6)
  scene.add(sun)
  const pink = new THREE.PointLight("#ff5f9a", 60)
  pink.position.set(1, -2.5, -3)
  scene.add(pink)
  const blue = new THREE.PointLight("#3b7bff", 40)
  blue.position.set(6, 0, 2)
  scene.add(blue)
  const sky = stars()
  scene.add(sky.points)

  const stage = new THREE.Group()
  scene.add(stage)
  const letters = new THREE.Group()
  letters.scale.setScalar(1.25)
  stage.add(letters)

  // Letters: a dark core plus the beads
  const geometry = vvGeometry()
  const coreMat = new THREE.MeshStandardMaterial({ color: "#2c2459", roughness: 0.9, transparent: true, opacity: 0 })
  const core = new THREE.Mesh(geometry, coreMat)
  core.scale.setScalar(0.965)
  letters.add(core)
  const mesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, 8, 6),
    new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.05 }),
    BEADS
  )
  mesh.frustumCulled = false
  letters.add(mesh)

  const rockMat = new THREE.MeshStandardMaterial({ color: "#34304f", roughness: 1, flatShading: true })
  for (const r of [
    { seed: 1.3, p: [-2.4, -2.75, 0.2], s: [2.4, 0.9, 1.7], ry: 0.3 },
    { seed: 4.1, p: [1.8, -2.9, 0.5], s: [1.8, 0.8, 1.4], ry: -0.5 },
    { seed: 7.7, p: [0, -2.4, -0.5], s: [2.0, 0.75, 1.4], ry: 1.2 },
  ]) {
    const rock = new THREE.Mesh(rockGeometry(r.seed), rockMat)
    rock.position.set(r.p[0], r.p[1], r.p[2])
    rock.scale.set(r.s[0], r.s[1], r.s[2])
    rock.rotation.y = r.ry
    stage.add(rock)
  }

  // Bead data
  const sampler = new MeshSurfaceSampler(new THREE.Mesh(geometry)).build()
  const target = new Float32Array(BEADS * 3)
  const normal = new Float32Array(BEADS * 3)
  const from = new Float32Array(BEADS * 3)
  const offset = new Float32Array(BEADS * 3)
  const delay = new Float32Array(BEADS)
  const size = new Float32Array(BEADS)
  const phase = new Float32Array(BEADS)
  {
    const p = new THREE.Vector3()
    const n = new THREE.Vector3()
    const c = new THREE.Color()
    for (let i = 0; i < BEADS; i++) {
      sampler.sample(p, n)
      target.set([p.x, p.y, p.z], i * 3)
      normal.set([n.x, n.y, n.z], i * 3)
      const a = Math.random() * Math.PI * 2
      const r = 1.5 + Math.random() * 3.5
      from.set([p.x + Math.cos(a) * r, -1.6 - Math.random() * 1.0, p.z + Math.sin(a) * r], i * 3)
      delay[i] = Math.max(0, ((p.x + 1.5) / 3) * 1.3 + Math.random() * 0.5) * SPEED
      size[i] = BEAD_RADIUS * (0.7 + Math.random() * 0.7)
      phase[i] = Math.random() * Math.PI * 2
      c.setHSL(0.7 + Math.random() * 0.03, 0.42, 0.34 + Math.random() * 0.12)
      mesh.setColorAt(i, c)
    }
    mesh.instanceColor!.needsUpdate = true
  }

  // Layout (same framing rules as the React scene)
  let W = 1, H = 1, wide = true
  function layout(width: number, height: number, tail: number) {
    W = Math.max(1, width)
    H = Math.max(1, height)
    renderer.setSize(W, H, false)
    const baseH = Math.max(1, H - tail)
    const aspect = W / baseH
    const vh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
    const vw = vh * aspect
    wide = aspect > 0.9
    const scale = wide ? THREE.MathUtils.clamp(vw / 8, 0.62, 1.05) : vw / 4.9
    camera.aspect = aspect
    camera.setViewOffset(W, baseH, 0, 0, W, H)
    stage.scale.setScalar(scale)
    if (wide) stage.position.set(-vw * 0.21, 0.15, 0)
    else stage.position.set(0, vh / 2 - 2.1 * scale, 0)
  }
  layout(init.width, init.height, init.tail)

  const pointer = { x: 0, y: 0, active: false }
  const ray = new THREE.Raycaster()
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
  const hit = new THREE.Vector3()
  const ndc = new THREE.Vector2()

  const t0 = performance.now()
  let last = t0
  let wakeUntil = 0
  let visible = true
  let running = false

  function frame() {
    const now = performance.now()
    const dt = Math.min((now - last) / 1000, 1 / 30)
    last = now
    const t = still ? 99 : (now - t0) / 1000

    stage.rotation.y = THREE.MathUtils.damp(stage.rotation.y, (wide ? 0.32 : 0.18) + pointer.x * 0.18, 3, dt)
    stage.rotation.x = THREE.MathUtils.damp(stage.rotation.x, pointer.y * 0.08, 3, dt)
    scene.updateMatrixWorld()

    let hasHit = false
    if (pointer.active && !still) {
      ndc.set(pointer.x, -pointer.y)
      ray.setFromCamera(ndc, camera)
      if (ray.ray.intersectPlane(plane, hit)) {
        letters.worldToLocal(hit)
        hasHit = true
      }
    }
    const R = 0.75
    const k = 1 - Math.exp(-7 * dt)
    const m = mesh.instanceMatrix.array as Float32Array
    for (let i = 0; i < BEADS; i++) {
      const j = i * 3
      const p = easeOut(THREE.MathUtils.clamp((t - delay[i]) / FLY, 0, 1))
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
      m[o + 12] = from[j] + (target[j] - from[j]) * p + normal[j] * breathe + offset[j]
      m[o + 13] = from[j + 1] + (target[j + 1] - from[j + 1]) * p + normal[j + 1] * breathe + offset[j + 1]
      m[o + 14] = from[j + 2] + (target[j + 2] - from[j + 2]) * p + normal[j + 2] * breathe + offset[j + 2]
    }
    mesh.instanceMatrix.needsUpdate = true
    coreMat.opacity = THREE.MathUtils.clamp((t - 1.6 * SPEED) / (1.2 * SPEED), 0, 1)
    sky.material.uniforms.time.value = still ? 0 : t * 0.4

    renderer.render(scene, camera)

    // Keep going through the intro and while the cursor moves; otherwise idle
    const intro = !still && t < INTRO_END
    if (visible && (intro || now < wakeUntil)) raf(frame)
    else running = false
  }
  function wake() {
    if (running) return
    running = true
    last = performance.now()
    raf(frame)
  }

  self.onmessage = (e: MessageEvent<InMsg>) => {
    const msg = e.data
    if (msg.type === "pointer") {
      pointer.x = msg.x
      pointer.y = msg.y
      pointer.active = true
      if (still) return
      wakeUntil = performance.now() + SETTLE
      wake()
    } else if (msg.type === "resize") {
      layout(msg.width, msg.height, msg.tail)
      wake()
    } else if (msg.type === "visible") {
      visible = msg.visible
      if (visible) wake()
    }
  }
  wake()
  self.postMessage({ type: "ready" })
}

self.onmessage = (e: MessageEvent<InMsg>) => {
  if (e.data.type === "init") start(e.data)
}
