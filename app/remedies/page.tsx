import { PageHeader, PreviewNote } from "@/components/ui";
import { RemedyBrowser } from "@/components/remedy-browser";

export default function Remedies() {
  return (
    <>
      <PageHeader title="Remedy library" sub="Your 600-page document, parsed into 150 searchable remedies. Search a name or any symptom phrase." />
      <PreviewNote>Shows 10 remedies with placeholder text. The real library is built from your Word document.</PreviewNote>
      <RemedyBrowser />
    </>
  );
}
