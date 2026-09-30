"use client";

import { useState, type ReactNode } from "react";
import { Card, PageHeader, PreviewNote } from "@/components/ui";
import { remedies } from "@/lib/mock";

const mark = (text: string, term: string): ReactNode => {
  const i = term ? text.toLowerCase().indexOf(term) : -1;
  if (i < 0) return text;
  return <>{text.slice(0, i)}<mark className="rounded bg-yellow-200 px-0.5">{text.slice(i, i + term.length)}</mark>{text.slice(i + term.length)}</>;
};

export default function Remedies() {
  const [q, setQ] = useState("");
  const [slug, setSlug] = useState(remedies[0].slug);
  const term = q.trim().toLowerCase();
  const hits = remedies.filter(
    (r) => !term || r.name.toLowerCase().includes(term) || r.sections.some((s) => s.bullets.some((b) => b.toLowerCase().includes(term))),
  );
  const sel = hits.find((r) => r.slug === slug) ?? hits[0];

  return (
    <>
      <PageHeader title="Remedy library" sub="Your 600-page document, parsed into 150 searchable remedies. Search a name or any symptom phrase." />
      <PreviewNote>Shows 10 remedies with placeholder text. The real library is built from your Word document.</PreviewNote>
      <div className="relative mb-4 max-w-md">
        <svg viewBox="0 0 20 20" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><circle cx="9" cy="9" r="6" /><path d="m14 14 4 4" /></svg>
        <input
          className="w-full rounded-xl border border-line-strong bg-surface py-2.5 pl-9 pr-9 text-sm transition placeholder:text-stone-400 hover:border-stone-400 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
          placeholder="Search a remedy or a phrase, e.g. “burning”" aria-label="Search remedies" value={q} onChange={(e) => setQ(e.target.value)}
        />
        {q && <button aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-2 text-stone-400 hover:bg-stone-100" onClick={() => setQ("")}>×</button>}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <p className="mb-2 text-xs text-stone-500">{hits.length} of {remedies.length} remedies</p>
          <ul className="space-y-1">
            {hits.map((r) => (
              <li key={r.slug}>
                <button onClick={() => setSlug(r.slug)} aria-current={sel?.slug === r.slug} className={`press w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${sel?.slug === r.slug ? "bg-brand-700 font-medium text-white" : "text-stone-700 hover:bg-stone-100"}`}>
                  {r.name}
                </button>
              </li>
            ))}
            {hits.length === 0 && <li className="px-3 py-6 text-center text-sm text-stone-500">No remedy matches “{q}”.</li>}
          </ul>
        </Card>
        <Card className="md:col-span-2">
          {sel && (
            <div key={sel.slug} className="rise">
              <h2 className="mb-4 text-2xl font-semibold tracking-tight">{mark(sel.name, term)}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {sel.sections.map((s) => (
                  <div key={s.heading} className="rounded-xl bg-stone-50 p-3">
                    <h3 className="text-xs font-semibold text-brand-800">{s.heading}</h3>
                    <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-stone-700">
                      {s.bullets.map((b) => <li key={b}>{mark(b, term)}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
