"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { about, photos, profile, signals } from "@/content/profile";
import { DotPortrait } from "@/components/story/DotPortrait";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { useApp } from "@/components/providers/AppProvider";

function SignalRow({ noise, signal, source, i }: { noise: string; signal: string; source: string; i: number }) {
  return (
    <motion.li
      className="group relative grid grid-cols-12 items-center gap-x-4 gap-y-2 border-t border-carbon/15 py-5 md:py-6"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.8, delay: (i % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      data-cursor="hover"
    >
      <span
        aria-hidden
        className="absolute inset-0 origin-bottom scale-y-0 bg-carbon transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-y-100"
      />
      <span className="label relative col-span-12 text-graphite transition-colors duration-500 group-hover:text-ash md:col-span-1 md:pl-3">
        {String(i + 1).padStart(2, "0")}
      </span>
      <span className="mono relative col-span-12 text-sm text-graphite transition-colors duration-500 group-hover:text-ash md:col-span-4">
        <ScrambleText text={noise} trigger="hover" />
      </span>
      <span aria-hidden className="relative col-span-1 hidden h-px md:block">
        <span className="absolute inset-0 origin-left scale-x-50 bg-carbon/30 transition-all duration-500 group-hover:scale-x-100 group-hover:bg-signal" />
      </span>
      <span className="display-lg relative col-span-12 text-[clamp(1.35rem,2.2vw,2.1rem)] leading-[1.02] transition-colors duration-500 group-hover:text-paper md:col-span-4">
        {signal}
      </span>
      <span className="label relative col-span-12 text-graphite transition-colors duration-500 group-hover:text-signal md:col-span-2 md:pr-3 md:text-right">
        {source}
      </span>
    </motion.li>
  );
}

export function About() {
  const { reducedMotion } = useApp();
  const shell = useRef<HTMLDivElement>(null);
  const statement = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (reducedMotion) return;
      // Paper panel opens up as it slides over the hero.
      gsap.fromTo(
        shell.current,
        { clipPath: "inset(0% 3.5% 0% 3.5% round 36px 36px 0px 0px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)",
          ease: "none",
          scrollTrigger: { trigger: shell.current, start: "top bottom", end: "top 20%", scrub: true },
        },
      );
      // Statement resolves word by word as you read.
      const words = statement.current?.querySelectorAll(".w");
      if (words?.length) {
        gsap.fromTo(
          words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: statement.current, start: "top 78%", end: "bottom 50%", scrub: true },
          },
        );
      }
    },
    { scope: shell, dependencies: [reducedMotion] },
  );

  return (
    <div ref={shell} id="about" className="relative z-10 -mt-[1px] bg-paper text-carbon">
      <section aria-label="About" className="px-[var(--gutter)] pb-24 pt-28 md:pb-36 md:pt-40">
        <SectionHeader index="01" label="About" title="The human behind the code" kicker="B.Tech CSE, class of 2028. Interning since first year." />

        <div className="mt-20 grid gap-14 md:mt-28 md:grid-cols-12">
          {/* Spec sheet */}
          <aside className="md:col-span-4">
            <div className="md:sticky md:top-24">
              <DotPortrait photo={photos.portrait} className="mb-6 aspect-[4/5] w-full max-w-sm" />
              <dl className="border-t border-carbon">
                {[
                  ["Name", `${profile.firstName} ${profile.lastName}`],
                  ["Based", "India · IST"],
                  ["Studying", `${profile.education.degree.split(",")[0]} CSE, SRM IST`],
                  ["Focus", "Full-stack · AI · Real-time systems"],
                  ["Now", "AI Engineering Intern, C-DAC"],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-3 border-b border-carbon/15 py-3">
                    <dt className="label text-graphite">{k}</dt>
                    <dd className="mono col-span-2 text-sm">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="label mt-4 text-graphite">Fig. 01 — spec sheet</p>
            </div>
          </aside>

          <div className="md:col-span-8">
            <p ref={statement} className="text-[clamp(1.5rem,3vw,2.9rem)] font-[450] leading-[1.12] tracking-[-0.02em]">
              {about.statement.split(" ").map((w, i) => (
                <span key={i} className="w">
                  {w}{" "}
                </span>
              ))}
            </p>

            <div className="mt-16 grid gap-px overflow-hidden rounded-sm bg-carbon/15 sm:grid-cols-3">
              {about.facts.map((f) => (
                <div key={f.label} className="flex flex-col gap-6 bg-paper p-5">
                  <span className="label text-graphite">{f.label}</span>
                  <span>
                    <span className="display-lg block text-2xl">{f.value}</span>
                    <span className="serif mt-1 block text-lg text-graphite">{f.note}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Practical outcomes: the thread running through the work */}
      <section aria-labelledby="signal-title" className="px-[var(--gutter)] pb-28 md:pb-40">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h3 id="signal-title" className="display-lg max-w-3xl text-[clamp(2rem,4.6vw,4.4rem)]">
            From problem <span className="serif font-normal text-signal">to outcome.</span>
          </h3>
          <p className="mono max-w-sm text-sm text-graphite">
            The same approach, again and again: understand the constraint, verify the result, and make the system useful. Hover a row.
          </p>
        </div>
        <div className="label mb-2 hidden grid-cols-12 gap-4 text-graphite md:grid">
          <span className="col-span-1 pl-3">#</span>
          <span className="col-span-4">Starting point</span>
          <span className="col-span-1" />
          <span className="col-span-4">Outcome</span>
          <span className="col-span-2 pr-3 text-right">Where</span>
        </div>
        <ul className="border-b border-carbon/15">
          {signals.map((s, i) => (
            <SignalRow key={s.source} {...s} i={i} />
          ))}
        </ul>
      </section>
    </div>
  );
}
