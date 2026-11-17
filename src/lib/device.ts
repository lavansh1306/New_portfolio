export type Tier = "high" | "mid" | "low";

export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Rough device tier used to scale particle counts and DPR. */
export function detectTier(): Tier {
  if (typeof window === "undefined") return "mid";
  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 768;
  if (coarse || small) return cores >= 8 && mem >= 6 ? "mid" : "low";
  if (cores >= 8 && mem >= 8) return "high";
  return "mid";
}

export const particleCount: Record<Tier, number> = { high: 26000, mid: 15000, low: 7000 };

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
