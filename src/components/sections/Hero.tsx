"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { storyStore } from "@/lib/storyStore";
import { profile, story } from "@/content/profile";
import { useApp } from "@/components/providers/AppProvider";
import { useSceneTrigger } from "@/components/story/Scene";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { Magnetic } from "@/components/ui/Magnetic";

const nameLines = [profile.firstName.toUpperCase(), profile.lastName.toUpperCase()];

function Corner({ className }: { className: string }) {
  return <span aria-hidden className={`absolute h-4 w-4 border-paper/40 ${className}`} />;
}

/** Prologue: the interactive introduction and visual anchor for the portfolio. */
export function Hero() {
  const { ready, reducedMotion, scrollTo } = useApp();
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLElement>(null);
  const snrRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useSceneTrigger(section, {
    index: 0,
    from: "storm",
    to: "cube",
    fromSky: story[0].sky,
    toSky: story[0].sky,
    morphEnd: 0.62,
    start: "top top",
    onProgress: (p) => {
      const v = Math.min(1, p / 0.62);
      if (snrRef.current) snrRef.current.textContent = String(Math.round(v * 100)).padStart(3, "0");
      if (barRef.current) barRef.current.style.transform = `scaleX(${v})`;
    },
  });

  useEffect(() => {
    if (frame.current) storyStore.anchors.core = frame.current;
    return () => {
      delete storyStore.anchors.core;
    };
  }, []);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });
  const nameX = useTransform(smx, (v) => v * -10);
  const nameY = useTransform(smy, (v) => v * 6);

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    mx.set((e.clientX / window.innerWidth) * 2 - 1);
    my.set(-((e.clientY / window.innerHeight) * 2 - 1));
  };

  useGSAP(
    () => {
      if (!ready) return;
      const q = gsap.utils.selector(section);
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(q(".hero-char"), { yPercent: 118, rotate: 6, duration: 1.4, stagger: 0.035 }, 0.1)
        .from(q(".hero-frame"), { autoAlpha: 0, scale: 0.9, duration: 1.6 }, 0.3)
        .from(q(".hero-fade"), { y: 24, autoAlpha: 0, duration: 1.1, stagger: 0.08 }, 0.6)
        .from(q(".hero-rule"), { scaleX: 0, transformOrigin: "left center", duration: 1.4, ease: "expo.inOut" }, 0.3);
      if (reducedMotion) return;
      gsap
        .timeline({ scrollTrigger: { trigger: section.current, start: "top top", end: "bottom bottom", scrub: true } })
        .to(q(".hero-statement-text"), { autoAlpha: 0, y: -30, duration: 0.16 }, 0.04)
        .fromTo(q(".hero-cap-0"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.16 }, 0.2)
        .to(q(".hero-cap-0"), { autoAlpha: 0, y: -30, duration: 0.14 }, 0.44)
        .fromTo(q(".hero-cap-1"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.16 }, 0.5)
        .to(q(".hero-scroll"), { autoAlpha: 0, duration: 0.1 }, 0.02)
        .to(q(".hero-name"), { autoAlpha: 0.15, duration: 0.2 }, 0.8)
        .set({}, {}, 1);
    },
    { scope: section, dependencies: [ready, reducedMotion] },
  );

  return (
    <section
      id="top"
      ref={section}
      data-scene="prologue"
      className="relative z-10 text-paper"
      style={{ height: reducedMotion ? "100svh" : "220svh" }}
      onPointerMove={onPointerMove}
      aria-label="Prologue: introduction"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="relative flex h-full flex-col px-[var(--gutter)] pb-6 pt-24 sm:pt-28">
          <div className="flex justify-between">
            <div className="hero-fade flex flex-col gap-1">
              <span className="label text-ash">Chapter 00 · Overview</span>
              <span className="label">{profile.role}</span>
            </div>
            <div className="hero-fade hidden flex-col items-end gap-1 text-right sm:flex">
              <span className="label text-ash">Currently</span>
              <span className="label flex items-center gap-2">
                <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-signal text-signal" />
                AI Engineering Intern · C-DAC
              </span>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] items-center gap-2 py-3 lg:grid-cols-12 lg:grid-rows-1 lg:gap-6">
            <motion.h1 style={{ x: nameX, y: nameY }} className="hero-name lg:col-span-7" aria-label={`${profile.firstName} ${profile.lastName}`}>
              {nameLines.map((line, li) => (
                <span
                  key={line}
                  aria-hidden
                  className={`display-xl block whitespace-nowrap text-[min(15.4vw,10.5svh)] [font-stretch:108%] lg:text-[min(7.7vw,16svh)] lg:[font-stretch:125%] ${li === 1 ? "pl-[0.55em]" : ""}`}
                >
                  {[...line].map((ch, ci) => (
                    <span key={ci} className="mask">
                      <span className={`hero-char ${li === 1 && ci === line.length - 1 ? "text-signal" : ""}`}>{ch}</span>
                    </span>
                  ))}
                </span>
              ))}
            </motion.h1>

            {/* The interactive visual anchors the introduction. */}
            <figure
              ref={frame}
              className="hero-frame relative mx-auto h-full max-h-[min(58svh,100%)] w-full max-w-[min(100%,58svh)] lg:col-span-5 lg:aspect-square lg:h-auto"
              onPointerEnter={() => (storyStore.coreHover = true)}
              onPointerLeave={() => (storyStore.coreHover = false)}
              data-cursor-label="Tune"
            >
              <Corner className="left-0 top-0 border-l border-t" />
              <Corner className="right-0 top-0 border-r border-t" />
              <Corner className="bottom-0 left-0 border-b border-l" />
              <Corner className="bottom-0 right-0 border-b border-r" />
              <figcaption className="pointer-events-none absolute inset-x-3 top-3 flex justify-between">
                <span className="label text-[10px] text-ash">Fig. 00 — interactive study</span>
                <span className="label text-[10px] tabular-nums text-ash">4,096 pts</span>
              </figcaption>
              <span className="label pointer-events-none absolute bottom-3 left-3 text-[10px] text-ash">Hover to tune · scroll to begin</span>
            </figure>
          </div>

          <div className="grid gap-5 md:grid-cols-12 md:gap-6">
            <div className="hero-rule col-span-full h-px bg-paper/25" />
            <div className="relative md:col-span-7">
              <p className="hero-statement-text hero-fade serif text-[clamp(1.45rem,2.8vw,2.9rem)] leading-[1.02]">{profile.positioning}</p>
              <p aria-hidden className="hero-cap-0 serif invisible absolute inset-0 text-[clamp(1.45rem,2.8vw,2.9rem)] leading-[1.02]">
                Most of what I build starts with a practical problem.
              </p>
              <p aria-hidden className="hero-cap-1 serif invisible absolute inset-0 text-[clamp(1.45rem,2.8vw,2.9rem)] leading-[1.02]">
                This is how I turn it into <span className="text-signal">software people can use.</span>
              </p>
            </div>
            <div className="hero-fade flex flex-wrap items-end gap-2 md:col-span-5 md:justify-end md:gap-3">
              {[
                { href: profile.links.github, label: "GitHub" },
                { href: profile.links.linkedin, label: "LinkedIn" },
                { href: `mailto:${profile.email}`, label: "Email" },
              ].map(({ href, label }) => (
                <Magnetic key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="label flex items-center gap-1.5 rounded-full border border-paper/30 px-4 py-3 transition-colors hover:border-signal hover:bg-signal hover:text-carbon"
                  >
                    {label}
                    <ArrowUpRight size={13} strokeWidth={1.75} aria-hidden />
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-end justify-between">
            <div className="hero-fade flex items-center gap-3">
              <span className="label text-ash">Signal</span>
              <span className="relative block h-px w-16 bg-paper/20 sm:w-32">
                <span ref={barRef} className="absolute inset-0 origin-left scale-x-0 bg-signal" />
              </span>
              <span className="label tabular-nums">
                <span ref={snrRef}>000</span>%
              </span>
            </div>
            <button type="button" onClick={() => scrollTo('[data-chapter="person"]')} className="hero-scroll hero-fade group flex items-center gap-3" aria-label="Begin the story">
              <span className="label hidden sm:inline">
                <ScrambleText text="Scroll to begin" trigger="hover" />
              </span>
              <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-paper/30">
                <ArrowDownRight size={16} className="transition-transform duration-500 group-hover:rotate-45" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
