"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export const TiltEffect = ({
  children,
  className = "",
  rotationRange = 8, // Degrees of tilt
}: {
  children: React.ReactNode;
  className?: string;
  rotationRange?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [disabled, setDisabled] = React.useState(false);

  React.useEffect(() => {
    // Disable tilt on mobile/tablet
    const checkMobile = () => setDisabled(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const x = useMotionValue(0);

  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`${rotationRange}deg`, `-${rotationRange}deg`],
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`-${rotationRange}deg`, `${rotationRange}deg`],
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || disabled) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        disabled
          ? {}
          : {
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }
      }
      className={className}
    >
      {/* 
        This internal div helps separation of transform contexts if needed,
        but for simple cards, direct children are fine.
        We ensure children layers (like buttons) utilize translateZ for depth.
      */}
      {children}
    </motion.div>
  );
};
