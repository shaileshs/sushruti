"use client";

import Link from "next/link";
import { useRef } from "react";

type Item = { text: string; href: string };
const groups: { title: string; items: Item[] }[] = [
  {
    title: "Base module",
    items: [
      { text: "Find a patient by name, phone, or code (try “P-0003”)", href: "/" },
      { text: "Open a patient: trends, photos over time, visits, consent", href: "/patients/p1" },
      { text: "Add a visit. Enter pain 11 to see the check. Then save.", href: "/patients/p1/visit/new" },
      { text: "Save a visit as a draft", href: "/patients/p2/visit/new" },
      { text: "Open the app on a phone", href: "/" },
    ],
  },
  {
    title: "Previews of later modules",
    items: [
      { text: "Remedy library: search “burning”", href: "/remedies" },
      { text: "Endoscopy reader: read the report, confirm each value", href: "/endoscopy" },
      { text: "Remedy match: open a remedy to see its points", href: "/match" },
      { text: "Analytics: prescriptions and outcome curves", href: "/analytics" },
      { text: "Research export: filter, then download a CSV", href: "/export" },
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
        className="ml-3 rounded bg-teal-600 px-2 py-0.5 font-medium text-white hover:bg-teal-500"
      >
        What to test
      </button>
      <dialog
        ref={ref}
        onClick={(e) => e.target === ref.current && close()}
        className="m-auto w-[min(32rem,calc(100%-2rem))] rounded-xl p-0 text-left text-slate-900 shadow-xl backdrop:bg-slate-900/50"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h2 className="text-lg font-semibold">What to test</h2>
          <button onClick={close} aria-label="Close" className="rounded px-2 text-xl text-slate-500 hover:bg-slate-100">×</button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
          {groups.map((g) => (
            <section key={g.title} className="mb-4 last:mb-0">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{g.title}</h3>
              <ul className="space-y-1">
                {g.items.map((i) => (
                  <li key={i.text}>
                    <Link href={i.href} onClick={close} className="block rounded-lg px-3 py-2 text-sm text-teal-800 hover:bg-teal-50">
                      {i.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <p className="mt-4 text-xs text-slate-500">All data is invented. Added visits vanish on refresh.</p>
        </div>
      </dialog>
    </>
  );
}
