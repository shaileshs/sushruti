"use client";

import { useState } from "react";
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

export default function Endoscopy() {
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
        <mark className="rounded bg-yellow-200 px-0.5">{text.slice(i, i + hit.from.length)}</mark>
        {text.slice(i + hit.from.length)}
      </>
    );
  };

  return (
    <>
      <PageHeader title="Endoscopy report reader" sub="Upload a hospital PDF. The tool suggests the key values. You confirm each one before it is saved." />
      <PreviewNote>Uses one invented report. The real tool is built and tested on your sample PDFs.</PreviewNote>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Report (PDF)">
          <div className="space-y-3 rounded-lg border border-slate-300 bg-white p-4 font-serif text-sm leading-relaxed shadow-inner">
            {report.map((line, i) => <p key={i} className={i < 2 ? "font-bold" : ""}>{highlight(line)}</p>)}
          </div>
          <div className="mt-3 flex gap-2">
            <button className={btn} onClick={run} disabled={step !== "idle"}>Read report</button>
            {step !== "idle" && <button className={btnGhost} onClick={reset}>Start over</button>}
          </div>
        </Card>

        <Card title="Suggested values">
          {step === "idle" && <p className="py-10 text-center text-sm text-slate-500">Press “Read report” to see the suggested values.</p>}
          {step === "reading" && <p className="py-10 text-center text-sm text-slate-600 animate-pulse">Reading the report…</p>}
          {step === "review" && (
            <ul className="space-y-3">
              {fields.map((f) => (
                <li key={f.name} className="rounded-lg border border-slate-200 p-3">
                  <div className="text-xs uppercase tracking-wide text-slate-500">{f.name}</div>
                  <div className="mt-0.5 font-medium">{f.value}</div>
                  <div className="mt-1 text-xs text-slate-500">Found in text: “{f.from}”</div>
                  <button
                    className={`mt-2 rounded-lg px-3 py-1 text-sm font-medium ${ok[f.name] ? "bg-teal-100 text-teal-800" : "border border-slate-300 hover:bg-slate-100"}`}
                    onClick={() => setOk({ ...ok, [f.name]: !ok[f.name] })}
                  >
                    {ok[f.name] ? "✓ Confirmed" : "Confirm"}
                  </button>
                </li>
              ))}
              <li>
                <button className={btn} disabled={!fields.every((f) => ok[f.name])} onClick={() => alert("In the real app the confirmed values are saved to the patient's visit.")}>
                  Save to visit
                </button>
              </li>
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
