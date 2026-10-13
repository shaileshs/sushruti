"use client";

import Link from "next/link";
import { useRef } from "react";

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

export function TestGuide() {
  const ref = useRef<HTMLDialogElement>(null);
  const close = () => ref.current?.close();
  return (
    <>
      <button
        onClick={() => ref.current?.showModal()}
        className="press flex items-center gap-2.5 whitespace-nowrap rounded-[7px] px-2 py-[5px] text-[13.5px] text-stone-500 transition-colors hover:bg-stone-50 hover:text-stone-900"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 10.5l3.5 3.5L15 6.5M3 3h14v14H3z" /></svg>
        What to test
      </button>
      <dialog
        ref={ref}
        onClick={(e) => e.target === ref.current && close()}
        className="m-auto w-[min(32rem,calc(100%-2rem))] rounded-xl p-0 text-left text-stone-900 shadow-xl backdrop:bg-stone-900/50"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="text-lg font-semibold">What to test</h2>
          <button onClick={close} aria-label="Close" className="rounded px-2 text-xl text-stone-500 hover:bg-stone-100">×</button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
          {groups.map((g) => (
            <section key={g.title} className="mb-4 last:mb-0">
              <h3 className="mb-2 text-xs font-semibold text-stone-500">{g.title}</h3>
              <ul className="space-y-1">
                {g.items.map((i) => (
                  <li key={i.text}>
                    <Link href={i.href} onClick={close} className="block rounded-lg px-3 py-2 text-sm text-brand-800 hover:bg-brand-50">
                      {i.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <p className="mt-4 text-xs text-stone-500">All data is invented. Added visits vanish on refresh.</p>
        </div>
      </dialog>
    </>
  );
}
