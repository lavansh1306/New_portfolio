"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { cities, journey, story } from "@/content/profile";
import { storyStore } from "@/lib/storyStore";
import { Scene } from "./Scene";

const START = 0.42;
const END = 0.94;

/**
 * A map chapter: the signal travels the journey from stop `from` to stop `to`.
 * "Roots" covers where Lavansh was born and grew up; "The Road" covers where he went as a builder.
 */
export function JourneyScene({ chapterId }: { chapterId: "roots" | "road" }) {
  const chapter = story.find((c) => c.id === chapterId)!;
  const idxs = journey.map((s, i) => (s.chapter === chapterId ? i : -1)).filter((i) => i >= 0);
  const first = idxs[0];
  const last = idxs[idxs.length - 1];
  const [active, setActive] = useState(-1);

  const onProgress = useCallback(
    (p: number) => {
      const r = Math.min(1, Math.max(0, (p - START) / (END - START)));
      // Dwell points: each stop (The Road also starts from the last stop of Roots)
      const startAt = first === 0 ? first : first - 1;
      const segments = last - startAt;
      // Pause at each stop (card + steady map), then travel to the next one; hold at the end
      const x = Math.min(segments, r * (segments + 0.5));
      const k = Math.min(Math.floor(x), segments - 1);
      const f = x - k;
      const t = Math.min(1, Math.max(0, (f - 0.4) / 0.6));
      const road = p < START ? (first === 0 ? -1 : startAt) : startAt + k + t * t * (3 - 2 * t);
      storyStore.road = road;
      const idx = p < START ? -1 : Math.min(last, Math.max(first, Math.floor(road + 0.08)));
      setActive((a) => (a === idx ? a : road < first - 0.05 ? -1 : idx));
    },
    [first, last],
  );

  const stop = active >= 0 ? journey[active] : null;
  const city = stop ? cities.find((c) => c.id === stop.city) : null;

  return (
    <Scene
      chapter={chapter}
      length={1.6 + idxs.length * 0.75}
      onProgress={onProgress}
      timing={{ titleIn: 0.1, titleOut: 0.24, linesAt: 0.26, linesSpan: 0.15, morphEnd: 0.24 }}
    >
      <div className="pointer-events-none absolute inset-x-[var(--gutter)] top-24 md:inset-x-auto md:right-[var(--gutter)] md:top-1/2 md:w-[min(36vw,440px)] md:-translate-y-1/2">
        <AnimatePresence mode="wait">
          {stop && city && (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-paper"
            >
              <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-signal">
                <span>{stop.kicker}</span>
                <span className="h-px w-8 bg-signal" />
                <span>{city.name}</span>
                <span className="text-ash">
                  {String(active - first + 1).padStart(2, "0")} / {String(idxs.length).padStart(2, "0")}
                </span>
              </p>
              <h3 className="display-lg mt-3 text-[clamp(1.7rem,3vw,2.8rem)]">{stop.title}</h3>
              <p className="mono mt-2 max-w-sm text-sm text-ash">{stop.note}</p>

              {stop.photos.length > 0 && (
                <div className="relative mt-6 hidden h-[min(40svh,340px)] sm:block">
                  {stop.photos.map((ph, i) => {
                    const n = stop.photos.length;
                    const rot = n === 1 ? -3 : -8 + (i * 16) / (n - 1);
                    const wide = ph.w > ph.h;
                    return (
                      <motion.figure
                        key={ph.src}
                        initial={{ opacity: 0, y: 40, rotate: 0 }}
                        animate={{ opacity: 1, y: 0, rotate: rot }}
                        transition={{ delay: 0.1 + i * 0.09, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className={`absolute top-0 bg-paper p-1.5 pb-7 shadow-[0_18px_40px_rgba(0,0,0,0.6)] ${wide ? "w-[64%]" : "w-[44%]"}`}
                        style={{ left: n === 1 ? "18%" : `${(i * (wide ? 36 : 54)) / (n - 1)}%`, top: wide ? "12%" : 0 }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ph.src}
                          alt={ph.alt}
                          width={ph.w}
                          height={ph.h}
                          loading="lazy"
                          decoding="async"
                          className={`w-full object-cover grayscale-[0.3] ${wide ? "aspect-[4/3]" : "aspect-[3/4]"}`}
                        />
                        <figcaption className="label absolute inset-x-2 bottom-2 truncate text-[8px] text-carbon">{ph.caption}</figcaption>
                      </motion.figure>
                    );
                  })}
                </div>
              )}
              {stop.photos.length > 0 && (
                <div className="mt-4 flex gap-2 sm:hidden">
                  {stop.photos.slice(0, 3).map((ph) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={ph.src} src={ph.src} alt={ph.alt} loading="lazy" decoding="async" className="aspect-[3/4] w-[30%] border-2 border-paper object-cover" />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Scene>
  );
}
