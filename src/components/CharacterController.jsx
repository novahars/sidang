import { forwardRef, useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'

export const CharacterController = forwardRef(({ children }, ref) => {
    const characterRef = ref || useRef()
    const [, getKeys] = useKeyboardControls()
    const { camera } = useThree()
    const [mouseDown, setMouseDown] = useState(false)
    const [rotation, setRotation] = useState(0)
    const moveDirection = useRef(new THREE.Vector3())

    // Mouse controls
    useEffect(() => {
        const handleMouseDown = () => setMouseDown(true)
        const handleMouseUp = () => setMouseDown(false)
        const handleMouseMove = (e) => {
            if (mouseDown) {
                setRotation(prev => prev - e.movementX * 0.01)
            }
        }

        document.addEventListener('mousedown', handleMouseDown)
        document.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('mousemove', handleMouseMove)

        return () => {
            document.removeEventListener('mousedown', handleMouseDown)
            document.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    useFrame((state, delta) => {
        const { forward, backward, left, right } = getKeys()
        const moveSpeed = 5

        if (!characterRef.current) return

        // Reset movement direction
        moveDirection.current.set(0, 0, 0)

        // Calculate movement direction based on key input and rotation
        if (forward) moveDirection.current.z -= 1
        if (backward) moveDirection.current.z += 1
        if (left) moveDirection.current.x -= 1
        if (right) moveDirection.current.x += 1

        // Normalize and apply movement
        if (moveDirection.current.length() > 0) {
            moveDirection.current.normalize()

            // Apply character's rotation to movement
            moveDirection.current.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation)

            // Move character
            characterRef.current.position.add(
                moveDirection.current.multiplyScalar(moveSpeed * delta)
            )
        }

        // Apply rotation to character
        characterRef.current.rotation.y = rotation
    })

    return <group ref={characterRef}>{children}</group>
})