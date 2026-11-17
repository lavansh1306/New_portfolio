import type { ShapeId } from "@/content/profile";

export const SHAPES: ShapeId[] = ["storm", "cube", "tunnel", "stars", "rail", "map", "medal", "horizon", "sun"];

/**
 * Mutable store shared by the DOM (GSAP / ScrollTrigger) and the WebGL world.
 * Plain fields, mutated in place: no React re-renders on scroll.
 */
export const storyStore = {
  /** the signal is morphing from this shape… */
  from: "storm" as ShapeId,
  /** …to this shape */
  to: "cube" as ShapeId,
  /** 0 → 1 morph progress */
  t: 0,
  /** distance travelled through the current scene (drives tunnel / stars / rail / horizon flow) */
  travel: 0,
  /** 0 → stops.length-1: how far the signal has moved along the map */
  road: 0,
  /** 0 → 1 once the loader has finished */
  intro: 0,
  /** pointer over the hero core: resolves the storm into the cube */
  coreHover: false,
  /** 0 = night (light ink on dark), 1 = dawn (dark ink on paper) */
  dawn: 0,
  /** 0 → 1 in the epilogue, the particle sun hands over to the photo's sun */
  handover: 0,
  /** DOM anchors the world aligns itself to (hero frame, sun in the photo) */
  anchors: {} as Partial<Record<"core" | "sun", HTMLElement>>,
  /** DOM labels the world positions over map cities */
  cityLabels: [] as (HTMLElement | null)[],
  /** set by the World once WebGL is up */
  webgl: false,
  /** number of story scenes currently on screen (world renders only when > 0) */
  visibleScenes: 0,
  listeners: new Set<() => void>(),
  notify() {
    this.listeners.forEach((l) => l());
  },
};

export function setScene(from: ShapeId, to: ShapeId, t: number) {
  storyStore.from = from;
  storyStore.to = to;
  storyStore.t = t;
}
