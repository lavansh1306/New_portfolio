"use client";

import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/content/profile";

/**
 * A photo that assembles itself out of scattered dots when it scrolls into view,
 * then hands over to the real image. Canvas 2D, runs once.
 */
export function DotPortrait({ photo, className = "" }: { photo: Photo; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    const c = canvas.current;
    if (!el || !c) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDone(true);
      return;
    }
    let raf = 0;
    let started = false;
    const img = new Image();
    img.decoding = "async";
    img.src = photo.src;

    const run = () => {
      if (started) return;
      started = true;
      const ctx = c.getContext("2d");
      if (!ctx) return setDone(true);
      const r = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      c.width = r.width * dpr;
      c.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Sample the photo (object-fit: cover) into a grid of brightness values
      const cols = 58;
      const cell = r.width / cols;
      const rows = Math.ceil(r.height / cell);
      const s = document.createElement("canvas");
      s.width = cols;
      s.height = rows;
      const sctx = s.getContext("2d", { willReadFrequently: true });
      if (!sctx) return setDone(true);
      const scale = Math.max(cols / img.width, rows / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      sctx.drawImage(img, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
      const data = sctx.getImageData(0, 0, cols, rows).data;
      const dots: { tx: number; ty: number; sx: number; sy: number; rad: number; d: number }[] = [];
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
          const rad = (1 - lum) * cell * 0.58;
          if (rad < 0.35) continue;
          dots.push({
            tx: x * cell + cell / 2,
            ty: y * cell + cell / 2,
            sx: Math.random() * r.width,
            sy: Math.random() * r.height,
            rad,
            d: Math.random() * 0.35,
          });
        }

      const start = performance.now();
      const dur = 1900;
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      const draw = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        ctx.clearRect(0, 0, r.width, r.height);
        ctx.fillStyle = "#111312";
        for (const d of dots) {
          const t = ease(Math.min(1, Math.max(0, (p - d.d) / (1 - d.d))));
          const x = d.sx + (d.tx - d.sx) * t;
          const y = d.sy + (d.ty - d.sy) * t;
          ctx.beginPath();
          ctx.arc(x, y, d.rad * (0.4 + 0.6 * t), 0, Math.PI * 2);
          ctx.fill();
        }
        if (p < 1) raf = requestAnimationFrame(draw);
        else setTimeout(() => setDone(true), 250);
      };
      raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (img.complete) run();
        else img.onload = run;
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [photo.src]);

  return (
    <div ref={wrap} className={`relative overflow-hidden bg-paper-2 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.w}
        height={photo.h}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover grayscale transition-[opacity,filter] duration-1000 hover:grayscale-0"
        style={{ opacity: done ? 1 : 0 }}
      />
      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-700" style={{ opacity: done ? 0 : 1 }} />
    </div>
  );
}
