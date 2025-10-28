import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SparksProps {
  active: boolean;
  position: [number, number, number];
}

export const Sparks = ({ active, position }: SparksProps) => {
  const particlesRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);
  
  const particleCount = 50;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);
    const lifetimes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Start at fire center
      positions[i3] = 0;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = 0;
      
      // Golden-orange color
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.7;
      colors[i3 + 2] = 0.2;
      
      sizes[i] = Math.random() * 0.08 + 0.02;
      
      // Random explosion velocity
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.05 + 0.02;
      velocities[i3] = Math.cos(angle) * speed;
      velocities[i3 + 1] = Math.random() * 0.08 + 0.06; // Upward bias
      velocities[i3 + 2] = Math.sin(angle) * speed;
      
      lifetimes[i] = Math.random();
    }
    
    return { positions, colors, sizes, velocities, lifetimes };
  }, []);
  
  useFrame((state, delta) => {
    if (!particlesRef.current || !active) return;
    
    timeRef.current += delta;
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array;
    const velocities = particles.velocities;
    const lifetimes = particles.lifetimes;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      lifetimes[i] += delta * 2;
      
      if (lifetimes[i] < 1) {
        // Update positions
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1] - delta * 2; // Gravity
        positions[i3 + 2] += velocities[i3 + 2];
        
        // Fade out size
        sizes[i] = (1 - lifetimes[i]) * (Math.random() * 0.08 + 0.02);
      } else {
        // Reset particle
        positions[i3] = 0;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = 0;
        sizes[i] = 0;
        lifetimes[i] = 0;
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.geometry.attributes.size.needsUpdate = true;
  });
  
  if (!active) return null;
  
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
        size={0.1}
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};
