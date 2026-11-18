"use client";

import { motion } from "motion/react";
import { photos, principles, profile } from "@/content/profile";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Beyond() {
  return (
    <section aria-label="How I work" className="relative z-10 bg-paper-2 px-[var(--gutter)] py-28 text-carbon md:py-40">
      <SectionHeader index="07" label="Working principles" title="How I work" kicker="Four habits shaped by shipping, reviewing and learning in public." />

      <div className="mt-20 grid gap-10 lg:grid-cols-12">
      <figure className="relative lg:col-span-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photos.stream.src} alt={photos.stream.alt} width={photos.stream.w} height={photos.stream.h} loading="lazy" decoding="async" className="aspect-[3/4] w-full object-cover grayscale transition-[filter] duration-700 hover:grayscale-0" />
        <figcaption className="label mt-3 text-graphite">Fig. 07 — offline</figcaption>
      </figure>
      <ol className="grid gap-px self-start bg-carbon/15 md:grid-cols-2 lg:col-span-8">
        {principles.map((p, i) => (
          <motion.li
            key={p.title}
            className="group relative flex min-h-[18rem] flex-col justify-between overflow-hidden bg-paper-2 p-6 md:p-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: (i % 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="serif text-[6rem] leading-[0.8] text-carbon/15 transition-colors duration-500 group-hover:text-signal">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="display-lg text-[clamp(1.7rem,2.8vw,2.6rem)]">{p.title}</h3>
              <p className="mt-3 max-w-md text-[1.02rem] leading-relaxed text-graphite">{p.body}</p>
            </div>
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-signal transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
          </motion.li>
        ))}
      </ol>
      </div>

      <div className="mt-16 flex flex-col gap-4 md:flex-row md:items-baseline md:gap-10">
        <span className="label shrink-0 text-graphite">Coursework so far</span>
        <ul className="flex flex-wrap gap-2">
          {profile.education.coursework.map((c) => (
            <li key={c} className="mono rounded-full border border-carbon/20 px-3 py-1.5 text-xs">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
