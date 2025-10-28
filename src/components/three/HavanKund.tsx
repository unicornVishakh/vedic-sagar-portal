import * as THREE from "three";

interface HavanKundProps {
  position: [number, number, number];
}

export const HavanKund = ({ position }: HavanKundProps) => {
  return (
    <group position={position}>
      {/* Base platform */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[0.6, 0.65, 0.1, 32]} />
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </mesh>
      
      {/* Main pit structure - brick texture */}
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.45, 0.4, 0.5, 32]} />
        <meshStandardMaterial 
          color="#A0522D" 
          roughness={0.95}
          metalness={0.1}
        />
      </mesh>
      
      {/* Inner pit - darker */}
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <cylinderGeometry args={[0.38, 0.35, 0.45, 32]} />
        <meshStandardMaterial 
          color="#3E2723" 
          roughness={1}
          emissive="#FF4500"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Glowing embers at bottom */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.32, 0.3, 0.05, 32]} />
        <meshStandardMaterial 
          color="#FF4500" 
          emissive="#FF4500"
          emissiveIntensity={0.8}
          roughness={0.5}
        />
      </mesh>
      
      {/* Decorative stones around rim */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 0.42;
        const z = Math.sin(angle) * 0.42;
        return (
          <mesh key={i} position={[x, 0.45, z]} castShadow>
            <boxGeometry args={[0.08, 0.08, 0.08]} />
            <meshStandardMaterial color="#D2691E" roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
};
