"use client";

import { useState } from "react";
import { useDemo } from "@/components/demo-provider";
import { Card, PageHeader, PreviewNote, btn, btnGhost } from "@/components/ui";
import { exportRows } from "@/lib/mock";

const removed = ["Name", "Phone", "Address", "Photos", "Exact dates", "Exact age"];

export default function Export() {
  const { notify } = useDemo();
  const [site, setSite] = useState("All");
  const sites = ["All", "Oral", "Esophageal", "Breast"];
  const rows = exportRows.filter((r) => site === "All" || r.cancer === site);
  const cols = Object.keys(exportRows[0]) as (keyof (typeof exportRows)[0])[];

  // A data dictionary lets statistics software label variables and read the codes correctly.
  const dictionary: Record<string, [string, string]> = {
    subject: ["Subject code, not the patient code", "text"],
    cancer: ["Cancer type: Oral, Esophageal, Breast", "category"],
    age_band: ["Age in 10-year bands", "category"],
    sex: ["F or M", "category"],
    visit_no: ["Visit number, 1 is the first", "integer"],
    days_from_first: ["Days since the first visit", "integer"],
    site: ["Lesion site", "text"],
    lesion_size_mm: ["Longest lesion dimension, millimetres", "number"],
    pain_0_10: ["Pain, whole number 0 to 10", "integer"],
    grade: ["Clinical grade (scale to be chosen)", "text"],
    qol: ["Quality-of-life score (scale to be chosen)", "number"],
    outcome: ["Outcome category: Cure, Remission, Pain management, Quality of life, Life expectancy. Blank if not set.", "category"],
    remedy: ["Main remedy prescribed at this visit. Blank if none.", "text"],
  };
  const save = (name: string, csv: string) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const download = () => {
    save("sample-anonymized-export.csv", [cols.join(","), ...rows.map((r) => cols.map((c) => `"${r[c]}"`).join(","))].join("\n"));
    notify(`Downloaded ${rows.length} anonymized rows`);
  };
  const downloadDictionary = () => {
    save("sample-data-dictionary.csv", ["variable,meaning,type", ...cols.map((c) => `"${c}","${dictionary[c]?.[0] ?? ""}","${dictionary[c]?.[1] ?? ""}"`)].join("\n"));
    notify("Downloaded the data dictionary");
  };

  return (
    <>
      <PageHeader title="Research export" sub="Download anonymized data for a journal. Names, phone, address, and photos are never included." />
      <PreviewNote>Sample rows from the invented patients. Only patients who agreed to research use appear.</PreviewNote>

      <div className="mb-4 grid gap-4 lg:grid-cols-3">
        <Card title="Filter by cancer type" className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Site filter">
            {sites.map((s) => (
              <button key={s} role="radio" aria-checked={site === s} onClick={() => setSite(s)} className={`press rounded-full px-4 py-2 text-sm font-medium transition-colors ${site === s ? "bg-stone-900 text-page" : "bg-surface text-stone-700 ring-1 ring-stone-200 hover:bg-stone-100"}`}>{s}</button>
            ))}
            <span className="ml-auto text-sm text-stone-600"><strong className="tnum text-stone-900">{rows.length}</strong> rows</span>
          </div>
        </Card>
        <Card title="Removed before export">
          <div className="flex flex-wrap gap-1.5">
            {removed.map((r) => <span key={r} className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-800 line-through decoration-rose-300">{r}</span>)}
          </div>
        </Card>
      </div>

      <Card title="Preview">
        <div className="max-h-96 overflow-auto rounded-xl border border-line">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-stone-100 text-stone-600"><tr>{cols.map((c) => <th key={c} className="whitespace-nowrap px-3 py-2.5 font-mono font-medium">{c}</th>)}</tr></thead>
            <tbody>
              {rows.slice(0, 12).map((r, i) => (
                <tr key={`${site}-${i}`} className="rise border-t border-stone-100 odd:bg-surface even:bg-stone-50/60 hover:bg-brand-50" style={{ "--i": Math.min(i, 8) } as React.CSSProperties}>
                  {cols.map((c) => <td key={c} className="tnum whitespace-nowrap px-3 py-2">{r[c]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-stone-500">Showing {Math.min(12, rows.length)} of {rows.length} rows.</p>
        <div className="mt-4 flex gap-2">
          <button className={btn} onClick={download}>↓ Download CSV</button>
          <button className={btnGhost} onClick={downloadDictionary}>↓ Data dictionary</button>
        </div>
        <p className="mt-3 text-xs text-stone-500">Identity is replaced by a subject code. Ages become bands. Dates become days from the first visit.</p>
        <p className="mt-1 text-xs text-stone-500">The CSV opens in Excel, SPSS, R, and Stata. The data dictionary names each column and its type, so the software labels variables correctly. An XLSX file comes with the real export.</p>
      </Card>
    </>
  );
}
