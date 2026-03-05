"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

/** Use Lenis scrollTo if available, otherwise fall back to native scrollIntoView */
export function lenisScrollTo(
  target: string | HTMLElement,
  options?: { offset?: number; duration?: number },
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenis = (window as any).__lenis as Lenis | undefined;
  if (lenis) {
    lenis.scrollTo(target as HTMLElement, {
      offset: options?.offset ?? -80,
      duration: options?.duration ?? 1.4,
    });
  } else {
    const el =
      typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * Wraps the app with Lenis smooth scroll.
 * - duration 1.2s, exponential easing (industry standard Awwwards feel)
 * - Disabled on touch devices (smoothTouch: false) for native-feel swipe
 * - Syncs with Framer Motion via a manual RAF tick
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      // Exponential ease — the signature Awwwards curve
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: false,
      syncTouch: false,
    });

    lenisRef.current = lenis;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__lenis = lenis;

    // RAF loop — drives every Lenis tick
    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    // Intercept anchor clicks (href="#section") so they use Lenis scrollTo
    // instead of the browser's native jump/scroll-behavior: smooth
    function handleAnchorClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("a[href^='#']");
      if (!target) return;
      const href = (target as HTMLAnchorElement).getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.4 });
    }

    document.addEventListener("click", handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).__lenis;
    };
  }, []);

  return <>{children}</>;
}
