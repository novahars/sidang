import { useRef, useEffect, useState } from "react"
import { useGLTF, Float } from "@react-three/drei"
import { animated, useSpring } from "@react-spring/three"
import islandScene from "../assets/YANGINI.glb"
import {
    Storeblue,
    Office,
    CircleK,
    Store,
    Road,
} from "../models/components"

export function Map({ loadingComplete, ...props }) {
    const group = useRef()
    const { nodes, materials } = useGLTF(islandScene)
    const [isMobile, setIsMobile] = useState(false)
    
    // Mobile detection
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768)
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const [start, setStart] = useState(false)

    // Animation spring
    const { positionY, rotation } = useSpring({
        positionY: isMobile ? (start ? -7 : 120) : (start ? 0 : 120),
        rotation: start ? [0, 0, 0] : [0, Math.PI / 8, 0],
        config: { tension: 20, friction: 20 },
        onRest: () => setStart(true),
    })

    // Start animation when loading completes
    useEffect(() => {
        if (loadingComplete) {
            setTimeout(() => setStart(true), 500)
        }
    }, [loadingComplete])

    return (
        <animated.group
            ref={group}
            {...props}
            dispose={null}
            position-y={positionY}
            rotation={rotation}
        >
            <Float speed={0} rotationIntensity={0} floatIntensity={0}>
                <Storeblue nodes={nodes} materials={materials} />
                <CircleK nodes={nodes} materials={materials} />
                <Store nodes={nodes} materials={materials} />
                <Office nodes={nodes} materials={materials} />
                
                <Road nodes={nodes} materials={materials} />
            </Float>
        </animated.group>
    )
}

useGLTF.preload(islandScene)