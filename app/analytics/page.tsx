"use client";

import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, PageHeader, PreviewNote } from "@/components/ui";
import { CountUp } from "@/components/viz";
import { useState } from "react";
import { useDemo } from "@/components/demo-provider";
import { indicationsFor, monthlyVisits, outcomeCategories, outcomeTrend, prescriptionMix, type CancerType, type Patient } from "@/lib/mock";

const grid = <CartesianGrid vertical={false} stroke="var(--color-line)" strokeDasharray="3 4" />;
const axis = { tick: { fontSize: 11, fill: "var(--color-stone-500)" }, axisLine: false, tickLine: false } as const;
const shades = ["#5f7a58", "#4c6649", "#5f7a58", "#788969", "#a4b89e", "#c8d5c2"];

// One tooltip style for every chart on this page.
const tip = (unit = "") => (
  <Tooltip
    cursor={{ fill: "rgb(15 118 110 / 0.06)" }}
    content={(p) =>
      p.active && p.payload?.length ? (
        <div className="rounded-xl border border-line bg-surface px-3 py-2 text-xs shadow-lg">
          <div className="mb-0.5 text-stone-500">{p.label ?? p.payload[0].payload.remedy}</div>
          {p.payload.map((x) => (
            <div key={String(x.dataKey)} className="tnum font-semibold" style={{ color: x.color ?? x.payload?.fill }}>{x.name === "count" || x.name === "visits" ? "" : `${x.name}: `}{x.value}{unit}</div>
          ))}
        </div>
      ) : null
    }
  />
);

const kpis = [
  { label: "Prescriptions", value: prescriptionMix.reduce((a, b) => a + b.count, 0), note: "all time" },
  { label: "Visits this month", value: monthlyVisits[monthlyVisits.length - 1].visits, note: "September" },
  { label: "Median size change", value: 24, unit: "%", note: "smaller at month 5" },
];

const cancers: ("All" | CancerType)[] = ["All", "Oral", "Esophageal", "Breast"];
const day = (iso: string) => +new Date(iso) / 864e5;

// One row per remedy: how long it was given, what happened to the lesion, and what supported it.
function remedyRows(ps: Patient[]) {
  const by = new Map<string, { patients: Set<string>; days: number[]; change: number[]; improved: number; n: number }>();
  for (const p of ps) {
    const seen = new Set<string>();
    for (const v of p.visits) {
      if (!v.rx) continue;
      const r = by.get(v.rx.remedy) ?? { patients: new Set(), days: [], change: [], improved: 0, n: 0 };
      r.n += 1;
      if (v.response === "Improved") r.improved += 1;
      r.patients.add(p.id);
      by.set(v.rx.remedy, r);
      if (seen.has(v.rx.remedy)) continue;
      seen.add(v.rx.remedy);
      const mine = p.visits.filter((x) => x.rx?.remedy === v.rx!.remedy);
      const last = mine[mine.length - 1];
      r.days.push(day(last.date) - day(v.date));
      r.change.push(((last.sizeMm - v.sizeMm) / v.sizeMm) * 100);
    }
  }
  const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  return [...by.entries()]
    .map(([remedy, r]) => ({ remedy, patients: r.patients.size, days: Math.round(avg(r.days)), change: Math.round(avg(r.change)), improved: r.improved, n: r.n }))
    .sort((a, b) => b.patients - a.patients);
}

