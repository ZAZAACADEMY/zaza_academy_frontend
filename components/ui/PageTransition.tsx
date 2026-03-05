"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { useRouter } from "@/navigation";
import Image from "next/image";
import Logo from "../../public/vectors/logo.svg";

type NavOptions = { locale?: string };

type TransitionContextType = {
  /** Drop-in replacement for router.push — plays the curtain transition first */
  navigateTo: (href: string, options?: NavOptions) => void;
};

const TransitionContext = createContext<TransitionContextType>({
  navigateTo: () => {},
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

// Aggressive expo curve — same "snap" feel you hear Awwwards judges describe
const EASE = [0.76, 0, 0.24, 1] as const;

type Phase = "idle" | "covering" | "revealing";

export function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const pendingRef = useRef<{ href: string; options?: NavOptions } | null>(
    null,
  );
  // Guard: onAnimationComplete can fire for sub-properties — only act once per phase
  const didActRef = useRef(false);

  const navigateTo = useCallback(
    (href: string, options?: NavOptions) => {
      if (phase !== "idle") return;
      pendingRef.current = { href, options };
      didActRef.current = false;
      setPhase("covering");
    },
    [phase],
  );

  const handleAnimationComplete = () => {
    if (didActRef.current) return;
    didActRef.current = true;

    if (phase === "covering" && pendingRef.current) {
      const { href, options } = pendingRef.current;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (router as any).push(href, options ?? undefined);
      // Small tick so Next.js starts the navigation before we start revealing
      setTimeout(() => {
        didActRef.current = false;
        setPhase("revealing");
      }, 40);
    } else if (phase === "revealing") {
      setPhase("idle");
      pendingRef.current = null;
    }
  };

  return (
    <TransitionContext.Provider value={{ navigateTo }}>
      {children}

      {phase !== "idle" && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-brand-dark flex items-center justify-center pointer-events-all"
          // Mount: clip from bottom edge (invisible), animate to fully visible.
          // Reveal: animate clipping upward (exits through the top).
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{
            clipPath:
              phase === "covering" ? "inset(0% 0 0 0)" : "inset(0 0 100% 0)",
          }}
          transition={{ duration: 0.5, ease: EASE }}
          onAnimationComplete={handleAnimationComplete}
        >
          {/* Logo centered — gives the blink-of-darkness a moment of brand */}
          <motion.div
            animate={{ opacity: phase === "covering" ? 1 : 0 }}
            initial={{ opacity: 0, y: 10 }}
            transition={
              phase === "covering"
                ? { duration: 0.2, delay: 0.18 }
                : { duration: 0.15 }
            }
          >
            <Image
              src={Logo}
              alt="Zaza"
              className="h-[52px] w-auto brightness-0 invert"
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </TransitionContext.Provider>
  );
}
