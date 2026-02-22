"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface JellyButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const JellyButton = ({
  children,
  className,
  onClick,
  ...props
}: JellyButtonProps) => {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
      whileTap={{ scale: 0.8, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 15, // Low damping for "jelly" wobble
        rotate: {
          duration: 0.3,
        },
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
};
