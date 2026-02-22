"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CoinDoodle = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <text
      x="50%"
      y="54%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="12"
      fontWeight="bold"
      fill="currentColor"
    >
      $
    </text>
  </svg>
);

const StarDoodle = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const PlaneDoodle = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M22 2L11 13" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
  </svg>
);

const CircleDoodle = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="8" />
  </svg>
);

const SquiggleDoodle = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 12C6 10 9 10 11 12C13 14 16 14 18 12" />
  </svg>
);

const FloatingItem = ({
  children,
  delay = 0,
  duration = 4,
  xRange = 20,
  yRange = 20,
  initialX = 0,
  initialY = 0,
  rotateRange = 10,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  xRange?: number;
  yRange?: number;
  initialX?: number;
  initialY?: number;
  rotateRange?: number;
  className?: string;
}) => (
  <motion.div
    style={{ x: initialX, y: initialY }}
    animate={{
      y: [0, -yRange, 0],
      x: [0, xRange, 0],
      rotate: [-rotateRange, rotateRange, -rotateRange],
    }}
    transition={{
      duration,
      repeat: Infinity,
      repeatType: "mirror", // Smoother loop
      ease: "easeInOut",
      delay,
    }}
    className={`absolute pointer-events-none ${className}`}
  >
    {children}
  </motion.div>
);

export const FloatingDoodles = () => {
  // Only render on client to avoid hydration mismatch with random positions if we were randomizing
  // But fixed positions are safer for layout stability.
  // We will place them in specific approximate spots that work generally.

  // We can use a portal or just place it in a fixed container covering the screen,
  // but the user asked for background.
  // Since sections alternate colors, we might want these to be subtle overlays.
  // Actually, sticking them inside Home.tsx's main container as fixed or absolute elements might cover too much.
  // Let's make them stick to the Home container context.

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 h-full w-full">
      {/* Top Area (Hero) */}
      <FloatingItem
        initialX={20}
        initialY={100}
        delay={0}
        className="left-[5%] top-[10%] opacity-20 text-brand-accent"
      >
        <StarDoodle className="w-8 h-8 md:w-12 md:h-12" />
      </FloatingItem>

      <FloatingItem
        initialX={-20}
        initialY={50}
        delay={1}
        className="right-[8%] top-[15%] opacity-20 text-brand-dark"
      >
        <CoinDoodle className="w-10 h-10 md:w-16 md:h-16" />
      </FloatingItem>

      {/* Middle Area */}
      <FloatingItem
        initialX={30}
        initialY={-30}
        delay={2}
        className="left-[10%] top-[35%] opacity-15 text-brand-purple"
      >
        <PlaneDoodle className="w-12 h-12 md:w-20 md:h-20" />
      </FloatingItem>

      <FloatingItem
        initialX={-15}
        initialY={25}
        delay={0.5}
        className="right-[5%] top-[45%] opacity-20 text-yellow-400"
      >
        <SquiggleDoodle className="w-10 h-10 md:w-14 md:h-14" />
      </FloatingItem>

      {/* Lower Area */}
      <FloatingItem
        initialX={25}
        initialY={40}
        delay={1.5}
        className="left-[8%] top-[65%] opacity-15 text-pink-400"
      >
        <CircleDoodle className="w-8 h-8 md:w-10 md:h-10" />
      </FloatingItem>

      <FloatingItem
        initialX={-30}
        initialY={-20}
        delay={2.5}
        className="right-[12%] top-[80%] opacity-20 text-brand-accent"
      >
        <StarDoodle className="w-10 h-10 md:w-16 md:h-16" />
      </FloatingItem>

      {/* Bottom Area */}
      <FloatingItem
        initialX={10}
        initialY={-40}
        delay={1}
        className="left-[15%] top-[90%] opacity-15 text-green-400"
      >
        <CoinDoodle className="w-12 h-12" />
      </FloatingItem>
    </div>
  );
};
