"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";
import { useDemo } from "@/components/demo-provider";
import { LesionImage } from "@/components/lesion-image";
import { TrendChart } from "@/components/trend-chart";
import { Accordion } from "@/components/controls";
import { Card, btn, btnGhost } from "@/components/ui";
import { Avatar, Compare, CountUp, Sparkline } from "@/components/viz";
import { fmtDate, type Patient, type Visit } from "@/lib/mock";

const responseTone: Record<string, string> = {
  Improved: "bg-emerald-100 text-emerald-800",
  Mixed: "bg-amber-100 text-amber-800",
  Worsened: "bg-rose-100 text-rose-800",
  Unchanged: "bg-stone-100 text-stone-700",
  Unclear: "bg-stone-100 text-stone-700",
};
const dot: Record<string, string> = { Improved: "bg-emerald-500", Mixed: "bg-amber-500", Worsened: "bg-rose-500" };

export default function PatientPage(props: PageProps<"/patients/[id]">) {
  const { id } = use(props.params);
  const { patients } = useDemo();
  const p = patients.find((x) => x.id === id);
  if (!p) notFound();
  return <PatientView p={p} />;
}

function Stat({ label, value, unit, delta, note, goodDown, series, color, i }: {
  label: string; value: number; unit?: string; delta?: number; note?: string; goodDown?: boolean; series: number[]; color: string; i: number;
}) {
  const good = delta !== undefined && delta !== 0 && (delta < 0) === !!goodDown;
  return (
    <div className="rise lift rounded-2xl border border-line bg-surface/90 p-4" style={{ "--i": i } as React.CSSProperties}>
      <p className="text-xs font-semibold text-stone-500">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="text-3xl font-semibold tracking-tight"><CountUp to={value} />{unit && <span className="ml-1 text-sm font-normal text-stone-500">{unit}</span>}</p>
        <Sparkline values={series} color={color} />
      </div>
      {note && <p className="mt-1 text-xs text-stone-500">{note}</p>}
      {delta !== undefined && (
        <p className={`mt-1 text-xs font-medium ${delta === 0 ? "text-stone-500" : good ? "text-emerald-700" : "text-rose-700"}`}>
          {delta === 0 ? "No change since first visit" : `${delta < 0 ? "▼" : "▲"} ${Math.abs(delta)}${unit ? ` ${unit}` : ""} since first visit`}
        </p>
      )}
    </div>
  );
}

