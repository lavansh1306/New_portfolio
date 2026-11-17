"use client";

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useMemo, useState } from "react";
import { skillCategories, type SkillCategory } from "@/content/profile";
import { SectionHeader } from "@/components/ui/SectionHeader";

const W = 1200;
const H = 780;
const CX = W / 2;
const CY = H / 2;

type Placed = {
  cat: SkillCategory;
  x: number;
  y: number;
  angle: number;
  depth: number;
  skills: { name: string; usedIn?: string[]; x: number; y: number; anchor: "start" | "end" | "middle" }[];
};

function layout(): Placed[] {
  const n = skillCategories.length;
  return skillCategories.map((cat, i) => {
    const angle = -Math.PI / 2 + (i / n) * Math.PI * 2 - 0.22;
    const x = Math.round(CX + Math.cos(angle) * 360);
    const y = Math.round(CY + Math.sin(angle) * 245);
    // Skills stack in a clean column on the outward side of each hub, so labels never collide.
    const side = Math.cos(angle) >= 0 ? 1 : -1;
    const m = cat.skills.length;
    const gap = 22;
    const skills = cat.skills.map((s, j) => ({
      ...s,
      x: x + side * 74,
      y: y + (j - (m - 1) / 2) * gap,
      anchor: (side > 0 ? "start" : "end") as "start" | "end" | "middle",
    }));
    return { cat, x, y, angle, depth: 0.4 + (i % 3) * 0.3, skills };
  });
}

function Cluster({
  p,
  index,
  mx,
  my,
  activeCat,
  setActiveCat,
  setSkill,
  activeSkill,
}: {
  p: Placed;
  index: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  activeCat: string | null;
  setActiveCat: (id: string | null) => void;
  setSkill: (s: { name: string; usedIn?: string[]; cat: string } | null) => void;
  activeSkill: string | null;
}) {
  const tx = useTransform(mx, (v) => v * 14 * p.depth);
  const ty = useTransform(my, (v) => v * 10 * p.depth);
  const dim = activeCat !== null && activeCat !== p.cat.id;
  const on = activeCat === p.cat.id;

  return (
    <motion.g
      style={{ x: tx, y: ty }}
      animate={{ opacity: dim ? 0.22 : 1 }}
      transition={{ duration: 0.4 }}
      onPointerEnter={() => setActiveCat(p.cat.id)}
      onPointerLeave={() => {
        setActiveCat(null);
        setSkill(null);
      }}
    >
      <motion.line
        x1={CX}
        y1={CY}
        x2={p.x}
        y2={p.y}
        stroke={on ? "#d4a359" : "rgba(234,230,223,0.18)"}
        strokeWidth={1}
        strokeDasharray="3 5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      />
      {p.skills.map((s, j) => {
        const hot = activeSkill === s.name;
        // Start each skill scattered, then settle it into its orbit.
        const jitterX = Math.round(Math.sin((index + 1) * (j + 3) * 12.9898) * 160);
        const jitterY = Math.round(Math.cos((index + 2) * (j + 1) * 78.233) * 120);
        return (
          <motion.g
            key={s.name}
            initial={{ x: jitterX, y: jitterY, opacity: 0 }}
            whileInView={{ x: 0, y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.4, delay: 0.3 + index * 0.06 + j * 0.04, ease: [0.16, 1, 0.3, 1] }}
          >
            <line x1={p.x} y1={p.y} x2={s.x} y2={s.y} stroke={on ? "rgba(212,163,89,0.6)" : "rgba(234,230,223,0.14)"} strokeWidth={1} />
            <g
              tabIndex={0}
              role="button"
              aria-label={`${s.name}${s.usedIn ? `, used in ${s.usedIn.join(", ")}` : ""}`}
              onPointerEnter={() => setSkill({ ...s, cat: p.cat.label })}
              onFocus={() => {
                setActiveCat(p.cat.id);
                setSkill({ ...s, cat: p.cat.label });
              }}
              onBlur={() => {
                setActiveCat(null);
                setSkill(null);
              }}
              style={{ outline: "none" }}
              data-cursor="hover"
            >
              <rect x={s.anchor === "start" ? s.x - 8 : s.x - 150} y={s.y - 10} width={158} height={20} fill="transparent" />
              <circle cx={s.x} cy={s.y} r={hot ? 5.5 : 3.2} fill={hot || on ? "#d4a359" : "#eae6df"} style={{ transition: "r .3s, fill .3s" }} />
              <text
                x={s.x + (s.anchor === "start" ? 11 : s.anchor === "end" ? -11 : 0)}
                y={s.y + 4}
                textAnchor={s.anchor}
                fill={hot ? "#d4a359" : "rgba(234,230,223,0.82)"}
                style={{ font: "500 13px var(--font-mono)", letterSpacing: "0.02em", transition: "fill .3s" }}
              >
                {s.name}
              </text>
            </g>
          </motion.g>
        );
      })}
      <g tabIndex={-1}>
        <circle cx={p.x} cy={p.y} r={on ? 30 : 24} fill="#1c221e" stroke={on ? "#d4a359" : "rgba(234,230,223,0.5)"} strokeWidth={1} style={{ transition: "r .35s" }} />
        <circle cx={p.x} cy={p.y} r={3} fill="#d4a359" />
        <text
          x={p.x + (Math.cos(p.angle) >= 0 ? 30 : -30)}
          y={p.y + (Math.sin(p.angle) > 0.2 ? -40 : 52)}
          textAnchor={Math.cos(p.angle) >= 0 ? "end" : "start"}
          fill="#eae6df"
          style={{ font: "700 15px var(--font-display)", fontStretch: "118%", letterSpacing: "-0.01em", textTransform: "uppercase" }}
        >
          {p.cat.label}
        </text>
      </g>
    </motion.g>
  );
}

