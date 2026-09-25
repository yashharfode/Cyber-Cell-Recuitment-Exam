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

  // Subtle breathing accent on workstation monitor
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (terminalLightRef.current) {
      terminalLightRef.current.intensity = 0.5 + Math.sin(t * 2) * 0.15;
    }
  });

  return (
    <group>
      {/* ========================================================================= */}
      {/* REALISTIC ARCHITECTURAL LIGHTING (Clean, balanced, non-neon)             */}
      {/* ========================================================================= */}
      <ambientLight intensity={0.7} color="#94A3B8" />
      <directionalLight 
        position={[0, 9, 2]} 
        intensity={1.3} 
        color="#F8FAFC" 
        castShadow 
      />
      <directionalLight 
        position={[-5, 7, -4]} 
        intensity={0.5} 
        color="#CBD5E1" 
      />
      {/* Soft screen bounce light */}
      <pointLight 
        ref={terminalLightRef} 
        position={[0, 1.8, -3.8]} 
        color="#38BDF8" 
        distance={5} 
        intensity={0.5} 
      />

      {/* ========================================================================= */}
      {/* ARCHITECTURAL ROOM ENVELOPE (Dark slate & matte architectural surfaces)   */}
      {/* ========================================================================= */}

      {/* Floor: Polished dark slate floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial color="#0B0F19" roughness={0.35} metalness={0.25} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial color="#090D16" roughness={0.9} />
      </mesh>

      {/* Overhead Linear Architectural Light Panels */}
      {[-4, 0, 4].map((x, idx) => (
        <group key={`light-panel-${idx}`} position={[x, 4.98, -1]}>
          <mesh>
            <boxGeometry args={[1.6, 0.04, 12]} />
            <meshStandardMaterial 
              color="#F8FAFC" 
              emissive="#F8FAFC" 
              emissiveIntensity={0.6} 
            />
          </mesh>
        </group>
      ))}

      {/* Back Wall (Behind main video wall) */}
      <mesh position={[0, 2.5, -13]}>
        <boxGeometry args={[26, 5, 0.4]} />
        <meshStandardMaterial color="#0F1422" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Front Wall */}
      <mesh position={[0, 2.5, 13]}>
        <boxGeometry args={[26, 5, 0.4]} />
        <meshStandardMaterial color="#0F1422" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-13, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[26, 5, 0.4]} />
        <meshStandardMaterial color="#0F1422" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[13, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[26, 5, 0.4]} />
        <meshStandardMaterial color="#0F1422" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* ========================================================================= */}
      {/* SOC MAIN WALL DISPLAY (Sleek multi-monitor videowall)                     */}
      {/* ========================================================================= */}
      <group position={[0, 3.2, -12.75]}>
        {/* Outer Frame Bezel */}
        <mesh>
          <planeGeometry args={[10.2, 3.0]} />
          <meshStandardMaterial color="#05070D" roughness={0.5} metalness={0.8} />
        </mesh>

        {/* Display Screen */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[10.0, 2.8]} />
          <meshStandardMaterial 
            color="#080D1A" 
            emissive="#0B132B" 
            emissiveIntensity={0.2} 
            roughness={0.2}
          />
        </mesh>

        {/* Clean Dashboard Content */}
        <Text
          position={[0, 0.8, 0.06]}
          fontSize={0.24}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          CYBER CELL • SECURITY OPERATIONS CENTER
        </Text>
        
        <Text
          position={[0, 0.28, 0.06]}
          fontSize={0.16}
          color="#94A3B8"
          anchorX="center"
          anchorY="middle"
        >
          INCIDENT MONITORING & THREAT ANALYSIS • SATI VIDISHA
        </Text>

        {/* Subtle Horizontal Divider */}
        <mesh position={[0, 0.02, 0.05]}>
          <planeGeometry args={[8.0, 0.015]} />
          <meshBasicMaterial color="#334155" />
        </mesh>

        <Text
          position={[0, -0.35, 0.06]}
          fontSize={0.17}
          color="#38BDF8"
          anchorX="center"
          anchorY="middle"
        >
          ACTIVE PROTOCOL: {missionTitle.toUpperCase()}
        </Text>

        <Text
          position={[0, -0.75, 0.06]}
          fontSize={0.11}
          color="#64748B"
          anchorX="center"
          anchorY="middle"
        >
          STANDBY TELEMETRY STREAM • SYSTEM SECURE
        </Text>
      </group>

      {/* ========================================================================= */}
      {/* SERVER RACKS (Enterprise Data Center Style)                               */}
      {/* ========================================================================= */}

      {/* Server Racks (Left Side) */}
      {[-8, -5, -2, 1, 4].map((z, idx) => (
        <group key={`rack-left-${idx}`} position={[-9.5, 1.8, z]}>
          {/* Cabinet Body */}
          <mesh castShadow>
            <boxGeometry args={[1.2, 3.6, 1.4]} />
            <meshStandardMaterial color="#111827" roughness={0.4} metalness={0.6} />
          </mesh>

          {/* Glass Door Tint */}
          <mesh position={[0.61, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.3, 3.4]} />
            <meshStandardMaterial color="#0F172A" roughness={0.1} metalness={0.9} transparent opacity={0.7} />
          </mesh>

          {/* Status LEDs (Small realistic activity pips) */}
          <mesh position={[0.62, 1.2, 0.3]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#10B981" />
          </mesh>
          <mesh position={[0.62, 0.8, 0.3]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#38BDF8" />
          </mesh>
          <mesh position={[0.62, 0.4, 0.3]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#10B981" />
          </mesh>
        </group>
      ))}

      {/* Server Racks (Right Side) */}
      {[-8, -5, -2, 1, 4].map((z, idx) => (
        <group key={`rack-right-${idx}`} position={[9.5, 1.8, z]}>
          {/* Cabinet Body */}
          <mesh castShadow>
            <boxGeometry args={[1.2, 3.6, 1.4]} />
            <meshStandardMaterial color="#111827" roughness={0.4} metalness={0.6} />
          </mesh>

          {/* Glass Door Tint */}
          <mesh position={[-0.61, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[1.3, 3.4]} />
            <meshStandardMaterial color="#0F172A" roughness={0.1} metalness={0.9} transparent opacity={0.7} />
          </mesh>

          {/* Status LEDs */}
          <mesh position={[-0.62, 1.2, 0.3]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#38BDF8" />
          </mesh>
          <mesh position={[-0.62, 0.8, 0.3]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#10B981" />
          </mesh>
        </group>
      ))}

      {/* ========================================================================= */}
      {/* CENTRAL SOC WORKSTATION CONSOLE (Clean modern desk)                       */}
      {/* ========================================================================= */}
      <group position={[0, 0, -4]}>
        {/* Workstation Desk Tabletop */}
        <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.08, 1.4]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.4} />
        </mesh>

        {/* Desk Legs / Pedestals */}
        <mesh position={[-1.4, 0.42, 0]} castShadow>
          <boxGeometry args={[0.1, 0.84, 1.2]} />
          <meshStandardMaterial color="#0F172A" roughness={0.5} metalness={0.7} />
        </mesh>
        <mesh position={[1.4, 0.42, 0]} castShadow>
          <boxGeometry args={[0.1, 0.84, 1.2]} />
          <meshStandardMaterial color="#0F172A" roughness={0.5} metalness={0.7} />
        </mesh>

        {/* Monitor Stand */}
        <mesh position={[0, 1.05, -0.2]} castShadow>
          <boxGeometry args={[0.3, 0.35, 0.15]} />
          <meshStandardMaterial color="#0F172A" roughness={0.5} metalness={0.8} />
        </mesh>

        {/* Workstation Ultrawide Monitor (Interactive) */}
        <mesh 
          position={[0, 1.45, -0.15]} 
          rotation={[-0.1, 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onInteractTerminal();
          }}
          castShadow
        >
          <boxGeometry args={[2.4, 1.1, 0.08]} />
          <meshStandardMaterial 
            color="#0A0F1D" 
            emissive="#0F172A" 
            emissiveIntensity={0.4}
            roughness={0.15}
          />
        </mesh>

        {/* Monitor Screen Frame Bezel */}
        <mesh position={[0, 1.45, -0.11]} rotation={[-0.1, 0, 0]}>
          <planeGeometry args={[2.3, 1.0]} />
          <meshStandardMaterial 
            color="#080C14" 
            emissive="#0D1629" 
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Screen Text */}
        <Text
          position={[0, 1.55, -0.09]}
          rotation={[-0.1, 0, 0]}
          fontSize={0.13}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          INCIDENT INVESTIGATION CONSOLE
        </Text>
        <Text
          position={[0, 1.35, -0.09]}
          rotation={[-0.1, 0, 0]}
          fontSize={0.095}
          color="#38BDF8"
          anchorX="center"
          anchorY="middle"
        >
          Press [E] or Click to Inspect
        </Text>

        {/* Workstation Keyboard & Trackpad */}
        <mesh position={[0, 0.9, 0.25]} rotation={[-0.05, 0, 0]}>
          <boxGeometry args={[1.3, 0.02, 0.4]} />
          <meshStandardMaterial color="#0F172A" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
