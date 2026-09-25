import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface CyberRoomProps {
  onInteractTerminal: () => void;
  missionTitle: string;
}

export default function CyberRoom({ onInteractTerminal, missionTitle }: CyberRoomProps) {
  const terminalLightRef = useRef<THREE.PointLight>(null);

  // Subtle pulsing animation on the terminal console
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (terminalLightRef.current) {
      terminalLightRef.current.intensity = 1.5 + Math.sin(t * 3) * 0.5;
    }
  });

  return (
    <group>
      {/* Lighting System (Section 27) */}
      <ambientLight intensity={0.35} color="#0B1018" />
      <directionalLight position={[5, 8, 3]} intensity={1.2} color="#00ffcc" castShadow />
      <directionalLight position={[-5, 6, -4]} intensity={0.7} color="#7000ff" />
      <pointLight ref={terminalLightRef} position={[0, 1.8, -3.5]} color="#00ffcc" distance={8} intensity={2} />

      {/* Main Floor (Grid finish) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial color="#05070D" roughness={0.6} metalness={0.8} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial color="#080C14" roughness={0.9} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 2.5, -13]}>
        <boxGeometry args={[26, 5, 0.4]} />
        <meshStandardMaterial color="#0A0F1A" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Front Wall */}
      <mesh position={[0, 2.5, 13]}>
        <boxGeometry args={[26, 5, 0.4]} />
        <meshStandardMaterial color="#0A0F1A" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-13, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[26, 5, 0.4]} />
        <meshStandardMaterial color="#0A0F1A" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[13, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[26, 5, 0.4]} />
        <meshStandardMaterial color="#0A0F1A" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* SOC Main Wall Display Screen */}
      <group position={[0, 3.2, -12.7]}>
        <mesh>
          <planeGeometry args={[10, 2.8]} />
          <meshStandardMaterial color="#06121E" emissive="#00ffcc" emissiveIntensity={0.08} />
        </mesh>
        <Text
          position={[0, 0.8, 0.05]}
          fontSize={0.28}
          color="#00ffcc"
          anchorX="center"
          anchorY="middle"
        >
          CYBER CELL // SATI VIDISHA SOC
        </Text>
        <Text
          position={[0, 0.2, 0.05]}
          fontSize={0.2}
          color="#EAF7F5"
          anchorX="center"
          anchorY="middle"
        >
          OPERATION ZERO-DAY • ACTIVE INCIDENT MONITORING
        </Text>
        <Text
          position={[0, -0.4, 0.05]}
          fontSize={0.16}
          color="#8DA3A0"
          anchorX="center"
          anchorY="middle"
        >
          {missionTitle}
        </Text>
      </group>

      {/* Server Racks (Left Side) */}
      {[-8, -5, -2, 1, 4].map((z, idx) => (
        <group key={`rack-left-${idx}`} position={[-9.5, 1.8, z]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 3.6, 1.4]} />
            <meshStandardMaterial color="#0D131F" roughness={0.4} metalness={0.8} />
          </mesh>
          {/* Glowing Rack Status LEDs */}
          <mesh position={[0.61, 0.6, 0]}>
            <planeGeometry args={[0.05, 1.8]} />
            <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}

      {/* Server Racks (Right Side) */}
      {[-8, -5, -2, 1, 4].map((z, idx) => (
        <group key={`rack-right-${idx}`} position={[9.5, 1.8, z]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 3.6, 1.4]} />
            <meshStandardMaterial color="#0D131F" roughness={0.4} metalness={0.8} />
          </mesh>
          {/* Glowing Rack Status LEDs */}
          <mesh position={[-0.61, 0.6, 0]}>
            <planeGeometry args={[0.05, 1.8]} />
            <meshStandardMaterial color="#7000ff" emissive="#7000ff" emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}

      {/* Central Interactive SOC Terminal Console */}
      <group position={[0, 0, -4]}>
        {/* Terminal Desk Base */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[3, 1, 1.5]} />
          <meshStandardMaterial color="#101721" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Terminal Monitor Screen (Interactive) */}
        <mesh 
          position={[0, 1.4, -0.1]} 
          rotation={[-0.2, 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onInteractTerminal();
          }}
          castShadow
        >
          <boxGeometry args={[2.2, 1.2, 0.1]} />
          <meshStandardMaterial 
            color="#081726" 
            emissive="#00ffcc" 
            emissiveIntensity={0.25}
            roughness={0.2}
          />
        </mesh>

        {/* Prompt on Screen */}
        <Text
          position={[0, 1.4, 0.02]}
          rotation={[-0.2, 0, 0]}
          fontSize={0.14}
          color="#00ffcc"
          anchorX="center"
          anchorY="middle"
        >
          [ CLICK OR PRESS E ]
        </Text>
        <Text
          position={[0, 1.15, 0.02]}
          rotation={[-0.2, 0, 0]}
          fontSize={0.09}
          color="#8DA3A0"
          anchorX="center"
          anchorY="middle"
        >
          ACCESS INCIDENT CONSOLE
        </Text>

        {/* Terminal Keyboard Unit */}
        <mesh position={[0, 1.02, 0.35]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[1.4, 0.05, 0.5]} />
          <meshStandardMaterial color="#0A0F18" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
