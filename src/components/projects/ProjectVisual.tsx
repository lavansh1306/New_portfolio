"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ProjectVisual as Kind } from "@/content/profile";

/** Round so server-rendered and client-rendered numbers match exactly (avoids hydration mismatches). */
const r2 = (n: number) => Math.round(n * 100) / 100;
const rand = (i: number, s = 1) => {
  const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
  return Math.round((x - Math.floor(x)) * 1e4) / 1e4;
};
const v = (o: Record<string, string | number>) => o as CSSProperties;

type P = { ink: string; accent: string };

/** Sephela — 10 microservices on a ring, 8 agents orbiting the APK under analysis. */
function Agents({ ink, accent }: P) {
  const services = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    return { x: r2(200 + Math.cos(a) * 92), y: r2(150 + Math.sin(a) * 92) };
  });
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <circle cx="200" cy="150" r="128" fill="none" stroke={ink} strokeOpacity="0.15" strokeDasharray="2 6" />
      {services.map((s, i) => (
        <line key={i} x1="200" y1="150" x2={s.x} y2={s.y} stroke={accent} strokeOpacity="0.55" strokeDasharray="4 4" className="dash" />
      ))}
      <g className="spin" style={v({ "--d": "22s" })}>
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <circle key={i} cx={r2(200 + Math.cos(a) * 128)} cy={r2(150 + Math.sin(a) * 128)} r="4.5" fill={accent} />;
        })}
      </g>
      {services.map((s, i) => (
        <g key={i}>
          <rect x={s.x - 9} y={s.y - 9} width="18" height="18" fill="none" stroke={ink} strokeOpacity="0.8" />
          <text x={s.x} y={s.y + 3} textAnchor="middle" fill={ink} style={{ font: "500 7px var(--font-mono)" }}>
            {String(i + 1).padStart(2, "0")}
          </text>
        </g>
      ))}
      <polygon points="200,124 222,137 222,163 200,176 178,163 178,137" fill={accent} />
      <text x="200" y="154" textAnchor="middle" fill="#111312" style={{ font: "700 10px var(--font-mono)" }}>
        APK
      </text>
      <text x="14" y="288" fill={ink} fillOpacity="0.6" style={{ font: "500 9px var(--font-mono)" }}>
        10 services · 8 agents · 1,400+ tests
      </text>
    </svg>
  );
}

/** Velocity AI — sprint Gantt that keeps re-planning itself. */
function Gantt({ ink, accent }: P) {
  const rows = Array.from({ length: 9 }, (_, i) => ({ x: r2(40 + rand(i) * 140), w: r2(60 + rand(i, 3) * 150), hot: i === 2 || i === 6 }));
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1={40 + i * 45} y1="24" x2={40 + i * 45} y2="270" stroke={ink} strokeOpacity="0.08" />
      ))}
      {rows.map((r, i) => (
        <g key={i}>
          <text x="10" y={44 + i * 26} fill={ink} fillOpacity="0.5" style={{ font: "500 8px var(--font-mono)" }}>
            {`V-${120 + i * 7}`}
          </text>
          <rect
            x={r.x}
            y={34 + i * 26}
            width={r2(Math.min(r.w, 360 - r.x))}
            height="12"
            fill={r.hot ? accent : ink}
            fillOpacity={r.hot ? 1 : 0.75}
            className="grow"
            style={v({ "--delay": `${r2(i * 0.12)}s` })}
          />
        </g>
      ))}
      <g className="sweep" style={v({ "--d": "6s", "--sweep": "320px" })}>
        <line x1="40" y1="20" x2="40" y2="272" stroke={accent} strokeWidth="1.5" />
        <rect x="32" y="12" width="16" height="8" fill={accent} />
      </g>
      <text x="14" y="292" fill={ink} fillOpacity="0.6" style={{ font: "500 9px var(--font-mono)" }}>
        500+ live issues · Redis cache · &lt;250ms
      </text>
    </svg>
  );
}

