"use client";

import { useState } from "react";
import { useDemo } from "@/components/demo-provider";
import { Card, PageHeader, PreviewNote, input } from "@/components/ui";
import { lastVisit, matchRows } from "@/lib/mock";

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
          <select className={input} value={pid} onChange={(e) => { setPid(e.target.value); setOpen(0); }}>
            {patients.map((x) => <option key={x.id} value={x.id}>{x.code} · {x.name}</option>)}
          </select>
          <dl className="mt-4 space-y-2 text-sm">
            <div><dt className="text-xs uppercase text-slate-500">Site</dt><dd>{lv.site}</dd></div>
            <div><dt className="text-xs uppercase text-slate-500">Size / pain</dt><dd>{lv.sizeMm} mm · {lv.pain}/10</dd></div>
            <div><dt className="text-xs uppercase text-slate-500">Complaint</dt><dd>{lv.complaint}</dd></div>
            <div><dt className="text-xs uppercase text-slate-500">Findings</dt><dd>{lv.findings}</dd></div>
          </dl>
        </Card>

        <Card title="Ranked remedies" className="lg:col-span-2">
          <ol className="space-y-2">
            {matchRows.map((m, i) => (
              <li key={m.remedy} className="rounded-lg border border-slate-200">
                <button className="flex w-full items-center gap-3 p-3 text-left" onClick={() => setOpen(open === i ? -1 : i)}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-700 text-sm font-semibold text-white">{i + 1}</span>
                  <span className="flex-1 font-medium">{m.remedy}</span>
                  <span className="text-sm text-slate-600">{m.total} / {m.max} points</span>
                </button>
                {open === i && (
                  <ul className="space-y-2 border-t border-slate-100 p-3">
                    {m.inputs.map((inp) => (
                      <li key={inp.label} className="text-sm">
                        <div className="flex justify-between"><span className="font-medium">{inp.label}</span><span>{inp.points} / {inp.max}</span></div>
                        <div className="mt-1 h-2 rounded bg-slate-100"><div className="h-2 rounded bg-teal-600" style={{ width: `${(inp.points / inp.max) * 100}%` }} /></div>
                        <p className="mt-1 text-xs text-slate-500">{inp.why}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-slate-500">Decision support only. The prescription is the doctor’s decision. This score is not a chance of cure.</p>
        </Card>
      </div>
    </>
  );
}
