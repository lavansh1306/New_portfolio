"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { story } from "@/content/profile";
import { ScrollTrigger } from "@/lib/gsap";
import { useApp } from "@/components/providers/AppProvider";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { QuickDock } from "@/components/ui/QuickDock";
import { QuickView } from "./QuickView";

const NAV_ITEMS = [
  { label: "About", id: "person" },
  { label: "Skills", id: "toolkit" },
  { label: "Projects", id: "builds" },
  { label: "Experience", id: "road" },
  { label: "Achievements", id: "arena" },
  { label: "Contact", id: "signal" },
] as const;

/** Film-style chapter HUD: progress with chapter ticks, direct navigation, chapter menu, quick view. */
export function HUD() {
  const { ready, scrollTo, setScrollLocked } = useApp();
  const [current, setCurrent] = useState(0);
  const [ticks, setTicks] = useState<number[]>([]);
  const [menu, setMenu] = useState(false);
  const [quick, setQuick] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ready) return;
    const els = story.map((c) => document.querySelector<HTMLElement>(`[data-chapter="${c.id}"]`));
    const triggers = els.map((el, i) =>
      el
        ? ScrollTrigger.create({
            trigger: el,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => self.isActive && setCurrent(i),
          })
        : null,
    );
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setTicks(els.map((el) => (el ? Math.min(1, (el.getBoundingClientRect().top + window.scrollY) / max) : 0)));
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      setScrolled(window.scrollY > 24);
    };
    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    ScrollTrigger.addEventListener("refresh", measure);
    return () => {
      triggers.forEach((t) => t?.kill());
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      ScrollTrigger.removeEventListener("refresh", measure);
    };
  }, [ready]);

  useEffect(() => setScrollLocked(menu || quick), [menu, quick, setScrollLocked]);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const go = useCallback(
    (id: string) => {
      setMenu(false);
      setTimeout(() => scrollTo(`[data-chapter="${id}"]`), 60);
    },
    [scrollTo],
  );

  const ch = story[current];

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 text-paper transition-colors duration-300 ${scrolled ? "bg-carbon" : ""}`}
        initial={{ y: -90 }}
        animate={{ y: ready ? 0 : -90 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Progress line with chapter ticks */}
        <div className="relative h-[2px] w-full bg-paper/15" aria-hidden>
          <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-paper" />
          {ticks.map((t, i) => (
            <span key={i} className="absolute top-0 h-[6px] w-px bg-paper/70" style={{ left: `${t * 100}%` }} />
          ))}
        </div>

        <nav aria-label="Navigation & Chapters" className="flex items-center justify-between gap-4 px-[var(--gutter)] py-4">
          <div className="flex items-center gap-6">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                go("prologue");
              }}
              className="group flex items-center gap-2"
              aria-label="Back to the start"
            >
              <span className="display-lg text-xl tracking-tight transition-transform duration-300 group-hover:scale-105">LC</span>
            </a>

            {/* Direct desktop navigation (Jakob's Law) */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2 border-l border-paper/20 pl-4">
              {NAV_ITEMS.map((item) => {
                const isActive = ch.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => go(item.id)}
                    className={`label relative rounded-full px-3 py-1.5 text-[11px] transition-all duration-300 ${
                      isActive ? "text-paper font-semibold opacity-100" : "opacity-60 hover:opacity-100 hover:bg-paper/10"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="hud-nav-active"
                        className="absolute inset-0 rounded-full border border-paper/40"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="label hidden items-center gap-3 md:flex lg:hidden" aria-live="polite">
            <span className="opacity-60">Chapter</span>
            <span className="tabular-nums">{ch.num}</span>
            <span className="h-px w-8 bg-paper/60" />
            <ScrambleText key={ch.id} text={ch.title} trigger="mount" duration={500} />
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuick(true)}
              aria-label="Open quick resume view"
              className="label min-h-[44px] rounded-full border border-paper/50 px-3.5 py-2 transition-all hover:bg-paper hover:text-carbon sm:px-4 active:scale-95"
            >
              Quick view
            </button>
            <button
              type="button"
              onClick={() => setMenu((m) => !m)}
              aria-expanded={menu}
              aria-controls="chapter-menu"
              aria-label={menu ? "Close menu" : "Open chapters menu"}
              className="label min-h-[44px] rounded-full border border-paper/50 px-3.5 py-2 transition-all hover:bg-paper hover:text-carbon sm:px-4 active:scale-95"
            >
              {menu ? "Close" : "Chapters"}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            id="chapter-menu"
            className="fixed inset-0 z-40 flex flex-col justify-center bg-carbon px-[var(--gutter)] pt-20 text-paper"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
          >
            <ol className="flex flex-col">
              {story.map((c, i) => (
                <li key={c.id} className="overflow-hidden border-b border-paper/10">
                  <motion.button
                    type="button"
                    onClick={() => go(c.id)}
                    className="group flex w-full items-baseline gap-5 py-2 text-left md:py-3"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2 + i * 0.04, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    aria-current={i === current ? "step" : undefined}
                  >
                    <span className={`label w-8 shrink-0 ${i === current ? "text-signal" : "text-ash"}`}>{c.num}</span>
                    <span className={`display-lg text-[clamp(1.8rem,5.5vw,4.6rem)] leading-none transition-colors group-hover:text-signal ${i === current ? "text-signal" : ""}`}>
                      {c.title}
                    </span>
                  </motion.button>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>

      <QuickView open={quick} onClose={() => setQuick(false)} />
      <QuickDock onOpenQuickView={() => setQuick(true)} />
    </>
  );
}
