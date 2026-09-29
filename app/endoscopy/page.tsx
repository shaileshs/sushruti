"use client";

import { useState } from "react";
import { useDemo } from "@/components/demo-provider";
import { Check } from "@/components/controls";
import { Card, PageHeader, PreviewNote, btn, btnGhost } from "@/components/ui";

const report = [
  "CITY HOSPITAL (SAMPLE) — GASTROENTEROLOGY UNIT",
  "UPPER GI ENDOSCOPY REPORT",
  "Patient ID: P-0002     Date: 22-Apr-2026",
  "Indication: Progressive dysphagia to solids, weight loss.",
  "Findings: An ulcero-proliferative, circumferential growth is seen in the lower third of the esophagus, 32 to 36 cm from the incisors, measuring approximately 4.5 cm in length. Friable, bleeds on contact. Scope passes with difficulty.",
  "Impression: Growth lower third esophagus. Biopsy taken.",
];

const fields = [
  { name: "Tumor site", value: "Lower third esophagus", from: "lower third of the esophagus" },
  { name: "Length", value: "45 mm", from: "approximately 4.5 cm in length" },
  { name: "Morphology", value: "Ulcero-proliferative, circumferential", from: "ulcero-proliferative, circumferential growth" },
];

type Step = "idle" | "reading" | "review";
const steps = ["Upload", "Read", "Confirm"];

export default function Endoscopy() {
  const { notify } = useDemo();
  const [step, setStep] = useState<Step>("idle");
  const [ok, setOk] = useState<Record<string, boolean>>({});

  const run = () => {
    setStep("reading");
    setTimeout(() => setStep("review"), 1600);
  };
  const reset = () => { setStep("idle"); setOk({}); };
  const highlight = (text: string) => {
    if (step !== "review") return text;
    const hit = fields.find((f) => text.toLowerCase().includes(f.from));
    if (!hit) return text;
    const i = text.toLowerCase().indexOf(hit.from);
    return (
      <>
        {text.slice(0, i)}
        <mark className={`rounded px-0.5 transition-colors duration-500 ${ok[hit.name] ? "bg-emerald-200" : "bg-yellow-200"}`}>{text.slice(i, i + hit.from.length)}</mark>
        {text.slice(i + hit.from.length)}
      </>
    );
  };
  const done = fields.filter((f) => ok[f.name]).length;
  const at = step === "idle" ? 0 : step === "reading" ? 1 : 2;

  return (
    <>
      <PageHeader title="Endoscopy report reader" sub="Upload a hospital PDF. The tool suggests the key values. You confirm each one before it is saved." />
      <PreviewNote>Uses one invented report. The real tool is built and tested on your sample PDFs.</PreviewNote>

      <ol className="mb-5 flex items-center gap-2 text-sm" aria-label="Progress">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors ${i < at ? "bg-emerald-500 text-white" : i === at ? "bg-teal-700 text-white" : "bg-slate-200 text-slate-500"}`}>{i < at ? <Check /> : i + 1}</span>
            <span className={i === at ? "font-medium text-slate-900" : "text-slate-500"}>{s}</span>
            {i < steps.length - 1 && <span className={`mx-1 h-0.5 w-8 rounded transition-colors ${i < at ? "bg-emerald-400" : "bg-slate-200"}`} />}
          </li>
        ))}
      </ol>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Report (PDF)">
          <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-white p-5 font-serif text-sm leading-relaxed shadow-inner">
            {step === "reading" && <div className="scan" aria-hidden />}
            <div className="space-y-3">{report.map((line, i) => <p key={i} className={i < 2 ? "font-bold" : ""}>{highlight(line)}</p>)}</div>
          </div>
          <div className="mt-3 flex gap-2">
            <button className={btn} onClick={run} disabled={step !== "idle"}>{step === "reading" ? "Reading…" : "Read report"}</button>
            {step !== "idle" && <button className={btnGhost} onClick={reset}>Start over</button>}
          </div>
        </Card>

        <Card title="Suggested values">
          {step === "idle" && <p className="py-12 text-center text-sm text-slate-500">Press “Read report” to see the suggested values.</p>}
          {step === "reading" && (
            <div className="space-y-3 py-2" aria-live="polite">
              {fields.map((f) => <div key={f.name} className="h-20 animate-pulse rounded-xl bg-slate-100" />)}
              <p className="text-center text-sm text-slate-500">Reading the report…</p>
            </div>
          )}
          {step === "review" && (
            <>
              <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                <span><strong className="tnum text-slate-800">{done}</strong> of {fields.length} confirmed</span>
                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-emerald-500 transition-[width] duration-500" style={{ width: `${(done / fields.length) * 100}%` }} /></div>
              </div>
              <ul className="space-y-3">
                {fields.map((f, i) => (
                  <li key={f.name} className={`rise rounded-xl border p-3 transition-colors ${ok[f.name] ? "border-emerald-300 bg-emerald-50/60" : "border-slate-200"}`} style={{ "--i": i } as React.CSSProperties}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{f.name}</div>
                        <div className="mt-0.5 font-medium">{f.value}</div>
                        <div className="mt-1 text-xs text-slate-500">Found in text: “{f.from}”</div>
                      </div>
                      <button
                        aria-pressed={!!ok[f.name]}
                        className={`press inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${ok[f.name] ? "bg-emerald-600 text-white" : "border border-slate-300 bg-white hover:bg-slate-100"}`}
                        onClick={() => setOk((o) => ({ ...o, [f.name]: !o[f.name] }))}
                      >
                        {ok[f.name] ? <><Check /> Confirmed</> : "Confirm"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-3">
                <button className={btn} disabled={done < fields.length} onClick={() => { notify("Confirmed values saved to the visit"); reset(); }}>Save to visit</button>
                {done < fields.length && <span className="text-xs text-slate-500">Confirm every value to save.</span>}
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  );
}
