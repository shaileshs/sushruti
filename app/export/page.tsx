"use client";

import { useState } from "react";
import { useDemo } from "@/components/demo-provider";
import { Card, PageHeader, PreviewNote, btn, btnGhost } from "@/components/ui";
import { exportRows } from "@/lib/mock";

const removed = ["Name", "Phone", "Address", "Photos", "Exact dates", "Exact age"];

export default function Export() {
  const { notify } = useDemo();
  const [site, setSite] = useState("All");
  const sites = ["All", "Oral", "Esophagus"];
  const rows = exportRows.filter((r) => site === "All" || (site === "Esophagus" ? /esophag/i.test(r.site) : !/esophag/i.test(r.site)));
  const cols = Object.keys(exportRows[0]) as (keyof (typeof exportRows)[0])[];

  const download = () => {
    const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => `"${r[c]}"`).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "sample-anonymized-export.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    notify(`Downloaded ${rows.length} anonymized rows`);
  };

  return (
    <>
      <PageHeader title="Research export" sub="Download anonymized data for a journal. Names, phone, address, and photos are never included." />
      <PreviewNote>Sample rows from the invented patients. Only patients who agreed to research use appear.</PreviewNote>

      <div className="mb-4 grid gap-4 lg:grid-cols-3">
        <Card title="Filter by site" className="lg:col-span-2">
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
          <button className={btnGhost} disabled title="Preview">Download XLSX</button>
        </div>
        <p className="mt-3 text-xs text-stone-500">Identity is replaced by a subject code. Ages become bands. Dates become days from the first visit.</p>
      </Card>
    </>
  );
}
