"use client";

import React from "react";
import { useCelebration } from "./CelebrationThemeContext";
import {
  NigerianFlagIcon,
  EagleIcon,
  JollofRiceIcon,
  TalkingDrumIcon,
  GreenHeartIcon,
  ChristmasTreeIcon,
  SnowflakeIcon,
  GiftBoxIcon,
  EasterEggIcon,
  ChampagneToastIcon,
} from "./CelebrationIcons";

interface ParticleDef {
  id: number;
  left: string;
  animationDelay: string;
  animationDuration: string;
  typeIndex: number;
}

const particleDefs: ParticleDef[] = [
  {
    id: 1,
    left: "5%",
    animationDelay: "0s",
    animationDuration: "12s",
    typeIndex: 0,
  },
  {
    id: 2,
    left: "15%",
    animationDelay: "3s",
    animationDuration: "15s",
    typeIndex: 1,
  },
  {
    id: 3,
    left: "26%",
    animationDelay: "1s",
    animationDuration: "17s",
    typeIndex: 2,
  },
  {
    id: 4,
    left: "38%",
    animationDelay: "5s",
    animationDuration: "13s",
    typeIndex: 3,
  },
  {
    id: 5,
    left: "50%",
    animationDelay: "2s",
    animationDuration: "16s",
    typeIndex: 4,
  },
  {
    id: 6,
    left: "63%",
    animationDelay: "4s",
    animationDuration: "14s",
    typeIndex: 0,
  },
  {
    id: 7,
    left: "74%",
    animationDelay: "1.5s",
    animationDuration: "18s",
    typeIndex: 1,
  },
  {
    id: 8,
    left: "85%",
    animationDelay: "6s",
    animationDuration: "13s",
    typeIndex: 2,
  },
  {
    id: 9,
    left: "94%",
    animationDelay: "2.5s",
    animationDuration: "16s",
    typeIndex: 3,
  },
];

export const CelebrationAtmosphere: React.FC = () => {
  const { celebration, isLoaded } = useCelebration();

  if (!isLoaded || !celebration) {
    return null;
  }

  const renderParticleSvg = (typeIndex: number) => {
    switch (celebration.id) {
      case "independence": {
        const icons = [
          <NigerianFlagIcon key="flag" className="w-7 h-5 shadow-sm" />,
          <EagleIcon key="eagle" className="w-6 h-6 text-green-800" />,
          <JollofRiceIcon key="jollof" className="w-7 h-7" />,
          <TalkingDrumIcon key="drum" className="w-6 h-6" />,
          <GreenHeartIcon key="heart" className="w-6 h-6" />,
        ];
        return icons[typeIndex % icons.length];
      }
      case "christmas": {
        const icons = [
          <SnowflakeIcon key="snow1" className="w-6 h-6 text-cyan-500" />,
          <ChristmasTreeIcon key="tree" className="w-6 h-6" />,
          <GiftBoxIcon key="gift" className="w-6 h-6" />,
          <SnowflakeIcon key="snow2" className="w-5 h-5 text-blue-400" />,
          <ChristmasTreeIcon key="tree2" className="w-6 h-6" />,
        ];
        return icons[typeIndex % icons.length];
      }
      case "easter": {
        const icons = [
          <EasterEggIcon key="egg1" className="w-6 h-6" />,
          <GreenHeartIcon key="leaf" className="w-5 h-5 text-emerald-500" />,
          <EasterEggIcon key="egg2" className="w-6 h-6" />,
          <GreenHeartIcon key="leaf2" className="w-5 h-5 text-teal-500" />,
          <EasterEggIcon key="egg3" className="w-6 h-6" />,
        ];
        return icons[typeIndex % icons.length];
      }
      case "newyear": {
        const icons = [
          <ChampagneToastIcon key="toast1" className="w-6 h-6" />,
          <SnowflakeIcon key="star1" className="w-5 h-5 text-amber-400" />,
          <ChampagneToastIcon key="toast2" className="w-6 h-6" />,
          <SnowflakeIcon key="star2" className="w-6 h-6 text-purple-400" />,
          <ChampagneToastIcon key="toast3" className="w-6 h-6" />,
        ];
        return icons[typeIndex % icons.length];
      }
      default:
        return null;
    }
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden select-none"
    >
      <style>{`
        @keyframes celebrationFall {
          0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.9;
          }
          90% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(105vh) rotate(360deg);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .celebration-particle {
            animation: none !important;
            display: none !important;
          }
        }
      `}</style>

      {particleDefs.map((p) => (
        <span
          key={p.id}
          className="celebration-particle absolute -top-12 will-change-transform inline-flex items-center justify-center filter drop-shadow-sm"
          style={{
            left: p.left,
            animation: `celebrationFall ${p.animationDuration} linear infinite`,
            animationDelay: p.animationDelay,
          }}
        >
          {renderParticleSvg(p.typeIndex)}
        </span>
      ))}
    </div>
  );
};
