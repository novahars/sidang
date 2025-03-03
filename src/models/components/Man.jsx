import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import islandScene from "../../assets/YANGINI.glb";

export const Man = ({ position, scale }) => {
    const group = useRef();
    const { nodes, materials, animations } = useGLTF(islandScene);
    const { actions, mixer, names } = useAnimations(animations, group);
    const [currentAnimation, setCurrentAnimation] = useState('idle');
    const [animationsMap] = useState(new Map());

    // Initialize animations
    useEffect(() => {
        console.log('Available animations:', names);

        // Map animations to their proper names
        names.forEach((name) => {
            const action = actions[name];
            if (name.toLowerCase().includes('idle')) {
                animationsMap.set('idle', action);
            } else if (name.toLowerCase().includes('walk')) {
                animationsMap.set('walk', action);
            } else if (name.toLowerCase().includes('run')) {
                animationsMap.set('run', action);
            } else if (name.toLowerCase().includes('jump')) {
                animationsMap.set('jump', action);
            }
        });

        // Start with idle animation
        const idleAction = animationsMap.get('idle');
        if (idleAction) {
            idleAction.play();
            setCurrentAnimation('idle');
        }
    }, [actions, names, animationsMap]);

    // Handle animation transitions
    useEffect(() => {
        const currentAction = animationsMap.get(currentAnimation);
        if (!currentAction) return;

        // Stop all current animations
        animationsMap.forEach(action => {
            action.fadeOut(0.2);
        });

        // Play new animation
        currentAction.reset().fadeIn(0.2).play();

        // Set loop mode for jump animation
        if (currentAnimation === 'jump') {
            currentAction.setLoop(THREE.LoopOnce);
            currentAction.clampWhenFinished = true;
        } else {
            currentAction.setLoop(THREE.LoopRepeat);
        }
    }, [currentAnimation, animationsMap]);

    // Update animations
    useFrame((state, delta) => {
        mixer?.update(delta);
    });

    return (
        <group ref={group} position={position} scale={scale}>
            <group
                name="Character"
                rotation={[Math.PI / 2, 0, 0]}
                position={[0, 0, 0]}
            >
                <primitive object={nodes.mixamorigHips} />

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