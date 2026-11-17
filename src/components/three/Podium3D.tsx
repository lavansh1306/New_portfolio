"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";

/**
 * A 3D podium built from the real results: one coin per finish, dropped onto the step it belongs to.
 * Winner ×3 (centre), 1st Runner-Up ×4 (left), 2nd Runner-Up ×1 (right), plus 1 finalist coin on the floor.
 */

type Step = { label: string; count: number; x: number; h: number; coin: string; rank: string };

const STEPS: Step[] = [
  { label: "1st Runner-Up", rank: "02", count: 4, x: -1.32, h: 1.15, coin: "#e7e2d6" },
  { label: "Winner", rank: "01", count: 3, x: 0, h: 1.7, coin: "#d4a359" },
  { label: "2nd Runner-Up", rank: "03", count: 1, x: 1.32, h: 0.72, coin: "#b85d43" },
];

const COIN_H = 0.13;

type Coin = { x: number; z: number; rest: number; y: number; v: number; delay: number; rot: number; color: string; flat?: boolean };

const ANCHORS: [number, number, number][] = [
  ...STEPS.map((s) => [s.x, s.h * 0.5, 0.62] as [number, number, number]),
  [2.05, -0.02, 1.55],
];

function Scene({ active, reducedMotion, labels }: { active: boolean; reducedMotion: boolean; labels: MutableRefObject<(HTMLDivElement | null)[]> }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const group = useRef<THREE.Group>(null);
  const stepRefs = useRef<(THREE.Group | null)[]>([]);
  const coinRefs = useRef<(THREE.Mesh | null)[]>([]);
  const gl = useThree((s) => s.gl);
  const [hovered, setHovered] = useState<number | null>(null);
  const started = useRef(false);
  const clock = useRef(0);
  const drag = useRef({ on: false, lastX: 0, ry: -0.35, vy: 0 });

  const coins = useMemo<Coin[]>(() => {
    const list: Coin[] = [];
    let d = 0;
    // Drop order: winners first, then runner-ups
    [1, 0, 2].forEach((si) => {
      const s = STEPS[si];
      for (let i = 0; i < s.count; i++) {
        const rest = s.h + COIN_H / 2 + i * COIN_H;
        list.push({
          x: s.x + Math.sin(i * 2.3 + si) * 0.05,
          z: Math.cos(i * 1.7 + si) * 0.05,
          rest,
          y: reducedMotion ? rest : rest + 3.2 + i * 0.4,
          v: 0,
          delay: d++ * 0.14,
          rot: i * 0.7,
          color: s.coin,
        });
      }
    });
    list.push({ x: 2.05, z: 1.05, rest: COIN_H / 2, y: reducedMotion ? COIN_H / 2 : 3.6, v: 0, delay: d * 0.14 + 0.2, rot: 0.4, color: "#68736b", flat: true });
    return list;
  }, [reducedMotion]);

  const coinGeo = useMemo(() => new THREE.CylinderGeometry(0.33, 0.33, COIN_H * 0.92, 48), []);
  const coinMats = useMemo(() => {
    const m = new Map<string, THREE.MeshStandardMaterial>();
    coins.forEach((c) => {
      if (!m.has(c.color)) m.set(c.color, new THREE.MeshStandardMaterial({ color: c.color, metalness: 0.35, roughness: 0.32 }));
    });
    return m;
  }, [coins]);
  useEffect(() => () => {
    coinGeo.dispose();
    coinMats.forEach((m) => m.dispose());
  }, [coinGeo, coinMats]);

  useEffect(() => {
    const el = gl.domElement;
    const d = drag.current;
    const down = (e: PointerEvent) => {
      d.on = true;
      d.lastX = e.clientX;
    };
    const move = (e: PointerEvent) => {
      if (!d.on) return;
      const dx = e.clientX - d.lastX;
      d.lastX = e.clientX;
      d.ry = THREE.MathUtils.clamp(d.ry + dx * 0.008, -1.1, 1.1);
      d.vy = dx * 0.004;
    };
    const up = () => (d.on = false);
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    if (active) started.current = true;
    if (started.current) clock.current += dt;
    const t = clock.current;

    // Coins: gravity + a damped bounce
    coins.forEach((c, i) => {
      const mesh = coinRefs.current[i];
      if (!mesh) return;
      if (started.current && t > c.delay && !reducedMotion) {
        c.v -= 18 * dt;
        c.y += c.v * dt;
        if (c.y <= c.rest) {
          c.y = c.rest;
          c.v = Math.abs(c.v) > 0.6 ? -c.v * 0.32 : 0;
        }
      }
      mesh.position.set(c.x, c.y, c.z);
      mesh.visible = started.current || reducedMotion;
    });

    // Steps lift on hover
    STEPS.forEach((_, i) => {
      const g = stepRefs.current[i];
      if (!g) return;
      const target = hovered === i ? 0.12 : 0;
      g.position.y += (target - g.position.y) * (1 - Math.pow(0.002, dt));
    });

    const d = drag.current;
    if (!d.on && !reducedMotion) {
      d.vy *= Math.pow(0.05, dt);
      d.ry += d.vy;
    }
    const sway = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.35) * 0.12;
    if (group.current) group.current.rotation.y += (d.ry + sway - group.current.rotation.y) * (1 - Math.pow(0.003, dt));

    // Project label anchors to screen space (plain DOM labels, crisp and cheap)
    if (group.current) {
      group.current.updateMatrixWorld();
      ANCHORS.forEach((a, i) => {
        const el = labels.current[i];
        if (!el) return;
        const lift = i < STEPS.length && stepRefs.current[i] ? stepRefs.current[i]!.position.y : 0;
        tmp.set(a[0], a[1] + lift, a[2]);
        group.current!.localToWorld(tmp);
        tmp.project(camera);
        const x = ((tmp.x + 1) / 2) * size.width;
        const y = ((1 - tmp.y) / 2) * size.height;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
        el.style.opacity = started.current || reducedMotion ? "1" : "0";
      });
    }
    if (reducedMotion) state.invalidate();
  });

  return (
    <group ref={group} position={[0, -0.85, 0]}>
      {STEPS.map((s, i) => (
        <group
          key={s.label}
          ref={(el) => {
            stepRefs.current[i] = el;
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(i);
          }}
          onPointerOut={() => setHovered((h) => (h === i ? null : h))}
        >
          <RoundedBox args={[1.2, s.h, 1.2]} radius={0.035} smoothness={3} position={[s.x, s.h / 2, 0]}>
            <meshStandardMaterial color={hovered === i ? "#262a27" : "#1a1d1b"} roughness={0.7} metalness={0.05} />
          </RoundedBox>
          <mesh position={[s.x, s.h + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.12, 1.12]} />
            <meshBasicMaterial color={i === 1 ? "#d4a359" : "#2d3631"} transparent opacity={i === 1 ? 0.18 : 0.6} />
          </mesh>
        </group>
      ))}
      {coins.map((c, i) => (
        <mesh
          key={i}
          ref={(el) => {
            coinRefs.current[i] = el;
          }}
          geometry={coinGeo}
          material={coinMats.get(c.color)}
          rotation={[0, c.rot, 0]}
          castShadow
        />
      ))}
      <ContactShadows position={[0, 0.001, 0]} opacity={0.38} scale={9} blur={2.6} far={3} resolution={512} color="#1c221e" />
    </group>
  );
}

