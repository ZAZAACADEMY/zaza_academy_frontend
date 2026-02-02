"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Coins, Cloud, PiggyBank, Star, Rocket } from "lucide-react";

export const FloatingElements = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yFast = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const ySlow = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const yReverse = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const rotateReverse = useTransform(scrollYProgress, [0, 1], [0, -45]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
    >
      {/* Piggy Bank - Top Right */}
      <motion.div
        style={{ y: ySlow, rotate: -10 }}
        className="absolute top-[5%] -right-[2%] md:right-[5%] text-[#F472B6] opacity-20"
      >
        <PiggyBank size={120} strokeWidth={1.5} />
      </motion.div>

      {/* Coins - Left */}
      <motion.div
        style={{ y: yFast, rotate: rotate }}
        className="absolute top-[25%] -left-[2%] md:left-[2%] text-[#FFC107] opacity-25"
      >
        <Coins size={80} strokeWidth={1.5} />
      </motion.div>

      {/* Cloud - Bottom Left */}
      <motion.div
        style={{ y: yReverse }}
        className="absolute bottom-[10%] left-[5%] text-[#A78BFA] opacity-10"
      >
        <Cloud size={180} fill="currentColor" strokeWidth={0} />
      </motion.div>

      {/* Star - Middle Right */}
      <motion.div
        style={{ y: yFast, rotate: rotateReverse }}
        className="absolute top-[60%] right-[10%] text-[#FBBF24] opacity-20"
      >
        <Star size={60} fill="currentColor" strokeWidth={0} />
      </motion.div>

      {/* Small decorative circles */}
      <motion.div
        style={{ y: ySlow }}
        className="absolute top-[15%] left-[20%] w-4 h-4 rounded-full bg-[#F472B6] opacity-20"
      />
      <motion.div
        style={{ y: yReverse }}
        className="absolute bottom-[30%] right-[20%] w-6 h-6 rounded-full bg-[#8B5CF6] opacity-10"
      />
    </div>
  );
};
