"use client";

import { useState } from "react";
import { Accordion } from "@/components/controls";
import { useDemo } from "@/components/demo-provider";
import { Card, PageHeader, PreviewNote, input } from "@/components/ui";
import { Avatar } from "@/components/viz";
import { lastVisit, matchRows } from "@/lib/mock";

const seg = ["bg-brand-700", "bg-brand-400", "bg-gold-400", "bg-gold-600"];

export default function Match() {
  const { patients } = useDemo();
  const [pid, setPid] = useState(patients[0].id);
  const [open, setOpen] = useState(0);
  const p = patients.find((x) => x.id === pid) ?? patients[0];
  const lv = lastVisit(p);

  return (
    <>
      <PageHeader title="Remedy match" sub="A ranked list to support your judgment. Each score is a sum of points you can inspect." />
      <PreviewNote>Scores are invented for this demo. What counts as a “match”, and how many points each input earns, is for the doctor to define.</PreviewNote>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Case" className="lg:col-span-1">
          <div className="mb-4 flex items-center gap-3">
            <Avatar name={p.name} size={40} />
            <select className={input} aria-label="Choose a patient" value={pid} onChange={(e) => { setPid(e.target.value); setOpen(0); }}>
              {patients.map((x) => <option key={x.id} value={x.id}>{x.code} · {x.name}</option>)}
            </select>
          </div>
          <dl key={p.id} className="rise space-y-3 text-sm">
            {[["Site", lv.site], ["Size / pain", `${lv.sizeMm} mm · ${lv.pain}/10`], ["Complaint", lv.complaint], ["Findings", lv.findings]].map(([k, val]) => (
              <div key={k}><dt className="text-xs font-semibold text-stone-500">{k}</dt><dd className="mt-0.5">{val}</dd></div>
            ))}
          </dl>
        </Card>

        <Card title="Ranked remedies" className="lg:col-span-2">
          <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
            {matchRows[0].inputs.map((inp, i) => <span key={inp.label} className="flex items-center gap-1.5"><span className={`h-2.5 w-2.5 rounded-sm ${seg[i]}`} />{inp.label}</span>)}
          </div>
          <ol className="space-y-2">
            {matchRows.map((m, i) => (
              <li key={m.remedy} className={`rise rounded-xl border transition-colors ${open === i ? "border-brand-300 bg-brand-50/40" : "border-line bg-surface"}`} style={{ "--i": i } as React.CSSProperties}>
                <button className="flex w-full items-center gap-3 p-3 text-left" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${i === 0 ? "bg-gradient-to-br from-amber-400 to-amber-600" : "bg-stone-400"}`}>{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{m.remedy}</span>
                    <span className="mt-1.5 flex h-2 overflow-hidden rounded-full bg-stone-100">
                      {m.inputs.map((inp, k) => <span key={inp.label} className={`grow h-full ${seg[k]}`} style={{ width: `${(inp.points / m.max) * 100}%`, "--i": i } as React.CSSProperties} />)}
                    </span>
                  </span>
                  <span className="tnum text-sm text-stone-600"><strong className="text-stone-900">{m.total}</strong> / {m.max}</span>
                </button>
                <Accordion open={open === i}>
                  <ul className="space-y-3 border-t border-stone-100 p-3">
                    {m.inputs.map((inp, k) => (
                      <li key={inp.label} className="text-sm">
                        <div className="flex justify-between"><span className="font-medium">{inp.label}</span><span className="tnum">{inp.points} / {inp.max}</span></div>
                        <div className="mt-1 h-2 rounded-full bg-stone-100"><div className={`h-2 rounded-full ${seg[k]}`} style={{ width: `${(inp.points / inp.max) * 100}%` }} /></div>
                        <p className="mt-1 text-xs text-stone-500">{inp.why}</p>
                      </li>
                    ))}
                  </ul>
                </Accordion>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-stone-500">Decision support only. The prescription is the doctor’s decision. This score is not a chance of cure.</p>
        </Card>
      </div>
    </>
  );
}
