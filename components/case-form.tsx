"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Accordion, Check, Chips, NumberField, PainScale, StateSelect } from "@/components/controls";
import { btnGhost, input } from "@/components/ui";
import { sections, type Field, type Row, type Val } from "@/lib/form";

export type Values = Record<string, Val>;
export type States = Record<string, string>;
export type PrevNums = Record<string, { val: number; goodDown: boolean }>;

const label = "mb-1.5 block text-sm font-medium text-stone-700";
const ring = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const filled = (f: Field, v: Values, st: States, base: Values) => {
  if (st[f.k] && st[f.k] !== "Value") return true;
  const x = v[f.k];
  if (typeof x === "string" && x === base[f.k]) return false; // prefilled from the last visit, not yet touched
  if (Array.isArray(x)) return f.t === "list" ? (x as Row[]).some((r) => Object.values(r).some(Boolean)) : x.length > 0;
  return !!x;
};

type Extra = { id: string; n: string; title: string; node: ReactNode };

export function CaseForm({
  v, st, setV, setSt, errors, extra, showSince, prev, baseline,
}: {
  v: Values; st: States; baseline: Values;
  setV: (k: string, val: Val) => void;
  setSt: (k: string, s: string) => void;
  errors: Record<string, string>;
  extra: Extra;
  showSince: boolean;
  prev: PrevNums;
}) {
  const secs = sections.filter((s) => showSince || s.id !== "since");
  const all = [...secs.map((s) => ({ id: s.id, n: s.n, title: s.title })), { id: extra.id, n: extra.n, title: extra.title }];
  const [cur, setCur] = useState(0);
  const [open, setOpen] = useState<Set<string>>(new Set([all[0].id]));
  const [more, setMore] = useState<Set<string>>(new Set());
  const navRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Keep the active item of the horizontal phone nav in view.
  useEffect(() => {
    navRefs.current[cur]?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [cur]);

  const toggle = (set: Set<string>, id: string) => {
    const s = new Set(set);
    if (s.has(id)) s.delete(id); else s.add(id);
    return s;
  };
  const go = (i: number) => {
    const j = Math.min(all.length - 1, Math.max(0, i));
    setCur(j);
    setOpen((o) => new Set(o).add(all[j].id));
    requestAnimationFrame(() => document.getElementById(`sec-${all[j].id}`)?.scrollIntoView({ block: "start", behavior: "smooth" }));
  };
  const count = (i: number) => (i < secs.length ? secs[i].fields.filter((f) => filled(f, v, st, baseline)).length : 0);
  const doneCount = secs.filter((_, i) => count(i) > 0).length;
  const pct = Math.round((doneCount / secs.length) * 100);

  const renderField = (f: Field) => {
    const id = `f-${f.k}`;
    const val = v[f.k];
    const err = errors[f.k];
    const state = st[f.k] ?? "Value";
    const wide = f.t !== "text" && f.t !== "num";
    let body: ReactNode;
    let group = false;
    if (f.t === "text") {
      body = <input id={id} className={input} value={(val as string) ?? ""} onChange={(e) => setV(f.k, e.target.value)} />;
    } else if (f.t === "long") {
      body = <textarea id={id} className={`${input} min-h-20 resize-y`} rows={2} value={(val as string) ?? ""} onChange={(e) => setV(f.k, e.target.value)} />;
    } else if (f.t === "num") {
      const p = prev[f.k];
      const pain = f.k === "pain";
      body = (
        <div>
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              {pain ? (
                <PainScale id={id} value={(val as string) ?? ""} disabled={state !== "Value"} onChange={(x) => setV(f.k, x)} />
              ) : (
                <NumberField id={id} value={(val as string) ?? ""} disabled={state !== "Value"} placeholder={state !== "Value" ? state : undefined} unit={f.unit} prev={p?.val} goodDown={p?.goodDown} onChange={(x) => setV(f.k, x)} />
              )}
            </div>
            <div className="h-11 shrink-0"><StateSelect label={f.label} value={state} onChange={(s) => setSt(f.k, s)} /></div>
          </div>
        </div>
      );
      if (pain) group = true;
    } else if (f.t === "enum" || f.t === "multi") {
      group = true;
      body = <Chips label={f.label} opts={f.opts!} multi={f.t === "multi"} value={f.t === "multi" ? ((val as string[]) ?? []) : ((val as string) ?? "")} onChange={(x) => setV(f.k, x)} />;
    } else {
      const rows = (val as Row[]) ?? [];
      const setRow = (i: number, c: string, x: string) => setV(f.k, rows.map((r, j) => (j === i ? { ...r, [c]: x } : r)));
      group = true;
      body = (
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div key={i} className="rise relative grid grid-cols-1 gap-2 rounded-xl border border-line bg-stone-50/70 p-3 pr-10 sm:grid-cols-2">
              {f.cols!.map((c) => (
                <input key={c.k} className={input} placeholder={c.label} aria-label={c.label} value={r[c.k] ?? ""} onChange={(e) => setRow(i, c.k, e.target.value)} />
              ))}
              <button type="button" aria-label="Remove row" className={`press absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-stone-400 hover:bg-rose-50 hover:text-rose-700 ${ring}`} onClick={() => setV(f.k, rows.filter((_, j) => j !== i))}>×</button>
            </div>
          ))}
          <button type="button" className={`${btnGhost} !py-2`} onClick={() => setV(f.k, [...rows, {}])}>+ Add row</button>
        </div>
      );
    }
    const head = group ? <span className={label} id={`${id}-l`}>{f.label}</span> : <label htmlFor={id} className={label}>{f.label}{f.unit && f.t === "num" ? ` (${f.unit})` : ""}</label>;
    return (
      <div key={f.k} className={wide || f.k === "pain" ? "sm:col-span-2" : ""}>
        {head}
        {body}
        {f.hint && <p className="mt-1 text-xs text-stone-500">{f.hint}</p>}
        {err && <p role="alert" className="mt-1 text-xs text-rose-700">{err}</p>}
      </div>
    );
  };

  return (
    <div
      className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-6"
      onKeyDown={(e) => {
        if (e.altKey && (e.key === "ArrowDown" || e.key === "ArrowUp")) { e.preventDefault(); go(cur + (e.key === "ArrowDown" ? 1 : -1)); }
      }}
    >
      <aside className="sticky top-0 z-20 -mx-4 mb-4 bg-stone-50/85 px-4 pb-2 pt-2 backdrop-blur md:-mx-10 md:px-10 lg:top-4 lg:z-auto lg:mx-0 lg:mb-0 lg:self-start lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <div className="mb-2 flex items-center justify-between text-xs text-stone-500">
          <span><strong className="tnum text-stone-800">{doneCount}</strong> of {secs.length} sections started</span>
          <span className="tnum font-medium text-brand-700">{pct}%</span>
        </div>
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-stone-200" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Form progress">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
        </div>
        <nav aria-label="Form sections" className="no-bar flex snap-x gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0">
          {all.map((s, i) => {
            const n = count(i);
            const done = n > 0;
            return (
              <button
                key={s.id} type="button" ref={(el) => { navRefs.current[i] = el; }} onClick={() => go(i)} aria-current={i === cur ? "step" : undefined}
                className={`press flex shrink-0 snap-center items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-left text-sm transition-colors lg:w-full lg:rounded-lg ${ring} ${
                  i === cur ? "bg-accent text-on-accent" : "bg-surface text-stone-700 ring-1 ring-stone-200 hover:bg-brand-50 lg:bg-transparent lg:ring-0"
                }`}
              >
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${done ? "bg-emerald-500 text-white" : i === cur ? "bg-on-accent/25 text-on-accent" : "bg-stone-200 text-stone-600"}`}>
                  {done ? <Check /> : s.n}
                </span>
                <span className="truncate">{s.title}</span>
              </button>
            );
          })}
        </nav>
        <p className="mt-3 hidden text-xs text-stone-400 lg:block">
          <kbd className="rounded border border-line-strong bg-surface px-1">Alt</kbd> + <kbd className="rounded border border-line-strong bg-surface px-1">↑</kbd>/<kbd className="rounded border border-line-strong bg-surface px-1">↓</kbd> moves between sections
        </p>
      </aside>

      <div>
        <div className="mb-3 hidden justify-end gap-3 text-xs lg:flex">
          <button type="button" className="text-brand-700 hover:underline" onClick={() => setOpen(new Set(all.map((s) => s.id)))}>Expand all</button>
          <button type="button" className="text-stone-500 hover:underline" onClick={() => setOpen(new Set())}>Collapse all</button>
        </div>
        <div className="space-y-3">
          {all.map((s, i) => {
            const sec = secs.find((x) => x.id === s.id);
            const isOpen = open.has(s.id);
            const showMore = more.has(s.id);
            const core = sec?.fields.filter((f) => !f.opt) ?? [];
            const opt = sec?.fields.filter((f) => f.opt) ?? [];
            const n = count(i);
            return (
              <section
                key={s.id} id={`sec-${s.id}`} style={{ "--i": Math.min(i, 8) } as React.CSSProperties}
                className={`rise scroll-mt-28 rounded-2xl border bg-surface/90  transition-colors lg:scroll-mt-4 ${i === cur ? "border-brand-300" : "border-line"} ${i === cur ? "" : "hidden lg:block"}`}
              >
                <button type="button" className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-left ${ring}`} aria-expanded={isOpen} onClick={() => { setCur(i); setOpen(toggle(open, s.id)); }}>
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-800">{s.n}</span>
                    <span className="truncate font-semibold text-stone-900">{s.title}</span>
                    {n > 0 && <span className="pop shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">{n} filled</span>}
                  </span>
                  <svg viewBox="0 0 20 20" className={`h-5 w-5 shrink-0 text-stone-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m5 8 5 5 5-5" /></svg>
                </button>
                <Accordion open={isOpen}>
                  <div className="border-t border-stone-100 px-4 pb-4 pt-4">
                    {sec ? (
                      <>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">{core.map(renderField)}</div>
                        {opt.length > 0 && (
                          <>
                            <button type="button" aria-expanded={showMore} className={`press mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800 hover:bg-brand-100 ${ring}`} onClick={() => setMore(toggle(more, s.id))}>
                              <span className={`inline-block transition-transform ${showMore ? "rotate-45" : ""}`}>+</span>
                              {showMore ? "Hide" : "Show"} {opt.length} optional field{opt.length > 1 ? "s" : ""}
                            </button>
                            <Accordion open={showMore}>
                              <div className="grid gap-x-4 gap-y-4 pt-4 sm:grid-cols-2">{opt.map(renderField)}</div>
                            </Accordion>
                          </>
                        )}
                      </>
                    ) : extra.node}
                    <div className="mt-5 flex justify-between lg:hidden">
                      <button type="button" className={btnGhost} disabled={i === 0} onClick={() => go(i - 1)}>← Back</button>
                      <button type="button" className={btnGhost} disabled={i === all.length - 1} onClick={() => go(i + 1)}>Next →</button>
                    </div>
                  </div>
                </Accordion>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
