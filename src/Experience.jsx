import { KeyboardControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { CharacterController } from './components/CharacterController'
import { ThirdPersonCamera } from './components/ThirdPersonCamera'
import { Map } from './components/Map'
import { Man } from './models/components/Man'  // Make sure this matches the export

export function Experience() {
  const characterRef = useRef()
  const [viewMode, setViewMode] = useState('third')

  return (
    <>
      {/* Camera Controls UI */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        gap: '10px'
      }}>
        <button
          onClick={() => setViewMode('third')}
          style={{
            padding: '8px 16px',
            background: viewMode === 'third' ? '#4CAF50' : '#fff',
            border: '2px solid #4CAF50',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Third Person
        </button>
        <button
          onClick={() => setViewMode('aerial')}
          style={{
            padding: '8px 16px',
            background: viewMode === 'aerial' ? '#4CAF50' : '#fff',
            border: '2px solid #4CAF50',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Aerial View
        </button>
        <button
          onClick={() => setViewMode('orbit')}
          style={{
            padding: '8px 16px',
            background: viewMode === 'orbit' ? '#4CAF50' : '#fff',
            border: '2px solid #4CAF50',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Orbit View
        </button>
      </div>
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
          { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
          { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
          { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
          { name: 'shift', keys: ['ShiftLeft', 'ShiftRight'] },
          { name: 'space', keys: ['Space'] }
        ]}
      >
        <Canvas shadows camera={{ fov: 45, position: [0, 2, 8] }}>
          <ThirdPersonCamera target={characterRef} viewMode={viewMode} />
          <CharacterController ref={characterRef}>
            <Man position={[0, 1, 0]} scale={0.01} /> {/* Adjusted position and scale */}
          </CharacterController>
          <Map />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        </Canvas>
      </KeyboardControls>
    </>
  )
}