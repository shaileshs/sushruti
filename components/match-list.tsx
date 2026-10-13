"use client";

import { useState } from "react";
import { Accordion } from "@/components/controls";
import { matchRows, type MatchRow } from "@/lib/mock";

const seg = ["bg-brand-700", "bg-brand-400", "bg-gold-400", "bg-gold-600"];

// A shortlist, not one answer: the doctor ticks the remedies she wants to keep and decides among them.
export function MatchList({ selected, onToggle, onCompare }: { selected: string[]; onToggle: (m: MatchRow) => void; onCompare?: (remedy: string) => void }) {
  const [open, setOpen] = useState(0);
  return (
    <>
      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
        {matchRows[0].inputs.map((inp, i) => <span key={inp.label} className="flex items-center gap-1.5"><span className={`h-2.5 w-2.5 rounded-sm ${seg[i]}`} />{inp.label}</span>)}
      </div>
      <ol className="space-y-2">
        {matchRows.map((m, i) => {
          const on = selected.includes(m.remedy);
          return (
            <li key={m.remedy} className={`rise rounded-xl border transition-colors ${on ? "border-emerald-400 bg-emerald-50/50" : open === i ? "border-brand-300 bg-brand-50/40" : "border-line bg-surface"}`} style={{ "--i": i } as React.CSSProperties}>
              <div className="flex items-center gap-2 p-3">
                <label className="flex shrink-0 cursor-pointer items-center" title="Add to shortlist">
                  <input type="checkbox" className="h-4 w-4 accent-emerald-600" checked={on} onChange={() => onToggle(m)} aria-label={`Shortlist ${m.remedy}`} />
                </label>
                <button className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-400 text-sm font-semibold text-white">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{m.remedy}</span>
                    <span className="mt-1.5 flex h-2 overflow-hidden rounded-full bg-stone-100">
                      {m.inputs.map((inp, k) => <span key={inp.label} className={`grow h-full ${seg[k]}`} style={{ width: `${(inp.points / m.max) * 100}%` }} />)}
                    </span>
                  </span>
                  <span className="tnum text-sm text-stone-600"><strong className="text-stone-900">{m.total}</strong> / {m.max}</span>
                </button>
              </div>
              <Accordion open={open === i}>
                <ul className="space-y-3 border-t border-stone-100 p-3">
                  {m.inputs.map((inp, k) => (
                    <li key={inp.label} className="text-sm">
                      <div className="flex justify-between"><span className="font-medium">{inp.label}</span><span className="tnum">{inp.points} / {inp.max}</span></div>
                      <div className="mt-1 h-2 rounded-full bg-stone-100"><div className={`h-2 rounded-full ${seg[k]}`} style={{ width: `${(inp.points / inp.max) * 100}%` }} /></div>
                      <p className="mt-1 text-xs text-stone-500">{inp.why}</p>
                    </li>
                  ))}
                  {onCompare && <li><button type="button" className="press text-sm font-medium text-brand-700 hover:underline" onClick={() => onCompare(m.remedy)}>Compare in remedy library →</button></li>}
                </ul>
              </Accordion>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-xs text-stone-500">Decision support only. The prescription is the doctor’s decision. This score is not a chance of cure.</p>
    </>
  );
}
