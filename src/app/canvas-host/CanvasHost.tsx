import type { ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import './canvas-host.css'

export function CanvasHost({ children }: { children: ReactNode }) {
  return (
    <section className="canvas-host">
      <Canvas orthographic gl={{ antialias: false }}>
        {children}
      </Canvas>
    </section>
  )
}
