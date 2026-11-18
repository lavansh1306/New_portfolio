import { SplitReveal } from "./SplitReveal";
import { ScrambleText } from "./ScrambleText";

type Props = {
  index: string;
  label: string;
  title: string;
  kicker?: string;
  tone?: "light" | "dark";
  className?: string;
};

/** Consistent editorial header: index + scrambled label on a rule, then a large masked title. */
export function SectionHeader({ index, label, title, kicker, tone = "light", className = "" }: Props) {
  const muted = tone === "dark" ? "text-ash" : "text-graphite";
  const rule = tone === "dark" ? "bg-paper/20" : "bg-carbon/15";
  return (
    <header className={`grid gap-8 md:grid-cols-12 ${className}`}>
      <div className="col-span-full flex items-center gap-4">
        <span className="label text-signal">{index}</span>
        <span className={`label ${muted}`}>
          <ScrambleText text={label} />
        </span>
        <span className={`h-px flex-1 ${rule}`} />
      </div>
      <SplitReveal text={title} className="display-lg text-[clamp(2.6rem,7.4vw,7.5rem)] md:col-span-9" />
      {kicker ? <p className={`serif self-end text-xl leading-snug md:col-span-3 md:text-2xl ${muted}`}>{kicker}</p> : null}
    </header>
  );
}
