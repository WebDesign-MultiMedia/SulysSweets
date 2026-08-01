"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import ProceduralCake from "./ProceduralCake";

export default function HeroScene() {
  return (
    <div className="h-full w-full touch-pan-y">
      <Canvas
        camera={{ position: [0, 1.4, 5.5], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 6, 4]} intensity={1.1} castShadow />
        <directionalLight position={[-4, 2, -3]} intensity={0.3} />

        <Suspense fallback={null}>
          <ProceduralCake />
          <Environment preset="apartment" />
          <ContactShadows position={[0, -1.35, 0]} opacity={0.35} blur={2.4} far={3} scale={6} />
        </Suspense>

        <OrbitControls
          makeDefault
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 1.8}
          enableDamping
          dampingFactor={0.08}
          autoRotate
          autoRotateSpeed={0.7}
          rotateSpeed={0.6}
        />
      </Canvas>
    </div>
  );
}
