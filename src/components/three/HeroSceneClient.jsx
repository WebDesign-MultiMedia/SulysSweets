"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-plum/40">
      Loading 3D scene…
    </div>
  ),
});

export default function HeroSceneClient() {
  return <HeroScene />;
}
