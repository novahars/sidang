import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { OrbitControls } from '@react-three/drei'

export function ThirdPersonCamera({ target, viewMode = 'third' }) {
    const cameraRef = useRef()
    const orbitControlsRef = useRef()

    const offsets = {
        third: new Vector3(0, 3, 8),
        aerial: new Vector3(0, 50, 50),
        orbit: new Vector3(0, 10, 150)
    }

    useFrame((state) => {
        if (!target.current) return

        // Skip camera updates when in orbit mode
        if (viewMode === 'orbit') {
            if (orbitControlsRef.current) {
                orbitControlsRef.current.target.copy(target.current.position)
            }
            return
        }

        const currentOffset = offsets[viewMode].clone()
        const targetPosition = target.current.position.clone()
        const cameraPosition = targetPosition.clone().add(currentOffset)

        // Smoother camera movement for non-orbit modes
        state.camera.position.lerp(cameraPosition, 0.1)
        state.camera.lookAt(targetPosition)
    })

    return (
        viewMode === 'orbit' ? (
            <OrbitControls
                ref={orbitControlsRef}
                maxPolarAngle={Math.PI / 2}
                minDistance={5}
                maxDistance={50}
            />
        ) : null
    )
}