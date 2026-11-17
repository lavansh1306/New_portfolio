"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment, type ElementType } from "react";

type Props = {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  stagger?: number;
  /** split by "word" (default) or "char" */
  by?: "word" | "char";
  once?: boolean;
  /** words rendered in the signal colour */
  accent?: string[];
};

/** Masked word/char reveal on scroll-into-view (Framer Motion). */
export function SplitReveal({ text, className, as: Tag = "h2", delay = 0, stagger = 0.06, by = "word", once = true, accent = [] }: Props) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  let charIndex = 0;

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden
        initial="hidden"
        whileInView="show"
        viewport={{ once, amount: 0.35 }}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
        style={{ display: "inline" }}
      >
        {words.map((word, wi) => (
          <Fragment key={wi}>
          <span style={{ whiteSpace: "nowrap" }} className={accent.includes(word) ? "text-signal" : undefined}>
            {by === "word" ? (
              <span className="mask">
                <motion.span
                  variants={{ hidden: { y: reduce ? 0 : "110%" }, show: { y: "0%" } }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              </span>
            ) : (
              [...word].map((ch) => {
                charIndex++;
                return (
                  <span className="mask" key={charIndex}>
                    <motion.span
                      variants={{ hidden: { y: reduce ? 0 : "110%", rotate: reduce ? 0 : 8 }, show: { y: "0%", rotate: 0 } }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {ch}
                    </motion.span>
                  </span>
                );
              })
            )}
          </span>
          {wi < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}
