"use client";

import { useEffect, useState } from "react";
import { LesionImage } from "@/components/lesion-image";

const hue = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7);

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const h = hue(name);
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full font-medium ring-1 ring-inset ring-line"
      style={{ width: size, height: size, fontSize: size * 0.36, color: `hsl(${h} 45% 46%)`, background: `color-mix(in oklch, hsl(${h} 55% 50%) 16%, transparent)` }}
    >
      {initials}
    </span>
  );
}

export function Sparkline({ values, color = "#5f7a58", w = 84, h = 28 }: { values: number[]; color?: string; w?: number; h?: number }) {
  if (values.length < 2) return <span className="text-xs text-stone-400">–</span>;
  const min = Math.min(...values), max = Math.max(...values), span = max - min || 1;
  const pts = values.map((v, i) => [3 + (i / (values.length - 1)) * (w - 6), 3 + (1 - (v - min) / span) * (h - 6)]);
  const last = pts[pts.length - 1];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="draw" />
      <circle cx={last[0]} cy={last[1]} r="3" fill={color} className="pop" style={{ animationDelay: "0.9s" }} />
    </svg>
  );
}

export function CountUp({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = reduce ? 1 : Math.min(1, (t - t0) / 800);
      setN(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span className="tnum">{n.toFixed(decimals)}</span>;
}

// Before / after photo slider. The range input carries keyboard and touch use.
export function Compare({ a, b }: { a: { label: string; sizeMm: number; seed: number }; b: { label: string; sizeMm: number; seed: number } }) {
  const [x, setX] = useState(50);
  return (
    <div>
      <div className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-xl border border-line">
        <LesionImage sizeMm={b.sizeMm} seed={b.seed} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }}>
          <LesionImage sizeMm={a.sizeMm} seed={a.seed} className="h-full w-full" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-surface" style={{ left: `${x}%` }}>
          <span className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-xs text-stone-600 shadow-lg">↔</span>
        </div>
        <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">{a.label} · {a.sizeMm} mm</span>
        <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">{b.label} · {b.sizeMm} mm</span>
        <input
          type="range" min={0} max={100} value={x} onChange={(e) => setX(Number(e.target.value))}
          aria-label="Compare first and latest photo" className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
    </div>
  );
}
