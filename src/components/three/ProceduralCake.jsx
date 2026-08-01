"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";

const TIERS = [
  { radius: 1.6, height: 0.9, color: "#fbf3e7" },
  { radius: 1.15, height: 0.7, color: "#f3e6d8" },
  { radius: 0.75, height: 0.55, color: "#fbf3e7" },
];

const RING_COLORS = ["#4e3d42", "#a3ad86"];
const SPRINKLE_COLORS = ["#4e3d42", "#a3ad86", "#fbf3e7"];
const SPRINKLE_COUNT = 90;
const PEARL_COUNT = 40;
const DRIP_COUNT = 18;
const DRIP_COLOR = "#4e3d42";
const CHERRY_COLOR = "#8c2f3a";

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function useInstancedTransforms(ref, transforms) {
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    transforms.forEach((t, i) => {
      dummy.position.set(t.x, t.y, t.z);
      dummy.scale.set(t.scaleX ?? t.scale ?? 1, t.scaleY ?? t.scale ?? 1, t.scaleZ ?? t.scale ?? 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      if (t.color) mesh.setColorAt(i, new THREE.Color(t.color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [ref, transforms]);
}

export default function ProceduralCake(props) {
  const sprinkleRef = useRef(null);
  const pearlRef = useRef(null);
  const dripRef = useRef(null);

  const { tierLayout, ringLayout, totalHeight } = useMemo(() => {
    let y = 0;
    const layout = TIERS.map((tier) => {
      const centerY = y + tier.height / 2;
      y += tier.height;
      return { ...tier, centerY, topY: y };
    });
    const rings = layout.slice(0, -1).map((tier, i) => ({
      radius: tier.radius,
      y: tier.topY,
      color: RING_COLORS[i % RING_COLORS.length],
    }));
    return { tierLayout: layout, ringLayout: rings, totalHeight: y };
  }, []);

  const sprinkleTransforms = useMemo(() => {
    const rand = seededRandom(42);
    const topTier = tierLayout[tierLayout.length - 1];
    const items = [];
    for (let i = 0; i < SPRINKLE_COUNT; i += 1) {
      const angle = rand() * Math.PI * 2;
      const radius = Math.sqrt(rand()) * topTier.radius * 0.7;
      items.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        y: topTier.topY + 0.04,
        scale: 0.4 + rand() * 0.5,
        color: SPRINKLE_COLORS[i % SPRINKLE_COLORS.length],
      });
    }
    return items;
  }, [tierLayout]);

  // Pearl piping border along the base of the bottom tier.
  const pearlTransforms = useMemo(() => {
    const bottomTier = tierLayout[0];
    const items = [];
    for (let i = 0; i < PEARL_COUNT; i += 1) {
      const angle = (i / PEARL_COUNT) * Math.PI * 2;
      items.push({
        x: Math.cos(angle) * (bottomTier.radius + 0.03),
        z: Math.sin(angle) * (bottomTier.radius + 0.03),
        y: 0.08,
        scale: 0.09,
        color: "#fbf3e7",
      });
    }
    return items;
  }, [tierLayout]);

  // Ganache drips hanging from the seam between the middle and top tiers.
  const dripTransforms = useMemo(() => {
    const rand = seededRandom(7);
    const seam = ringLayout[ringLayout.length - 1];
    const items = [];
    for (let i = 0; i < DRIP_COUNT; i += 1) {
      const angle = (i / DRIP_COUNT) * Math.PI * 2 + (rand() - 0.5) * 0.12;
      const length = 0.16 + rand() * 0.26;
      items.push({
        x: Math.cos(angle) * seam.radius,
        z: Math.sin(angle) * seam.radius,
        y: seam.y - length / 2,
        scaleX: 0.09,
        scaleZ: 0.09,
        scaleY: length / 2,
      });
    }
    return items;
  }, [ringLayout]);

  useInstancedTransforms(sprinkleRef, sprinkleTransforms);
  useInstancedTransforms(pearlRef, pearlTransforms);
  useInstancedTransforms(dripRef, dripTransforms);

  const offsetY = -totalHeight / 2;
  const topTier = tierLayout[tierLayout.length - 1];

  return (
    <group {...props} position={[0, offsetY, 0]}>
      {/* stand */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[2, 2.1, 0.18, 48]} />
        <meshStandardMaterial color="#fbf3e7" roughness={0.5} />
      </mesh>

      {tierLayout.map((tier, i) => (
        <mesh key={i} position={[0, tier.centerY, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[tier.radius, tier.radius, tier.height, 48]} />
          <meshStandardMaterial color={tier.color} roughness={0.45} />
        </mesh>
      ))}

      {ringLayout.map((ring, i) => (
        <mesh key={i} position={[0, ring.y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[ring.radius, 0.11, 16, 64]} />
          <meshStandardMaterial color={ring.color} roughness={0.35} />
        </mesh>
      ))}

      {/* ganache drips off the top seam */}
      <instancedMesh ref={dripRef} args={[null, null, DRIP_COUNT]} castShadow>
        <sphereGeometry args={[1, 10, 10]} />
        <meshStandardMaterial color={DRIP_COLOR} roughness={0.3} />
      </instancedMesh>

      {/* pearl piping border at the base */}
      <instancedMesh ref={pearlRef} args={[null, null, PEARL_COUNT]} castShadow>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial roughness={0.4} />
      </instancedMesh>

      {/* sprinkles on top */}
      <instancedMesh ref={sprinkleRef} args={[null, null, SPRINKLE_COUNT]} castShadow>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial roughness={0.4} />
      </instancedMesh>

      {/* icing inscription on the front of the bottom tier */}
      <Text
        position={[0, tierLayout[0].centerY, tierLayout[0].radius + 0.02]}
        fontSize={0.34}
        maxWidth={2.4}
        font="/fonts/GreatVibes-Regular.ttf"
        color="#4e3d42"
        anchorX="center"
        anchorY="middle"
      >
        Suly&apos;s Sweets
      </Text>

      {/* cherry topper */}
      <group position={[0, topTier.topY, 0]}>
        <mesh position={[0, 0.12, 0]} castShadow>
          <sphereGeometry args={[0.14, 20, 20]} />
          <meshStandardMaterial color={CHERRY_COLOR} roughness={0.25} />
        </mesh>
        <mesh position={[0.03, 0.27, 0]} rotation={[0, 0, -0.4]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.16, 6]} />
          <meshStandardMaterial color="#5b6b3f" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}
