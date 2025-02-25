import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import islandScene from "../../assets/YANGINI.glb";

export const Man = ({ position, scale }) => {
    const group = useRef();
    const { nodes, materials, animations } = useGLTF(islandScene);
    const { actions, mixer } = useAnimations(animations, group);
    const [animation, setAnimation] = useState('idle');

    // Debug animations
    useEffect(() => {
        console.log('Available animations:', animations);
        console.log('Available actions:', actions);

        // Setup animations map
        if (mixer) {
            // Start with idle animation
            if (actions.idle) {
                actions.idle.play();
            }
        }
    }, [animations, actions, mixer]);

    // Handle animation transitions
    useEffect(() => {
        if (!actions) return;

        // Fade out all current animations
        Object.values(actions).forEach(action => {
            if (action.isRunning()) {
                action.fadeOut(0.2);
            }
        });

        // Fade in the new animation
        if (actions[animation]) {
            actions[animation].reset().fadeIn(0.2).play();
        }
    }, [actions, animation]);

    // Animation control with keyboard
    useFrame((state, delta) => {
        mixer?.update(delta);

        const { forward, backward, left, right, shift, space } = state.controls?.getKeys?.() || {};

        // Update animation state based on input
        if (forward || backward || left || right) {
            if (shift) {
                setAnimation('run');
            } else {
                setAnimation('walk');
            }
        } else if (space) {
            setAnimation('jump');
        } else {
            setAnimation('idle');
        }
    });


    return (
        <group ref={group} position={position} scale={scale}>
            <group
                name="Character"
                rotation={[Math.PI / 2, 0, 0]}
                position={[0, 0, 0]}
            >
                <primitive object={nodes.mixamorigHips} /> {/* Armature/Skeleton root */}

                <skinnedMesh
                    name="Ch13_Body"
                    geometry={nodes.Ch13_Body.geometry}
                    material={materials['Ch13_body.001']}
                    skeleton={nodes.Ch13_Body.skeleton}
                    morphTargetDictionary={nodes.Ch13_Body.morphTargetDictionary}
                    morphTargetInfluences={nodes.Ch13_Body.morphTargetInfluences}
                />
                <skinnedMesh
                    name="Ch13_Eyeleashes"
                    geometry={nodes.Ch13_Eyeleashes.geometry}
                    material={materials['Ch13_hair.001']}
                    skeleton={nodes.Ch13_Eyeleashes.skeleton}
                />
                <skinnedMesh
                    name="Ch13_Hair"
                    geometry={nodes.Ch13_Hair.geometry}
                    material={materials['Ch13_hair.001']}
                    skeleton={nodes.Ch13_Hair.skeleton}
                />
                <skinnedMesh
                    name="Ch13_Pants"
                    geometry={nodes.Ch13_Pants.geometry}
                    material={materials['Ch13_body.001']}
                    skeleton={nodes.Ch13_Pants.skeleton}
                />
                <skinnedMesh
                    name="Ch13_Shirt"
                    geometry={nodes.Ch13_Shirt.geometry}
                    material={materials['Ch13_body.001']}
                    skeleton={nodes.Ch13_Shirt.skeleton}
                />
                <skinnedMesh
                    name="Ch13_Shoe"
                    geometry={nodes.Ch13_Shoe.geometry}
                    material={materials['Ch13_body.001']}
                    skeleton={nodes.Ch13_Shoe.skeleton}
                />
                {nodes?.mixamorigHips && (
                    <primitive object={nodes.mixamorigHips} />
                )}
            </group>
        </group>
    );
}

useGLTF.preload(islandScene);