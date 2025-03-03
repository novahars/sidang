import { forwardRef, useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'

// Constants
const DIRECTIONS = ['w', 'a', 's', 'd']
const W = 'w'
const A = 'a'
const S = 's'
const D = 'd'

export const CharacterController = forwardRef(({ children }, ref) => {
    const characterRef = ref || useRef()
    const [, getKeys] = useKeyboardControls()
    const { camera } = useThree()
    const [currentAction, setCurrentAction] = useState('idle')
    const [toggleRun, setToggleRun] = useState(true)

    // Constants
    const fadeDuration = 0.2
    const runVelocity = 5
    const walkVelocity = 2

    // Vectors and quaternions
    const walkDirection = useRef(new THREE.Vector3())
    const rotateAngle = useRef(new THREE.Vector3(0, 1, 0))
    const rotateQuaternion = useRef(new THREE.Quaternion())
    const cameraTarget = useRef(new THREE.Vector3())

    const updateCameraTarget = (moveX, moveZ) => {
        // move camera
        camera.position.x += moveX
        camera.position.z += moveZ

        // update camera target
        cameraTarget.current.x = characterRef.current.position.x
        cameraTarget.current.y = characterRef.current.position.y + 1
        cameraTarget.current.z = characterRef.current.position.z
    }

    const directionOffset = (keysPressed) => {
        let directionOffset = 0 // w

        if (keysPressed[W]) {
            if (keysPressed[A]) {
                directionOffset = Math.PI / 4 // w+a
            } else if (keysPressed[D]) {
                directionOffset = - Math.PI / 4 // w+d
            }
        } else if (keysPressed[S]) {
            if (keysPressed[A]) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
            } else if (keysPressed[D]) {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d
            } else {
                directionOffset = Math.PI // s
            }
        } else if (keysPressed[A]) {
            directionOffset = Math.PI / 2 // a
        } else if (keysPressed[D]) {
            directionOffset = - Math.PI / 2 // d
        }

        return directionOffset
    }

    useFrame((state, delta) => {
        const keys = getKeys()
        if (!characterRef.current) return

        const directionPressed = DIRECTIONS.some(key => keys[key] === true)

        // Determine animation
        let play = 'idle'
        if (directionPressed && toggleRun) {
            play = 'run'
        } else if (directionPressed) {
            play = 'walk'
        }

        // Update current action
        if (currentAction !== play) {
            setCurrentAction(play)
        }

        if (currentAction === 'run' || currentAction === 'walk') {
            // Calculate towards camera direction
            const angleYCameraDirection = Math.atan2(
                (camera.position.x - characterRef.current.position.x),
                (camera.position.z - characterRef.current.position.z)
            )

            // Diagonal movement angle offset
            const offset = directionOffset(keys)

            // Rotate model
            rotateQuaternion.current.setFromAxisAngle(rotateAngle.current, angleYCameraDirection + offset)
            characterRef.current.quaternion.rotateTowards(rotateQuaternion.current, 0.2)

            // Calculate direction
            camera.getWorldDirection(walkDirection.current)
            walkDirection.current.y = 0
            walkDirection.current.normalize()
            walkDirection.current.applyAxisAngle(rotateAngle.current, offset)

            // Run/walk velocity
            const velocity = currentAction === 'run' ? runVelocity : walkVelocity

            // Move model & camera
            const moveX = walkDirection.current.x * velocity * delta
            const moveZ = walkDirection.current.z * velocity * delta
            characterRef.current.position.x += moveX
            characterRef.current.position.z += moveZ
            updateCameraTarget(moveX, moveZ)
        }
    })

    // Handle run toggle
    useEffect(() => {
        const handleShiftKey = (event) => {
            if (event.key === 'Shift') {
                setToggleRun(event.type === 'keydown')
            }
        }

        window.addEventListener('keydown', handleShiftKey)
        window.addEventListener('keyup', handleShiftKey)

        return () => {
            window.removeEventListener('keydown', handleShiftKey)
            window.removeEventListener('keyup', handleShiftKey)
        }
    }, [])

    return <group ref={characterRef}>{children}</group>
})