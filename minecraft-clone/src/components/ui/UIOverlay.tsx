"use client";

import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";
import { BLOCK_TYPES } from "@/constants/blocks";
import { useWorldStore } from "@/state/worldStore";

type UIOverlayProps = {
  controls: MutableRefObject<PointerLockControlsImpl | null>;
};

export function UIOverlay({ controls }: UIOverlayProps) {
  const [isLocked, setIsLocked] = useState(false);
  const selectedBlock = useWorldStore((state) => state.selectedBlock);
  const setSelectedBlock = useWorldStore((state) => state.setSelectedBlock);

  const handleSelect = useCallback(
    (id: (typeof BLOCK_TYPES)[number]["id"]) => {
      setSelectedBlock(id);
    },
    [setSelectedBlock]
  );

  useEffect(() => {
    const handlePointerLock = () => {
      setIsLocked(Boolean(document.pointerLockElement));
    };

    document.addEventListener("pointerlockchange", handlePointerLock);
    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLock);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 select-none text-white">
      <Crosshair />

      <div className="pointer-events-none absolute left-4 top-4 backdrop-blur-sm">
        <div className="rounded bg-black/30 px-3 py-2 text-sm leading-relaxed">
          <p className="font-semibold uppercase tracking-wide text-emerald-200">
            Controls
          </p>
          <ul className="mt-2 space-y-1 text-emerald-50">
            <li>WASD to move, Shift to sprint</li>
            <li>Left click removes, right click adds</li>
            <li>Scroll or press number keys to change block</li>
          </ul>
        </div>
      </div>

      <InventoryBar selectedBlock={selectedBlock} onSelect={handleSelect} />

      {!isLocked && (
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/60">
          <button
            type="button"
            className="rounded-lg bg-emerald-500 px-6 py-3 text-lg font-semibold text-emerald-900 shadow-lg shadow-emerald-900/40 transition hover:bg-emerald-400"
            onClick={() => controls.current?.lock()}
          >
            Click to enter the world
          </button>
        </div>
      )}
    </div>
  );
}

function Crosshair() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2">
      <div className="absolute left-1/2 top-1/2 h-6 w-px -translate-x-1/2 -translate-y-1/2 bg-white" />
      <div className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 bg-white" />
    </div>
  );
}

type InventoryBarProps = {
  selectedBlock: string;
  onSelect: (block: (typeof BLOCK_TYPES)[number]["id"]) => void;
};

function InventoryBar({ selectedBlock, onSelect }: InventoryBarProps) {
  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      event.preventDefault();
      const currentIndex = BLOCK_TYPES.findIndex((block) => block.id === selectedBlock);
      if (event.deltaY > 0) {
        const next = (currentIndex + 1) % BLOCK_TYPES.length;
        onSelect(BLOCK_TYPES[next].id);
      } else {
        const prev =
          (currentIndex - 1 + BLOCK_TYPES.length) % BLOCK_TYPES.length;
        onSelect(BLOCK_TYPES[prev].id);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      const index = Number(event.key) - 1;
      if (Number.isNaN(index) || index < 0 || index >= BLOCK_TYPES.length) return;
      onSelect(BLOCK_TYPES[index].id);
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("keydown", handleKey);
    };
  }, [onSelect, selectedBlock]);

  return (
    <div className="pointer-events-auto absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2 rounded-xl bg-black/50 px-4 py-3 shadow-lg shadow-black/40">
      {BLOCK_TYPES.map((block) => {
        const isActive = block.id === selectedBlock;
        return (
          <button
            key={block.id}
            type="button"
            onClick={() => onSelect(block.id)}
            className={`flex h-14 w-14 items-center justify-center rounded-lg border-2 text-xs font-semibold uppercase tracking-wide transition ${
              isActive
                ? "border-emerald-300 bg-emerald-500/40 text-emerald-50"
                : "border-white/20 bg-black/40 text-emerald-200 hover:border-emerald-200/40"
            }`}
            style={{ boxShadow: isActive ? "0 0 0 3px rgba(52,211,153,0.2)" : undefined }}
          >
            {block.label}
          </button>
        );
      })}
    </div>
  );
}
