"use client";

import { useState } from "react";
import { useDemo } from "@/components/demo-provider";
import { Check } from "@/components/controls";
import { Card, PageHeader, PreviewNote, btn, btnGhost } from "@/components/ui";

type Field = { name: string; value: string; from: string };
type Kind = { id: string; label: string; lines: string[]; fields: Field[] };

// All reports are invented. Real reports vary in wording and layout.
const kinds: Kind[] = [
  {
    id: "endoscopy", label: "Endoscopy",
    lines: [
      "CITY HOSPITAL (SAMPLE) — GASTROENTEROLOGY UNIT",
      "UPPER GI ENDOSCOPY REPORT",
      "Patient ID: P-0002     Date: 22-Apr-2026",
      "Indication: Progressive dysphagia to solids, weight loss.",
      "Findings: An ulcero-proliferative, circumferential growth is seen in the lower third of the esophagus, 32 to 36 cm from the incisors, measuring approximately 4.5 cm in length. Friable, bleeds on contact. Scope passes with difficulty.",
      "Impression: Growth lower third esophagus. Biopsy taken.",
    ],
    fields: [
      { name: "Tumor site", value: "Lower third esophagus", from: "lower third of the esophagus" },
      { name: "Length", value: "45 mm", from: "approximately 4.5 cm in length" },
      { name: "Morphology", value: "Ulcero-proliferative, circumferential", from: "ulcero-proliferative, circumferential growth" },
    ],
  },
  {
    id: "biopsy", label: "Biopsy",
    lines: [
      "SAMPLE PATHOLOGY LABORATORY — HISTOPATHOLOGY REPORT",
      "Patient ID: P-0001     Date: 06-Mar-2026",
      "Specimen: Incision biopsy, left buccal mucosa.",
      "Microscopy: Sheets and nests of atypical squamous cells with keratin pearls and invasion into underlying connective tissue.",
      "Diagnosis: Squamous cell carcinoma, moderately differentiated (Grade 2). Margins not assessed on biopsy.",
    ],
    fields: [
      { name: "Specimen site", value: "Left buccal mucosa", from: "left buccal mucosa" },
      { name: "Type", value: "Squamous cell carcinoma", from: "squamous cell carcinoma" },
      { name: "Grade", value: "Moderately differentiated (G2)", from: "moderately differentiated (grade 2)" },
    ],
  },
  {
    id: "mri", label: "MRI",
    lines: [
      "SAMPLE IMAGING CENTRE — MRI HEAD AND NECK WITH CONTRAST",
      "Patient ID: P-0001     Date: 10-Mar-2026",
      "Findings: Enhancing mass in the left buccal mucosa measuring 2.8 x 2.1 cm. Extension into the adjacent masticator space. Left level II lymph node, 1.4 cm, rounded.",
      "Impression: Primary mass with probable left level II nodal involvement.",
    ],
    fields: [
      { name: "Primary size", value: "28 × 21 mm", from: "2.8 x 2.1 cm" },
      { name: "Local extension", value: "Masticator space", from: "masticator space" },
      { name: "Nodes", value: "Left level II, 14 mm", from: "left level ii lymph node, 1.4 cm" },
    ],
  },
  {
    id: "pet", label: "PET scan",
    lines: [
      "SAMPLE NUCLEAR MEDICINE — FDG PET-CT WHOLE BODY",
      "Patient ID: P-0001     Date: 14-Mar-2026",
      "Findings: FDG-avid mass in the left buccal mucosa, SUVmax 11.2. FDG-avid left level II node, SUVmax 6.4. No distant uptake.",
      "Impression: Loco-regional disease. No distant metastasis seen.",
    ],
    fields: [
      { name: "Primary uptake", value: "SUVmax 11.2", from: "suvmax 11.2" },
      { name: "Nodal uptake", value: "Left level II, SUVmax 6.4", from: "suvmax 6.4" },
      { name: "Distant disease", value: "None seen", from: "no distant metastasis seen" },
    ],
  },
  {
    id: "ct", label: "CT scan",
    lines: [
      "SAMPLE IMAGING CENTRE — CT NECK AND CHEST WITH CONTRAST",
      "Patient ID: P-0001     Date: 12-Mar-2026",
      "Findings: Soft-tissue mass in the left buccal region, 2.7 cm, with mild erosion of the adjacent mandible. Lungs clear. No pulmonary nodules.",
      "Impression: Primary lesion with early bone erosion. Chest clear.",
    ],
    fields: [
      { name: "Primary size", value: "27 mm", from: "2.7 cm" },
      { name: "Bone", value: "Early mandibular erosion", from: "mild erosion of the adjacent mandible" },
      { name: "Chest", value: "Clear", from: "lungs clear" },
    ],
  },
  {
    id: "sono", label: "Sonography",
    lines: [
      "SAMPLE ULTRASOUND CLINIC — NECK AND ABDOMEN",
      "Patient ID: P-0001     Date: 08-Mar-2026",
      "Neck: Two hypoechoic lymph nodes in left level II, the larger 13 mm, loss of fatty hilum.",
      "Abdomen: Liver normal in size and echotexture. No focal lesion.",
    ],
    fields: [
      { name: "Neck nodes", value: "2 nodes, left level II, largest 13 mm", from: "two hypoechoic lymph nodes in left level ii, the larger 13 mm" },
      { name: "Node features", value: "Loss of fatty hilum", from: "loss of fatty hilum" },
      { name: "Liver", value: "No focal lesion", from: "no focal lesion" },
    ],
  },
];

