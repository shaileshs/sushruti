"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemo } from "@/components/demo-provider";
import { PageHeader, btn, input } from "@/components/ui";
import { fmtDate, lastVisit } from "@/lib/mock";

export default function PatientList() {
  const { patients } = useDemo();
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const rows = patients
    .filter((p) => !term || [p.name, p.phone, p.code].some((f) => f.toLowerCase().includes(term)))
    .sort((a, b) => +new Date(lastVisit(b).date) - +new Date(lastVisit(a).date));

  return (
    <>
      <PageHeader
        title="Patients"
        sub="Sorted by last visit. Search by name, phone, or code."
        action={<button className={btn} onClick={() => alert("In the real app this opens the new patient form.")}>New patient</button>}
      />
      <input className={`${input} mb-4 max-w-md`} placeholder="Search name, phone, or P-0001…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Name</th>
              <th className="hidden px-4 py-3 sm:table-cell">Age / sex</th>
              <th className="hidden px-4 py-3 md:table-cell">Site</th>
              <th className="px-4 py-3">Last visit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-slate-100 hover:bg-teal-50">
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.code}</td>
                <td className="px-4 py-3 font-medium">
                  <Link href={`/patients/${p.id}`} className="text-teal-800 hover:underline">{p.name}</Link>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">{p.age} / {p.sex}</td>
                <td className="hidden px-4 py-3 text-slate-600 md:table-cell">{lastVisit(p).site}</td>
                <td className="px-4 py-3">{fmtDate(lastVisit(p).date)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No patient matches “{q}”.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
