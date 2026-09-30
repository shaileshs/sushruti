"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDemo } from "@/components/demo-provider";
import { btn } from "@/components/ui";
import { Avatar, Sparkline } from "@/components/viz";
import { fmtDate, lastVisit, type Patient } from "@/lib/mock";

type Filter = "all" | "improving" | "attention";

// Improving: lesion smaller than at the visit before. Attention: lesion larger, pain 6 or more, or a draft is open.
const status = (p: Patient): Filter | "steady" => {
  const l = p.visits[p.visits.length - 1];
  const b = p.visits[p.visits.length - 2];
  if (l.pain >= 6 || (b && l.sizeMm > b.sizeMm) || p.visits.some((v) => v.status === "draft")) return "attention";
  return b && l.sizeMm < b.sizeMm ? "improving" : "steady";
};

export default function PatientList() {
  const { patients } = useDemo();
  const [q, setQ] = useState("");
  const [f, setF] = useState<Filter>("all");
  const box = useRef<HTMLInputElement>(null);

  // "/" jumps to search, as in most modern apps.
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") { e.preventDefault(); box.current?.focus(); }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);

  const term = q.trim().toLowerCase();
  const rows = patients
    .filter((p) => !term || [p.name, p.phone, p.code].some((x) => x.toLowerCase().includes(term)))
    .filter((p) => f === "all" || status(p) === f)
    .sort((a, b) => +new Date(lastVisit(b).date) - +new Date(lastVisit(a).date));
  const n = (k: Filter) => patients.filter((p) => k === "all" || status(p) === k).length;
  const tabs: [Filter, string][] = [["all", "All"], ["improving", "Improving"], ["attention", "Needs attention"]];

  return (
    <>
      <div className="rise dash-b mb-8 flex flex-wrap items-end justify-between gap-3 pb-6">
        <div>
          <h1 className="flex items-baseline gap-3 text-2xl font-semibold md:text-[28px]"><span className="font-mono text-xs font-normal tracking-normal text-stone-400">01</span>Patients</h1>
          <p className="mt-2 text-sm text-stone-500">Sorted by last visit. Search by name, phone, or code.</p>
        </div>
        <button className={btn} onClick={() => alert("In the real app this opens the new patient form.")}>+ New patient</button>
      </div>

      <div className="rise mb-4 flex flex-wrap items-center gap-3" style={{ "--i": 1 } as React.CSSProperties}>
        <div className="relative w-full max-w-md">
          <svg viewBox="0 0 20 20" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><circle cx="9" cy="9" r="6" /><path d="m14 14 4 4" /></svg>
          <input
            ref={box} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, or P-0001…" aria-label="Search patients"
            className="w-full rounded-xl border border-line-strong bg-surface py-2.5 pl-9 pr-16 text-sm transition placeholder:text-stone-400 hover:border-stone-400 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
          />
          {q ? (
            <button aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700" onClick={() => setQ("")}>×</button>
          ) : (
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-line-strong bg-stone-50 px-1.5 text-xs text-stone-400">/</kbd>
          )}
        </div>
        <div className="flex flex-wrap gap-0.5 rounded-full bg-stone-100 p-0.5 ring-1 ring-line" role="tablist" aria-label="Filter patients">
          {tabs.map(([k, l]) => (
            <button
              key={k} role="tab" aria-selected={f === k} onClick={() => setF(k)}
              className={`press rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${f === k ? "bg-surface text-stone-900 ring-1 ring-line-strong" : "text-stone-500 hover:text-stone-900"}`}
            >
              {l} <span className={`tnum ml-1 text-xs text-stone-400`}>{n(k)}</span>
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-2">
        {rows.map((p, i) => {
          const l = lastVisit(p);
          const s = status(p);
          return (
            <li key={p.id} className="rise" style={{ "--i": Math.min(i + 2, 10) } as React.CSSProperties}>
              <Link href={`/patients/${p.id}`} className="lift group flex items-center gap-4 rounded-2xl border border-line bg-surface/90 p-3.5 focus-visible:outline-2 focus-visible:outline-accent sm:p-4">
                <Avatar name={p.name} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="font-semibold text-stone-900 group-hover:text-brand-800">{p.name}</span>
                    <span className="font-mono text-xs text-stone-400">{p.code}</span>
                    {s === "improving" && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">Improving</span>}
                    {s === "attention" && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">Needs attention</span>}
                  </div>
                  <p className="truncate text-sm text-stone-500">{p.age} / {p.sex} · {l.site}</p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="tnum text-sm font-medium text-stone-800">{l.sizeMm} mm</p>
                  <p className="text-xs text-stone-400">pain {l.pain}/10</p>
                </div>
                <div className="hidden md:block"><Sparkline values={p.visits.map((v) => v.sizeMm)} color={s === "attention" ? "#d97706" : "#5f7a58"} /></div>
                <div className="text-right text-xs text-stone-500">
                  <p className="text-stone-700">{fmtDate(l.date)}</p>
                  <p>{p.visits.length} visit{p.visits.length > 1 ? "s" : ""}</p>
                </div>
                <span className="text-stone-300 transition-transform group-hover:translate-x-1 group-hover:text-brand-600" aria-hidden>›</span>
              </Link>
            </li>
          );
        })}
        {rows.length === 0 && (
          <li className="rise rounded-2xl border border-dashed border-line-strong bg-surface/60 px-4 py-12 text-center text-stone-500">
            <p>No patient matches{q && <> “{q}”</>}{f !== "all" && " in this filter"}.</p>
            <button className="mt-2 text-sm font-medium text-brand-700 hover:underline" onClick={() => { setQ(""); setF("all"); }}>Clear search and filter</button>
          </li>
        )}
      </ul>
    </>
  );
}
