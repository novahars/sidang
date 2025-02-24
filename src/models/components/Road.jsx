export default function Road({ nodes, materials }) {
    return (
        <group>

            <group
                name="ROAD"
                position={[-549.038, -127.662, -453.774]}
                rotation={[Math.PI / 2, 0, -Math.PI]}>
                <group name="ROAD_Lines_12" position={[-106.277, -127.72, -0.404]}>
                    <mesh
                        name="ROAD_Lines_12_World_ap_0"
                        castShadow
                        receiveShadow
                        geometry={nodes.ROAD_Lines_12_World_ap_0.geometry}
                        material={materials['World_ap.001']}
                    />

                </group>
            </group>
        </group>
    )
}