/** TANFI-NET — a wall of 50 devices; faults flash, get caught, clear. */
function Network({ ink, accent }: P) {
  const nodes = Array.from({ length: 50 }, (_, i) => ({ x: 40 + (i % 10) * 36, y: 48 + Math.floor(i / 10) * 44, f: rand(i, 7) > 0.72 }));
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      {nodes.map((n, i) =>
        i % 10 !== 9 ? <line key={`h${i}`} x1={n.x} y1={n.y} x2={n.x + 36} y2={n.y} stroke={ink} strokeOpacity="0.15" /> : null,
      )}
      {nodes.map((n, i) => (i < 40 ? <line key={`v${i}`} x1={n.x} y1={n.y} x2={n.x} y2={n.y + 44} stroke={ink} strokeOpacity="0.1" /> : null))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="5" fill={ink} fillOpacity="0.85" />
          {n.f && (
            <g className="fault" style={v({ "--delay": `${r2(rand(i, 2) * 4)}s`, "--d": `${r2(3 + rand(i, 5) * 3)}s` })}>
              <circle cx={n.x} cy={n.y} r="11" fill="none" stroke={accent} />
              <circle cx={n.x} cy={n.y} r="5" fill={accent} />
            </g>
          )}
        </g>
      ))}
      <g className="sweep" style={v({ "--d": "4s", "--sweep": "360px" })}>
        <rect x="20" y="30" width="2" height="196" fill={accent} fillOpacity="0.8" />
      </g>
      <text x="14" y="270" fill={ink} fillOpacity="0.6" style={{ font: "500 9px var(--font-mono)" }}>
        50+ devices · WebSockets · ~1s
      </text>
      <text x="386" y="270" textAnchor="end" fill={accent} style={{ font: "500 9px var(--font-mono)" }} className="blink">
        ● LIVE
      </text>
    </svg>
  );
}

/** RAKSHA X — ambient audio; a spike crosses the threshold, SOS fires. */
function Waveform({ ink, accent }: P) {
  const bars = Array.from({ length: 46 }, (_, i) => ({ h: r2(20 + rand(i) * 90), spike: i === 30 || i === 31 || i === 32 }));
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <line x1="10" y1="70" x2="390" y2="70" stroke={accent} strokeDasharray="4 4" strokeOpacity="0.8" />
      <line x1="10" y1="230" x2="390" y2="230" stroke={accent} strokeDasharray="4 4" strokeOpacity="0.8" />
      <text x="390" y="62" textAnchor="end" fill={accent} style={{ font: "500 8px var(--font-mono)" }}>
        threat threshold
      </text>
      {bars.map((b, i) => (
        <rect
          key={i}
          x={18 + i * 8}
          y={r2(150 - (b.spike ? 85 : b.h / 2))}
          width="4"
          height={b.spike ? 170 : b.h}
          rx="2"
          fill={b.spike ? accent : ink}
          fillOpacity={b.spike ? 1 : 0.8}
          className="bar"
          style={v({ "--delay": `${r2((i % 9) * 0.11)}s`, "--d": b.spike ? "2.4s" : `${r2(0.9 + rand(i, 4) * 0.8)}s` })}
        />
      ))}
      <g className="pop" style={v({ "--d": "2.4s", "--delay": "0.6s" })}>
        <rect x="268" y="20" width="96" height="26" fill={accent} />
        <text x="316" y="37" textAnchor="middle" fill="#111312" style={{ font: "700 10px var(--font-mono)" }}>
          SOS → WhatsApp
        </text>
      </g>
      <text x="14" y="288" fill={ink} fillOpacity="0.6" style={{ font: "500 9px var(--font-mono)" }}>
        YAMNet · Vosk · Twilio · location + clip
      </text>
    </svg>
  );
}

