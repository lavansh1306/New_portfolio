"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react";
import { photos, profile, story, sunsetSun } from "@/content/profile";
import { storyStore } from "@/lib/storyStore";
import { useApp } from "@/components/providers/AppProvider";
import { Magnetic } from "@/components/ui/Magnetic";
import { Scene } from "./Scene";

const chapter = story.find((c) => c.id === "signal")!;

/** Epilogue: dawn. The visual resolves into the contact details. */
export function Epilogue() {
  const { scrollTo, reducedMotion } = useApp();
  const sunRef = useRef<HTMLSpanElement>(null);
  const [photoIn, setPhotoIn] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    if (sunRef.current) storyStore.anchors.sun = sunRef.current;
    const f = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: profile.timezone });
    const u = () => setTime(f.format(new Date()));
    u();
    const id = setInterval(u, 15000);
    return () => {
      clearInterval(id);
      delete storyStore.anchors.sun;
    };
  }, []);

  const onProgress = useCallback((p: number) => {
    const h = Math.min(1, Math.max(0, (p - 0.5) / 0.22));
    storyStore.handover = h;
    setPhotoIn(Math.round(h * 20) / 20);
    setReveal(p > 0.62);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const show = reveal || reducedMotion;

  return (
    <Scene chapter={chapter} length={3.4} onProgress={onProgress} timing={{ titleIn: 0.14, titleOut: 0.36, linesAt: 0.38, linesSpan: 0.14, morphEnd: 0.42 }}>
      <div className="absolute inset-0 grid grid-rows-[minmax(0,30svh)_1fr] gap-4 px-[var(--gutter)] pb-8 pt-24 md:grid-cols-12 md:grid-rows-1 md:items-center md:gap-10 md:pt-20">
        {/* The photo that anchors the closing scene. */}
        <figure className="relative mx-auto h-full max-h-[78svh] md:order-2 md:col-span-5 md:h-auto md:w-full">
          <div className="relative mx-auto aspect-[3/4] h-full md:h-auto md:w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos.sunset.src}
              alt={photos.sunset.alt}
              width={photos.sunset.w}
              height={photos.sunset.h}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-[clip-path] duration-700"
              style={{ opacity: reducedMotion ? 1 : photoIn, clipPath: `inset(${(1 - (reducedMotion ? 1 : photoIn)) * 50}% 0% ${(1 - (reducedMotion ? 1 : photoIn)) * 50}% 0%)` }}
            />
            <span
              ref={sunRef}
              aria-hidden
              className="absolute block aspect-square w-[7%] -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${sunsetSun.x * 100}%`, top: `${sunsetSun.y * 100}%` }}
            />
            <figcaption className="label absolute -bottom-6 left-0 text-[10px] text-ash" style={{ opacity: show ? 1 : 0 }}>
              Fig. 08 — contact, at dawn
            </figcaption>
          </div>
        </figure>

        {/* Contact */}
        <div className="flex min-h-0 flex-col justify-end gap-6 text-paper md:order-1 md:col-span-7 md:justify-center">
          <AnimatePresence>
            {show && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-paper/25 px-3.5 py-1 text-xs mono text-paper">
                  <span className="live-dot inline-block h-2 w-2 rounded-full bg-signal" />
                  <span>Open for Software & AI Engineering roles</span>
                </div>
                <h2 className="display-xl text-[clamp(2.1rem,7vw,7.4rem)]">
                  Let’s build something <span className="text-signal">useful.</span>
                </h2>
                <div className="mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
                  <Magnetic strength={0.2}>
                    <button
                      type="button"
                      onClick={copy}
                      data-cursor-label={copied ? "Copied" : "Copy"}
                      className="group flex min-h-[48px] items-center gap-3 rounded-full bg-paper py-3 pl-6 pr-3 text-carbon transition-transform active:scale-[0.98] shadow-lg"
                      aria-label={copied ? "Email copied" : `Copy email address ${profile.email}`}
                    >
                      <span className="display-lg text-[clamp(0.95rem,1.8vw,1.5rem)] normal-case">{profile.email}</span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-carbon text-paper">
                        {copied ? <Check size={18} /> : <Copy size={16} />}
                      </span>
                    </button>
                  </Magnetic>
                  <a
                    href={`mailto:${profile.email}`}
                    className="label flex min-h-[48px] items-center gap-2 rounded-full border border-paper/40 px-5 py-3 text-paper transition-colors hover:border-paper hover:bg-paper hover:text-carbon active:scale-95"
                  >
                    Send Email <ArrowUpRight size={14} aria-hidden />
                  </a>
                  <span className="label text-ash" aria-live="polite">
                    {copied ? "Copied to clipboard!" : ""}
                  </span>
                </div>
                <ul className="mt-5 grid max-w-xl grid-cols-3 border-t border-paper/20 sm:mt-8">
                  {[
                    { label: "GitHub", href: profile.links.github },
                    { label: "LinkedIn", href: profile.links.linkedin },
                    { label: "Email", href: `mailto:${profile.email}` },
                  ].map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        target={l.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="group flex items-center gap-1.5 py-3 pr-4"
                        data-cursor-label="Open"
                      >
                        <span className="display-lg text-lg transition-colors group-hover:text-signal sm:text-2xl">{l.label}</span>
                        <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                      </a>
                    </li>
                  ))}
                </ul>
                <footer className="mono mt-4 flex sm:mt-8 flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ash">
                  <span>IST {time}</span>
                  <span>
                    © {new Date().getFullYear()} {profile.firstName} {profile.lastName}
                  </span>
                  <button type="button" onClick={() => scrollTo(0)} className="flex items-center gap-1.5 underline-offset-4 hover:underline">
                    <ArrowUp size={12} /> Back to the start
                  </button>
                </footer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Scene>
  );
}
