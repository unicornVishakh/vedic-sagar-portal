import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FireParticlesProps {
  intensity: "small" | "large" | "blossom";
  position: [number, number, number];
}

export const FireParticles = ({ intensity, position }: FireParticlesProps) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = intensity === "small" ? 100 : intensity === "large" ? 300 : 500;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random position around fire center
      positions[i3] = (Math.random() - 0.5) * 0.3;
      positions[i3 + 1] = Math.random() * 0.2;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.3;
      
      // Fire colors (red-orange-yellow gradient)
      const colorMix = Math.random();
      if (colorMix < 0.3) {
        // Red core
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.2;
        colors[i3 + 2] = 0.0;
      } else if (colorMix < 0.7) {
        // Orange
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.5;
        colors[i3 + 2] = 0.0;
      } else {
        // Yellow-white
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.9;
        colors[i3 + 2] = 0.4;
      }
      
      sizes[i] = Math.random() * 0.15 + 0.05;
      
      // Upward velocity with slight randomness
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = Math.random() * 0.03 + 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    return { positions, colors, sizes, velocities };
  }, [particleCount]);
  
  useFrame((state, delta) => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const velocities = particles.velocities;
    
    const intensityMultiplier = intensity === "small" ? 1 : intensity === "large" ? 1.5 : 2.5;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Update positions based on velocity
      positions[i3] += velocities[i3] * intensityMultiplier;
      positions[i3 + 1] += velocities[i3 + 1] * intensityMultiplier;
      positions[i3 + 2] += velocities[i3 + 2] * intensityMultiplier;
      
      // Reset particles that go too high
      if (positions[i3 + 1] > 2.0) {
        positions[i3] = (Math.random() - 0.5) * 0.3;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = (Math.random() - 0.5) * 0.3;
      }
      
      // Add flickering motion
      positions[i3] += Math.sin(state.clock.elapsedTime * 3 + i) * 0.002;
      positions[i3 + 2] += Math.cos(state.clock.elapsedTime * 3 + i) * 0.002;
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={particlesRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};