/** Pravah.ai — a noisy Slack thread condenses into a structured task. */
function Thread({ ink, accent }: P) {
  const msgs = [70, 110, 52, 96, 128, 64, 88];
  const fields = ["task", "owner", "blocker", "due"];
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      {msgs.map((w, i) => (
        <g key={i} className="pop" style={v({ "--d": "6s", "--delay": `${r2(i * 0.18)}s` })}>
          <circle cx="22" cy={38 + i * 32} r="7" fill={ink} fillOpacity="0.35" />
          <rect x="36" y={31 + i * 32} width={w} height="14" rx="7" fill={ink} fillOpacity="0.22" />
        </g>
      ))}
      <path d="M180 150 L222 150" stroke={accent} strokeWidth="1.5" strokeDasharray="4 4" className="dash" />
      <polygon points="222,145 232,150 222,155" fill={accent} />
      <rect x="244" y="62" width="140" height="176" fill="none" stroke={ink} strokeOpacity="0.6" />
      <rect x="244" y="62" width="140" height="22" fill={accent} />
      <text x="254" y="77" fill="#111312" style={{ font: "700 9px var(--font-mono)" }}>
        TASK.json ✓ schema
      </text>
      {fields.map((f, i) => (
        <g key={f} className="pop" style={v({ "--d": "6s", "--delay": `${r2(1.6 + i * 0.25)}s` })}>
          <text x="254" y={110 + i * 34} fill={ink} fillOpacity="0.55" style={{ font: "500 8px var(--font-mono)" }}>
            {f}
          </text>
          <rect x="254" y={116 + i * 34} width={60 + ((i * 37) % 60)} height="7" fill={ink} fillOpacity="0.8" />
        </g>
      ))}
      <text x="14" y="288" fill={ink} fillOpacity="0.6" style={{ font: "500 9px var(--font-mono)" }}>
        Slack thread → schema-checked task · fallback on timeout
      </text>
    </svg>
  );
}

/** Stock_Verse — scrolling candlesticks with a trend line. */
function Candles({ ink, accent }: P) {
  const candles = Array.from({ length: 24 }, (_, i) => {
    const o = r2(150 + Math.sin(i * 0.6) * 40 + (rand(i) - 0.5) * 30);
    const c = r2(o + (rand(i, 9) - 0.45) * 40);
    return { o, c, hi: r2(Math.min(o, c) - 6 - rand(i, 2) * 14), lo: r2(Math.max(o, c) + 6 + rand(i, 3) * 14) };
  });
  const series = [...candles, ...candles];
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      {Array.from({ length: 5 }, (_, i) => (
        <line key={i} x1="0" y1={60 + i * 45} x2="400" y2={60 + i * 45} stroke={ink} strokeOpacity="0.08" />
      ))}
      <g className="scroll-x" style={v({ "--d": "16s" })}>
        {series.map((k, i) => {
          const up = k.c < k.o;
          const x = 14 + i * 17;
          return (
            <g key={i}>
              <line x1={x + 4} y1={k.hi} x2={x + 4} y2={k.lo} stroke={up ? accent : ink} strokeOpacity={up ? 1 : 0.7} />
              <rect x={x} y={Math.min(k.o, k.c)} width="8" height={r2(Math.max(2, Math.abs(k.c - k.o)))} fill={up ? accent : ink} fillOpacity={up ? 1 : 0.7} />
            </g>
          );
        })}
      </g>
      <text x="14" y="28" fill={ink} style={{ font: "700 11px var(--font-mono)" }}>
        MARKET <tspan fill={accent}>▲ live</tspan>
      </text>
      <text x="386" y="28" textAnchor="end" fill={ink} fillOpacity="0.6" style={{ font: "500 9px var(--font-mono)" }}>
        XP · levels · leaderboard
      </text>
      <text x="14" y="288" fill={ink} fillOpacity="0.6" style={{ font: "500 9px var(--font-mono)" }}>
        Live market data · games · Gemini assistant
      </text>
    </svg>
  );
}

