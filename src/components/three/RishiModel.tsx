import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

interface RishiModelProps {
  position: [number, number, number];
  animationState: "idle" | "offering" | "welcomed";
  onAnimationComplete?: () => void;
}

export const RishiModel = ({ position, animationState, onAnimationComplete }: RishiModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const animationProgress = useRef(0);
  
  // Load the reference texture
  const texture = useTexture("/assets/task_01k8m963hwfngaxjxj1nf2t5j7_1761617406_img_1.webp");
  
  useFrame((state, delta) => {
    if (!groupRef.current || !armRef.current || !headRef.current) return;
    
    // Breathing animation for idle states
    if (animationState === "idle" || animationState === "welcomed") {
      const breathe = Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
      groupRef.current.scale.y = 1 + breathe;
    }
    
    // Offering animation
    if (animationState === "offering") {
      animationProgress.current += delta * 0.5;
      
      if (animationProgress.current < 1) {
        // Head turns to fire (0-0.2)
        if (animationProgress.current < 0.2) {
          const t = animationProgress.current / 0.2;
          headRef.current.rotation.y = THREE.MathUtils.lerp(0, -0.3, t);
        }
        
        // Arm extends to get ghee (0.2-0.4)
        if (animationProgress.current > 0.2 && animationProgress.current < 0.4) {
          const t = (animationProgress.current - 0.2) / 0.2;
          armRef.current.rotation.z = THREE.MathUtils.lerp(0, -0.5, t);
        }
        
        // Arm moves to fire (0.4-0.6)
        if (animationProgress.current > 0.4 && animationProgress.current < 0.6) {
          const t = (animationProgress.current - 0.4) / 0.2;
          armRef.current.rotation.x = THREE.MathUtils.lerp(0, -0.8, t);
          armRef.current.position.x = THREE.MathUtils.lerp(0, 0.3, t);
        }
        
        // Pour ghee (0.6-0.7) - tilt hand
        if (animationProgress.current > 0.6 && animationProgress.current < 0.7) {
          const t = (animationProgress.current - 0.6) / 0.1;
          armRef.current.rotation.y = THREE.MathUtils.lerp(0, -0.4, t);
        }
        
        // Return to idle (0.7-1.0)
        if (animationProgress.current > 0.7) {
          const t = (animationProgress.current - 0.7) / 0.3;
          headRef.current.rotation.y = THREE.MathUtils.lerp(-0.3, 0, t);
          armRef.current.rotation.z = THREE.MathUtils.lerp(-0.5, 0, t);
          armRef.current.rotation.x = THREE.MathUtils.lerp(-0.8, 0, t);
          armRef.current.rotation.y = THREE.MathUtils.lerp(-0.4, 0, t);
          armRef.current.position.x = THREE.MathUtils.lerp(0.3, 0, t);
        }
      } else {
        // Animation complete
        animationProgress.current = 0;
        onAnimationComplete?.();
      }
    } else {
      animationProgress.current = 0;
    }
  });
  
  return (
    <group ref={groupRef} position={position}>
      {/* Main body - seated cross-legged pose */}
      <group position={[0, 0.3, 0]}>
        {/* Torso */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.3, 0.6, 16]} />
          <meshStandardMaterial color="#FF8C42" roughness={0.7} />
        </mesh>
        
        {/* Head */}
        <group ref={headRef} position={[0, 1.3, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.18, 32, 32]} />
            <meshStandardMaterial color="#D4A574" roughness={0.6} />
          </mesh>
          
          {/* Beard */}
          <mesh position={[0, -0.15, 0.1]} castShadow>
            <coneGeometry args={[0.12, 0.3, 8]} />
            <meshStandardMaterial color="#E0E0E0" roughness={0.9} />
          </mesh>
          
          {/* Top-knot (shikha) */}
          <mesh position={[0, 0.25, 0]} castShadow>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#808080" roughness={0.8} />
          </mesh>
          
          {/* Tilak */}
          <mesh position={[0, 0.05, 0.18]} rotation={[0.3, 0, 0]}>
            <planeGeometry args={[0.04, 0.08]} />
            <meshStandardMaterial color="#DC143C" emissive="#DC143C" emissiveIntensity={0.3} />
          </mesh>
        </group>
        
        {/* Right arm (for offering) */}
        <group ref={armRef} position={[0.3, 0.9, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.06, 0.05, 0.4, 12]} />
            <meshStandardMaterial color="#FF8C42" roughness={0.7} />
          </mesh>
          
          {/* Hand */}
          <mesh position={[0, -0.25, 0]} castShadow>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#D4A574" roughness={0.6} />
          </mesh>
          
          {/* Rudraksha beads on wrist */}
          <mesh position={[0, -0.15, 0]}>
            <torusGeometry args={[0.07, 0.015, 8, 12]} />
            <meshStandardMaterial color="#5C4033" roughness={0.8} />
          </mesh>
        </group>
        
        {/* Left arm */}
        <mesh position={[-0.3, 0.8, 0]} rotation={[0, 0, 0.3]} castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.4, 12]} />
          <meshStandardMaterial color="#FF8C42" roughness={0.7} />
        </mesh>
        
        {/* Angavastram (shawl) */}
        <mesh position={[0.2, 0.9, -0.1]} rotation={[0.2, 0.3, -0.2]} castShadow>
          <planeGeometry args={[0.3, 0.8]} />
          <meshStandardMaterial 
            color="#FF6B35" 
            roughness={0.8} 
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      
      {/* Lower body - crossed legs */}
      <group position={[0, 0, 0]}>
        {/* Dhoti/Lower garment */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.35, 0.3, 16]} />
          <meshStandardMaterial color="#FF8C42" roughness={0.7} />
        </mesh>
        
        {/* Legs crossed */}
        <mesh position={[0.15, 0.05, 0.2]} rotation={[0, 0, -0.3]} castShadow>
          <capsuleGeometry args={[0.08, 0.4, 12, 16]} />
          <meshStandardMaterial color="#D4A574" roughness={0.6} />
        </mesh>
        <mesh position={[-0.15, 0.05, 0.2]} rotation={[0, 0, 0.3]} castShadow>
          <capsuleGeometry args={[0.08, 0.4, 12, 16]} />
          <meshStandardMaterial color="#D4A574" roughness={0.6} />
        </mesh>
      </group>
      
      {/* Rudraksha mala (necklace) */}
      <mesh position={[0, 1.1, 0]}>
        <torusGeometry args={[0.15, 0.02, 8, 20]} />
        <meshStandardMaterial color="#5C4033" roughness={0.8} />
      </mesh>
    </group>
  );
};