export default function Podium3D({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  return (
    <div className="relative h-full w-full">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={!active ? "never" : reducedMotion ? "demand" : "always"}
        camera={{ position: [0, 2.4, 7.2], fov: 34 }}
        gl={{ antialias: true, alpha: true }}
        style={{ touchAction: "pan-y", cursor: "grab" }}
        onCreated={({ camera }) => camera.lookAt(0, 0.15, 0)}
      >
        <ambientLight intensity={0.7} />
        <hemisphereLight args={["#eae6df", "#68736b", 0.6]} />
        <directionalLight position={[3, 6, 5]} intensity={1.8} />
        <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#d4a359" />
        <Scene active={active} reducedMotion={reducedMotion} labels={labels} />
      </Canvas>
      {STEPS.map((s, i) => (
        <div
          key={s.label}
          ref={(el) => {
            labels.current[i] = el;
          }}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 flex select-none flex-col items-center text-center text-paper opacity-0"
        >
          <span className="display-lg text-[clamp(1.3rem,2.2vw,2rem)] leading-none" style={{ color: i === 1 ? "#d4a359" : undefined }}>
            ×{s.count}
          </span>
          <span className="label mt-1 text-[8px] leading-tight">
            {s.label.split(" ").map((w) => (
              <span key={w} className="block">
                {w}
              </span>
            ))}
          </span>
        </div>
      ))}
      <div
        ref={(el) => {
          labels.current[STEPS.length] = el;
        }}
        aria-hidden
        className="label pointer-events-none absolute left-0 top-0 whitespace-nowrap text-[9px] text-graphite opacity-0"
      >
        Finalist ×1
      </div>
    </div>
  );
}
