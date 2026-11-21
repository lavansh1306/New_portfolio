"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { setScene, storyStore } from "@/lib/storyStore";
import { story, type ShapeId, type StoryChapter } from "@/content/profile";
import { useApp } from "@/components/providers/AppProvider";
import { ScrambleText } from "@/components/ui/ScrambleText";

const lerpColor = (a: string, b: string, t: number) => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (p: number, s: number) => (p >> s) & 255;
  const mix = (s: number) => Math.round(ch(pa, s) + (ch(pb, s) - ch(pa, s)) * t);
  return `rgb(${mix(16)}, ${mix(8)}, ${mix(0)})`;
};

type SceneOpts = {
  index: number;
  from: ShapeId;
  to: ShapeId;
  fromSky: string;
  toSky: string;
  /** called with overall progress p (0 when the scene enters from below, 1 when its end reaches the bottom) */
  onProgress?: (p: number) => void;
  /** progress at which the morph into this chapter's shape completes */
  morphEnd?: number;
  /** ScrollTrigger start (default: when the scene enters from below) */
  start?: string;
};

/** Wires a tall section to the world: morph, travel, sky colour, and on-screen tracking. */
export function useSceneTrigger(ref: RefObject<HTMLElement | null>, opts: SceneOpts) {
  const { reducedMotion } = useApp();
  const optsRef = useRef(opts);
  optsRef.current = opts;

  // Track whether this scene is on screen so the world only renders when needed.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let on = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting === on) return;
      on = e.isIntersecting;
      storyStore.visibleScenes += on ? 1 : -1;
      storyStore.notify();
    });
    io.observe(el);
    return () => {
      io.disconnect();
      if (on) {
        storyStore.visibleScenes -= 1;
        storyStore.notify();
      }
    };
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = (p: number) => {
      const o = optsRef.current;
      const t = reducedMotion ? 1 : Math.min(1, Math.max(0, p / (o.morphEnd ?? 0.5)));
      const eased = t * t * (3 - 2 * t);
      setScene(o.from, o.to, eased);
      storyStore.travel = o.index + p;
      document.body.style.backgroundColor = lerpColor(o.fromSky, o.toSky, eased);
      storyStore.dawn = o.to === "sun" ? eased : 0;
      o.onProgress?.(reducedMotion ? 1 : p);
    };
    const st = ScrollTrigger.create({
      trigger: el,
      start: optsRef.current.start ?? "top bottom",
      end: "bottom bottom",
      onUpdate: (self) => apply(self.progress),
      onToggle: (self) => self.isActive && apply(self.progress),
    });
    return () => st.kill();
  }, [ref, reducedMotion]);
}

type Props = {
  chapter: StoryChapter;
  /** scene length in viewport heights */
  length?: number;
  children?: ReactNode;
  onProgress?: (p: number) => void;
  className?: string;
  /** timing, as fractions of the scene's scroll range */
  timing?: { titleIn?: number; titleOut?: number; linesAt?: number; linesSpan?: number; morphEnd?: number };
};

/** A chapter scene: transparent, pinned, the world on stage, a title card, then first-person subtitles. */
export function Scene({ chapter, length = 2.4, children, onProgress, className = "", timing = {} }: Props) {
  const { titleIn = 0.16, titleOut = 0.5, linesAt = 0.56, linesSpan = 0.4, morphEnd = 0.5 } = timing;
  const { reducedMotion } = useApp();
  const section = useRef<HTMLElement>(null);
  const idx = story.findIndex((c) => c.id === chapter.id);
  const prev = story[Math.max(0, idx - 1)];

  useSceneTrigger(section, { index: idx, from: prev.shape, to: chapter.shape, fromSky: prev.sky, toSky: chapter.sky, onProgress, morphEnd });

  useGSAP(
    () => {
      if (reducedMotion) return;
      const q = gsap.utils.selector(section);
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: section.current, start: "top bottom", end: "bottom bottom", scrub: 0.6 },
      });
      tl.set({}, {}, 1)
        .fromTo(q(".sc-num"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.05 }, titleIn)
        .fromTo(q(".sc-title .mask > span"), { yPercent: 110 }, { yPercent: 0, stagger: 0.01, duration: 0.08 }, titleIn + 0.01)
        .fromTo(q(".sc-rule"), { scaleX: 0 }, { scaleX: 1, duration: 0.1 }, titleIn + 0.02)
        .to(q(".sc-card"), { autoAlpha: 0, y: -60, duration: 0.08 }, titleOut);
      const lines = q(".sc-line");
      const span = linesSpan / Math.max(1, lines.length);
      lines.forEach((l, i) => {
        const at = linesAt + i * span;
        tl.fromTo(l, { autoAlpha: 0, y: 24, filter: "blur(6px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: span * 0.3 }, at);
        if (i < lines.length - 1 || chapter.shape === "map" || chapter.shape === "sun") tl.to(l, { autoAlpha: 0, y: -20, duration: span * 0.25 }, at + span * 0.72);
      });
    },
    { scope: section, dependencies: [reducedMotion, titleIn, titleOut, linesAt, linesSpan] },
  );

  return (
    <section
      ref={section}
      data-scene={chapter.id}
      aria-label={`Chapter ${chapter.num}: ${chapter.title}`}
      className={`relative z-10 ${className}`}
      style={{ height: reducedMotion ? "100svh" : `${length * 100}svh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className={`sc-card absolute inset-x-0 top-1/2 -translate-y-1/2 px-[var(--gutter)]`}>
          <p className="sc-num label flex items-center gap-3 text-signal">
            <span>Chapter {chapter.num}</span>
            <span className="sc-rule h-px w-16 origin-left bg-signal" />
          </p>
          <h2 className="sc-title display-xl mt-5 text-[clamp(3.2rem,11vw,11rem)] text-paper" >
            {chapter.title.split(" ").map((w, i) => (
              <span key={i} className="mask mr-[0.25em]">
                <span>{w}</span>
              </span>
            ))}
          </h2>
        </div>

        {children}

        {chapter.lines.length > 0 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-[12svh] px-[var(--gutter)] text-center">
            <div className="relative mx-auto grid max-w-4xl">
              {chapter.lines.map((l, i) => (
                <p
                  key={l}
                  className={`sc-line serif col-start-1 row-start-1 text-[clamp(1.6rem,3.6vw,3.2rem)] leading-[1.05] text-paper ${reducedMotion && i > 0 ? "hidden" : ""}`}
                >
                  {l}
                </p>
              ))}
            </div>
          </div>
        )}

        {chapter.shape !== "sun" && (
          <span className="label pointer-events-none absolute bottom-6 left-[var(--gutter)] text-ash">
            <ScrambleText text={`${chapter.num} / ${chapter.title}`} />
          </span>
        )}
      </div>
    </section>
  );
}
