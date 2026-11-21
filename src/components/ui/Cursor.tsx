"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Two-part cursor (dot + ring). Elements with data-cursor="hover" grow the ring,
 * data-cursor-label="View" shows a label inside it. Fine pointers only.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("a, button, [data-cursor]");
      setHover(!!t);
      setLabel(t?.dataset.cursorLabel ?? null);
    };
    const leave = () => {
      x.set(-100);
      y.set(-100);
    };
    const d = () => setDown(true);
    const u = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", d);
    window.addEventListener("pointerup", u);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", d);
      window.removeEventListener("pointerup", u);
    };
  }, [x, y]);

  if (!enabled) return null;
  const size = label ? 84 : hover ? 56 : 30;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
      <motion.div className="absolute left-0 top-0 h-2 w-2 rounded-full bg-paper shadow-[0_0_0_1.5px_#050606]" style={{ x, y, translateX: "-50%", translateY: "-50%" }} />
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-paper shadow-[0_0_0_1.5px_#050606]"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: size, height: size, scale: down ? 0.82 : 1, backgroundColor: label ? "rgba(245,243,239,1)" : "rgba(245,243,239,0)" }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        {label ? <span className="label text-[10px] text-carbon">{label}</span> : null}
      </motion.div>
    </div>
  );
}
