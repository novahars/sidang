import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimations } from '@react-three/drei';
import { CharakterControll } from '../../CharakterControll';
import ThirdPersonCamera from '../../Thirdpersoncamera.jsx';
import * as THREE from 'three'; // Add THREE import

export default function Man({ nodes, materials, camera, animations }) {
    const group = useRef();
    const { actions, mixer } = useAnimations(animations, group);
    const [characterControls, setCharacterControls] = useState(null);
    const [keysPressed, setKeysPressed] = useState({});

    useFrame((state, delta) => {
        mixer?.update(delta);
        if (characterControls) {
            characterControls.update(delta, keysPressed);
        }
    });

    useEffect(() => {
        if (group.current && actions && camera?.controls && camera?.instance) {
            const animationsMap = new Map();

            Object.entries(actions).forEach(([name, action]) => {
                if (name === 'Idle' || name === 'Walk' ||
                    name === 'Run' || name === 'jumping') {
                    console.log(`Mapping animation: ${name}`);
                    animationsMap.set(name === 'jumping' ? 'Jump' : name, action);

                    // Set proper animation settings
                    action.clampWhenFinished = false;
                    action.loop = THREE.LoopRepeat;
                    if (name === 'jumping') {
                        action.loop = THREE.LoopOnce;
                        action.clampWhenFinished = true;
                    }
                }
            });

            if (animationsMap.size > 0) {
                const controls = new CharakterControll(
                    group.current,
                    mixer,
                    animationsMap,
                    camera.controls,
                    camera.instance,
                    'Idle'
                );
                setCharacterControls(controls);

                // Start with Idle animation
                const idleAction = animationsMap.get('Idle');
                if (idleAction) {
                    idleAction.play();
                }
            }
        }

        const handleKeyDown = (e) => {
            setKeysPressed(keys => ({ ...keys, [e.key.toLowerCase()]: true }));
            if (e.code === 'Space') characterControls?.jump();
            if (e.key === 'Shift') characterControls?.switchRunToggle();
        };

        const handleKeyUp = (e) => {
            setKeysPressed(keys => ({ ...keys, [e.key.toLowerCase()]: false }));
            if (e.key === 'Shift') characterControls?.switchRunToggle();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => { // Fixed typo here (removed 'n')
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [actions, mixer, camera, animations]); // Added characterControls dependency


    return (
        <group ref={group}>
            <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.03}>
                <skinnedMesh
                    name="Ch13_Body"
                    geometry={nodes.Ch13_Body.geometry}
                    material={materials['Ch13_body.001']}
                    skeleton={nodes.Ch13_Body.skeleton}
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
                <primitive object={nodes.mixamorigHips} />
                <ThirdPersonCamera target={group} />

            </group>

        </group>
    );
}
