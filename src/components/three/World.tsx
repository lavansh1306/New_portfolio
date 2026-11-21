"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { simplex } from "./noise";
import { buildShapes, cityFirstVisit, cityWorld, N, NCR_Q, NCR_ZOOM } from "./shapes";
import { cities, journey } from "@/content/profile";
import { SHAPES, storyStore } from "@/lib/storyStore";

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uTravel;
uniform float uRoad;
uniform float uIntro;
uniform float uPixelRatio;
uniform float uSize;
uniform float uHandover;
uniform float uW[9];
uniform vec3 uCoreCenter;
uniform float uCoreScale;
uniform vec2 uCoreRot;
uniform vec3 uSunCenter;
uniform float uSunScale;
uniform float uMedalRot;
uniform float uMapScale;
uniform vec3 uMapShift;
uniform vec3 uMapQ;
uniform float uMapZoom;
uniform float uMapPan;

attribute vec4 aSeed;
attribute vec3 aTunnel;
attribute vec3 aStars;
attribute vec3 aRail;
attribute vec3 aMap;
attribute vec2 aMapInfo;
attribute vec3 aMapOff;
attribute vec3 aMedal;
attribute vec3 aHorizon;
attribute vec3 aSun;

varying float vAccent;
varying float vAlpha;

${simplex}

mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }

float flowZ(float z, float L, float speed) { return mod(z + uTravel * speed + uTime * 0.35, L) - L + 6.0; }
float depthFade(float z, float L) { return smoothstep(6.0 - L, 6.0 - L + 10.0, z) * (1.0 - smoothstep(3.6, 5.7, z)); }