/** Peer-Point — a doubt branches into threaded answers, one gets accepted. */
function QA({ ink, accent }: P) {
  const replies = [
    { x: 96, y: 108, w: 150 },
    { x: 96, y: 150, w: 120 },
    { x: 140, y: 188, w: 140, accepted: true },
    { x: 96, y: 228, w: 170 },
  ];
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <rect x="40" y="36" width="300" height="40" fill="none" stroke={ink} strokeOpacity="0.8" />
      <text x="52" y="54" fill={accent} style={{ font: "700 9px var(--font-mono)" }}>
        Q · CSE / DSA
      </text>
      <rect x="52" y="60" width="200" height="6" fill={ink} fillOpacity="0.7" />
      <path d="M60 76 V232" stroke={ink} strokeOpacity="0.3" />
      {replies.map((r, i) => (
        <g key={i} className="pop" style={v({ "--d": "7s", "--delay": `${r2(0.3 + i * 0.4)}s` })}>
          <path d={`M${r.x === 140 ? 100 : 60} ${r.y + 8} H${r.x}`} stroke={ink} strokeOpacity="0.3" />
          {r.x === 140 && <path d="M100 158 V196" stroke={ink} strokeOpacity="0.3" />}
          <rect x={r.x} y={r.y} width={r.w} height="18" fill={r.accepted ? accent : "none"} stroke={r.accepted ? accent : ink} strokeOpacity="0.7" />
          <rect x={r.x + 8} y={r.y + 7} width={r.w - 40} height="4" fill={r.accepted ? "#111312" : ink} fillOpacity="0.7" />
          {r.accepted && (
            <text x={r.x + r.w + 8} y={r.y + 13} fill={accent} style={{ font: "700 9px var(--font-mono)" }}>
              ✓ accepted
            </text>
          )}
        </g>
      ))}
      <text x="14" y="288" fill={ink} fillOpacity="0.6" style={{ font: "500 9px var(--font-mono)" }}>
        Threads · categories · JWT + roles
      </text>
    </svg>
  );
}


/** PRAPTI-AI — a tender moves through 7 stages; AI marks in pencil, 3 jurors vote, an officer stamps in ink. */
function Tender({ ink, accent }: P) {
  const stages = ["Indent", "Tender", "Bids", "Tech", "Price", "Rules", "Award"];
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <line x1="30" y1="52" x2="370" y2="52" stroke={ink} strokeOpacity="0.25" />
      {stages.map((st, i) => (
        <g key={st}>
          <rect x={14 + i * 53} y="26" width="46" height="16" fill="none" stroke={ink} strokeOpacity="0.7" />
          <text x={37 + i * 53} y="37" textAnchor="middle" fill={ink} style={{ font: "500 7px var(--font-mono)" }}>
            {st}
          </text>
          <circle cx={37 + i * 53} cy="52" r="2.5" fill={ink} fillOpacity="0.6" />
        </g>
      ))}
      <g className="sweep" style={v({ "--d": "7s", "--sweep": "318px" })}>
        <circle cx="37" cy="52" r="5" fill={accent} />
      </g>
      <rect x="22" y="78" width="150" height="176" fill="none" stroke={ink} strokeOpacity="0.5" />
      <text x="30" y="94" fill={ink} fillOpacity="0.55" style={{ font: "500 7px var(--font-mono)" }}>
        BID · p.14 (scanned)
      </text>
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x="32" y={104 + i * 15} width={r2(90 + rand(i, 11) * 40)} height="4" fill={ink} fillOpacity="0.45" />
      ))}
      <g className="pop" style={v({ "--d": "7s", "--delay": "0.8s" })}>
        <rect x="30" y="129" width="124" height="12" fill="none" stroke={accent} strokeDasharray="3 3" />
        <text x="158" y="138" fill={accent} style={{ font: "700 7px var(--font-mono)" }}>
          AI
        </text>
      </g>
      <g className="pop" style={v({ "--d": "7s", "--delay": "1.2s" })}>
        <rect x="30" y="189" width="104" height="12" fill="none" stroke={accent} strokeDasharray="3 3" />
      </g>
      {[0, 1, 2].map((j) => (
        <g key={j}>
          <circle cx={224 + j * 52} cy="110" r="15" fill="none" stroke={ink} strokeOpacity="0.7" />
          <text x={224 + j * 52} y="113" textAnchor="middle" fill={ink} style={{ font: "500 7px var(--font-mono)" }}>
            {`J${j + 1}`}
          </text>
          <g className="pop" style={v({ "--d": "7s", "--delay": `${r2(1.8 + j * 0.35)}s` })}>
            <rect x={210 + j * 52} y="134" width="28" height="16" fill={accent} />
            <text x={224 + j * 52} y="145" textAnchor="middle" fill="#111312" style={{ font: "700 8px var(--font-mono)" }}>
              ✓
            </text>
          </g>
        </g>
      ))}
      <text x="276" y="172" textAnchor="middle" fill={ink} fillOpacity="0.55" style={{ font: "500 7px var(--font-mono)" }}>
        3 independent jurors
      </text>
      <g className="pop" style={v({ "--d": "7s", "--delay": "3.2s" })}>
        <g transform="rotate(-8 276 222)">
          <rect x="222" y="204" width="108" height="34" fill="none" stroke={accent} strokeWidth="2" />
          <text x="276" y="226" textAnchor="middle" fill={accent} style={{ font: "800 13px var(--font-display)", letterSpacing: "0.08em" }}>
            APPROVED
          </text>
        </g>
      </g>
      <text x="14" y="288" fill={ink} fillOpacity="0.6" style={{ font: "500 9px var(--font-mono)" }}>
        11 agents · 36 rules · AI in pencil, officer in ink
      </text>
    </svg>
  );
}