type Step = "idle" | "reading" | "review";
const steps = ["Upload", "Read", "Confirm"];

export default function Reports() {
  const { notify } = useDemo();
  const [kindId, setKindId] = useState(kinds[0].id);
  const kind = kinds.find((k) => k.id === kindId)!;
  const { lines: report, fields } = kind;
  const [step, setStep] = useState<Step>("idle");
  const [ok, setOk] = useState<Record<string, boolean>>({});

  const run = () => {
    setStep("reading");
    setTimeout(() => setStep("review"), 1600);
  };
  const reset = () => { setStep("idle"); setOk({}); };
  const pick = (id: string) => { setKindId(id); reset(); };
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
      <PageHeader title="Report reader" sub="Pick the report type, then upload a hospital PDF. The tool suggests the key values. You confirm each one before it is saved." />
      <PreviewNote>Uses invented reports. We start with endoscopy and add the other types one by one, each tested on your sample PDFs.</PreviewNote>

      <div className="mb-5 flex flex-wrap gap-2" role="radiogroup" aria-label="Report type">
        {kinds.map((k) => (
          <button key={k.id} role="radio" aria-checked={k.id === kindId} onClick={() => pick(k.id)} className={`press rounded-full px-4 py-2 text-sm font-medium transition-colors ${k.id === kindId ? "bg-stone-900 text-page" : "bg-surface text-stone-700 ring-1 ring-stone-200 hover:bg-stone-100"}`}>{k.label}</button>
        ))}
      </div>

      <ol className="mb-5 flex items-center gap-2 text-sm" aria-label="Progress">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors ${i < at ? "bg-emerald-500 text-white" : i === at ? "bg-accent text-on-accent" : "bg-stone-200 text-stone-500"}`}>{i < at ? <Check /> : i + 1}</span>
            <span className={i === at ? "font-medium text-stone-900" : "text-stone-500"}>{s}</span>
            {i < steps.length - 1 && <span className={`mx-1 h-0.5 w-8 rounded transition-colors ${i < at ? "bg-emerald-400" : "bg-stone-200"}`} />}
          </li>
        ))}
      </ol>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={`${kind.label} report (PDF)`}>
          <div className="relative overflow-hidden rounded-xl border border-line-strong bg-surface p-5 font-serif text-sm leading-relaxed">
            {step === "reading" && <div className="scan" aria-hidden />}
            <div className="space-y-3">{report.map((line, i) => <p key={i} className={i < 2 ? "font-bold" : ""}>{highlight(line)}</p>)}</div>
          </div>
          <div className="mt-3 flex gap-2">
            <button className={btn} onClick={run} disabled={step !== "idle"}>{step === "reading" ? "Reading…" : "Read report"}</button>
            {step !== "idle" && <button className={btnGhost} onClick={reset}>Start over</button>}
          </div>
        </Card>

        <Card title="Suggested values">
          {step === "idle" && <p className="py-12 text-center text-sm text-stone-500">Press “Read report” to see the suggested values.</p>}
          {step === "reading" && (
            <div className="space-y-3 py-2" aria-live="polite">
              {fields.map((f) => <div key={f.name} className="h-20 animate-pulse rounded-xl bg-stone-100" />)}
              <p className="text-center text-sm text-stone-500">Reading the report…</p>
            </div>
          )}
          {step === "review" && (
            <>
              <div className="mb-3 flex items-center justify-between text-xs text-stone-500">
                <span><strong className="tnum text-stone-800">{done}</strong> of {fields.length} confirmed</span>
                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-stone-200"><div className="h-full rounded-full bg-emerald-500 transition-[width] duration-500" style={{ width: `${(done / fields.length) * 100}%` }} /></div>
              </div>
              <ul className="space-y-3">
                {fields.map((f, i) => (
                  <li key={f.name} className={`rise rounded-xl border p-3 transition-colors ${ok[f.name] ? "border-emerald-300 bg-emerald-50/60" : "border-line"}`} style={{ "--i": i } as React.CSSProperties}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold text-stone-500">{f.name}</div>
                        <div className="mt-0.5 font-medium">{f.value}</div>
                        <div className="mt-1 text-xs text-stone-500">Found in text: “{f.from}”</div>
                      </div>
                      <button
                        aria-pressed={!!ok[f.name]}
                        className={`press inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${ok[f.name] ? "bg-emerald-500 text-white" : "border border-line-strong bg-surface hover:bg-stone-100"}`}
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
                {done < fields.length && <span className="text-xs text-stone-500">Confirm every value to save.</span>}
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  );
}
