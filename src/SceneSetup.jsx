/* eslint-disable react/no-unknown-property */
import { CameraControls, Environment, PerspectiveCamera } from '@react-three/drei'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function SceneSetup() {
  const autoRotate = useRef()

  useFrame((delta, state) => {
    console.log(delta)
    console.log(autoRotate.current)
  })

  return (
    <>
      <PerspectiveCamera makeDefault fov={75} position={[40, 40, 40]} />

      <CameraControls
        ref={autoRotate}
        makeDefault
        truckSpeed={0}
        azimuthRotateSpeed={0.2}
        polarRotateSpeed={0.2}
        minDistance={10}
        maxDistance={150}
      />

      {/* Sumber cahaya utama */}
      <directionalLight intensity={3} position={[200, -100, -100]} castShadow />
      <directionalLight intensity={1} position={[100, 150, -250]} castShadow />

      {/* Cahaya tambahan: Ambient light */}
      <ambientLight intensity={0.25} />

      {/* Cahaya tambahan: Point light */}
      <pointLight intensity={5} position={[50, 50, 50]} />

      {/* Cahaya tambahan: Spot light */}
      <spotLight
        intensity={3}
        position={[0, 100, 100]}
        angle={Math.PI / 6}
        penumbra={1}
        castShadow
      />

    </>
  )
}