/** SAHAYAK-AI — files flow through 7 stages, bad ones get quarantined, answers come back verified twice. */
function Pipeline({ ink, accent }: P) {
  const nodes = Array.from({ length: 7 }, (_, i) => ({ x: 92 + i * 46 }));
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      {["csv", "xlsx", "pdf"].map((f, i) => (
        <g key={f} className="pop" style={v({ "--d": "6s", "--delay": `${r2(i * 0.25)}s` })}>
          <path d={`M14 ${62 + i * 34} h22 l8 8 v20 h-30 z`} fill="none" stroke={ink} strokeOpacity="0.8" />
          <text x="29" y={84 + i * 34} textAnchor="middle" fill={ink} style={{ font: "500 6px var(--font-mono)" }}>
            {f}
          </text>
        </g>
      ))}
      <path d="M48 110 H360" stroke={accent} strokeDasharray="4 4" className="dash" />
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy="110" r="11" fill={i === 6 ? accent : "none"} stroke={i === 6 ? accent : ink} strokeOpacity="0.85" />
          <text x={n.x} y="113.5" textAnchor="middle" fill={i === 6 ? "#111312" : ink} style={{ font: "700 8px var(--font-mono)" }}>
            {i + 1}
          </text>
        </g>
      ))}
      <g className="sweep" style={v({ "--d": "4s", "--sweep": "276px" })}>
        <rect x="84" y="86" width="16" height="10" fill={accent} />
      </g>
      <path d="M230 121 V160 H262" fill="none" stroke={ink} strokeOpacity="0.4" strokeDasharray="2 3" />
      <rect x="262" y="150" width="96" height="20" fill="none" stroke={ink} strokeOpacity="0.5" strokeDasharray="3 3" />
      <text x="310" y="163" textAnchor="middle" fill={ink} fillOpacity="0.7" style={{ font: "500 7px var(--font-mono)" }}>
        quarantined: bad file
      </text>
      <rect x="22" y="190" width="150" height="22" rx="11" fill={ink} fillOpacity="0.12" />
      <text x="34" y="204" fill={ink} style={{ font: "500 8px var(--font-mono)" }}>
        “total by month, last FY?”
      </text>
      <rect x="196" y="186" width="182" height="78" fill="none" stroke={ink} strokeOpacity="0.6" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          key={i}
          x={208 + i * 16}
          y={r2(254 - (20 + rand(i, 13) * 34))}
          width="10"
          height={r2(20 + rand(i, 13) * 34)}
          fill={i === 5 ? accent : ink}
          fillOpacity={i === 5 ? 1 : 0.7}
          className="bar"
          style={v({ "--d": "3s", "--delay": `${r2(i * 0.08)}s` })}
        />
      ))}
      <g className="pop" style={v({ "--d": "6s", "--delay": "1.4s" })}>
        <rect x="292" y="192" width="80" height="16" fill={accent} />
        <text x="332" y="203" textAnchor="middle" fill="#111312" style={{ font: "700 7px var(--font-mono)" }}>
          VERIFIED 2 / 2
        </text>
      </g>
      <text x="14" y="288" fill={ink} fillOpacity="0.6" style={{ font: "500 9px var(--font-mono)" }}>
        7 stages · pandas + DuckDB · every number checked twice
      </text>
    </svg>
  );
}

