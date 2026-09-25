"use client";

import { useState } from "react";
import { Card, PageHeader, PreviewNote, btn, btnGhost } from "@/components/ui";
import { exportRows } from "@/lib/mock";

export default function Export() {
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
  };

  return (
    <>
      <PageHeader title="Research export" sub="Download anonymized data for a journal. Names, phone, address, and photos are never included." />
      <PreviewNote>Sample rows from the invented patients. Only patients who agreed to research use appear.</PreviewNote>
      <Card title="Filter" className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {sites.map((s) => (
            <button key={s} onClick={() => setSite(s)} className={`rounded-lg px-3 py-1.5 text-sm ${site === s ? "bg-teal-700 text-white" : "border border-slate-300 hover:bg-slate-100"}`}>{s}</button>
          ))}
          <span className="ml-auto text-sm text-slate-600">{rows.length} rows</span>
        </div>
      </Card>
      <Card title="Preview">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500"><tr>{cols.map((c) => <th key={c} className="whitespace-nowrap px-2 py-2 font-mono">{c}</th>)}</tr></thead>
            <tbody>
              {rows.slice(0, 8).map((r, i) => (
                <tr key={i} className="border-t border-slate-100">{cols.map((c) => <td key={c} className="whitespace-nowrap px-2 py-1.5">{r[c]}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex gap-2">
          <button className={btn} onClick={download}>Download CSV</button>
          <button className={btnGhost} disabled title="Preview">Download XLSX</button>
        </div>
        <p className="mt-3 text-xs text-slate-500">Identity is replaced by a subject code. Ages become bands. Dates become days from the first visit.</p>
      </Card>
    </>
  );
}
