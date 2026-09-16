import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { shaders } from '../../runtime/renderer/webgl/shaders'

export function GridPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { size } = useThree()

  const uniforms = useMemo(
    () => ({
      iResolution: { value: new THREE.Vector2(size.width, size.height) },
      uColumns: { value: 12 },
      uRows: { value: 12 },
    }),
    [],
  )

  useFrame(() => {
    const material = materialRef.current
    if (!material) return
    material.uniforms.iResolution.value.set(size.width, size.height)
  })

  return (
    <mesh renderOrder={1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={shaders.fullscreenVert}
        fragmentShader={shaders.gridFrag}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}
