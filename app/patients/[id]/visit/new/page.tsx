"use client";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { use, useEffect, useState, useSyncExternalStore } from "react";
import { CaseForm, type PrevNums, type States, type Values } from "@/components/case-form";
import { useDemo } from "@/components/demo-provider";
import { LesionImage } from "@/components/lesion-image";
import { Avatar } from "@/components/viz";
import { btn, btnGhost, input } from "@/components/ui";
import { PHOTO_VIEWS, sections, type Row, type Val } from "@/lib/form";
import { fmtDate, lastVisit, type Patient } from "@/lib/mock";

export default function NewVisit(props: PageProps<"/patients/[id]/visit/new">) {
  const { id } = use(props.params);
  const { patients } = useDemo();
  const p = patients.find((x) => x.id === id);
  // The form reads its saved draft from sessionStorage, so it renders on the client only.
  const client = useSyncExternalStore(() => () => {}, () => true, () => false);
  if (!p) notFound();
  return client ? <VisitForm p={p} /> : null;
}

const text = (x: Val | undefined) => (typeof x === "string" ? x : "");

function VisitForm({ p }: { p: Patient }) {
  const { addVisit, notify } = useDemo();
  const router = useRouter();
  const prev = lastVisit(p);
  const key = `invicta-draft-${p.id}`;
  const saved = readDraft(key);
  const [v, setValues] = useState<Values>(saved?.v ?? { site: prev.site, stage: prev.grade });
  const [st, setStates] = useState<States>(saved?.st ?? {});
  const [photos, setPhotos] = useState<{ view: string; consent: boolean }[]>(saved?.photos ?? []);
  const [restored, setRestored] = useState(!!saved);
  const [autoAt, setAutoAt] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const setV = (k: string, val: Val) => { setTouched(true); setValues((x) => ({ ...x, [k]: val })); };
  const setSt = (k: string, s: string) => { setTouched(true); setStates((x) => ({ ...x, [k]: s })); };

  // Keep a draft in this browser tab, so a lost connection or a reload does not lose work (NFR-10).
  useEffect(() => {
    if (!touched) return;
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(key, JSON.stringify({ v, st, photos }));
        setAutoAt(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
      } catch { /* storage full or blocked: the form still works */ }
    }, 500);
    return () => clearTimeout(t);
  }, [v, st, photos, touched, key]);
  const discard = () => {
    try { sessionStorage.removeItem(key); } catch { /* ignore */ }
    setValues({ site: prev.site, stage: prev.grade }); setStates({}); setPhotos([]); setRestored(false); setAutoAt(null); setTouched(false);
  };
  const prevNums: PrevNums = {
    size: { val: prev.sizeMm, goodDown: true },
    pain: { val: prev.pain, goodDown: true },
    qol: { val: prev.qol, goodDown: false },
  };

  const size = Number(v.size);
  const pain = Number(v.pain);
  const mouth = Number(v.mouth);
  const errors: Record<string, string> = {};
  if (v.size && st.size !== "Absent" && (size <= 0 || size > 300)) errors.size = "Enter a size between 1 and 300 mm.";
  if (v.pain && (!Number.isInteger(pain) || pain < 0 || pain > 10)) errors.pain = "Pain is a whole number from 0 to 10.";
  if (v.mouth && (mouth < 0 || mouth > 80)) errors.mouth = "Enter a mouth opening between 0 and 80 mm.";
  const valid = Object.keys(errors).length === 0;

  const asText = (k: string, val: Val | undefined): string => {
    if (st[k] && st[k] !== "Value") return st[k];
    if (!val || (Array.isArray(val) && val.length === 0)) return "";
    if (typeof val === "string") return val;
    if (typeof val[0] === "string") return (val as string[]).join(", ");
    return (val as Row[]).map((r) => Object.values(r).filter(Boolean).join(" / ")).filter(Boolean).join("; ");
  };

  const save = (status: "final" | "draft") => {
    const detail = sections
      .map((s) => ({
        title: `${s.n}. ${s.title}`,
        items: s.fields.map((f) => [f.label, asText(f.k, v[f.k])] as const).filter(([, t]) => t).map(([l, t]) => `${l}: ${t}`),
      }))
      .filter((s) => s.items.length > 0);
    const numeric = (k: string, fallback: number) => (st[k] && st[k] !== "Value" ? fallback : Number(v[k]) || fallback);
    addVisit(p.id, {
      id: `${p.id}v${p.visits.length + 1}`,
      date: new Date().toISOString().slice(0, 10),
      type: "Follow-up",
      status,
      complaint: text(v.complaint) || text(v.change) || "(none entered)",
      findings: [asText("morph", v.morph), text(v.surface)].filter(Boolean).join(" · ") || "(none entered)",
      notes: text(v.rationale),
      site: text(v.site) || prev.site,
      sizeMm: numeric("size", prev.sizeMm),
      pain: st.pain && st.pain !== "Value" ? 0 : pain || 0,
      grade: text(v.stage) || prev.grade,
      qol: numeric("qol", prev.qol),
      rx: text(v.remedy) ? { remedy: text(v.remedy), potency: text(v.potency), dose: text(v.dose), repetition: text(v.repeat) } : undefined,
      decision: text(v.decision) || undefined,
      response: text(v.response) || undefined,
      detail,
    });
    try { sessionStorage.removeItem(key); } catch { /* ignore */ }
    notify(status === "draft" ? "Draft saved to this visit list" : "Visit saved");
    router.push(`/patients/${p.id}`);
  };

  const photoNode = (
    <>
      <div className="flex flex-wrap gap-3">
        {photos.map((ph, i) => (
          <div key={i} className="pop w-36 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
            <div className="relative">
              <LesionImage sizeMm={size || prev.sizeMm} seed={i + 7} className="h-32 w-full rounded-lg" />
              <button type="button" aria-label="Remove photo" className="press absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/60 text-white hover:bg-rose-600" onClick={() => setPhotos(photos.filter((_, j) => j !== i))}>×</button>
            </div>
            <select className={`${input} mt-2 !py-1.5`} aria-label="Photo view" value={ph.view} onChange={(e) => setPhotos(photos.map((x, j) => (j === i ? { ...x, view: e.target.value } : x)))}>
              {PHOTO_VIEWS.map((o) => <option key={o}>{o}</option>)}
            </select>
            <label className="mt-2 flex cursor-pointer items-center gap-1.5 text-xs text-slate-600">
              <input type="checkbox" className="accent-teal-700" checked={ph.consent} onChange={(e) => setPhotos(photos.map((x, j) => (j === i ? { ...x, consent: e.target.checked } : x)))} /> Photo consent
            </label>
          </div>
        ))}
        <button type="button" className="press flex h-40 w-36 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 text-sm text-slate-500 hover:border-teal-600 hover:bg-teal-50 hover:text-teal-700" onClick={() => setPhotos([...photos, { view: "Front", consent: p.consentPhoto }])}>
          <span className="text-2xl leading-none">+</span>Add photo
        </button>
      </div>
      <p className="mt-3 text-xs text-slate-500">On a phone this button opens the camera or photo library. Photos are shrunk and stripped of location data.{!p.consentPhoto && " This patient has not given photo consent."}</p>
    </>
  );

  return (
    <>
      <div className="rise mb-5 flex flex-wrap items-center gap-4">
        <Avatar name={p.name} size={48} />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-slate-500"><Link href={`/patients/${p.id}`} className="hover:underline">← {p.name}</Link> · {p.code}</p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">New visit</h1>
        </div>
      </div>

      {restored && (
        <div className="rise mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
          <span>We restored your unsaved draft for this visit.</span>
          <button className="font-medium underline" onClick={discard}>Discard draft</button>
        </div>
      )}

      <div className="rise mb-5 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white px-4 py-3 text-sm text-teal-950" style={{ "--i": 1 } as React.CSSProperties}>
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">Last visit · {fmtDate(prev.date)}</p>
        <p className="mt-1">
          {prev.rx ? <strong>{prev.rx.remedy} {prev.rx.potency}</strong> : "No prescription recorded"}
          {prev.rx && `, ${prev.rx.dose}, ${prev.rx.repetition.toLowerCase()}`}
          {prev.decision && <span className="ml-2 rounded-full bg-teal-100 px-2 py-0.5 text-xs">{prev.decision}</span>}
          {prev.response && <span className="ml-1 rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-900">{prev.response}</span>}
        </p>
        <p className="mt-1 text-xs text-teal-800">{prev.sizeMm} mm · pain {prev.pain}/10 · QoL {prev.qol}</p>
      </div>

      <CaseForm v={v} st={st} setV={setV} setSt={setSt} errors={errors} showSince prev={prevNums} baseline={{ site: prev.site, stage: prev.grade }} extra={{ id: "photos", n: "P", title: "Photos", node: photoNode }} />

      <p className="mt-6 text-xs text-slate-500">
        Urgent bleeding, breathing difficulty, inability to swallow fluids, dehydration or fast swelling needs prompt medical care. This app never delays urgent care.
      </p>

      <div className="sticky bottom-0 z-30 -mx-4 mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white/85 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <span className="flex items-center gap-2 text-xs text-slate-500" aria-live="polite">
          <span className={`h-2 w-2 rounded-full ${autoAt ? "live-dot bg-emerald-500" : "bg-slate-300"}`} />
          {autoAt ? `Draft autosaved at ${autoAt}` : "Changes autosave as you type"}
        </span>
        <div className="flex gap-2">
          <Link className={btnGhost} href={`/patients/${p.id}`}>Cancel</Link>
          <button className={btnGhost} disabled={!valid} onClick={() => save("draft")}>Save as draft</button>
          <button className={btn} disabled={!valid} onClick={() => save("final")}>Save visit</button>
        </div>
      </div>
    </>
  );
}

type Draft = { v: Values; st: States; photos: { view: string; consent: boolean }[] };
function readDraft(key: string): Draft | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}
