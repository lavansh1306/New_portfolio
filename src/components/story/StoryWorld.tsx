"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { hasWebGL } from "@/lib/device";
import { storyStore } from "@/lib/storyStore";
import { cities } from "@/content/profile";
import { useApp } from "@/components/providers/AppProvider";

const World = dynamic(() => import("@/components/three/World"), { ssr: false });

/** Mounts the 3D world (and the city labels it positions) only when WebGL is available. */
export function StoryWorld() {
  const { reducedMotion } = useApp();
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(hasWebGL()), []);
  if (!ok) return null;
  const labels = [...cities.map((c) => c.name), "Delhi NCR"];
  return (
    <>
      <World reducedMotion={reducedMotion} />
      {/* Above the canvas, below the opaque content panels */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
        {labels.map((name, i) => (
          <div
            key={name}
            ref={(el) => {
              storyStore.cityLabels[i] = el;
            }}
            className="group absolute left-0 top-0 opacity-0"
            style={{ visibility: "hidden" }}
          >
            <div className="flex -translate-y-1/2 translate-x-4 items-center gap-2 group-data-[side=left]:-translate-x-[calc(100%+1rem)] group-data-[side=left]:flex-row-reverse">
              <span className="h-px w-4 bg-paper/40 group-data-[lit=true]:bg-paper" />
              <span className="label whitespace-nowrap text-[10px] text-ash group-data-[lit=true]:text-paper">{name}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
