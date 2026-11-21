"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { projects } from "@/content/profile";
import { ProjectVisual } from "./ProjectVisual";

/** Ranked list for the projects outside the top six. Each row opens into a compact case study. */
export function MoreWork({ offset }: { offset: number }) {
  const rest = projects.filter((p) => !p.featured);
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const allOpen = rest.length > 0 && openIds.length === rest.length;
  const toggleAll = () => {
    setOpenIds(allOpen ? [] : rest.map((p) => p.id));
  };

  return (
    <div className="px-[var(--gutter)] pb-28 pt-20 md:pb-36">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="display-lg text-[clamp(2rem,4vw,3.6rem)]">More work</h3>
          <p className="mono max-w-sm text-sm text-ash">Ranks {offset + 1}–{offset + rest.length}. Open a row for the full story.</p>
        </div>
        <button
          type="button"
          onClick={toggleAll}
          aria-label={allOpen ? "Collapse all case studies" : "Expand all case studies"}
          className="label min-h-[38px] rounded-full border border-paper/30 px-4 py-1.5 text-xs transition-colors hover:bg-paper hover:text-carbon active:scale-95"
        >
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>

      <ol className="border-t border-paper/60">
        {rest.map((p, i) => {
          const isOpen = openIds.includes(p.id);
          const dark = p.tone === "dark";
          return (
            <li key={p.id} className="border-b border-paper/20">
              <h4>
                <button
                  type="button"
                  className="group relative grid w-full grid-cols-12 items-center gap-x-4 gap-y-1 py-6 text-left hover:[--sig:#050606]"
                  aria-expanded={isOpen}
                  aria-controls={`more-${p.id}`}
                  onClick={() => toggle(p.id)}
                  data-cursor-label={isOpen ? "Close" : "Open"}
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-bottom scale-y-0 bg-paper transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-y-100"
                  />
                  <span className="label relative col-span-2 text-ash transition-colors duration-500 group-hover:text-graphite md:col-span-1 md:pl-3">
                    {String(offset + i + 1).padStart(2, "0")}
                  </span>
                  <span className="display-lg relative col-span-8 text-[clamp(1.6rem,3vw,2.8rem)] transition-colors duration-500 group-hover:text-carbon md:col-span-4">
                    {p.name}
                  </span>
                  <span className="relative col-span-2 flex justify-end md:order-last md:col-span-1 md:pr-3">
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="transition-colors duration-500 group-hover:text-signal">
                      <Plus size={22} strokeWidth={1.5} />
                    </motion.span>
                  </span>
                  <span className="serif relative col-span-12 text-lg text-ash transition-colors duration-500 group-hover:text-graphite md:col-span-3">
                    {p.kind}
                  </span>
                  <span className="mono relative col-span-12 text-xs text-ash transition-colors duration-500 group-hover:text-graphite md:col-span-3">
                    {p.stack.slice(0, 3).join(" · ")}
                  </span>
                </button>
              </h4>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`more-${p.id}`}
                    role="region"
                    aria-label={p.name}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-8 pb-10 pt-2 md:grid-cols-12">
                      <div className="flex flex-col gap-5 md:col-span-6 md:col-start-2">
                        <p className="serif text-2xl leading-tight">{p.tagline}</p>
                        <dl className="grid gap-4 text-[0.95rem] leading-relaxed">
                          <div>
                            <dt className="label text-ash">Problem</dt>
                            <dd className="mt-1">{p.problem}</dd>
                          </div>
                          <div>
                            <dt className="label text-ash">What I built</dt>
                            <dd className="mt-1">
                              <ul className="grid gap-1.5">
                                {p.built.map((b) => (
                                  <li key={b} className="flex gap-2">
                                    <span aria-hidden className="text-signal">
                                      →
                                    </span>
                                    {b}
                                  </li>
                                ))}
                              </ul>
                            </dd>
                          </div>
                          <div>
                            <dt className="label text-ash">Key decision</dt>
                            <dd className="mt-1">{p.decision}</dd>
                          </div>
                          <div>
                            <dt className="label text-ash">Why it ranks here</dt>
                            <dd className="mono mt-1 text-sm text-ash">{p.rankNote}</dd>
                          </div>
                        </dl>
                        <div className="flex flex-wrap gap-2">
                          {p.repo && (
                            <a href={p.repo} target="_blank" rel="noreferrer" className="label flex items-center gap-1.5 rounded-full border border-paper/40 px-4 py-2.5 hover:bg-paper hover:text-carbon">
                              GitHub <ArrowUpRight size={13} aria-hidden />
                            </a>
                          )}
                          {p.live && (
                            <a href={p.live} target="_blank" rel="noreferrer" className="label flex items-center gap-1.5 rounded-full bg-signal px-4 py-2.5 text-carbon">
                              Live <ArrowUpRight size={13} aria-hidden />
                            </a>
                          )}
                          {!p.repo && !p.live && <span className="label text-ash">Code on request</span>}
                        </div>
                      </div>
                      <div className={`relative aspect-[4/3] md:col-span-4 ${dark ? "border border-paper/20 bg-carbon" : "bg-paper-2"}`}>
                        <span className={`label absolute left-3 top-3 ${dark ? "text-ash" : "text-graphite"}`}>
                          Fig. {String(offset + i + 1).padStart(2, "0")}
                        </span>
                        <div className="absolute inset-0 p-5 pt-9">
                          <ProjectVisual kind={p.visual} ink={dark ? "#F5F3EF" : "#050606"} accent={dark ? "#C8FF00" : "#050606"} label={`Animated diagram of ${p.name}`} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
