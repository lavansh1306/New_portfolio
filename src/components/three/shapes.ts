import { cities, journey, ncrCenter } from "@/content/profile";

/**
 * Every shape the signal can take. All shapes share the same N points, so the
 * shader can morph any shape into any other by blending positions.
 */
export const N = 4096; // 16³: the cube lattice uses every point exactly once

const rnd = (() => {
  let s = 1337;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
})();

function fill(arr: Float32Array, from: number, fn: (i: number) => [number, number, number]) {
  for (let i = from; i < N; i++) {
    const [x, y, z] = fn(i);
    arr[i * 3] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = z;
  }
}

export const MAP_TILT = 1.0;
const MAP_SCALE = 0.2;
const MAP_LON0 = 82.5;
const MAP_LAT0 = 21;

/** Map-plane coords (x east, y north, h up) → world */
export function mapToWorld(x: number, y: number, h: number): [number, number, number] {
  const c = Math.cos(MAP_TILT);
  const s = Math.sin(MAP_TILT);
  return [x, y * c + h * s - 0.35, -y * s + h * c];
}
export const lonLatToPlane = (lon: number, lat: number): [number, number] => [(lon - MAP_LON0) * MAP_SCALE, (lat - MAP_LAT0) * MAP_SCALE];

/** World position of each city (before the GPU zoom is applied) */
export const cityWorld = cities.map((c) => {
  const [x, y] = lonLatToPlane(c.lon, c.lat);
  return mapToWorld(x, y, 0.0);
});
/** The point the map zooms around (Delhi NCR) */
export const NCR_Q = (() => {
  const [x, y] = lonLatToPlane(ncrCenter.lon, ncrCenter.lat);
  return mapToWorld(x, y, 0);
})();
/** How much the NCR view zooms in */
export const NCR_ZOOM = 34;
/** First time the journey reaches each city (lights it up) */
export const cityFirstVisit = cities.map((c) => journey.findIndex((s) => s.city === c.id));

