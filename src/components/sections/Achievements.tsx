"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { hasWebGL } from "@/lib/device";
import { useApp } from "@/components/providers/AppProvider";
import { certifications, podium, results } from "@/content/profile";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { CountUp } from "./Experience";

const Podium3D = dynamic(() => import("@/components/three/Podium3D"), { ssr: false });

const badge: Record<string, string> = {
  Winner: "bg-signal text-carbon border-signal",
  "1st Runner-Up": "border-carbon text-carbon",
  "2nd Runner-Up": "border-carbon/50 text-carbon",
  Finalist: "border-dashed border-carbon/50 text-graphite",
};

export function Achievements() {
  const marquee = results.map((r) => r.event).join("  ·  ");
  const { reducedMotion } = useApp();
  const podiumRef = useRef<HTMLElement>(null);
  const [podiumVisible, setPodiumVisible] = useState(false);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    setWebgl(hasWebGL());
    const io = new IntersectionObserver(([e]) => setPodiumVisible(e.isIntersecting), { threshold: 0.25 });
    if (podiumRef.current) io.observe(podiumRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section id="podium" aria-label="Achievements and certifications" className="relative z-10 overflow-hidden bg-paper text-carbon">
      {/* Outline marquee of every event */}
      <div aria-hidden className="border-y border-carbon/15 py-5">
        <div className="marquee-track flex w-max whitespace-nowrap" style={{ ["--marquee-dur" as string]: "60s" }}>
          {[0, 1].map((k) => (
            <span key={k} className="display-xl outline-text pr-8 text-[clamp(3rem,7vw,6.5rem)] uppercase text-carbon/70">
              {marquee}  ·
            </span>
          ))}
        </div>
      </div>

      <div className="px-[var(--gutter)] pb-28 pt-24 md:pb-40 md:pt-32">
        <SectionHeader index="06" label="Achievements" title="Results that show the work" kicker="Hackathons and ideathons, at national and university level." />

        <div className="mt-20 grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="flex items-end gap-4">
                <span className="flex items-start">
                  <CountUp to={podium.count} className="display-xl text-[clamp(6rem,11vw,10rem)] leading-[0.78] text-carbon" />
                  <span className="display-xl mt-2 text-[clamp(2.4rem,4vw,4rem)] text-signal">×</span>
                </span>
                <span className="serif pb-1 text-3xl leading-none">podium finishes</span>
              </div>

              <figure ref={podiumRef} className="relative mt-8 aspect-[4/3] w-full border border-carbon/15 bg-paper-2" data-cursor-label="Drag">
                <figcaption className="pointer-events-none absolute inset-x-3 top-3 z-[1] flex justify-between">
                  <span className="label text-[10px] text-graphite">Fig. 06 — one coin per finish</span>
                  <span className="label text-[10px] text-graphite">drag</span>
                </figcaption>
                <div className="absolute inset-0">
                  {webgl ? (
                    <Podium3D active={podiumVisible} reducedMotion={reducedMotion} />
                  ) : (
                    <div className="flex h-full items-end justify-center gap-2 p-10">
                      {[
                        ["1st RU ×4", "h-2/5"],
                        ["Winner ×3", "h-3/5"],
                        ["2nd RU ×1", "h-1/4"],
                      ].map(([l, h]) => (
                        <div key={l} className={`flex w-1/4 items-center justify-center bg-carbon ${h}`}>
                          <span className="label text-[9px] text-paper">{l}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="sr-only">3D podium: 3 wins, 4 first runner-up finishes, 1 second runner-up finish and 1 finalist spot.</p>
              </figure>

              <div className="mt-8 flex items-baseline gap-4 border-t border-carbon/15 pt-6">
                <span className="display-lg text-5xl">{podium.prize}</span>
                <span className="mono text-sm text-graphite">in cash prizes</span>
              </div>
              <p className="mono mt-4 text-sm text-graphite">Plus finalist spots at several other national and university-level hackathons.</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="label mb-3 grid grid-cols-12 gap-4 text-graphite">
              <span className="col-span-4 sm:col-span-3">Result</span>
              <span className="col-span-8 sm:col-span-9">Event</span>
            </div>
            <ol className="border-t border-carbon">
              {results.map((r, i) => (
                <motion.li
                  key={r.event}
                  className="group grid grid-cols-12 items-center gap-4 border-b border-carbon/15 py-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.7, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="col-span-4 sm:col-span-3">
                    <span className={`label inline-block whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] ${badge[r.result]}`}>{r.result}</span>
                  </span>
                  <span className="col-span-8 flex flex-wrap items-baseline justify-between gap-x-4 sm:col-span-9">
                    <span className="display-lg text-[clamp(1.25rem,2.2vw,2rem)] transition-transform duration-500 group-hover:translate-x-2">
                      <ScrambleText text={r.event} duration={700} delay={i * 60} />
                    </span>
                    {r.note && <span className="mono text-xs text-graphite">{r.note}</span>}
                  </span>
                </motion.li>
              ))}
            </ol>

            <div className="mt-16">
              <p className="label text-graphite">Certifications</p>
              <ul className="mt-4 grid gap-px bg-carbon/15 sm:grid-cols-2">
                {certifications.map((c) => (
                  <li key={c.name} className="flex flex-col gap-6 bg-paper-2 p-6">
                    <span className="label flex items-center justify-between text-graphite">
                      <span>{c.issuer}</span>
                      <span>{c.year}</span>
                    </span>
                    <span className="display-lg text-2xl">{c.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
