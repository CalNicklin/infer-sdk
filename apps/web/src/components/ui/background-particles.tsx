"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const createParticles = () =>
  Array.from({ length: 40 }).map(() => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 8 + 2,
    delay: Math.random() * 2,
    color: `hsl(${Math.random() * 60 + 220}, 70%, 50%)`,
  }));

export function BackgroundParticles() {
  const [particles] = useState(createParticles);
  const [activeConnections, setActiveConnections] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const totalPossibleConnections = particles.length * 2;
      const newActive = Array.from({ length: 5 }).map(() =>
        Math.floor(Math.random() * totalPossibleConnections)
      );
      setActiveConnections(newActive);
    }, 2000);

    return () => clearInterval(interval);
  }, [particles.length]);

  return (
    <div className="fixed inset-0 pointer-events-none">
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(100,200,255,0)" />
            <stop offset="50%" stopColor="rgba(100,200,255,0.5)" />
            <stop offset="100%" stopColor="rgba(100,200,255,0)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {particles.map((particle, i) =>
          particles.slice(i + 1, i + 3).map((targetParticle, j) => {
            const connectionId = i * 2 + j;
            const isActive = activeConnections.includes(connectionId);

            return (
              <g key={`${i}-${j}`}>
                {/* Base connection */}
                <line
                  x1={particle.left}
                  y1={particle.top}
                  x2={targetParticle.left}
                  y2={targetParticle.top}
                  stroke="rgba(100,200,255,0.05)"
                  strokeWidth="0.5"
                />

                {/* Animated connection */}
                {isActive && (
                  <>
                    <motion.line
                      x1={particle.left}
                      y1={particle.top}
                      x2={targetParticle.left}
                      y2={targetParticle.top}
                      stroke="rgba(100,200,255,0.15)"
                      strokeWidth="2"
                      filter="url(#glow)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{
                        pathLength: [0, 1],
                        opacity: [0, 0.3, 0.3, 0],
                      }}
                      transition={{
                        duration: 2,
                        times: [0, 0.5, 0.8, 1],
                        ease: "easeInOut",
                      }}
                    />
                  </>
                )}
              </g>
            );
          })
        )}
      </svg>

      {/* Particles */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle at center, ${particle.color}, transparent)`,
            boxShadow: `0 0 20px ${particle.color}`,
          }}
        />
      ))}
    </div>
  );
}
