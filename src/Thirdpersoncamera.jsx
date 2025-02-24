import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function ThirdPersonCamera({ target }) {
    const offset = useRef(new THREE.Vector3(0, 2, 6)); // Adjusted position
    const smoothSpeed = 0.1;

    useFrame(({ camera }) => {
        if (target?.current) {
            const targetPosition = new THREE.Vector3();
            target.current.getWorldPosition(targetPosition);

            // Calculate desired camera position
            const desiredPosition = targetPosition.clone().add(offset.current);
            
            // Smoothly move camera
            camera.position.lerp(desiredPosition, smoothSpeed);
            
            // Look at target with offset for better view
            const lookAtPosition = targetPosition.clone().add(new THREE.Vector3(0, 1, 0));
            camera.lookAt(lookAtPosition);
        }
    });

    return null;
}