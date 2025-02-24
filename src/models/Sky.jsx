import React, { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import * as THREE from 'three'

export default function Sky() {
  const { scene } = useThree()
  const skyRef = useRef()

  useEffect(() => {
    // Loader HDR
    const loader = new RGBELoader()
    const textureURL = '../assets/00.hdr' 

    loader.load(textureURL, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping 
      scene.environment = texture 

      const skyMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
      })
      const skySphere = new THREE.Mesh(new THREE.SphereGeometry(500, 60, 40), skyMaterial)
      skySphere.rotation.y = 0 
      skyRef.current = skySphere
      scene.add(skySphere)
    })

    return () => {
      if (skyRef.current) {
        scene.remove(skyRef.current)
        skyRef.current.geometry.dispose()
        skyRef.current.material.dispose()
      }
    }
  }, [scene])

  useFrame((state, delta) => {
    if (skyRef.current) {
      skyRef.current.rotation.y += delta * 0.02 
      if (skyRef.current.rotation.y > Math.PI * 2) {
        skyRef.current.rotation.y -= Math.PI * 2 
      }
    }
  })

  return null
}
