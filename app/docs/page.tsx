import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";
import { listDocs } from "@/lib/docs";

export default function Docs() {
  return (
    <>
      <PageHeader title="Project documents" sub="Requirements, decisions, and open questions for this project." />
      <Card>
        <ul className="divide-y divide-slate-100">
          {listDocs().map((d, i) => (
            <li key={d.slug} className="rise" style={{ "--i": Math.min(i, 8) } as React.CSSProperties}>
              <Link href={`/docs/${d.slug}`} className="group flex items-baseline justify-between gap-4 rounded-xl px-3 py-3.5 transition-colors hover:bg-teal-50">
                <span className="font-medium text-teal-900 group-hover:underline">{d.title}</span>
                <span className="flex items-center gap-2 font-mono text-xs text-slate-400">{d.slug}.md <span className="transition-transform group-hover:translate-x-1" aria-hidden>›</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
