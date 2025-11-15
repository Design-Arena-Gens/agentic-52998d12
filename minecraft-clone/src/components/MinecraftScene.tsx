"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { Sky, PointerLockControls, Stats } from "@react-three/drei";
import { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";
import { PhysicsWorld } from "./systems/PhysicsWorld";
import { BlockManager } from "./world/BlockManager";
import { Player } from "./player/Player";
import { WorldLighting } from "./world/WorldLighting";
import { UIOverlay } from "./ui/UIOverlay";

export function MinecraftScene() {
  const controlsRef = useRef<PointerLockControlsImpl>(null);
  const fallback = useMemo(
    () => (
      <div className="flex h-full items-center justify-center text-xl font-semibold text-white">
        Loading world...
      </div>
    ),
    []
  );

  return (
    <div className="relative h-full w-full bg-slate-900">
      <Suspense fallback={fallback}>
        <Canvas shadows camera={{ fov: 75, position: [0, 20, 20] }}>
          <Sky distance={450000} sunPosition={[100, 100, 100]} />
          <color attach="background" args={["#87CEEB"]} />
          <fog attach="fog" args={["#87CEEB", 60, 150]} />
          <ambientLight intensity={0.6} />
          <WorldLighting />
          <PhysicsWorld>
            <BlockManager />
            <Player controls={controlsRef} />
          </PhysicsWorld>
          <PointerLockControls ref={controlsRef} makeDefault />
          <Stats />
        </Canvas>
      </Suspense>
      <UIOverlay controls={controlsRef} />
    </div>
  );
}

export default MinecraftScene;
