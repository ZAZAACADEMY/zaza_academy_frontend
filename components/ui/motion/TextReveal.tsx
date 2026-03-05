"use client";

import React from "react";
import { motion } from "framer-motion";

// Signature Awwwards easing: springs into place with natural deceleration
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Recursively extracts the plain-text content from a ReactNode.
 * Needed because next-intl t.rich() passes ReactNode, not string.
 */
function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement(node))
    return extractText((node.props as { children?: React.ReactNode }).children);
  return "";
}

/**
 * WordReveal
 * Splits children (string or ReactNode) into words. Each word slides up
 * from behind an overflow-hidden mask, staggered by `stagger` seconds.
 *
 * Apply color/gradient classNames here — they're forwarded to each
 * animated word span so bg-clip-text gradients render correctly.
 */
export function WordReveal({
  children,
  delay = 0,
  stagger = 0.055,
  duration = 0.75,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  stagger?: number;
  duration?: number;
  /** Forwarded to each animated word span (for gradient/color) */
  className?: string;
}) {
  const text = extractText(children);
  const words = text.split(" ").filter(Boolean);

  return (
    // aria-label restores screenreader text since we fragment the string
    <span aria-label={text} className="inline">
      {words.map((word, i) => (
        <React.Fragment key={i}>
          {/* Natural word spacing — preserved in the text flow */}
          {i > 0 && <span aria-hidden> </span>}
          {/*
           * The overflow-hidden wrapper IS the mask.
           * verticalAlign:"bottom" anchors the clip to the text baseline
           * so descenders (g, y, p) aren't cropped.
           * lineHeight:"inherit" stops the wrapper from adding extra height.
           */}
          <span
            aria-hidden
            className="inline-block overflow-hidden"
            style={{ verticalAlign: "bottom", lineHeight: "inherit" }}
          >
            <motion.span
              className={`inline-block ${className}`}
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{
                duration,
                delay: delay + i * stagger,
                ease: EASE,
              }}
            >
              {word}
            </motion.span>
          </span>
        </React.Fragment>
      ))}
    </span>
  );
}

/**
 * LineReveal
 * Reveals an entire block (paragraph, complex node, etc.) as a single unit
 * from behind an overflow-hidden mask. Ideal for subtitles and short lines
 * where you don't want word-level granularity.
 */
export function LineReveal({
  children,
  delay = 0,
  duration = 0.9,
  className = "",
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`overflow-hidden ${className}`} style={style}>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}
