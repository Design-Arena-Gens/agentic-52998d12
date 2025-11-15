import { create } from "zustand";
import { BlockType, BLOCK_TYPES } from "@/constants/blocks";

type BlockKey = `${number}:${number}:${number}`;

export type BlockMap = Record<BlockKey, BlockType>;

type WorldState = {
  blocks: BlockMap;
  selectedBlock: BlockType;
  addBlock: (position: [number, number, number], type?: BlockType) => void;
  removeBlock: (position: [number, number, number]) => void;
  setSelectedBlock: (type: BlockType) => void;
  generateInitialWorld: () => void;
};

const keyFromPosition = ([x, y, z]: [number, number, number]): BlockKey =>
  `${x}:${y}:${z}`;

const INITIAL_CHUNK_RADIUS = 16;

const clampToGrid = (value: number) => Math.round(value);

const buildChunk = () => {
  const chunk: BlockMap = {};

  for (let x = -INITIAL_CHUNK_RADIUS; x <= INITIAL_CHUNK_RADIUS; x += 1) {
    for (let z = -INITIAL_CHUNK_RADIUS; z <= INITIAL_CHUNK_RADIUS; z += 1) {
      const height =
        Math.floor(
          3 +
            Math.sin(x * 0.2) * 1.5 +
            Math.cos(z * 0.2) * 1.5 +
            Math.sin((x + z) * 0.1)
        ) || 1;

      for (let y = 0; y <= height; y += 1) {
        let type: BlockType = "stone";
        if (y === height) {
          type = "grass";
        } else if (y === height - 1) {
          type = "dirt";
        }

        chunk[keyFromPosition([x, y, z])] = type;
      }

      if (Math.abs(x) % 9 === 0 && Math.abs(z) % 9 === 0) {
        chunk[keyFromPosition([x, 1, z])] = "wood";
        chunk[keyFromPosition([x, 2, z])] = "wood";
        chunk[keyFromPosition([x, 3, z])] = "wood";
        const offsets = [
          [1, 3, 0],
          [-1, 3, 0],
          [0, 3, 1],
          [0, 3, -1],
          [0, 4, 0],
        ] as const;
        offsets.forEach(([ox, oy, oz]) => {
          chunk[keyFromPosition([x + ox, oy, z + oz])] = "leaf";
        });
      }
    }
  }

  return chunk;
};

export const useWorldStore = create<WorldState>((set, get) => ({
  blocks: {},
  selectedBlock: BLOCK_TYPES[0].id,
  addBlock: (position, blockType) =>
    set((state) => {
      const type = blockType ?? state.selectedBlock;
      const snapped: [number, number, number] = [
        clampToGrid(position[0]),
        clampToGrid(position[1]),
        clampToGrid(position[2]),
      ];
      const key = keyFromPosition(snapped);
      if (state.blocks[key] === type) {
        return state;
      }
      return {
        blocks: {
          ...state.blocks,
          [key]: type,
        },
      };
    }),
  removeBlock: (position) =>
    set((state) => {
      const snapped: [number, number, number] = [
        clampToGrid(position[0]),
        clampToGrid(position[1]),
        clampToGrid(position[2]),
      ];
      if (snapped[1] <= 0) {
        return state;
      }
      const key = keyFromPosition(snapped);
      if (!state.blocks[key]) {
        return state;
      }
      const blocks = { ...state.blocks };
      delete blocks[key];
      return { blocks };
    }),
  setSelectedBlock: (type) =>
    set(() => ({
      selectedBlock: type,
    })),
  generateInitialWorld: () => {
    if (Object.keys(get().blocks).length > 0) {
      return;
    }
    set(() => ({
      blocks: buildChunk(),
    }));
  },
}));
