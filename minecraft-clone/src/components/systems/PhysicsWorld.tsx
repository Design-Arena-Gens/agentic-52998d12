"use client";

import { ReactNode, useEffect } from "react";
import { useWorldStore } from "@/state/worldStore";

type PhysicsWorldProps = {
  children: ReactNode;
};

/**
 * Thin wrapper that prepares the world state before rendering any 3D content.
 */
export function PhysicsWorld({ children }: PhysicsWorldProps) {
  const generateInitialWorld = useWorldStore((state) => state.generateInitialWorld);

  useEffect(() => {
    generateInitialWorld();
  }, [generateInitialWorld]);

  return <>{children}</>;
}
