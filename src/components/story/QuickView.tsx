"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Printer, X } from "lucide-react";
import { certifications, chapters, profile, projects, results, skillCategories } from "@/content/profile";

/** The whole story as a plain one-page resume, for people in a hurry. */
export function QuickView({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lastFocus.current?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[85] flex justify-end bg-carbon/60 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="qv-title"
            data-lenis-prevent
            className="h-full w-full max-w-3xl overflow-y-auto bg-paper px-[var(--gutter)] pb-16 pt-6 text-carbon sm:px-10"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-[1] -mx-[var(--gutter)] flex items-center justify-between border-b border-carbon/15 bg-paper px-[var(--gutter)] py-3 sm:-mx-10 sm:px-10">
              <span className="label text-graphite">Quick view · the short version</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  aria-label="Print or save as PDF"
                  className="label flex min-h-[36px] items-center gap-1.5 rounded-full border border-carbon/25 px-3 py-1.5 text-xs transition-colors hover:bg-carbon hover:text-paper active:scale-95"
                >
                  <Printer size={13} aria-hidden /> Print / PDF
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close quick view"
                  className="label flex min-h-[36px] items-center gap-1.5 rounded-full border border-carbon/30 px-3.5 py-1.5 text-xs transition-colors hover:bg-carbon hover:text-paper active:scale-95"
                >
                  Close <X size={14} aria-hidden />
                </button>
              </div>
            </div>

            <header className="mt-8">
              <h2 id="qv-title" className="display-lg text-5xl">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="serif mt-2 text-2xl text-graphite">{profile.role}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label={copied ? "Email copied to clipboard" : `Copy email ${profile.email}`}
                  className="mono flex items-center gap-2 rounded-full border border-carbon/25 bg-paper-2 px-3.5 py-1.5 text-xs text-carbon transition-all hover:border-signal active:scale-95"
                >
                  {copied ? <Check size={13} className="text-signal" /> : <Copy size={13} />}
                  <span>{copied ? "Copied to clipboard!" : profile.email}</span>
                </button>
                <a
                  className="mono flex items-center gap-1 text-xs underline underline-offset-4 transition-colors hover:text-signal"
                  href={profile.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub <ArrowUpRight size={12} aria-hidden />
                </a>
                <a
                  className="mono flex items-center gap-1 text-xs underline underline-offset-4 transition-colors hover:text-signal"
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn <ArrowUpRight size={12} aria-hidden />
                </a>
              </div>
            </header>

            <Block title="Experience">
              {chapters.map((c) => (
                <div key={c.org} className="grid gap-1 border-b border-carbon/10 py-3 sm:grid-cols-[1fr_auto]">
                  <p>
                    <span className="font-semibold">{c.role}</span> · {c.org}
                  </p>
                  <p className="mono text-xs text-graphite sm:text-right">{c.period}</p>
                  {c.progression && <p className="mono text-xs text-graphite sm:col-span-2">{c.progression.map((p) => p.role).join(" → ")}</p>}
                </div>
              ))}
            </Block>

            <Block title="Projects (ranked)">
              <ol className="grid gap-3">
                {projects.map((p, i) => (
                  <li key={p.id} className="grid grid-cols-[2rem_1fr] gap-2 border-b border-carbon/10 pb-3">
                    <span className="mono text-xs text-graphite">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="flex flex-wrap items-center gap-x-3">
                        <span className="font-semibold">{p.name}</span>
                        <span className="text-sm text-graphite">{p.kind}</span>
                        {p.repo && (
                          <a href={p.repo} target="_blank" rel="noreferrer" className="mono flex items-center text-xs text-signal">
                            code <ArrowUpRight size={12} />
                          </a>
                        )}
                        {p.live && (
                          <a href={p.live} target="_blank" rel="noreferrer" className="mono flex items-center text-xs text-signal">
                            live <ArrowUpRight size={12} />
                          </a>
                        )}
                      </p>
                      <p className="mt-1 text-sm">{p.tagline}</p>
                      <p className="mono mt-1 text-xs text-graphite">{p.stack.join(" · ")}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Block>

            <Block title="Hackathons">
              <ul className="grid gap-1 text-sm sm:grid-cols-2">
                {results.map((r) => (
                  <li key={r.event}>
                    <span className="font-semibold">{r.result}</span> · {r.event}
                  </li>
                ))}
              </ul>
            </Block>

            <Block title="Certifications">
              <ul className="grid gap-1 text-sm">
                {certifications.map((c) => (
                  <li key={c.name}>
                    {c.issuer} · {c.name} ({c.year})
                  </li>
                ))}
              </ul>
            </Block>

            <Block title="Skills">
              <dl className="grid gap-2 text-sm">
                {skillCategories.map((c) => (
                  <div key={c.id} className="grid gap-1 sm:grid-cols-[9rem_1fr]">
                    <dt className="mono text-xs uppercase tracking-wider text-graphite">{c.label}</dt>
                    <dd>{c.skills.map((s) => s.name).join(", ")}</dd>
                  </div>
                ))}
              </dl>
            </Block>

            <Block title="Education">
              <p className="text-sm">
                {profile.education.degree}, {profile.education.school} · {profile.education.period} · CGPA {profile.education.cgpa}
              </p>
            </Block>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h3 className="label mb-3 border-b border-carbon pb-2 text-graphite">{title}</h3>
      {children}
    </section>
  );
}
