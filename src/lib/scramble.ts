const GLYPHS = "!<>-_\\/[]{}—=+*^?#01ABCDEFXYZ";

export type ScrambleOptions = {
  duration?: number; // ms
  delay?: number; // ms
  glyphs?: string;
  onDone?: () => void;
};

/**
 * Scrambles `el.textContent` into `text`, locking characters left → right.
 * Returns a cancel function. Writes directly to the DOM (no React renders).
 */
export function scramble(el: HTMLElement, text: string, opts: ScrambleOptions = {}) {
  const { duration = 900, delay = 0, glyphs = GLYPHS, onDone } = opts;
  let raf = 0;
  let start = 0;
  const chars = [...text];
  const step = (t: number) => {
    if (!start) start = t;
    const elapsed = t - start - delay;
    if (elapsed < 0) {
      raf = requestAnimationFrame(step);
      return;
    }
    const p = Math.min(1, elapsed / duration);
    const locked = Math.floor(p * chars.length);
    let out = "";
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      if (i < locked || c === " ") out += c;
      else out += glyphs[(Math.random() * glyphs.length) | 0];
    }
    el.textContent = out;
    if (p < 1) raf = requestAnimationFrame(step);
    else {
      el.textContent = text;
      onDone?.();
    }
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}
