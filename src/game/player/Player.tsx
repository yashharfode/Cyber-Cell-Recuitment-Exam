import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

interface PlayerProps {
  onInteract: () => void;
  canInteract: boolean;
  onProximityChange?: (inRange: boolean) => void;
  isChallengeOpen?: boolean;
}

const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
};

export default function Player({ onInteract, canInteract, onProximityChange, isChallengeOpen }: PlayerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  // Immediately release pointer lock when a challenge opens
  useEffect(() => {
    if (isChallengeOpen && document.pointerLockElement) {
      document.exitPointerLock();
    }
  }, [isChallengeOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isChallengeOpen) return; // Don't move while answering challenge
      const key = e.key.toLowerCase();
      if (keys.hasOwnProperty(key)) keys[key as keyof typeof keys] = true;
      if (key === 'e' && canInteract) {
        onInteract();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keys.hasOwnProperty(key)) keys[key as keyof typeof keys] = false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [canInteract, onInteract, isChallengeOpen]);

  useFrame((_state, delta) => {
    if (isChallengeOpen || !controlsRef.current?.isLocked) return;

    const speed = 6.0;

    // Dampen velocity
    velocity.current.x -= velocity.current.x * 10.0 * delta;
    velocity.current.z -= velocity.current.z * 10.0 * delta;

    direction.current.z = Number(keys.w) - Number(keys.s);
    direction.current.x = Number(keys.d) - Number(keys.a);
    direction.current.normalize();

    if (keys.w || keys.s) velocity.current.z -= direction.current.z * speed * delta;
    if (keys.a || keys.d) velocity.current.x -= direction.current.x * speed * delta;

    controlsRef.current.moveRight(-velocity.current.x);
    controlsRef.current.moveForward(-velocity.current.z);

    // Bounding room boundaries: [-11, 11] for X, [-11, 11] for Z
    camera.position.x = Math.max(-11, Math.min(11, camera.position.x));
    camera.position.z = Math.max(-11, Math.min(11, camera.position.z));
    camera.position.y = 1.6; // Eye level

    // Terminal proximity detection: Terminal at [0, 1.4, -4]
    const distToTerminal = Math.hypot(camera.position.x, camera.position.z - (-4));
    if (onProximityChange) {
      onProximityChange(distToTerminal < 4.0);
    }
  });

  return (
    <>
      {!isChallengeOpen && <PointerLockControls ref={controlsRef} />}
    </>
  );
}
