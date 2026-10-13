import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";

type Item = { text: string; href: string };
const groups: { title: string; items: Item[] }[] = [
  {
    title: "New patient: follow your clinic flow",
    items: [
      { text: "1. Start a visit. Pain 11 shows a check.", href: "/patients/p6/visit/new" },
      { text: "2. In Histopathology or Investigations, press “Read a report”. Pick MRI, confirm each value, save.", href: "/patients/p6/visit/new" },
      { text: "3. In Evaluation, press “Suggest remedies”. Tick two or three, compare one in the library.", href: "/patients/p6/visit/new" },
      { text: "4. Write why you chose it, then use it in the treatment plan.", href: "/patients/p6/visit/new" },
      { text: "5. In Treatment plan, add a supportive medicine and the charge taken. Save.", href: "/patients/p6/visit/new" },
    ],
  },
  {
    title: "Follow-up",
    items: [
      { text: "Open a patient: trends, photos, timeline, charges", href: "/patients/p1" },
      { text: "Add a visit, then press “View full history and all earlier prescriptions”", href: "/patients/p3/visit/new" },
      { text: "Save a visit as a draft", href: "/patients/p2/visit/new" },
    ],
  },
  {
    title: "Research",
    items: [
      { text: "Analytics: filter by cancer type, read the remedy table", href: "/analytics" },
      { text: "Research export: filter, download the CSV and the data dictionary", href: "/export" },
    ],
  },
  {
    title: "Other screens",
    items: [
      { text: "Find a patient by name, phone, or code (try “P-0003”)", href: "/" },
      { text: "Remedy library: search “burning”", href: "/remedies" },
      { text: "Report reader on its own", href: "/reports" },
      { text: "Remedy match: tick a shortlist, start a visit", href: "/match" },
      { text: "Open the app on a phone", href: "/" },
    ],
  },
];

export default function Test() {
  return (
    <>
      <PageHeader title="What to test" sub="Follow these steps in order. Each link opens the right screen." />
      <div className="grid gap-4 lg:grid-cols-2">
        {groups.map((g) => (
          <Card key={g.title} title={g.title}>
            <ul className="space-y-1">
              {g.items.map((i) => (
                <li key={i.text}>
                  <Link href={i.href} className="block rounded-lg px-3 py-2 text-sm text-brand-800 hover:bg-brand-50">{i.text}</Link>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      <p className="mt-4 text-xs text-stone-500">All data is invented. Added visits vanish on refresh.</p>
    </>
  );
}
