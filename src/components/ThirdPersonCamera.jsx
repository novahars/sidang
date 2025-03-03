import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3, Quaternion } from 'three'
import { OrbitControls } from '@react-three/drei'

export function ThirdPersonCamera({ target, viewMode = 'third' }) {
    const orbitControlsRef = useRef()
    const cameraPositionRef = useRef(new Vector3())
    const cameraTargetRef = useRef(new Vector3())

    // Offset kamera untuk berbagai mode
    const offsets = {
        third: new Vector3(0, 6, 6.5),
        aerial: new Vector3(0, 15, 15),
        orbit: new Vector3(0, 5, 10),
    }

    useFrame((state, delta) => {
        if (!target.current) return

        if (viewMode === 'orbit') {
            if (orbitControlsRef.current) {
                orbitControlsRef.current.target.copy(target.current.position)
            }
            return
        }

        // Ambil posisi dan skala karakter
        const targetPosition = target.current.position
        const targetScale = target.current.scale.length() // Ambil rata-rata skala karakter
        const targetRotation = target.current.rotation.y

        // Gunakan quaternion untuk menangkap rotasi global karakter
        const quaternion = new Quaternion()
        target.current.getWorldQuaternion(quaternion)

        // Hitung offset kamera yang sudah dikalikan dengan skala karakter
        const scaledOffset = offsets[viewMode].clone().multiplyScalar(targetScale)
        scaledOffset.applyQuaternion(quaternion) // Terapkan rotasi karakter ke kamera

        // Tentukan posisi kamera yang diinginkan
        const desiredPosition = new Vector3(
            targetPosition.x + scaledOffset.x,
            targetPosition.y + scaledOffset.y,
            targetPosition.z + scaledOffset.z
        )

        // Lerp agar kamera bergerak lebih smooth
        const lerpFactor = Math.min(0.1 * targetScale, 0.2) // Lerp dinamis berdasarkan skala
        cameraPositionRef.current.lerp(desiredPosition, lerpFactor)
        state.camera.position.copy(cameraPositionRef.current)

        // Kamera harus melihat ke arah karakter (dengan sedikit di atas kepala)
        const lookAtPosition = new Vector3(
            targetPosition.x,
            targetPosition.y + 1 * targetScale, // Tinggi pandangan mengikuti skala karakter
            targetPosition.z
        )
        cameraTargetRef.current.lerp(lookAtPosition, lerpFactor)
        state.camera.lookAt(cameraTargetRef.current)

        // Sedikit miringkan kamera untuk mode third-person
        if (viewMode === 'third') {
            state.camera.rotation.x = -0.2
        }
    })

    return viewMode === 'orbit' ? (
        <OrbitControls
            ref={orbitControlsRef}
            maxPolarAngle={Math.PI / 2}
            minDistance={5}
            maxDistance={15}
        />
    ) : null
}
