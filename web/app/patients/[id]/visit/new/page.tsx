"use client";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { use, useState } from "react";
import { useDemo } from "@/components/demo-provider";
import { LesionImage } from "@/components/lesion-image";
import { Card, PageHeader, btn, btnGhost, input } from "@/components/ui";
import { lastVisit, type Patient } from "@/lib/mock";

const label = "mb-1 block text-sm font-medium text-slate-700";

export default function NewVisit(props: PageProps<"/patients/[id]/visit/new">) {
  const { id } = use(props.params);
  const { patients } = useDemo();
  const p = patients.find((x) => x.id === id);
  if (!p) notFound();
  return <VisitForm p={p} />;
}

function VisitForm({ p }: { p: Patient }) {
  const { addVisit } = useDemo();
  const router = useRouter();
  const prev = lastVisit(p);
  const [f, setF] = useState({ complaint: "", findings: "", notes: "", site: prev.site, size: "", pain: "", grade: prev.grade, qol: "" });
  const [photos, setPhotos] = useState(0);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  const size = Number(f.size);
  const pain = Number(f.pain);
  const errors = {
    size: f.size !== "" && (size <= 0 || size > 300) ? "Enter a size between 1 and 300 mm." : "",
    pain: f.pain !== "" && (!Number.isInteger(pain) || pain < 0 || pain > 10) ? "Pain is a whole number from 0 to 10." : "",
  };
  const valid = !errors.size && !errors.pain && f.size !== "" && f.pain !== "";

  const save = (status: "final" | "draft") => {
    addVisit(p.id, {
      id: `${p.id}v${p.visits.length + 1}`,
      date: new Date().toISOString().slice(0, 10),
      type: "Follow-up",
      status,
      complaint: f.complaint || "(none entered)",
      findings: f.findings || "(none entered)",
      notes: f.notes,
      site: f.site,
      sizeMm: size || prev.sizeMm,
      pain: pain || 0,
      grade: f.grade,
      qol: Number(f.qol) || prev.qol,
    });
    router.push(`/patients/${p.id}`);
  };

  return (
    <>
      <PageHeader title="New visit" sub={`${p.name} · ${p.code}. Saving here adds the visit to this demo until you refresh the page.`} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Case notes">
          <div className="space-y-3">
            <div><label className={label}>Chief complaint</label><textarea className={input} rows={2} value={f.complaint} onChange={set("complaint")} /></div>
            <div><label className={label}>Oral or esophageal findings</label><textarea className={input} rows={3} value={f.findings} onChange={set("findings")} /></div>
            <div><label className={label}>Notes</label><textarea className={input} rows={2} value={f.notes} onChange={set("notes")} /></div>
            <p className="text-xs text-slate-500">The real form will copy the doctor’s own case form.</p>
          </div>
        </Card>

        <Card title="Measures">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className={label}>Lesion site</label><input className={input} value={f.site} onChange={set("site")} /></div>
            <div>
              <label className={label}>Size (mm)</label>
              <input className={input} inputMode="decimal" placeholder={`Last: ${prev.sizeMm}`} value={f.size} onChange={set("size")} />
              {errors.size && <p className="mt-1 text-xs text-rose-700">{errors.size}</p>}
            </div>
            <div>
              <label className={label}>Pain (0–10)</label>
              <input className={input} inputMode="numeric" placeholder={`Last: ${prev.pain}`} value={f.pain} onChange={set("pain")} />
              {errors.pain && <p className="mt-1 text-xs text-rose-700">{errors.pain}</p>}
            </div>
            <div><label className={label}>Clinical grade</label><input className={input} value={f.grade} onChange={set("grade")} /></div>
            <div><label className={label}>Quality of life</label><input className={input} inputMode="numeric" placeholder={`Last: ${prev.qol}`} value={f.qol} onChange={set("qol")} /></div>
            <p className="col-span-2 text-xs text-slate-500">Grade and quality-of-life scales are placeholders until the doctor picks them.</p>
          </div>
        </Card>
      </div>

      <Card title="Photos" className="mt-4">
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: photos }, (_, i) => (
            <LesionImage key={i} sizeMm={size || prev.sizeMm} seed={i + 7} className="h-24 w-24 rounded-lg border border-slate-200" />
          ))}
          <button className="h-24 w-24 rounded-lg border-2 border-dashed border-slate-300 text-sm text-slate-500 hover:border-teal-600 hover:text-teal-700" onClick={() => setPhotos(photos + 1)}>
            + Photo
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">On a phone this button opens the camera or photo library. Photos are shrunk and stripped of location data.</p>
      </Card>

      <div className="mt-5 flex flex-wrap gap-2">
        <button className={btn} disabled={!valid} onClick={() => save("final")}>Save visit</button>
        <button className={btnGhost} onClick={() => save("draft")}>Save as draft</button>
        <Link className={btnGhost} href={`/patients/${p.id}`}>Cancel</Link>
      </div>
    </>
  );
}