/** Incident Triage — logs in, top-3 causes out, an approval gate, a hash-chained audit trail. */
function Triage({ ink, accent }: P) {
  const logs = [0.6, 0.8, 0.5, 0.9, 0.7, 0.55, 0.85, 0.65];
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <rect x="14" y="24" width="150" height="150" fill="none" stroke={ink} strokeOpacity="0.5" />
      <text x="22" y="38" fill={ink} fillOpacity="0.55" style={{ font: "500 7px var(--font-mono)" }}>
        app.log · SEV1
      </text>
      {logs.map((w, i) => (
        <g key={i}>
          <rect x="22" y={48 + i * 15} width="18" height="5" fill={i === 4 ? accent : ink} fillOpacity={i === 4 ? 1 : 0.35} />
          <rect x="44" y={48 + i * 15} width={r2(110 * w)} height="5" fill={i === 4 ? accent : ink} fillOpacity={i === 4 ? 0.9 : 0.55} className={i === 4 ? "blink" : undefined} />
        </g>
      ))}
      <text x="186" y="38" fill={ink} fillOpacity="0.55" style={{ font: "500 7px var(--font-mono)" }}>
        top-3 causes · runbook match
      </text>
      {[0.92, 0.48, 0.22].map((w, i) => (
        <g key={i}>
          <text x="186" y={60 + i * 22} fill={ink} style={{ font: "700 8px var(--font-mono)" }}>
            {`#${i + 1}`}
          </text>
          <rect x="204" y={53 + i * 22} width={r2(160 * w)} height="9" fill={i === 0 ? accent : ink} fillOpacity={i === 0 ? 1 : 0.5} className="grow" style={v({ "--delay": `${r2(i * 0.2)}s` })} />
        </g>
      ))}
      <rect x="186" y="128" width="190" height="46" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="5 4" />
      <text x="198" y="146" fill={accent} style={{ font: "700 8px var(--font-mono)" }}>
        ⏸ rollback → waiting for approval
      </text>
      <g className="pop" style={v({ "--d": "6s", "--delay": "2.2s" })}>
        <text x="198" y="164" fill={ink} style={{ font: "500 8px var(--font-mono)" }}>
          ✓ approved by lead · health check ok
        </text>
      </g>
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i} className="pop" style={v({ "--d": "6s", "--delay": `${r2(0.3 + i * 0.35)}s` })}>
          <rect x={22 + i * 52} y="204" width="34" height="24" fill="none" stroke={i === 6 ? accent : ink} strokeOpacity="0.8" />
          <text x={39 + i * 52} y="219" textAnchor="middle" fill={ink} fillOpacity="0.7" style={{ font: "500 6px var(--font-mono)" }}>
            {`#${(i * 37 + 11).toString(16)}`}
          </text>
          {i < 6 && <line x1={56 + i * 52} y1="216" x2={74 + i * 52} y2="216" stroke={ink} strokeOpacity="0.5" />}
        </g>
      ))}
      <text x="22" y="246" fill={ink} fillOpacity="0.55" style={{ font: "500 7px var(--font-mono)" }}>
        hash-chained audit log
      </text>
      <text x="14" y="288" fill={ink} fillOpacity="0.6" style={{ font: "500 9px var(--font-mono)" }}>
        Qwen via Ollama · 0 of 60 unapproved runs got through
      </text>
    </svg>
  );
}

const MAP: Record<Kind, (p: P) => React.JSX.Element> = {
  tender: Tender,
  pipeline: Pipeline,
  triage: Triage,
  agents: Agents,
  gantt: Gantt,
  network: Network,
  waveform: Waveform,
  thread: Thread,
  candles: Candles,
  qa: QA,
};

/** Animated technical diagram for a project. Animations pause while off-screen. */
export function ProjectVisual({ kind, ink, accent, label }: { kind: Kind; ink: string; accent: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(true);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setPaused(!e.isIntersecting), { threshold: 0.05 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const Cmp = MAP[kind];
  return (
    <div ref={ref} className="viz h-full w-full" data-paused={paused} role="img" aria-label={label}>
      <Cmp ink={ink} accent={accent} />
    </div>
  );
}
