export const BLOCK_TYPES = [
  {
    id: "grass",
    label: "Grass",
    color: "#4caf50",
  },
  {
    id: "dirt",
    label: "Dirt",
    color: "#8d6e63",
  },
  {
    id: "stone",
    label: "Stone",
    color: "#9e9e9e",
  },
  {
    id: "wood",
    label: "Wood",
    color: "#a1887f",
  },
  {
    id: "leaf",
    label: "Leaves",
    color: "#66bb6a",
  },
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number]["id"];

export const BLOCK_COLORS: Record<BlockType, string> = BLOCK_TYPES.reduce(
  (acc, block) => {
    acc[block.id] = block.color;
    return acc;
  },
  {} as Record<BlockType, string>
);
