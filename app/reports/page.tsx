import { PageHeader, PreviewNote } from "@/components/ui";
import { ReportReader } from "@/components/report-reader";

export default function Reports() {
  return (
    <>
      <PageHeader title="Report reader" sub="Pick the report type, then upload a hospital PDF. The tool suggests the key values. You confirm each one before it is saved." />
      <PreviewNote>Uses invented reports. We start with endoscopy and add the other types one by one, each tested on your sample PDFs.</PreviewNote>
      <ReportReader />
    </>
  );
}
