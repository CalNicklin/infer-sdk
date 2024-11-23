"use client";

import dynamic from "next/dynamic";

const BackgroundParticles = dynamic(
  () =>
    import("@/components/ui/background-particles").then(
      (mod) => mod.BackgroundParticles
    ),
  { ssr: false }
);

export function Background() {
  return (
    <div className="fixed inset-0 z-0">
      {/* Prism Effect */}
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-transparent to-blue-500/30" />
        <div className="absolute inset-0 bg-gradient-to-tl from-red-500/30 via-transparent to-yellow-500/30" />
      </div>
      <BackgroundParticles />
    </div>
  );
}
