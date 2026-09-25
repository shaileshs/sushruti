"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { useDemo } from "@/components/demo-provider";
import { LesionImage } from "@/components/lesion-image";
import { TrendChart } from "@/components/trend-chart";
import { Card, PageHeader, btn, btnGhost } from "@/components/ui";
import { fmtDate } from "@/lib/mock";

export default function PatientPage(props: PageProps<"/patients/[id]">) {
  const { id } = use(props.params);
  const { patients } = useDemo();
  const p = patients.find((x) => x.id === id);
  if (!p) notFound();

  const chart = p.visits.map((v) => ({
    date: new Date(v.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    size: v.sizeMm,
    pain: v.pain,
  }));
  const newestFirst = [...p.visits].reverse();

  return (
    <>
      <PageHeader
        title={p.name}
        sub={`${p.code} · ${p.age} years · ${p.sex === "F" ? "Female" : "Male"} · ${p.phone} · ${p.address}`}
        action={
          <div className="flex gap-2">
            <button className={btnGhost} onClick={() => alert("In the real app this opens the edit form.")}>Edit</button>
            <Link className={btn} href={`/patients/${p.id}/visit/new`}>Add visit</Link>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Lesion size (mm)">
          <TrendChart data={chart} dataKey="size" unit="" color="#0f766e" />
        </Card>
        <Card title="Pain (0–10)">
          <TrendChart data={chart} dataKey="pain" unit="" domain={[0, 10]} color="#be123c" />
        </Card>
      </div>

      <Card title="Photos over time" className="mt-4">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {p.visits.map((v, i) => (
            <figure key={v.id} className="w-28 shrink-0">
              <LesionImage sizeMm={v.sizeMm} seed={i + p.age} className="h-28 w-28 rounded-lg border border-slate-200" />
              <figcaption className="mt-1 text-xs text-slate-600">{fmtDate(v.date)}<br />{v.sizeMm} mm</figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">Illustrations. The real app shows the clinic photos here.</p>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card title="Visits" className="lg:col-span-2">
          <ol className="space-y-4">
            {newestFirst.map((v) => (
              <li key={v.id} className="border-l-4 border-teal-600 pl-3">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-semibold">{fmtDate(v.date)}</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{v.type}</span>
                  {v.status === "draft" && <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">Draft</span>}
                </div>
                <p className="mt-1 text-sm"><strong>Complaint:</strong> {v.complaint}</p>
                <p className="text-sm"><strong>Findings:</strong> {v.findings}</p>
                {v.notes && <p className="text-sm"><strong>Notes:</strong> {v.notes}</p>}
                <p className="mt-1 text-xs text-slate-500">
                  {v.site} · {v.sizeMm} mm · pain {v.pain}/10 · grade {v.grade} · QoL {v.qol}
                </p>
              </li>
            ))}
          </ol>
        </Card>

        <div className="space-y-4">
          <Card title="Consent">
            <ul className="space-y-2 text-sm">
              <li>Store this case: <strong className={p.consentStorage ? "text-teal-700" : "text-rose-700"}>{p.consentStorage ? "Yes" : "No"}</strong></li>
              <li>Anonymized research use: <strong className={p.consentResearch ? "text-teal-700" : "text-rose-700"}>{p.consentResearch ? "Yes" : "No"}</strong></li>
            </ul>
          </Card>
          <Card title="Change log">
            <ul className="space-y-2 text-xs text-slate-600">
              <li>Dr. (sample) edited a visit — pain 5 → 4</li>
              <li>Trainee (sample) added a visit</li>
              <li>Dr. (sample) created the patient</li>
            </ul>
          </Card>
          <Link href="/match" className={`${btnGhost} w-full`}>Suggest remedies (preview)</Link>
        </div>
      </div>
    </>
  );
}
