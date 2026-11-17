"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { projects } from "@/content/profile";
import { ProjectVisual } from "./ProjectVisual";

/** Ranked list for the projects outside the top six. Each row opens into a compact case study. */
export function MoreWork({ offset }: { offset: number }) {
  const rest = projects.filter((p) => !p.featured);
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="px-[var(--gutter)] pb-28 pt-20 md:pb-36">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h3 className="display-lg text-[clamp(2rem,4vw,3.6rem)]">More work</h3>
        <p className="mono max-w-sm text-sm text-graphite">Ranks {offset + 1}–{offset + rest.length}. Open a row for the full story.</p>
      </div>

      <ol className="border-t border-carbon">
        {rest.map((p, i) => {
          const isOpen = open === p.id;
          const dark = p.tone === "dark";
          return (
            <li key={p.id} className="border-b border-carbon/15">
              <h4>
                <button
                  type="button"
                  className="group relative grid w-full grid-cols-12 items-center gap-x-4 gap-y-1 py-6 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`more-${p.id}`}
                  onClick={() => setOpen(isOpen ? null : p.id)}
                  data-cursor-label={isOpen ? "Close" : "Open"}
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-bottom scale-y-0 bg-carbon transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-y-100"
                  />
                  <span className="label relative col-span-2 text-graphite transition-colors duration-500 group-hover:text-ash md:col-span-1 md:pl-3">
                    {String(offset + i + 1).padStart(2, "0")}
                  </span>
                  <span className="display-lg relative col-span-8 text-[clamp(1.6rem,3vw,2.8rem)] transition-colors duration-500 group-hover:text-paper md:col-span-4">
                    {p.name}
                  </span>
                  <span className="relative col-span-2 flex justify-end md:order-last md:col-span-1 md:pr-3">
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="transition-colors duration-500 group-hover:text-signal">
                      <Plus size={22} strokeWidth={1.5} />
                    </motion.span>
                  </span>
                  <span className="serif-i relative col-span-12 text-lg text-graphite transition-colors duration-500 group-hover:text-ash md:col-span-3">
                    {p.kind}
                  </span>
                  <span className="mono relative col-span-12 text-xs text-graphite transition-colors duration-500 group-hover:text-ash md:col-span-3">
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
                        <p className="serif-i text-2xl leading-tight">{p.tagline}</p>
                        <dl className="grid gap-4 text-[0.95rem] leading-relaxed">
                          <div>
                            <dt className="label text-graphite">Problem</dt>
                            <dd className="mt-1">{p.problem}</dd>
                          </div>
                          <div>
                            <dt className="label text-graphite">What I built</dt>
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
                            <dt className="label text-graphite">Key decision</dt>
                            <dd className="mt-1">{p.decision}</dd>
                          </div>
                          <div>
                            <dt className="label text-graphite">Why it ranks here</dt>
                            <dd className="mono mt-1 text-sm text-graphite">{p.rankNote}</dd>
                          </div>
                        </dl>
                        <div className="flex flex-wrap gap-2">
                          {p.repo && (
                            <a href={p.repo} target="_blank" rel="noreferrer" className="label flex items-center gap-1.5 rounded-full border border-carbon/40 px-4 py-2.5 hover:bg-carbon hover:text-paper">
                              GitHub <ArrowUpRight size={13} aria-hidden />
                            </a>
                          )}
                          {p.live && (
                            <a href={p.live} target="_blank" rel="noreferrer" className="label flex items-center gap-1.5 rounded-full bg-signal px-4 py-2.5 text-carbon">
                              Live <ArrowUpRight size={13} aria-hidden />
                            </a>
                          )}
                          {!p.repo && !p.live && <span className="label text-graphite">Code on request</span>}
                        </div>
                      </div>
                      <div className={`relative aspect-[4/3] md:col-span-4 ${dark ? "bg-carbon" : "bg-paper-2"}`}>
                        <span className={`label absolute left-3 top-3 ${dark ? "text-ash" : "text-graphite"}`}>
                          Fig. {String(offset + i + 1).padStart(2, "0")}
                        </span>
                        <div className="absolute inset-0 p-5 pt-9">
                          <ProjectVisual kind={p.visual} ink={dark ? "#f1ede4" : "#111312"} accent={p.accent} label={`Animated diagram of ${p.name}`} />
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
