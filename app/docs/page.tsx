import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";
import { listDocs } from "@/lib/docs";

export default function Docs() {
  return (
    <>
      <PageHeader title="Project documents" sub="Requirements, decisions, and open questions for this project." />
      <Card>
        <ul className="divide-y divide-slate-100">
          {listDocs().map((d) => (
            <li key={d.slug}>
              <Link href={`/docs/${d.slug}`} className="flex items-baseline justify-between gap-4 px-2 py-3 hover:bg-teal-50">
                <span className="font-medium text-teal-800">{d.title}</span>
                <span className="font-mono text-xs text-slate-500">{d.slug}.md</span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
