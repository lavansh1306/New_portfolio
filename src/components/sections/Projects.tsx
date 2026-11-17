"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { projects, type Project } from "@/content/profile";
import { MoreWork } from "@/components/projects/MoreWork";

const featured = projects.filter((p) => p.featured);
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { Magnetic } from "@/components/ui/Magnetic";

function ProjectPanel({ p, i }: { p: Project; i: number }) {
  const dark = p.tone === "dark";
  const ink = dark ? "#f1ede4" : "#111312";
  const muted = dark ? "text-ash" : "text-graphite";
  const rule = dark ? "border-paper/15" : "border-carbon/15";

  return (
    <article
      className={`project-panel relative flex w-full shrink-0 flex-col overflow-hidden rounded-md lg:h-[min(80svh,800px)] lg:w-[min(88vw,1320px)] ${
        dark ? "bg-carbon text-paper" : "bg-paper-2 text-carbon"
      }`}
      aria-labelledby={`p-${p.id}`}
    >
      <div className="grid flex-1 gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10">
        {/* Text column */}
        <div className="flex flex-col lg:col-span-6">
          <div className={`flex items-center justify-between border-b pb-4 ${rule}`}>
            <span className="label" style={{ color: p.accent }}>
              {String(i + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}
            </span>
            <span className={`label ${muted}`}>{p.kind}</span>
          </div>

          <h3 id={`p-${p.id}`} className="display-xl mt-6 text-[clamp(2.6rem,4.4vw,5.2rem)]">
            {p.name}
          </h3>
          <p className={`serif-i mt-4 max-w-xl text-[clamp(1.25rem,1.7vw,1.7rem)] leading-tight ${muted}`}>{p.tagline}</p>
          {p.context && (
            <p className="label mt-3" style={{ color: p.accent }}>
              {p.context}
            </p>
          )}

          <dl className="mt-8 grid gap-5 text-[0.95rem] leading-relaxed lg:mt-auto">
            <div className="grid gap-1 sm:grid-cols-4">
              <dt className={`label pt-1 ${muted}`}>Problem</dt>
              <dd className="sm:col-span-3">{p.problem}</dd>
            </div>
            <div className="grid gap-1 sm:grid-cols-4">
              <dt className={`label pt-1 ${muted}`}>What I built</dt>
              <dd className="sm:col-span-3">
                <ul className="grid gap-1.5">
                  {p.built.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span aria-hidden style={{ color: p.accent }}>
                        →
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="grid gap-1 sm:grid-cols-4">
              <dt className={`label pt-1 ${muted}`}>Key decision</dt>
              <dd className="sm:col-span-3">{p.decision}</dd>
            </div>
          </dl>
        </div>

        {/* Visual column */}
        <div className="flex flex-col gap-4 lg:col-span-6">
          <div className={`project-visual relative aspect-[4/3] w-full border ${rule} lg:aspect-auto lg:flex-1`}>
            <span className={`label absolute left-3 top-3 ${muted}`}>Fig. {String(i + 1).padStart(2, "0")} — system overview</span>
            <div className="absolute inset-0 p-6 pt-10">
              <ProjectVisual kind={p.visual} ink={ink} accent={p.accent} label={`Animated diagram of ${p.name}: ${p.tagline}`} />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
              {p.stack.map((s) => (
                <li key={s} className={`mono rounded-full border px-2.5 py-1 text-[11px] ${rule}`}>
                  {s}
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              {p.repo && (
                <Magnetic>
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor-label="Code"
                    className={`label flex items-center gap-1.5 rounded-full border px-4 py-2.5 transition-colors ${dark ? "border-paper/40 hover:bg-paper hover:text-carbon" : "border-carbon/40 hover:bg-carbon hover:text-paper"}`}
                  >
                    GitHub <ArrowUpRight size={13} aria-hidden />
                  </a>
                </Magnetic>
              )}
              {p.live && (
                <Magnetic>
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor-label="Open"
                    className="label flex items-center gap-1.5 rounded-full px-4 py-2.5 text-carbon"
                    style={{ background: p.accent }}
                  >
                    Live <ArrowUpRight size={13} aria-hidden />
                  </a>
                </Magnetic>
              )}
              {!p.repo && !p.live && <span className={`label ${muted}`}>Code on request</span>}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
              if (count.current) {
                const n = Math.min(featured.length, Math.floor(self.progress * featured.length) + 1);
                count.current.textContent = String(n).padStart(2, "0");
              }
            },
          },
        });
        // Depth: diagrams drift against the scroll direction inside each panel.
        gsap.utils.toArray<HTMLElement>(".project-panel").forEach((panel) => {
          const visual = panel.querySelector(".project-visual");
          if (!visual) return;
          gsap.fromTo(
            visual,
            { xPercent: 5 },
            {
              xPercent: -5,
              ease: "none",
              scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: pin },
  );

  return (
    <section id="work" aria-label="Selected projects" className="relative z-10 bg-paper text-carbon">
      <div className="px-[var(--gutter)] pb-16 pt-28 md:pt-40">
        <SectionHeader index="04" label="Selected work" title="Projects built for real constraints" kicker="A selection of systems, products and experiments with a practical outcome." />
      </div>

      <div ref={pin} className="relative lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:overflow-hidden">
        <div ref={track} className="flex flex-col gap-6 px-[var(--gutter)] pb-24 lg:w-max lg:flex-row lg:gap-8 lg:pb-0">
          {featured.map((p, i) => (
            <ProjectPanel key={p.id} p={p} i={i} />
          ))}
          <div className="hidden w-[30vw] shrink-0 flex-col justify-center gap-4 pr-[var(--gutter)] lg:flex">
            <p className="serif-i text-4xl leading-tight">Four more below, and more experiments on GitHub.</p>
            <a
              href="https://github.com/lavansh1306"
              target="_blank"
              rel="noreferrer"
              className="label flex items-center gap-2 text-signal"
              data-cursor-label="Open"
            >
              github.com/lavansh1306 <ArrowUpRight size={14} aria-hidden />
            </a>
          </div>
        </div>

        <div className="absolute inset-x-[var(--gutter)] bottom-6 hidden items-center gap-4 lg:flex" aria-hidden>
          <span className="label tabular-nums">
            <span ref={count}>01</span> / {String(featured.length).padStart(2, "0")}
          </span>
          <span className="relative h-px flex-1 bg-carbon/15">
            <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-signal" />
          </span>
          <span className="label text-graphite">Scroll →</span>
        </div>
      </div>
      <MoreWork offset={featured.length} />
    </section>
  );
}