export function buildShapes() {
  const seed = new Float32Array(N * 4);
  for (let i = 0; i < N * 4; i++) seed[i] = rnd();

  // CUBE — 16³ lattice in [-1, 1]
  const cube = new Float32Array(N * 3);
  let i = 0;
  for (let x = 0; x < 16; x++)
    for (let y = 0; y < 16; y++)
      for (let z = 0; z < 16; z++) {
        cube[i * 3] = (x / 15) * 2 - 1;
        cube[i * 3 + 1] = (y / 15) * 2 - 1;
        cube[i * 3 + 2] = (z / 15) * 2 - 1;
        i++;
      }

  // TUNNEL — 64 square rings you fly through (echoes the cube)
  const tunnel = new Float32Array(N * 3);
  for (let r = 0; r < 64; r++)
    for (let k = 0; k < 64; k++) {
      const side = Math.floor(k / 16);
      const u = (k % 16) / 16;
      const a = 1.75;
      const b = 1.2;
      const p: [number, number][] = [
        [-a + 2 * a * u, -b],
        [a, -b + 2 * b * u],
        [a - 2 * a * u, b],
        [-a, b - 2 * b * u],
      ];
      const [x, y] = p[side];
      const j = r * 64 + k;
      tunnel[j * 3] = x;
      tunnel[j * 3 + 1] = y;
      tunnel[j * 3 + 2] = r * 0.72;
    }

  // STARS — a deep field you drift through
  const stars = new Float32Array(N * 3);
  fill(stars, 0, () => {
    let x = 0;
    let y = 0;
    do {
      x = (rnd() * 2 - 1) * 9;
      y = (rnd() * 2 - 1) * 5.5;
    } while (Math.hypot(x, y) < 0.7);
    return [x, y, rnd() * 40];
  });

  // RAIL — a track running into the distance, the signal line in the middle
  const rail = new Float32Array(N * 3);
  let j = 0;
  const put = (a: Float32Array, x: number, y: number, z: number) => {
    a[j * 3] = x;
    a[j * 3 + 1] = y;
    a[j * 3 + 2] = z;
    j++;
  };
  for (let k = 0; k < 900; k++) put(rail, -0.8, -1.05, (k / 900) * 46);
  for (let k = 0; k < 900; k++) put(rail, 0.8, -1.05, (k / 900) * 46);
  for (let k = 0; k < 700; k++) put(rail, 0, -1.05, (k / 700) * 46);
  for (let row = 0; row < 46; row++) for (let k = 0; k < 24; k++) put(rail, -1.15 + (k / 23) * 2.3, -1.12, row + 0.5);
  while (j < N) put(rail, (rnd() * 2 - 1) * 6, -0.8 + rnd() * 4.2, rnd() * 46);

  // MAP — an abstract lat/long grid (no borders drawn), a finer grid around Delhi NCR for the zoomed-in view,
  // every city on the journey, and an arc for each leg of it
  const map = new Float32Array(N * 3);
  const mapInfo = new Float32Array(N * 2);
  const mapOff = new Float32Array(N * 3);
  j = 0;
  const putMap = (x: number, y: number, h: number, role: number, value: number, off?: [number, number]) => {
    const [wx, wy, wz] = mapToWorld(x, y, h);
    map[j * 3] = wx;
    map[j * 3 + 1] = wy;
    map[j * 3 + 2] = wz;
    mapInfo[j * 2] = role;
    mapInfo[j * 2 + 1] = value;
    if (off) {
      // marker offsets are not zoomed, so city markers keep their size
      const [ox, oy, oz] = mapToWorld(off[0], off[1], 0);
      const [bx, by, bz] = mapToWorld(0, 0, 0);
      mapOff[j * 3] = ox - bx;
      mapOff[j * 3 + 1] = oy - by;
      mapOff[j * 3 + 2] = oz - bz;
    }
    j++;
  };
  // India grid: 0.6°
  for (let la = 0; la < 47; la++)
    for (let lo = 0; lo < 51; lo++) {
      const [x, y] = lonLatToPlane(68 + lo * 0.6, 8 + la * 0.6);
      putMap(x, y, 0, 0, Math.min(1, Math.min(lo, 50 - lo) / 8, Math.min(la, 46 - la) / 8));
    }
  // NCR grid: 0.025°
  for (let la = 0; la < 25; la++)
    for (let lo = 0; lo < 31; lo++) {
      const [x, y] = lonLatToPlane(76.82 + lo * 0.025, 28.16 + la * 0.025);
      putMap(x, y, 0, 3, Math.min(1, Math.min(lo, 30 - lo) / 5, Math.min(la, 24 - la) / 5));
    }
  // Cities: a ring and a core, sized in screen-stable offsets
  cities.forEach((c, ci) => {
    const [cx, cy] = lonLatToPlane(c.lon, c.lat);
    for (let k = 0; k < 40; k++) {
      const a = (k / 22) * Math.PI * 2;
      const r = k < 22 ? 0.13 : 0.045 * Math.sqrt(rnd());
      putMap(cx, cy, 0.0, 1, cityFirstVisit[ci], [Math.cos(a) * r, Math.sin(a) * r]);
    }
  });
  // Arcs: one per leg of the journey
  for (let leg = 0; leg < journey.length - 1; leg++) {
    const A = cities.find((c) => c.id === journey[leg].city)!;
    const B = cities.find((c) => c.id === journey[leg + 1].city)!;
    const [x0, y0] = lonLatToPlane(A.lon, A.lat);
    const [x1, y1] = lonLatToPlane(B.lon, B.lat);
    const d = Math.hypot(x1 - x0, y1 - y0);
    for (let k = 0; k < 80; k++) {
      const u = k / 79;
      putMap(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, Math.sin(Math.PI * u) * d * 0.32, 2, leg + u * 0.999);
    }
  }
  while (j < N) {
    const [x, y] = lonLatToPlane(68 + rnd() * 30, 8 + rnd() * 28);
    putMap(x, y, 0, 0, 0.3);
  }

  // MEDAL — a ring and a coin face
  const medal = new Float32Array(N * 3);
  fill(medal, 0, (k) => {
    if (k < 2200) {
      const a = rnd() * Math.PI * 2;
      const b = rnd() * Math.PI * 2;
      const R = 1.3;
      const r = 0.09;
      return [(R + r * Math.cos(b)) * Math.cos(a), (R + r * Math.cos(b)) * Math.sin(a), r * Math.sin(b)];
    }
    const a = rnd() * Math.PI * 2;
    const r = Math.sqrt(rnd()) * 1.05;
    return [Math.cos(a) * r, Math.sin(a) * r, (rnd() * 2 - 1) * 0.04];
  });

  // HORIZON — a calm wave field stretching out to dawn
  const horizon = new Float32Array(N * 3);
  for (let zr = 0; zr < 64; zr++)
    for (let xr = 0; xr < 64; xr++) {
      const k = zr * 64 + xr;
      horizon[k * 3] = -9 + (xr / 63) * 18;
      horizon[k * 3 + 1] = -1.35;
      horizon[k * 3 + 2] = (zr / 64) * 40;
    }

  // SUN — a disc with a soft halo (scaled onto the sun in the final photo)
  const sun = new Float32Array(N * 3);
  fill(sun, 0, (k) => {
    const a = rnd() * Math.PI * 2;
    const r = k < 3000 ? Math.pow(rnd(), 0.6) : 1.2 + rnd() * 0.9;
    return [Math.cos(a) * r, Math.sin(a) * r, 0];
  });

  return { seed, cube, tunnel, stars, rail, map, mapInfo, mapOff, medal, horizon, sun };
}