function ByCancer() {
  const { patients } = useDemo();
  const [site, setSite] = useState<(typeof cancers)[number]>("All");
  const ps = patients.filter((p) => site === "All" || p.cancer === site);
  const outcome = (p: Patient) => p.visits[p.visits.length - 1].outcome;
  const rows = remedyRows(ps);
  const bars = outcomeCategories.map((c) => ({ name: c, count: ps.filter((p) => outcome(p) === c).length }));
  const none = ps.filter((p) => !outcome(p)).length;
  return (
    <div className="mb-6">
      <div className="mb-3 flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Cancer type">
        {cancers.map((c) => (
          <button key={c} role="radio" aria-checked={site === c} onClick={() => setSite(c)} className={`press rounded-full px-4 py-2 text-sm font-medium transition-colors ${site === c ? "bg-stone-900 text-page" : "bg-surface text-stone-700 ring-1 ring-stone-200 hover:bg-stone-100"}`}>
            {c === "All" ? "All cancers" : c}{c !== "All" && <span className="tnum ml-1.5 text-xs opacity-70">{patients.filter((p) => p.cancer === c).length}</span>}
          </button>
        ))}
        <span className="ml-auto text-sm text-stone-600"><strong className="tnum text-stone-900">{ps.length}</strong> patients · <strong className="tnum text-stone-900">{ps.reduce((a, p) => a + p.visits.length, 0)}</strong> visits</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <Card title="Patients by outcome category" className="lg:col-span-2">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bars} layout="vertical" margin={{ left: 24, right: 12 }}>
                <CartesianGrid horizontal={false} stroke="var(--color-line)" strokeDasharray="3 4" />
                <XAxis type="number" allowDecimals={false} {...axis} />
                <YAxis type="category" dataKey="name" width={110} {...axis} />
                {tip(" patients")}
                <Bar dataKey="count" fill="#5f7a58" radius={[0, 8, 8, 0]} animationDuration={700} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-1 text-xs text-stone-500">{none > 0 ? `${none} patient${none > 1 ? "s" : ""} without an outcome yet. ` : ""}Categories are samples, to be confirmed with the doctor.</p>
        </Card>
        <Card title="Remedies: duration, effect, and supporting indications" className="lg:col-span-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-stone-500"><tr>{["Remedy", "Patients", "Days given", "Lesion size", "Improved", "Supporting indications"].map((h) => <th key={h} className="whitespace-nowrap py-2 pr-3 font-medium">{h}</th>)}</tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.remedy} className="border-t border-stone-100 align-top">
                    <td className="py-2 pr-3 font-medium text-stone-900">{r.remedy}</td>
                    <td className="tnum py-2 pr-3">{r.patients}</td>
                    <td className="tnum py-2 pr-3">{r.days}</td>
                    <td className={`tnum py-2 pr-3 ${r.change < 0 ? "text-emerald-700" : "text-rose-700"}`}>{r.change > 0 ? "+" : ""}{r.change}%</td>
                    <td className="tnum py-2 pr-3">{r.improved} of {r.n}</td>
                    <td className="py-2 text-stone-600">{indicationsFor[r.remedy] ?? "Not recorded"}</td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-stone-500">No prescriptions for this cancer type yet.</td></tr>}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-stone-500">Days given and size change are averages per patient. Small numbers: read as description, not proof.</p>
        </Card>
      </div>
    </div>
  );
}

export default function Analytics() {
  return (
    <>
      <PageHeader title="Research analytics" sub="Live view of prescriptions and outcomes across your cases." />
      <PreviewNote>Numbers are invented. Real curves need real follow-up data, so early charts will be sparse.</PreviewNote>

      <ByCancer />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {kpis.map((k, i) => (
          <div key={k.label} className="rise lift rounded-2xl border border-line bg-surface/90 p-4" style={{ "--i": i } as React.CSSProperties}>
            <p className="text-xs font-semibold text-stone-500">{k.label}</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight"><CountUp to={k.value} />{k.unit}</p>
            <p className="text-xs text-stone-500">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Prescriptions by remedy">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prescriptionMix} layout="vertical" margin={{ left: 24, right: 12 }}>
                <CartesianGrid horizontal={false} stroke="var(--color-line)" strokeDasharray="3 4" />
                <XAxis type="number" {...axis} />
                <YAxis type="category" dataKey="remedy" width={110} {...axis} />
                {tip()}
                <Bar dataKey="count" radius={[0, 8, 8, 0]} animationDuration={900}>
                  {prescriptionMix.map((_, i) => <Cell key={i} fill={shades[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Visits per month">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyVisits} margin={{ right: 12, left: -14 }}>
                {grid}
                <XAxis dataKey="month" {...axis} />
                <YAxis {...axis} />
                {tip()}
                <Bar dataKey="visits" fill="#c8903a" radius={[8, 8, 0, 0]} animationDuration={900} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Change in lesion size by remedy (%)" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={outcomeTrend} margin={{ right: 12, left: -10 }}>
                {grid}
                <XAxis dataKey="month" {...axis} />
                <YAxis {...axis} unit="%" />
                {tip("%")}
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="arsenicum" name="Arsenicum album" stroke="#5f7a58" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} animationDuration={1000} />
                <Line type="monotone" dataKey="phosphorus" name="Phosphorus" stroke="#c8903a" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} animationDuration={1000} />
                <Line type="monotone" dataKey="nitricum" name="Nitricum acidum" stroke="#b4553a" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} animationDuration={1000} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-stone-500">Curves show association in a small, uncontrolled group. They do not show that a remedy caused the change.</p>
        </Card>
      </div>
    </>
  );
}