function VisitItem({ v, latest }: { v: Visit; latest: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="relative pb-6 pl-8 last:pb-0">
      <span className={`absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-surface ring-2 ring-stone-200 ${(v.response && dot[v.response]) || "bg-brand-600"} ${latest ? "live-dot" : ""}`} />
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="group w-full rounded-xl text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-semibold">{fmtDate(v.date)}</span>
          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">{v.type}</span>
          {v.status === "draft" && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">Draft</span>}
          {v.decision && <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-800">{v.decision}</span>}
          {v.response && <span className={`rounded-full px-2 py-0.5 text-xs ${responseTone[v.response] ?? "bg-stone-100"}`}>{v.response}</span>}
        </div>
        <p className="mt-1 text-sm">
          {v.rx ? <><strong>{v.rx.remedy} {v.rx.potency}</strong> · {v.rx.dose}, {v.rx.repetition.toLowerCase()}</> : <span className="text-stone-500">No prescription recorded</span>}
        </p>
        <p className="text-xs text-stone-500">
          {v.site} · {v.sizeMm} mm · pain {v.pain}/10 · grade {v.grade} · QoL {v.qol}{" "}
          <span className="font-medium text-brand-700 group-hover:underline">{open ? "Hide details" : "Details"}</span>
        </p>
      </button>
      <Accordion open={open}>
        <div className="space-y-2 pt-3 text-sm">
          <p><strong>Complaint:</strong> {v.complaint}</p>
          <p><strong>Findings:</strong> {v.findings}</p>
          {v.notes && <p><strong>Notes:</strong> {v.notes}</p>}
          {v.detail?.map((d) => (
            <div key={d.title} className="rounded-xl bg-stone-50 p-3">
              <p className="text-xs font-semibold text-stone-500">{d.title}</p>
              <ul className="mt-1 space-y-0.5 text-stone-700">{d.items.map((it) => <li key={it}>{it}</li>)}</ul>
            </div>
          ))}
        </div>
      </Accordion>
    </li>
  );
}

function PatientView({ p }: { p: Patient }) {
  const chart = p.visits.map((v) => ({
    date: new Date(v.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    size: v.sizeMm,
    pain: v.pain,
  }));
  const first = p.visits[0];
  const last = p.visits[p.visits.length - 1];
  const newestFirst = [...p.visits].reverse();
  const days = Math.round((+new Date(last.date) - +new Date(first.date)) / 864e5);
  const consent = [
    ["Case storage", p.consentStorage],
    ["Photos", p.consentPhoto],
    ["Research", p.consentResearch],
  ] as const;

  return (
    <>
      <div className="rise relative mb-6 overflow-hidden rounded-2xl border border-line bg-surface p-5 md:p-6">        <div className="relative flex flex-wrap items-center gap-4">
          <Avatar name={p.name} size={64} />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs text-stone-500">{p.code}</p>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{p.name}</h1>
            <p className="mt-0.5 text-sm text-stone-600">{p.age} years · {p.sex === "F" ? "Female" : "Male"} · {p.phone} · {p.address}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {consent.map(([k, ok]) => (
                <span key={k} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ok ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>{ok ? "✓" : "✕"} {k}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button className={btnGhost} onClick={() => alert("In the real app this opens the edit form.")}>Edit</button>
            <Link className={btn} href={`/patients/${p.id}/visit/new`}>+ Add visit</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat i={1} label="Lesion size" value={last.sizeMm} unit="mm" delta={last.sizeMm - first.sizeMm} goodDown series={p.visits.map((v) => v.sizeMm)} color="#5f7a58" />
        <Stat i={2} label="Pain" value={last.pain} unit="/10" delta={last.pain - first.pain} goodDown series={p.visits.map((v) => v.pain)} color="#be123c" />
        <Stat i={3} label="Quality of life" value={last.qol} delta={last.qol - first.qol} series={p.visits.map((v) => v.qol)} color="#a76720" />
        <Stat i={4} label="Visits" value={p.visits.length} note={days ? `over ${days} days` : "first visit"} series={p.visits.map((_, i) => i + 1)} color="#c8903a" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Lesion size (mm)"><TrendChart data={chart} dataKey="size" unit="" color="#5f7a58" /></Card>
        <Card title="Pain (0–10)"><TrendChart data={chart} dataKey="pain" unit="" domain={[0, 10]} color="#be123c" /></Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <Card title="Then and now" className="lg:col-span-2">
          {p.visits.length > 1 ? (
            <>
              <Compare a={{ label: "First", sizeMm: first.sizeMm, seed: p.age }} b={{ label: "Latest", sizeMm: last.sizeMm, seed: p.visits.length - 1 + p.age }} />
              <p className="mt-2 text-xs text-stone-500">Drag to compare the first and latest photo. Illustrations in this demo.</p>
            </>
          ) : <p className="py-10 text-center text-sm text-stone-500">Comparison appears after the second visit.</p>}
        </Card>
        <Card title="Photos over time" className="lg:col-span-3">
          <div className="no-bar flex snap-x gap-3 overflow-x-auto pb-1">
            {p.visits.map((v, i) => (
              <figure key={v.id} className="lift w-32 shrink-0 snap-start">
                <LesionImage sizeMm={v.sizeMm} seed={i + p.age} className="h-32 w-32 rounded-xl border border-line" />
                <figcaption className="mt-1.5 text-xs text-stone-600"><span className="font-medium text-stone-800">{fmtDate(v.date)}</span><br />{v.sizeMm} mm</figcaption>
              </figure>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card title="Visit timeline" className="lg:col-span-2">
          <ol className="relative before:absolute before:bottom-2 before:left-[7px] before:top-3 before:w-0.5 before:bg-stone-200">
            {newestFirst.map((v, i) => <VisitItem key={v.id} v={v} latest={i === 0} />)}
          </ol>
        </Card>

        <div className="space-y-4">
          <Card title="Change log">
            <ul className="space-y-2 text-xs text-stone-600">
              <li>Dr. (sample) edited a visit — pain 5 → 4</li>
              <li>Trainee (sample) added a visit</li>
              <li>Dr. (sample) created the patient</li>
            </ul>
          </Card>
          <Link href="/match" className={`${btnGhost} w-full`}>✦ Suggest remedies (preview)</Link>
        </div>
      </div>
    </>
  );
}
