import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  Environment,
  Float,
  Lightformer,
  MeshDistortMaterial,
  MeshTransmissionMaterial,
} from "@react-three/drei"
import * as THREE from "three"

export type Variant = "glass" | "pearl" | "chrome"

// Draft 3D heroes: one object, one material, studio lighting built from
// Lightformers (no HDR downloads, so no third-party requests).

const pointer = { x: 0, y: 0 }

function usePointer() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [])
}

/** Places the object right of the copy on wide screens, above it on phones, and tilts it toward the cursor. */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null!)
  const { width, height, aspect } = useThree((s) => s.viewport)
  const wide = aspect > 0.9
  const scale = wide ? THREE.MathUtils.clamp(width / 7.5, 0.6, 1) : 0.5
  useFrame((_, dt) => {
    const g = group.current
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.x * 0.45, 3, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, pointer.y * 0.25, 3, dt)
  })
  return (
    <group
      ref={group}
      position={wide ? [width * 0.26, 0, 0] : [0, height * 0.24, 0]}
      scale={scale}
    >
      {children}
    </group>
  )
}

function Studio({ warm, cool }: { warm: string; cool: string }) {
  return (
    <Environment resolution={256}>
      <Lightformer form="rect" intensity={5} position={[0, 6, -2]} scale={[12, 3, 1]} />
      <Lightformer form="rect" intensity={3} color={warm} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
      <Lightformer form="rect" intensity={3} color={cool} position={[6, -1, 2]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} />
      <Lightformer form="ring" intensity={2} position={[0, -4, 4]} scale={4} />
      {/* Large front softbox: without it mirror-like materials reflect a black room */}
      <Lightformer form="rect" intensity={1.6} position={[0, 0, 8]} scale={[14, 8, 1]} />
      <Lightformer form="rect" intensity={2.5} color={warm} position={[-3, -5, 0]} rotation-x={Math.PI / 2} scale={[8, 4, 1]} />
    </Environment>
  )
}

function Glass() {
  const knot = useRef<THREE.Mesh>(null!)
  useFrame((_, dt) => {
    knot.current.rotation.x += dt * 0.12
    knot.current.rotation.z += dt * 0.08
  })
  return (
    <>
      {/* Soft colour sources behind the glass, so it has something to refract */}
      <mesh position={[0.5, 0.4, -2]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial color="#6f7cff" />
      </mesh>
      <mesh position={[-0.5, -0.5, -2]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial color="#f0a57e" />
      </mesh>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh ref={knot}>
          <torusKnotGeometry args={[1.05, 0.38, 220, 36]} />
          <MeshTransmissionMaterial
            backside
            samples={6}
            resolution={512}
            transmission={1}
            thickness={0.7}
            roughness={0.04}
            ior={1.32}
            chromaticAberration={0.4}
            anisotropy={0.2}
            distortion={0.25}
            distortionScale={0.4}
            temporalDistortion={0.08}
            color="#e7eaff"
          />
        </mesh>
      </Float>
    </>
  )
}

function Pearl() {
  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.9}>
      <mesh>
        <sphereGeometry args={[1.55, 160, 160]} />
        <MeshDistortMaterial
          distort={0.42}
          speed={1.5}
          color="#efeaff"
          roughness={0.12}
          metalness={0.25}
          clearcoat={1}
          clearcoatRoughness={0.1}
          iridescence={1}
          iridescenceIOR={1.7}
          iridescenceThicknessRange={[120, 780]}
        />
      </mesh>
    </Float>
  )
}

function Chrome() {
  const mark = useRef<THREE.Mesh>(null!)
  const geometry = useMemo(() => {
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
      depth: 0.5,
      bevelEnabled: true,
      bevelSize: 0.07,
      bevelThickness: 0.07,
      bevelSegments: 8,
      curveSegments: 4,
    })
    g.center()
    return g
  }, [])
  useFrame((state) => {
    mark.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.55
  })
  return (
    <Float speed={1} rotationIntensity={0.15} floatIntensity={0.6}>
      <mesh ref={mark} geometry={geometry} scale={1.15}>
        <meshStandardMaterial color="#f2f2f6" metalness={1} roughness={0.16} />
      </mesh>
    </Float>
  )
}

const STUDIO: Record<Variant, { warm: string; cool: string }> = {
  glass: { warm: "#f0a57e", cool: "#7d8bff" },
  pearl: { warm: "#ffd9c2", cool: "#c9d2ff" },
  chrome: { warm: "#f2b27e", cool: "#5f72e8" },
}

export function Scene3D({ variant }: { variant: Variant }) {
  usePointer()
  const still =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={still ? "demand" : "always"}
      camera={{ position: [0, 0, 7], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} />
      <Studio {...STUDIO[variant]} />
      <Rig>
        {variant === "glass" && <Glass />}
        {variant === "pearl" && <Pearl />}
        {variant === "chrome" && <Chrome />}
      </Rig>
    </Canvas>
  )
}
