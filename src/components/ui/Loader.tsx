"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { storyStore } from "@/lib/storyStore";

const STEPS = ["loading type", "checking assets", "preparing workspace", "ready"];

/** Calibration screen: counts to 100 while fonts load, then wipes upward. */
export function Loader() {
  const { setReady } = useApp();
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minTime = reduce ? 200 : 1700;
    let fontsReady = false;
    document.fonts?.ready.then(() => (fontsReady = true)).catch(() => (fontsReady = true));
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / minTime);
      const eased = 1 - Math.pow(1 - t, 3);
      const target = fontsReady ? eased : Math.min(eased, 0.9);
      setPct(Math.round(target * 100));
      // The trace settles as the page assets become ready.
      if (pathRef.current) {
        const amp = (1 - target) * 18;
        let d = "M0 24";
        for (let x = 4; x <= 240; x += 4) d += ` L${x} ${(24 + (Math.random() - 0.5) * 2 * amp).toFixed(1)}`;
        pathRef.current.setAttribute("d", d);
      }
      if (target >= 1) {
        setTimeout(() => setDone(true), reduce ? 0 : 220);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!done) return;
    setReady(true);
    storyStore.intro = 1;
  }, [done, setReady]);

  const step = STEPS[Math.min(STEPS.length - 1, Math.floor((pct / 100) * STEPS.length))];

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[80] flex flex-col justify-between bg-carbon p-[var(--gutter)] text-paper"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center justify-between">
            <span className="label text-ash">Lavansh Choubey — portfolio</span>
            <span className="label text-ash">2026</span>
          </div>
          <div className="flex flex-col items-start gap-6">
            <svg width="240" height="48" viewBox="0 0 240 48" aria-hidden className="text-signal">
              <path ref={pathRef} d="M0 24 L240 24" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <div className="flex items-end gap-6">
              <span className="display-xl text-[clamp(4.5rem,16vw,13rem)] tabular-nums">{String(pct).padStart(3, "0")}</span>
              <span className="label mb-4 text-ash">/ {step}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="label text-ash">Preparing workspace</span>
            <span className="label text-signal">{pct === 100 ? "Ready" : "Loading"}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
