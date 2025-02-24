import React, { useEffect, useState, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { motion } from "framer-motion";
import * as THREE from "three";

const RotatingBackground = ({ texture }) => {
  const { scene } = useThree();
  const skyRef = useRef();

  useEffect(() => {
    if (texture) {
      const skyMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
      });

      const skySphere = new THREE.Mesh(
        new THREE.SphereGeometry(500, 60, 40),
        skyMaterial
      );

      skyRef.current = skySphere;
      scene.add(skySphere);
    }

    return () => {
      if (skyRef.current) {
        scene.remove(skyRef.current);
        skyRef.current.geometry.dispose();
        skyRef.current.material.dispose();
      }
    };
  }, [texture, scene]);

  return null;
};

const LoadingScreen = ({ sky, loadingComplete }) => {
  const sentence = "Explore our sparks";
  const [restart, setRestart] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showBackground, setShowBackground] = useState(false);

  useEffect(() => {
    // Start with black screen
    const blackScreenTimer = setTimeout(() => {
      // After 1.5s show the text
      setShowText(true);
      
      // After text appears, start fading in the background
      const backgroundTimer = setTimeout(() => {
        setShowBackground(true);
      }, 2000); // 2s after text appears

      return () => clearTimeout(backgroundTimer);
    }, 1500);

    return () => clearTimeout(blackScreenTimer);
  }, []);

  useEffect(() => {
    setRestart(true);
    setTimeout(() => setRestart(false), 50);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: loadingComplete ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ pointerEvents: loadingComplete ? 'none' : 'auto' }}
    >
      <div className="absolute inset-0 z-0" style={{ opacity: showBackground ? 1 : 0, transition: 'opacity 1s' }}>
        <Canvas className="w-full h-full">
          {sky && <RotatingBackground texture={sky} />}
        </Canvas>
      </div>

      <motion.div 
        className="absolute inset-0 bg-black z-10"
        initial={{ opacity: 1 }}
        animate={{ opacity: showText ? 0.3 : 1 }}
        transition={{ duration: 0.8 }}
      />

      <div className="absolute inset-0 flex mx-10 md:mx-0 items-center justify-center text-center z-20">
        <div className="text-white">
          {showText && !restart && (
            <motion.h1
              className="text-5xl md:text-8xl font-travelnesia"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {sentence.split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
