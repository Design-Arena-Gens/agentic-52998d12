"use client";

import { useEffect, useMemo } from "react";
import { MeshStandardMaterial, Vector3 } from "three";
import { ThreeEvent } from "@react-three/fiber";
import { BLOCK_COLORS, BlockType } from "@/constants/blocks";
import { useWorldStore } from "@/state/worldStore";

type BlockProps = {
  position: [number, number, number];
  type: BlockType;
};

const faceNormal = new Vector3();
const worldNormal = new Vector3();

export function Block({ position, type }: BlockProps) {
  const addBlock = useWorldStore((state) => state.addBlock);
  const removeBlock = useWorldStore((state) => state.removeBlock);
  const selectedBlock = useWorldStore((state) => state.selectedBlock);

  const material = useMemo(
    () => new MeshStandardMaterial({ color: BLOCK_COLORS[type] }),
    [type]
  );

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useEffect(() => {
    material.color.set(BLOCK_COLORS[type]);
  }, [material, type]);

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();

    if (event.button === 0) {
      removeBlock(position);
      return;
    }

    if (event.button === 2) {
      if (!event.face) return;
      faceNormal.copy(event.face.normal);
      worldNormal
        .copy(faceNormal)
        .applyMatrix3(event.object.normalMatrix)
        .normalize();

      const newPosition: [number, number, number] = [
        Math.round(position[0] + worldNormal.x),
        Math.round(position[1] + worldNormal.y),
        Math.round(position[2] + worldNormal.z),
      ];

      addBlock(newPosition, selectedBlock);
    }
  };

  const handleContextMenu = (event: ThreeEvent<MouseEvent>) => {
    event.nativeEvent.preventDefault();
  };

  return (
    <mesh
      position={position}
      onPointerDown={handlePointerDown}
      onContextMenu={handleContextMenu}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
