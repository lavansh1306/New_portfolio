"use client";

import { useEffect, useRef } from "react";
import { scramble } from "@/lib/scramble";
import { prefersReducedMotion } from "@/lib/device";

type Props = {
  text: string;
  className?: string;
  /** "view" scrambles once when visible; "hover" also re-scrambles on hover; "mount" runs on mount */
  trigger?: "view" | "hover" | "mount";
  duration?: number;
  delay?: number;
  as?: "span" | "p" | "div";
};

/** Text that resolves from noise into its final characters. Screen readers get the final text. */
export function ScrambleText({ text, className, trigger = "view", duration = 900, delay = 0, as: Tag = "span" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let cancel: (() => void) | undefined;
    if (trigger === "mount") {
      cancel = scramble(el, text, { duration, delay });
      return () => cancel?.();
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          cancel = scramble(el, text, { duration, delay });
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancel?.();
    };
  }, [text, trigger, duration, delay]);

  const onEnter = () => {
    if (trigger !== "hover" || !ref.current || prefersReducedMotion()) return;
    scramble(ref.current, text, { duration: 450 });
  };

  return (
    <Tag className={className} aria-label={text} onMouseEnter={onEnter}>
      <span ref={ref} aria-hidden>
        {text}
      </span>
    </Tag>
  );
}
