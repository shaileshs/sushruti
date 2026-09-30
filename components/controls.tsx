"use client";

import { useState, type ReactNode } from "react";
import { MEASURE_STATES } from "@/lib/form";

const ring = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export const Check = () => (
  <svg viewBox="0 0 16 16" className="pop h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m3 8.5 3.2 3L13 4.5" />
  </svg>
);

export function Accordion({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div className="acc" data-open={open} aria-hidden={!open} inert={!open}>
      <div>{children}</div>
    </div>
  );
}

export function Chips({ label, opts, value, multi, onChange }: { label: string; opts: string[]; value: string | string[]; multi?: boolean; onChange: (v: string | string[]) => void }) {
  const sel = (o: string) => (multi ? (value as string[]).includes(o) : value === o);
  const click = (o: string) =>
    multi ? onChange(sel(o) ? (value as string[]).filter((x) => x !== o) : [...(value as string[]), o]) : onChange(sel(o) ? "" : o);
  return (
    <div role={multi ? "group" : "radiogroup"} aria-label={label} className="flex flex-wrap gap-2">
      {opts.map((o) => (
        <button
          type="button" key={o} role={multi ? undefined : "radio"} aria-checked={multi ? undefined : sel(o)} aria-pressed={multi ? sel(o) : undefined}
          onClick={() => click(o)}
          className={`press inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-colors ${ring} ${
            sel(o) ? "border-accent bg-accent text-on-accent" : "border-line-strong bg-surface text-stone-700 hover:border-brand-500 hover:bg-brand-50"
          }`}
        >
          {sel(o) && <Check />}
          {o}
        </button>
      ))}
    </div>
  );
}

const painHue = (i: number) => 150 - i * 15;
const painWord = (n: number) => (n === 0 ? "No pain" : n <= 3 ? "Mild" : n <= 6 ? "Moderate" : "Severe");

// 0–10 tap scale. Arrow keys move the value, as in a native radio group.
export function PainScale({ id, value, disabled, onChange }: { id: string; value: string; disabled?: boolean; onChange: (v: string) => void }) {
  const n = value === "" ? null : Number(value);
  const key = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    onChange(String(Math.min(10, Math.max(0, (n ?? (d > 0 ? -1 : 11)) + d))));
  };
  return (
    <div>
      <div id={id} role="radiogroup" aria-label="Pain intensity, 0 to 10" onKeyDown={key} className={`grid grid-cols-11 gap-1 ${disabled ? "pointer-events-none opacity-40" : ""}`}>
        {Array.from({ length: 11 }, (_, i) => {
          const on = n === i;
          return (
            <button
              type="button" key={i} role="radio" aria-checked={on} tabIndex={on || (n === null && i === 0) ? 0 : -1} onClick={() => onChange(on ? "" : String(i))}
              className={`press aspect-square rounded-lg text-sm font-semibold tnum transition-all ${ring} ${on ? "scale-110 text-white" : "hover:scale-105"}`}
              style={{
                background: on ? `hsl(${painHue(i)} 60% 42%)` : `color-mix(in oklch, hsl(${painHue(i)} 65% 50%) 16%, transparent)`,
                color: on ? "#fff" : `hsl(${painHue(i)} 55% 42%)`,
              }}
            >
              {i}
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 h-4 text-xs text-stone-500">{n === null ? "Tap a number. Arrow keys also work." : `${n} · ${painWord(n)}`}</p>
    </div>
  );
}

export function StateSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <select
      aria-label={`${label}: value or state`} value={value} onChange={(e) => onChange(e.target.value)}
      className={`rounded-xl border px-2 text-sm ${ring} ${value === "Value" ? "border-line-strong bg-surface text-stone-500" : "border-amber-300 bg-amber-50 text-amber-900"}`}
    >
      {MEASURE_STATES.map((s) => <option key={s}>{s}</option>)}
    </select>
  );
}

export function NumberField({
  id, value, onChange, unit, disabled, placeholder, prev, goodDown, step = 1,
}: {
  id: string; value: string; onChange: (v: string) => void; unit?: string; disabled?: boolean; placeholder?: string;
  prev?: number; goodDown?: boolean; step?: number;
}) {
  const [bump, setBump] = useState(0);
  const nudge = (d: number) => {
    const base = value === "" ? prev ?? 0 : Number(value) || 0;
    onChange(String(Math.max(0, Math.round((base + d) * 10) / 10)));
    setBump((b) => b + 1);
  };
  const n = Number(value);
  const delta = prev !== undefined && value !== "" && !Number.isNaN(n) ? Math.round((n - prev) * 10) / 10 : null;
  const good = delta !== null && delta !== 0 && (delta < 0) === !!goodDown;
  const btn = `press flex h-full w-10 items-center justify-center text-lg text-stone-500 hover:bg-stone-100 hover:text-brand-700 disabled:opacity-40 ${ring}`;
  return (
    <div>
      <div className={`flex h-11 items-stretch overflow-hidden rounded-xl border border-line-strong bg-surface transition focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15 ${disabled ? "bg-stone-50" : ""}`}>
        <button type="button" className={btn} aria-label="Decrease" disabled={disabled} onClick={() => nudge(-step)}>−</button>
        <input
          id={id} inputMode="decimal" disabled={disabled} placeholder={placeholder ?? (prev !== undefined ? `Last: ${prev}` : "")}
          value={disabled ? "" : value} onChange={(e) => onChange(e.target.value)}
          className="tnum min-w-0 flex-1 bg-transparent text-center text-base outline-none placeholder:text-stone-400 disabled:cursor-not-allowed"
        />
        {unit && <span className="flex items-center pr-1 text-xs text-stone-400">{unit}</span>}
        <button type="button" className={btn} aria-label="Increase" disabled={disabled} onClick={() => nudge(step)}>+</button>
      </div>
      <p key={bump} className={`mt-1 h-4 text-xs ${delta === null ? "" : delta === 0 ? "text-stone-500" : good ? "text-emerald-700" : "text-rose-700"}`}>
        {delta === null ? "" : delta === 0 ? `No change from last (${prev})` : `${delta < 0 ? "▼" : "▲"} ${Math.abs(delta)}${unit ? ` ${unit}` : ""} vs last (${prev})`}
      </p>
    </div>
  );
}