export function TechUniverse() {
  const placed = useMemo(layout, []);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [skill, setSkill] = useState<{ name: string; usedIn?: string[]; cat: string } | null>(null);
  const [mobileSkill, setMobileSkill] = useState<string | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 50, damping: 15 });
  const smy = useSpring(my, { stiffness: 50, damping: 15 });
  const total = skillCategories.reduce((a, c) => a + c.skills.length, 0);

  return (
    <section id="stack" aria-label="Technical universe" className="relative z-10 bg-carbon px-[var(--gutter)] py-28 text-paper md:py-40">
      <SectionHeader
        index="03"
        label="Stack"
        title="Technical universe"
        kicker="Only tools I’ve shipped with. No percentage bars."
        tone="dark"
      />

      {/* Desktop constellation */}
      <div
        className="relative mt-16 hidden md:block"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
          my.set(((e.clientY - r.top) / r.height) * 2 - 1);
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="group" aria-label="Skills grouped by category">
          <ellipse cx={CX} cy={CY} rx={360} ry={245} fill="none" stroke="rgba(241,237,228,0.08)" />
          <ellipse cx={CX} cy={CY} rx={500} ry={340} fill="none" stroke="rgba(241,237,228,0.05)" strokeDasharray="2 8" />
          {placed.map((p, i) => (
            <Cluster
              key={p.cat.id}
              p={p}
              index={i}
              mx={smx}
              my={smy}
              activeCat={activeCat}
              setActiveCat={setActiveCat}
              setSkill={setSkill}
              activeSkill={skill?.name ?? null}
            />
          ))}
          <circle cx={CX} cy={CY} r={56} fill="#d4a359" />
          <text x={CX} y={CY + 8} textAnchor="middle" fill="#1c221e" style={{ font: "800 26px var(--font-display)", fontStretch: "125%" }}>
            LC
          </text>
        </svg>

        {/* Readout panel */}
        <div className="pointer-events-none absolute bottom-0 left-0 w-72 border-t border-paper/20 pt-4" aria-live="polite">
          {skill ? (
            <>
              <p className="label text-signal">{skill.cat}</p>
              <p className="display-lg mt-2 text-3xl">{skill.name}</p>
              <p className="mono mt-3 text-sm text-ash">
                {skill.usedIn ? <>Used in → {skill.usedIn.join(" · ")}</> : "From coursework and resume skills"}
              </p>
            </>
          ) : (
            <>
              <p className="label text-ash">Readout</p>
              <p className="display-lg mt-2 text-3xl">
                {total} tools · {skillCategories.length} orbits
              </p>
              <p className="mono mt-3 text-sm text-ash">Hover or tab through a node to see where it was used.</p>
            </>
          )}
        </div>
      </div>

      {/* Mobile: grouped chips */}
      <div className="mt-14 grid gap-10 md:hidden">
        {skillCategories.map((c, i) => {
          const selected = c.skills.find((s) => s.name === mobileSkill);
          return (
            <div key={c.id}>
              <div className="flex items-center gap-3 border-b border-paper/15 pb-3">
                <span className="label text-signal">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display-lg text-xl uppercase">{c.label}</h3>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {c.skills.map((s) => (
                  <li key={s.name}>
                    <button
                      type="button"
                      onClick={() => setMobileSkill((m) => (m === s.name ? null : s.name))}
                      aria-pressed={mobileSkill === s.name}
                      className={`mono rounded-full border px-3 py-1.5 text-xs transition-colors ${
                        mobileSkill === s.name ? "border-signal bg-signal text-carbon" : "border-paper/25"
                      }`}
                    >
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
              {selected && (
                <p className="mono mt-3 text-xs text-ash">
                  {selected.usedIn ? <>↳ used in {selected.usedIn.join(" · ")}</> : "↳ from coursework and resume skills"}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
