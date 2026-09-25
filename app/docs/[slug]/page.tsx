import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { listDocs } from "@/lib/docs";

export const dynamicParams = false;

export function generateStaticParams() {
  return listDocs().map((d) => ({ slug: d.slug }));
}

export default async function DocPage(props: PageProps<"/docs/[slug]">) {
  const { slug } = await props.params;
  const doc = listDocs().find((d) => d.slug === slug);
  if (!doc) notFound();

  return (
    <>
      <Link href="/docs" className="mb-4 inline-block text-sm text-teal-800 hover:underline">← All documents</Link>
      <article className="doc max-w-4xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
        <Markdown remarkPlugins={[remarkGfm]}>{doc.source}</Markdown>
      </article>
    </>
  );
}
