"use client";

import { useState } from "react";
import { Card, PageHeader, PreviewNote, input } from "@/components/ui";
import { remedies } from "@/lib/mock";

export default function Remedies() {
  const [q, setQ] = useState("");
  const [slug, setSlug] = useState(remedies[0].slug);
  const term = q.trim().toLowerCase();
  const hits = remedies.filter(
    (r) => !term || r.name.toLowerCase().includes(term) || r.sections.some((s) => s.bullets.some((b) => b.toLowerCase().includes(term))),
  );
  const sel = remedies.find((r) => r.slug === slug) ?? hits[0];

  return (
    <>
      <PageHeader title="Remedy library" sub="Your 600-page document, parsed into 150 searchable remedies. Search a name or any symptom phrase." />
      <PreviewNote>Shows 10 remedies with placeholder text. The real library is built from your Word document.</PreviewNote>
      <input className={`${input} mb-4 max-w-md`} placeholder="Search a remedy or a phrase, e.g. “burning”" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <ul className="space-y-1">
            {hits.map((r) => (
              <li key={r.slug}>
                <button onClick={() => setSlug(r.slug)} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${sel?.slug === r.slug ? "bg-teal-700 text-white" : "hover:bg-slate-100"}`}>
                  {r.name}
                </button>
              </li>
            ))}
            {hits.length === 0 && <li className="px-3 py-2 text-sm text-slate-500">No remedy matches.</li>}
          </ul>
        </Card>
        <Card className="md:col-span-2">
          {sel && (
            <>
              <h2 className="mb-3 text-xl font-semibold">{sel.name}</h2>
              {sel.sections.map((s) => (
                <div key={s.heading} className="mb-4">
                  <h3 className="text-sm font-semibold text-teal-800">{s.heading}</h3>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {s.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </>
          )}
        </Card>
      </div>
    </>
  );
}
