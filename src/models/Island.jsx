import React, { useRef, useEffect, useState } from "react";
import { useGLTF, Float, OrbitControls } from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";
import { useThree } from "@react-three/fiber";
import islandScene from "../assets/YANGINI.glb";

import {
  Storeblue,
  Office,
  CircleK,
  Store,
  Road,
  Man,
} from "./components/index";

export function Island({ loadingComplete, ...props }) {
  const [isMobile, setIsMobile] = useState(false);
  const group = useRef();
  const controls = useRef();
  const { camera } = useThree();

  // Load GLTF model
  const { nodes, materials, animations } = useGLTF(islandScene);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [start, setStart] = useState(false);

  // Animation spring
  const { positionY, rotation } = useSpring({
    positionY: isMobile ? (start ? -7 : 120) : (start ? 0 : 120),
    rotation: start ? [0, 0, 0] : [0, Math.PI / 8, 0],
    config: { tension: 20, friction: 20 },
    onRest: () => setStart(true),
  });

  // Start animation when loading completes
  useEffect(() => {
    if (loadingComplete) {
      setTimeout(() => setStart(true), 500);
    }
  }, [loadingComplete]);

  // Safeguard against early rendering
  if (!loadingComplete || !nodes || !materials) {
    return null;
  }

  return (
    <animated.group
      ref={group}
      {...props}
      dispose={null}
      position-y={positionY}
      rotation={rotation}
    >
      <OrbitControls
        ref={controls}
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={0}
      />
      <Float speed={0} rotationIntensity={0} floatIntensity={0}>
        <Storeblue nodes={nodes} materials={materials} />
        <CircleK nodes={nodes} materials={materials} />
        <Store nodes={nodes} materials={materials} />
        <Office nodes={nodes} materials={materials} />
        <Road nodes={nodes} materials={materials} />
        <Man
          nodes={nodes}
          materials={materials}
          animations={animations} // Add this line
          camera={{
            instance: camera,
            controls: controls.current
          }}
        />
      </Float>
    </animated.group>
  );
}

// Pre-load the model
useGLTF.preload(islandScene);

export default Island;