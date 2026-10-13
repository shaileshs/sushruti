"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDemo } from "@/components/demo-provider";
import { MatchList } from "@/components/match-list";
import { Card, PageHeader, PreviewNote, btn, input } from "@/components/ui";
import { Avatar } from "@/components/viz";
import { lastVisit, matchRows, type MatchRow } from "@/lib/mock";

export default function Match() {
  const { patients } = useDemo();
  const router = useRouter();
  const [pid, setPid] = useState(patients[0].id);
  const [picked, setPicked] = useState<string[]>([]);
  const p = patients.find((x) => x.id === pid) ?? patients[0];
  const lv = lastVisit(p);
  const toggle = (m: MatchRow) => setPicked((s) => (s.includes(m.remedy) ? s.filter((x) => x !== m.remedy) : [...s, m.remedy]));

  // Hand the shortlist to the visit form through its draft, so the doctor continues where she left off.
  const startVisit = () => {
    const cand = matchRows.filter((m) => picked.includes(m.remedy)).map((m) => ({ remedy: m.remedy, differentiating_features: `Match score ${m.total}/${m.max}` }));
    try { sessionStorage.setItem(`invicta-draft-${p.id}`, JSON.stringify({ v: { site: lv.site, stage: lv.grade, cand }, st: {}, photos: [] })); } catch { /* the form still opens, without the shortlist */ }
    router.push(`/patients/${p.id}/visit/new`);
  };

  return (
    <>
      <PageHeader title="Remedy match" sub="A ranked list to support your judgment. Each score is a sum of points you can inspect. Tick the remedies you want on your shortlist." />
      <PreviewNote>Scores are invented for this demo. What counts as a “match”, and how many points each input earns, is for the doctor to define.</PreviewNote>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Case" className="lg:col-span-1">
          <div className="mb-4 flex items-center gap-3">
            <Avatar name={p.name} size={40} />
            <select className={input} aria-label="Choose a patient" value={pid} onChange={(e) => { setPid(e.target.value); setPicked([]); }}>
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
          <MatchList selected={picked} onToggle={toggle} />
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-stone-100 pt-4">
            <button className={btn} disabled={picked.length === 0} onClick={startVisit}>Start a visit with {picked.length || "the"} shortlisted</button>
            <span className="text-xs text-stone-500">{picked.length === 0 ? "Tick at least one remedy." : "They are added to “Remedy candidates” in the visit form."}</span>
          </div>
        </Card>
      </div>
    </>
  );
}
