"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { prefersReducedMotion } from "./hooks";

let lenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenis;
}

/** Smoothly scroll to a selector, element or y-offset. Falls back to native scrolling. */
export function scrollToTarget(target: string | HTMLElement | number, offset = 0): void {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4 });
    return;
  }
  const reduce = prefersReducedMotion();
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}

/** Pause / resume page scrolling (used by the mobile menu). */
export function lockScroll(locked: boolean): void {
  document.documentElement.style.overflow = locked ? "hidden" : "";
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: false });
    lenis = instance;
    let frame = requestAnimationFrame(function loop(t) {
      instance.raf(t);
      frame = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      lenis = null;
    };
  }, []);
  return <>{children}</>;
}
