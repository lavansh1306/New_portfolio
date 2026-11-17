"use client";

import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { chapters, leadershipStats } from "@/content/profile";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useApp } from "@/components/providers/AppProvider";

export function CountUp({ to, suffix = "", className }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = `${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, to, suffix]);
  return (
    <span ref={ref} className={className} aria-label={`${to}${suffix}`}>
      {to}
      {suffix}
    </span>
  );
}

const KIND_LABEL = { work: "Work", leadership: "Leadership", education: "Education" } as const;

export function Experience() {
  const { reducedMotion } = useApp();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion) return;
      gsap.fromTo(
        ".timeline-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".timeline", start: "top 70%", end: "bottom 60%", scrub: true },
        },
      );
      gsap.utils.toArray<HTMLElement>(".chapter").forEach((el) => {
        gsap.from(el.querySelectorAll(".ch-in"), {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
        });
        gsap.fromTo(
          el.querySelector(".ch-dot"),
          { scale: 0 },
          { scale: 1, duration: 0.6, ease: "back.out(3)", scrollTrigger: { trigger: el, start: "top 62%" } },
        );
      });
    },
    { scope: root, dependencies: [reducedMotion] },
  );

  return (
    <section ref={root} id="experience" aria-label="Experience and leadership" className="relative z-10 bg-carbon px-[var(--gutter)] py-28 text-paper md:py-40">
      <SectionHeader index="05" label="Experience" title="Work & leadership" kicker="Code matters. So does running the room." tone="dark" />

      <div className="mt-20 grid gap-16 lg:grid-cols-12">
        {/* Sticky side: leadership callout */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="label text-ash">Beyond the code</p>
            <p className="serif-i mt-4 text-3xl leading-tight">
              Joined PLACFV’s, SRM’s student placement team, as a volunteer. Now I lead one of its corporate groups.
            </p>
            <ol className="mt-8 flex flex-col gap-0" aria-label="Role progression at PLACFV’s">
              {(chapters.find((c) => c.progression)?.progression ?? []).map((step, i, arr) => (
                <li key={step.role} className="relative flex items-start gap-4 pb-5 last:pb-0">
                  {i < arr.length - 1 && <span aria-hidden className="absolute left-[5px] top-4 h-full w-px bg-paper/20" />}
                  <span
                    aria-hidden
                    className={`relative mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border ${step.current ? "live-dot border-signal bg-signal text-signal" : "border-paper/50 bg-carbon"}`}
                  />
                  <span className="flex flex-col">
                    <span className={`display-lg text-xl ${step.current ? "text-signal" : ""}`}>{step.role}</span>
                    {step.note && <span className="mono text-xs text-ash">{step.note}</span>}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-10 grid grid-cols-2 gap-px bg-paper/15">
              {leadershipStats.map((s) => (
                <div key={s.label} className="bg-carbon py-5 pr-4 [&+&]:pl-5">
                  <CountUp to={s.value} suffix={s.suffix} className="display-xl block text-[clamp(3rem,6vw,5.5rem)] text-signal" />
                  <span className="mono mt-2 block text-xs text-ash">{s.label}</span>
                </div>
              ))}
            </div>
            <p className="mono mt-6 text-sm text-ash">Recruiter communication, volunteer coordination, drives run end-to-end.</p>
          </div>
        </aside>

        {/* Timeline */}
        <ol className="timeline relative lg:col-span-8">
          <span aria-hidden className="absolute bottom-0 left-[7px] top-0 w-px bg-paper/10" />
          <span aria-hidden className="timeline-line absolute bottom-0 left-[7px] top-0 w-px origin-top bg-signal" />
          {chapters.map((c) => (
            <li key={c.org} className="chapter relative pb-16 pl-12 last:pb-0">
              <span aria-hidden className="ch-dot absolute left-0 top-2 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-signal bg-carbon">
                <span className="h-[5px] w-[5px] rounded-full bg-signal" />
              </span>
              <div className="ch-in flex flex-wrap items-center gap-3">
                <span className="label text-ash">{c.period}</span>
                <span className="label rounded-full border border-paper/20 px-2 py-0.5 text-ash">{KIND_LABEL[c.kind]}</span>
                {c.current && (
                  <span className="label flex items-center gap-2 text-signal">
                    <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-signal" /> Current
                  </span>
                )}
              </div>
              <h3 className="ch-in display-lg mt-4 text-[clamp(1.9rem,3.6vw,3.4rem)]">{c.org}</h3>
              <p className="ch-in serif-i mt-1 text-2xl text-signal-soft">{c.role}</p>
              <p className="ch-in mono mt-3 text-xs text-ash">{c.context}</p>
              {c.progression && (
                <p className="ch-in mono mt-3 flex flex-wrap items-center gap-2 text-xs">
                  {c.progression.map((st, i) => (
                    <span key={st.role} className="flex items-center gap-2">
                      <span className={st.current ? "text-signal" : "text-paper/80"}>{st.role}</span>
                      {i < c.progression!.length - 1 && <span aria-hidden className="text-ash">→</span>}
                    </span>
                  ))}
                </p>
              )}
              <ul className="mt-6 grid gap-3">
                {c.points.map((pt) => (
                  <motion.li key={pt} className="ch-in flex gap-3 text-[1.02rem] leading-relaxed text-paper/90">
                    <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-signal" />
                    {pt}
                  </motion.li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
