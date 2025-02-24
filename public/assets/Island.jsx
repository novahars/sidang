import React, { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations, Float } from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";
import islandScene from "../assets/island_v5.glb";
import Tree from "./components/Tree";
import Bridge from "./components/Bridge";

/* Main Island Start */
import {
  Monas,
  Billboard,
  Windmill,
  MainIsland,
  InformationBoard,
  Candy,
  Acqua,
  FerrisWheel,
  Vespa,
  Stage,
  Stone1,
  Cloud,
  StreetMiddle,
} from "./components/MainIsland/Index";
/* Main Island End */

/* Rocket Island Start */
import { Planet, Rocket, RocketIslands } from "./components/RocketIsland/index";
/* Rocket Island End */

/* Gate Island Start */
import { WelcomeGate, FirstIsland, Spawn, Helicopter } from "./components/GateIsland/Index";
/* Gate Island End */

/* Mount Island Start */
import {
  Castle,
  Mount,
  MountIsland,
  MountTree,
} from "./components/Mountisland/index";
/* Mount Island End */

/* Festival Island Start */
import { Tent, TentIsland, Wagon } from "./components/FestivalIsland/Index";
/* Festival Island End */

export function Island({ loadingComplete, ...props }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const group = useRef();
  const { nodes, materials, animations } = useGLTF(islandScene);
  const { actions } = useAnimations(animations, group);
  const [start, setStart] = useState(false);

  const { positionY, rotation } = useSpring({
    positionY: isMobile ? (start ? -7 : 120) : (start ? 0 : 120),
    rotation: start ? [0, 0, 0] : [0, Math.PI / 8, 0], // Rotasi sedikit ke kanan
    config: { tension: 20, friction: 20 },
    onRest: () => setStart(true), // Setelah selesai, objek kembali normal
  });

  useEffect(() => {
    // Add safety checks for actions
    if (actions && typeof actions === 'object') {
      Object.keys(actions).forEach((key) => {
        // Log before playing animation
        console.log(`Attempting to play animation: ${key}`);

        if (actions[key] && typeof actions[key].play === 'function') {
          actions[key].play();
          console.log(`Successfully playing animation: ${key}`);

          // Log animation details
          const animationClip = actions[key]._clip;
          console.log(`Animation ${key} details:`, {
            duration: animationClip.duration,
            tracks: animationClip.tracks.length
          });
        }
      });
    }

    if (loadingComplete) {
      setTimeout(() => setStart(true), 500);
    }
  }, [actions, loadingComplete]);



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
      <Float speed={0} rotationIntensity={0} floatIntensity={0}>
        <Tree nodes={nodes} materials={materials} />
        <Bridge nodes={nodes} materials={materials} />

        {/* Main Island Start */}
        <Monas
          nodes={nodes}
          materials={materials}
          loadingComplete={loadingComplete}
        />
        <Billboard
          nodes={nodes}
          materials={materials}
          loadingComplete={loadingComplete}
        />
        <Windmill nodes={nodes} materials={materials} />
        <MainIsland nodes={nodes} materials={materials} />
        <InformationBoard
          nodes={nodes}
          materials={materials}
          loadingComplete={loadingComplete}
        />
        <Candy
          nodes={nodes}
          materials={materials}
          loadingComplete={loadingComplete}
        />
        <Acqua nodes={nodes} materials={materials} />
        <FerrisWheel
          nodes={nodes}
          materials={materials}
          loadingComplete={loadingComplete}
        />
        <Stage
          nodes={nodes}
          materials={materials}
          loadingComplete={loadingComplete}
        />
        <Stone1 nodes={nodes} materials={materials} />
        <StreetMiddle nodes={nodes} materials={materials} />
        <Vespa nodes={nodes} materials={materials} />
        <Cloud nodes={nodes} materials={materials} />
        {/* Main Island End */}

        {/* Mount Island Start */}
        <Mount nodes={nodes} materials={materials} />
        <MountIsland nodes={nodes} materials={materials} />
        <MountTree nodes={nodes} materials={materials} />
        <Castle nodes={nodes} materials={materials} />
        {/* Mount Island End */}

        {/* Rocket Island Start */}
        <Rocket nodes={nodes} materials={materials} />
        <RocketIslands nodes={nodes} materials={materials} />
        <Planet nodes={nodes} materials={materials} />
        {/* Rocket Island End */}

        {/* Gate Island Start */}
        <WelcomeGate nodes={nodes} materials={materials} />
        <Spawn nodes={nodes} materials={materials} />
        <Helicopter
          nodes={nodes}
          materials={materials}
          animations={animations}
        />
        <FirstIsland nodes={nodes} materials={materials} />
        {/* Gate Island End */}

        {/* Festival Island Start */}
        <Tent nodes={nodes} materials={materials} />
        <TentIsland nodes={nodes} materials={materials} />
        <Wagon nodes={nodes} materials={materials} />
        {/* Festival Island End */}
      </Float>
    </animated.group>
  );
}

export default Island;
