"use client";

import dynamic from "next/dynamic";

const MinecraftScene = dynamic(() => import("@/components/MinecraftScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-slate-900 text-lg font-semibold text-white">
      Initializing blocks...
    </div>
  ),
});

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <MinecraftScene />
    </div>
  );
}