void main() {
  vec3 P = vec3(0.0);
  float A = 0.0;   // accent (0 ink → 1 signal orange)
  float O = 0.0;   // opacity
  float S = 0.0;   // size factor
  float w;

  // 0 STORM — noise drifting around the core
  w = uW[0];
  if (w > 0.001) {
    vec3 dir = normalize(aSeed.xyz * 2.0 - 1.0 + 1e-4);
    vec3 base = dir * pow(aSeed.w, 0.5) * vec3(6.2, 3.6, 2.5);
    float t = uTime * 0.12;
    vec3 flow = vec3(snoise(base * 0.35 + vec3(t, 0.0, 0.0)), snoise(base * 0.35 + vec3(0.0, t + 7.1, 0.0)), snoise(base * 0.35 + vec3(0.0, 0.0, t + 3.3)));
    P += w * (base + flow * 0.7 + uCoreCenter * 0.35);
    A += w * step(0.975, aSeed.x);
    O += w * (0.35 + aSeed.y * 0.45);
    S += w * (0.6 + aSeed.z * 1.25);
  }
  // 1 CUBE — the signal core
  w = uW[1];
  if (w > 0.001) {
    vec3 c = rotY(uCoreRot.y) * rotX(uCoreRot.x) * position;
    float wave = sin(position.x * 2.4 + uTime * 1.5) * 0.5 * cos(position.z * 1.3 + uTime * 0.4);
    float on = 1.0 - smoothstep(0.0, 0.17, abs(position.y - wave));
    P += w * (c * uCoreScale + uCoreCenter);
    A += w * on;
    O += w * (0.55 + on * 0.4);
    S += w * (0.75 + on * 0.9);
  }
  // 2 TUNNEL — flying inside the lattice
  w = uW[2];
  if (w > 0.001) {
    float z = flowZ(aTunnel.z, 46.08, 14.0);
    float ring = floor(aTunnel.z / 0.72 + 0.5);
    P += w * vec3(aTunnel.xy, z);
    A += w * (1.0 - step(0.5, mod(ring, 8.0)));
    O += w * depthFade(z, 46.08) * 0.85;
    S += w * 0.95;
  }
  // 3 STARS — the toolkit field
  w = uW[3];
  if (w > 0.001) {
    float z = flowZ(aStars.z, 40.0, 8.0);
    P += w * vec3(aStars.xy, z);
    A += w * step(0.94, aSeed.y);
    O += w * depthFade(z, 40.0) * (0.35 + aSeed.x * 0.6);
    S += w * (0.4 + aSeed.z * 1.6);
  }
  // 4 RAIL — riding the line
  w = uW[4];
  if (w > 0.001) {
    float z = flowZ(aRail.z, 46.0, 16.0);
    float center = 1.0 - step(0.001, abs(aRail.x) + abs(aRail.y + 1.05));
    P += w * vec3(aRail.xy, z);
    A += w * center;
    O += w * depthFade(z, 46.0) * (aRail.y > -0.9 ? 0.35 : 0.9);
    S += w * (center > 0.5 ? 1.4 : 0.9);
  }
  // 5 MAP — the road across India
  w = uW[5];
  if (w > 0.001) {
    float role = aMapInfo.x;
    float v = aMapInfo.y;
    float lit = 0.0;
    float op = 0.0;
    float sz = 0.0;
    if (role < 0.5) { op = 0.55 * v * (1.0 - 0.7 * uMapPan); sz = 0.8; }
    else if (role < 1.5) { lit = step(v, uRoad + 0.02); op = 0.55 + lit * 0.45; sz = 1.4 + lit * 0.8; }
    else if (role < 2.5) { lit = step(v, uRoad); op = 0.12 + lit * 0.88; sz = 0.9 + lit * 0.5; }
    else { op = 0.5 * v * smoothstep(0.35, 0.9, uMapPan); sz = 0.8; }
    vec3 m = uMapQ + (aMap - uMapQ) * uMapZoom - uMapQ * uMapPan;
    vec3 p = (m + aMapOff) * uMapScale + uMapShift;
    // when zoomed into NCR, hide far-away routes that would scatter across the screen
    op *= mix(1.0, 1.0 - smoothstep(1.9, 2.8, length(m)), uMapPan);
    p.y += sin(aMap.x * 3.0 + uTime * 0.8) * 0.01;
    P += w * p;
    A += w * lit;
    O += w * op;
    S += w * sz;
  }
  // 6 MEDAL — the arena
  w = uW[6];
  if (w > 0.001) {
    float ring = step(1.12, length(aMedal.xy));
    P += w * (rotY(uMedalRot) * rotX(0.25) * aMedal);
    A += w * ring;
    O += w * (0.45 + ring * 0.5);
    S += w * (0.8 + ring * 0.4);
  }
  // 7 HORIZON — dawn
  w = uW[7];
  if (w > 0.001) {
    float z = flowZ(aHorizon.z, 40.0, 6.0);
    float y = aHorizon.y + 0.16 * sin(aHorizon.x * 0.55 + z * 0.35 + uTime * 0.5);
    P += w * vec3(aHorizon.x, y, z);
    A += w * step(0.975, aSeed.x);
    O += w * depthFade(z, 40.0) * 0.95;
    S += w * 1.15;
  }
  // 8 SUN — becomes the sun in the final photo
  w = uW[8];
  if (w > 0.001) {
    float halo = step(1.15, length(aSun.xy));
    P += w * (aSun * uSunScale + uSunCenter);
    A += w;
    O += w * (halo > 0.5 ? 0.25 : 0.9) * (1.0 - uHandover * 0.9);
    S += w * (halo > 0.5 ? 0.6 : 1.3);
  }

  P.xy *= mix(0.25, 1.0, uIntro);
  vec4 mv = modelViewMatrix * vec4(P, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = min(uSize * S * uPixelRatio * (6.0 / max(0.3, -mv.z)), 42.0);
  vAccent = clamp(A, 0.0, 1.0);
  vAlpha = O * uIntro * smoothstep(0.4, 1.6, -mv.z);
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uInk;
uniform vec3 uSignal;
varying float vAccent;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d);
  gl_FragColor = vec4(mix(uInk, uSignal, vAccent), a * vAlpha);
}
`;

const PAPER = new THREE.Color("#F5F3EF");
const CARBON = new THREE.Color("#F5F3EF");
const IDX = Object.fromEntries(SHAPES.map((s, i) => [s, i])) as Record<string, number>;

const DIR = new THREE.Vector3();
/** Screen pixel → the point on the z = 0 plane under it */
function screenToWorld(px: number, py: number, w: number, h: number, camera: THREE.Camera, out: THREE.Vector3) {
  DIR.set((px / w) * 2 - 1, -(py / h) * 2 + 1, 0.5).unproject(camera).sub(camera.position).normalize();
  const dist = -camera.position.z / DIR.z;
  return out.copy(camera.position).addScaledVector(DIR, dist);
}

function Signal({ reducedMotion }: { reducedMotion: boolean }) {
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;

  const { geometry, material } = useMemo(() => {
    const sh = buildShapes();
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(sh.cube, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(sh.seed, 4));
    g.setAttribute("aTunnel", new THREE.BufferAttribute(sh.tunnel, 3));
    g.setAttribute("aStars", new THREE.BufferAttribute(sh.stars, 3));
    g.setAttribute("aRail", new THREE.BufferAttribute(sh.rail, 3));
    g.setAttribute("aMap", new THREE.BufferAttribute(sh.map, 3));
    g.setAttribute("aMapInfo", new THREE.BufferAttribute(sh.mapInfo, 2));
    g.setAttribute("aMapOff", new THREE.BufferAttribute(sh.mapOff, 3));
    g.setAttribute("aMedal", new THREE.BufferAttribute(sh.medal, 3));
    g.setAttribute("aHorizon", new THREE.BufferAttribute(sh.horizon, 3));
    g.setAttribute("aSun", new THREE.BufferAttribute(sh.sun, 3));
    g.setDrawRange(0, N);
    const m = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uTime: { value: 0 },
        uTravel: { value: 0 },
        uRoad: { value: -1 },
        uIntro: { value: 0 },
        uPixelRatio: { value: 1 },
        uSize: { value: 3 },
        uHandover: { value: 0 },
        uW: { value: new Array(9).fill(0) },
        uCoreCenter: { value: new THREE.Vector3(1.6, 0, 0) },
        uCoreScale: { value: 0.9 },
        uCoreRot: { value: new THREE.Vector2(-0.38, 0.6) },
        uSunCenter: { value: new THREE.Vector3(0, 1, 0) },
        uSunScale: { value: 0.3 },
        uMedalRot: { value: 0 },
        uMapScale: { value: 1 },
        uMapShift: { value: new THREE.Vector3() },
        uMapQ: { value: new THREE.Vector3(...NCR_Q) },
        uMapZoom: { value: 1 },
        uMapPan: { value: 0 },
        uInk: { value: PAPER.clone() },
        uSignal: { value: new THREE.Color("#C8FF00") },
      },
    });
    return { geometry: g, material: m };
  }, []);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  const st = useRef({ pan: 0, w: new Array(9).fill(0) as number[], travel: 0, road: -1, intro: 0, hover: 0, rotY: 0.6, handover: 0, dawn: 0, px: 0, py: 0 });
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const tmp2 = useMemo(() => new THREE.Vector3(), []);
  const proj = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      st.current.px = (e.clientX / window.innerWidth) * 2 - 1;
      st.current.py = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const s = st.current;
    const u = material.uniforms;
    const k = 1 - Math.pow(0.004, dt); // smooth, frame-rate independent
    const kSlow = 1 - Math.pow(0.03, dt);

    if (!reducedMotion) u.uTime.value += dt;
    u.uPixelRatio.value = gl.getPixelRatio();
    u.uSize.value = size.width < 640 ? 3.4 : 3;

    // Target weights for the current morph
    s.hover += ((storyStore.coreHover ? 1 : 0) - s.hover) * kSlow;
    let { from, to, t } = storyStore;
    if (from === "storm" && to === "cube") t = Math.max(t, s.hover);
    const target = new Array(9).fill(0);
    target[IDX[from]] += 1 - t;
    target[IDX[to]] += t;
    for (let i = 0; i < 9; i++) {
      s.w[i] += (target[i] - s.w[i]) * k;
      u.uW.value[i] = s.w[i];
    }

    s.travel += (storyStore.travel - s.travel) * k;
    u.uTravel.value = s.travel;
    s.road += (storyStore.road - s.road) * kSlow;
    u.uRoad.value = s.road;
    s.intro += (storyStore.intro - s.intro) * (1 - Math.pow(0.05, dt));
    u.uIntro.value = s.intro;
    s.handover += (storyStore.handover - s.handover) * k;
    u.uHandover.value = s.handover;
    s.dawn += (storyStore.dawn - s.dawn) * k;
    (u.uInk.value as THREE.Color).copy(PAPER).lerp(CARBON, s.dawn);

    // Gentle parallax camera
    camera.position.x += (s.px * 0.25 - camera.position.x) * kSlow;
    camera.position.y += (s.py * 0.15 - camera.position.y) * kSlow;
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();

    // Align the core cube to the hero frame
    const core = storyStore.anchors.core;
    if (core) {
      const r = core.getBoundingClientRect();
      if (r.bottom > -200 && r.top < size.height + 200) {
        screenToWorld(r.left + r.width / 2, r.top + r.height / 2, size.width, size.height, camera, tmp);
        (u.uCoreCenter.value as THREE.Vector3).lerp(tmp, 0.35);
        screenToWorld(r.left + r.width / 2, r.top, size.width, size.height, camera, tmp2);
        u.uCoreScale.value = Math.abs(tmp2.y - tmp.y) * 0.5;
      }
    }
    if (!reducedMotion) s.rotY += dt * (0.22 - s.w[1] * 0.08);
    (u.uCoreRot.value as THREE.Vector2).set(-0.38 + s.py * 0.15, s.rotY + s.px * 0.4);
    u.uMedalRot.value = s.rotY * 1.4;

    // Align the sun to the sun in the final photo
    const sun = storyStore.anchors.sun;
    if (sun && s.w[8] > 0.001) {
      const r = sun.getBoundingClientRect();
      screenToWorld(r.left + r.width / 2, r.top + r.height / 2, size.width, size.height, camera, tmp);
      (u.uSunCenter.value as THREE.Vector3).copy(tmp);
      screenToWorld(r.left + r.width, r.top + r.height / 2, size.width, size.height, camera, tmp2);
      u.uSunScale.value = Math.abs(tmp2.x - tmp.x) * (1 - 0.45 * s.handover);
    }

    // Fit the map to the screen: shift left on wide screens (room for the stop card), shrink on narrow ones
    const halfW = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 6 * (size.width / size.height);
    const mapScale = Math.min(1, Math.max(0.42, halfW / 2.6));
    u.uMapScale.value = mapScale;
    (u.uMapShift.value as THREE.Vector3).set(size.width >= 768 ? -1.15 : -0.4 * mapScale, size.width >= 768 ? 0 : -0.6, 0);

    // Zoom into Delhi NCR or out to all of India, depending on where the journey is
    // While travelling between two stops, head for the next stop's view; while paused, keep the current one
    const fr = storyStore.road - Math.floor(storyStore.road);
    const toward = fr > 0.12 ? Math.ceil(storyStore.road) : Math.floor(storyStore.road + 0.0001);
    const stopIdx = Math.min(journey.length - 1, Math.max(0, toward));
    const panTarget = journey[stopIdx].view === "ncr" ? 1 : 0;
    s.pan += (panTarget - s.pan) * (1 - Math.pow(0.06, dt));
    u.uMapPan.value = s.pan;
    u.uMapZoom.value = Math.exp(s.pan * Math.log(NCR_ZOOM));
    const zoom = u.uMapZoom.value;
    const shift = u.uMapShift.value as THREE.Vector3;

    // Position the DOM labels over the map cities (last label = "Delhi NCR" when zoomed out)
    const mapW = s.w[5];
    const fade = Math.min(1, (mapW - 0.25) / 0.5);
    const place = (el: HTMLElement, wx: number, wy: number, wz: number, lit: boolean, show: boolean) => {
      const mx = NCR_Q[0] + (wx - NCR_Q[0]) * zoom - NCR_Q[0] * s.pan;
      const my = NCR_Q[1] + (wy - NCR_Q[1]) * zoom - NCR_Q[1] * s.pan;
      const mz = NCR_Q[2] + (wz - NCR_Q[2]) * zoom - NCR_Q[2] * s.pan;
      proj.set(mx, my, mz).multiplyScalar(mapScale).add(shift).project(camera);
      const x = ((proj.x + 1) / 2) * size.width;
      const y = ((1 - proj.y) / 2) * size.height;
      const onScreen = proj.z < 1 && x > -40 && x < size.width + 40 && y > -40 && y < size.height + 40;
      if (!show || !onScreen || mapW < 0.25) {
        el.style.opacity = "0";
        el.style.visibility = "hidden";
        return;
      }
      el.style.visibility = "visible";
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.style.opacity = String(fade * (lit ? 1 : 0.45));
      el.dataset.lit = lit ? "true" : "false";
      el.dataset.side = x > size.width * 0.7 ? "left" : "right";
    };
    storyStore.cityLabels.forEach((el, i) => {
      if (!el) return;
      if (i === cities.length) {
        // group label for NCR when zoomed out
        place(el, NCR_Q[0], NCR_Q[1], NCR_Q[2], s.road >= -0.02, s.pan < 0.45);
        return;
      }
      const c = cityWorld[i];
      const ncr = !!cities[i].ncr;
      place(el, c[0], c[1], c[2], s.road >= cityFirstVisit[i] - 0.02, !ncr || s.pan > 0.55);
    });
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

/** The single 3D world the story happens inside. Fixed behind the chapters; renders only while a scene is on screen. */
export default function World({ reducedMotion }: { reducedMotion: boolean }) {
  const [active, setActive] = useState(true);
  const [dpr] = useState(() => (typeof window !== "undefined" && window.innerWidth < 768 ? 1.5 : 1.75));
  useEffect(() => {
    storyStore.webgl = true;
    const update = () => setActive(storyStore.visibleScenes > 0);
    storyStore.listeners.add(update);
    update();
    return () => {
      storyStore.listeners.delete(update);
    };
  }, []);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={dpr}
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, 6], fov: 50, near: 0.1, far: 80 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance", depth: false, stencil: false }}
      >
        <Signal reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
