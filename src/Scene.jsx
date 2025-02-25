import { KeyboardControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'
import { CharacterController } from './CharacterController'
import { ThirdPersonCamera } from './ThirdPersonCamera'


export function Scene() {
    const characterRef = useRef()

    return (
        <KeyboardControls
            map={[
                { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
                { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
                { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
                { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
            ]}
        >
            <Canvas>
                <CharacterController ref={characterRef}>
                    {/* Your character model goes here */}
                    <mesh>
                        <boxGeometry />
                        <meshStandardMaterial color="blue" />
                    </mesh>
                </CharacterController>

                <ThirdPersonCamera target={characterRef} />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />

                {/* Ground */}
                <mesh rotation-x={-Math.PI / 2} position-y={-0.5}>
                    <planeGeometry args={[50, 50]} />
                    <meshStandardMaterial color="green" />
                </mesh>
            </Canvas>
        </KeyboardControls>
    )
}