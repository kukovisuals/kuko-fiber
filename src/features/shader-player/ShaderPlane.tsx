import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { shaders } from '../../runtime/renderer/webgl/shaders'

export function ShaderPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { size } = useThree()

  const uniforms = useMemo(
    () => ({
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [],
  )

  useFrame((state) => {
    const material = materialRef.current
    if (!material) return
    material.uniforms.iTime.value = state.clock.elapsedTime
    material.uniforms.iResolution.value.set(size.width, size.height)
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={shaders.fullscreenVert}
        fragmentShader={shaders.flowFrag}
      />
    </mesh>
  )
}
