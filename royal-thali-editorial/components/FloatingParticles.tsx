"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function DustField() {
  const points = useRef<THREE.Points>(null);
  const { pointer } = useThree();

  const positions = useMemo(() => {
    const arr = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      const radius = 5 + Math.random() * 6;
      const angle = Math.random() * Math.PI * 2;
      arr[i * 3] = Math.cos(angle) * radius * 1.1;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7;
      arr[i * 3 + 2] = Math.sin(angle) * radius * 0.8;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.008;
    points.current.rotation.x =
      Math.sin(performance.now() * 0.00006) * 0.03 + pointer.y * 0.018;
    points.current.rotation.z = pointer.x * 0.02;
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#7d6b5e"
        size={0.017}
        sizeAttenuation
        opacity={0.24}
        depthWrite={false}
      />
    </Points>
  );
}

export default function FloatingParticles() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2] hidden md:block"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.5} />
        <DustField />
      </Canvas>
    </div>
  );
}
