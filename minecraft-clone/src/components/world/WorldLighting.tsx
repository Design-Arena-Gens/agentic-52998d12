"use client";

export function WorldLighting() {
  return (
    <>
      <directionalLight
        position={[15, 35, 25]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-25, 15, -15]} intensity={0.2} />
      <hemisphereLight color="#cceeff" groundColor="#424242" intensity={0.5} />
    </>
  );
}
