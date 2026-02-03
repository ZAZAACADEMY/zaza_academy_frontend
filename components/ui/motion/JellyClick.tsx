"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface JellyClickProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export const JellyClick = ({
  children,
  className,
  ...props
}: JellyClickProps) => {
  return (
    <motion.div
      className={className}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 10,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
