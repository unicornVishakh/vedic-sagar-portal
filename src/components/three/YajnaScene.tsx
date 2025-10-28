import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { RishiModel } from "./RishiModel";
import { HavanKund } from "./HavanKund";
import { FireParticles } from "./FireParticles";
import { Sparks } from "./Sparks";

interface YajnaSceneProps {
  autoPlay?: boolean;
  onWelcomeComplete?: () => void;
}

export const YajnaScene = ({ autoPlay = false, onWelcomeComplete }: YajnaSceneProps) => {
  const [state, setState] = useState<"idle" | "offering" | "welcomed">("idle");
  const [fireIntensity, setFireIntensity] = useState<"small" | "large" | "blossom">("small");
  const [showSparks, setShowSparks] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const lightRef = useRef<THREE.PointLight>(null);
  
  // Auto-play on mount
  useEffect(() => {
    if (autoPlay && !hasAutoPlayed) {
      setHasAutoPlayed(true);
      setTimeout(() => {
        handleClick();
      }, 1000);
    }
  }, [autoPlay, hasAutoPlayed]);
  
  const handleClick = () => {
    if (state === "idle") {
      setState("offering");
      
      // Trigger fire blossom at the right moment (when ghee is poured)
      setTimeout(() => {
        setFireIntensity("blossom");
        setShowSparks(true);
        
        // Return to large flame after blossom
        setTimeout(() => {
          setFireIntensity("large");
          setShowSparks(false);
        }, 1500);
      }, 3000); // Matches the pour timing in animation
    }
  };
  
  const handleAnimationComplete = () => {
    setState("welcomed");
    onWelcomeComplete?.();
  };
  
  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Canvas
        shadows
        camera={{ position: [0, 2, 5], fov: 50 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.2} />
        
        {/* Moonlight / soft top light */}
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.3}
          castShadow
          shadow-mapSize={[1024, 1024]}
          color="#b8cfe0"
        />
        
        {/* Dynamic fire light */}
        <pointLight
          ref={lightRef}
          position={[0.5, 0.5, 0]}
          intensity={fireIntensity === "small" ? 2 : fireIntensity === "large" ? 3.5 : 5}
          color="#FF8C42"
          distance={8}
          decay={2}
          castShadow
        />
        
        {/* Additional warm rim light */}
        <pointLight
          position={[-2, 1, -2]}
          intensity={0.5}
          color="#FFB366"
          distance={5}
        />
        
        {/* Environment for subtle reflections */}
        <Environment preset="night" />
        
        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial 
            color="#2F1810" 
            roughness={0.95}
            metalness={0.05}
          />
        </mesh>
        
        {/* Rishi Model */}
        <group onClick={handleClick} onPointerOver={() => document.body.style.cursor = "pointer"} onPointerOut={() => document.body.style.cursor = "auto"}>
          <RishiModel
            position={[-1.2, 0, 0]}
            animationState={state}
            onAnimationComplete={handleAnimationComplete}
          />
        </group>
        
        {/* Havan Kund (Fire Pit) */}
        <HavanKund position={[0.5, 0, 0]} />
        
        {/* Fire Particles */}
        <FireParticles 
          intensity={fireIntensity} 
          position={[0.5, 0.3, 0]} 
        />
        
        {/* Sparks burst */}
        <Sparks active={showSparks} position={[0.5, 0.5, 0]} />
        
        {/* Ghee pot and spoon props */}
        <group position={[-0.5, 0.05, 0.5]}>
          {/* Ghee pot */}
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.1, 0.12, 16]} />
            <meshStandardMaterial 
              color="#B8860B" 
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
          
          {/* Spoon */}
          <mesh position={[0.15, 0.02, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
            <capsuleGeometry args={[0.02, 0.2, 8, 16]} />
            <meshStandardMaterial 
              color="#DAA520" 
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </group>
        
        {/* Ambient floating motes */}
        {[...Array(20)].map((_, i) => {
          const x = (Math.random() - 0.5) * 6;
          const y = Math.random() * 3 + 0.5;
          const z = (Math.random() - 0.5) * 6;
          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial
                color="#FFE4B5"
                emissive="#FFE4B5"
                emissiveIntensity={0.5}
                transparent
                opacity={0.6}
              />
            </mesh>
          );
        })}
        
        {/* Camera controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 0.5, 0]}
        />
      </Canvas>
    </div>
  );
};
