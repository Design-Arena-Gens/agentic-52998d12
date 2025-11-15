"use client";

import { useMemo } from "react";
import { useWorldStore } from "@/state/worldStore";
import { Block } from "./Block";

export function BlockManager() {
  const blocks = useWorldStore((state) => state.blocks);

  const entries = useMemo(() => Object.entries(blocks), [blocks]);

  return (
    <group>
      {entries.map(([key, type]) => {
        const [x, y, z] = key.split(":").map((value) => Number(value)) as [
          number,
          number,
          number,
        ];
        return <Block key={key} position={[x, y, z]} type={type} />;
      })}
    </group>
  );
}
