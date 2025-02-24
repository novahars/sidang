import { Sparkles, Stars } from "@react-three/drei";
import { Island } from "./models/Island";
import Sky from "./models/Sky";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { useThree } from "@react-three/fiber";
import * as THREE from 'three';

export default function Experience({ startZoom, loadingComplete, cameraTransitionDone }) {
  const { camera } = useThree();
  const [isMobile, setIsMobile] = useState(false);
  const cameraTransitionComplete = useRef(false);

  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  // Handle initial camera position and transition
  useEffect(() => {
    if (loadingComplete && !cameraTransitionComplete.current) {
      cameraTransitionComplete.current = true;

      // Create a timeline for sequential animations
      const tl = gsap.timeline({
        onComplete: () => {
          console.log("Camera transition complete");
        }
      });

      // First movement: Zoom in closer to the island
      tl.to(camera.position, {
        x: 0,
        y: 50,
        z: 100,
        duration: 2,
        ease: "power2.inOut"
      });

      // Second movement: Circle around to back of character
      tl.to(camera.position, {
        x: 0,
        y: 10,
        z: 20,
        duration: 1.5,
        ease: "power1.inOut"
      });

      // Final movement: Move to third-person position
      tl.to(camera.position, {
        x: 0,
        y: 2,
        z: 5,
        duration: 1,
        ease: "power3.inOut"
      });

      // Update camera target during transition
      gsap.to(camera.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 4.5, // Match total timeline duration
        ease: "power2.inOut",
        onUpdate: () => {
          camera.lookAt(new THREE.Vector3(0, 1, 0));
        }
      });
    }
  }, [camera, loadingComplete]);

  // Mobile responsiveness
  useEffect(() => {
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const islandPosition = isMobile ? [-10, -7, -10] : [0, 0, 0];
  const islandScale = isMobile ? [0.2, 0.2, 0.2] : [0.3, 0.3, 0.3];
  const showThirdPerson = cameraTransitionDone;

  return (
    <>
      <Island
        position={islandPosition}
        scale={islandScale}
        loadingComplete={loadingComplete}
      />
      {showThirdPerson && <ThirdPersonCamera />}

      <Sky />
      <Stars
        radius={100}
        depth={30}
        count={3000}
        factor={3}
        saturation={0}
        fade
        speed={1000}
      />
      {!isMobile && (
        <Sparkles
          size={50}
          scale={[500, 500, 500]}
          speed={5}
          count={1000}
        />
      )}
    </>
  );
}