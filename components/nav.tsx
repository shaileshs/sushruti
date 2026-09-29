"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const ic = (d: string): ReactNode => (
  <svg viewBox="0 0 20 20" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);
type Item = { href: string; label: string; icon: ReactNode };
const base: Item[] = [{ href: "/", label: "Patients", icon: ic("M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 17c0-3 2-5 5-5s5 2 5 5M14 4a2.5 2.5 0 0 1 0 5M15 12c2 .4 3 2 3 5") }];
const preview: Item[] = [
  { href: "/remedies", label: "Remedy library", icon: ic("M4 3h9a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2V3ZM4 15a2 2 0 0 1 2-2h9") },
  { href: "/endoscopy", label: "Endoscopy reader", icon: ic("M5 2h7l4 4v12H5V2ZM12 2v4h4M8 10h5M8 13h5") },
  { href: "/match", label: "Remedy match", icon: ic("M3 10h4l2-5 3 10 2-5h3") },
  { href: "/analytics", label: "Analytics", icon: ic("M3 17V9M8 17V4M13 17v-6M18 17V7") },
  { href: "/export", label: "Research export", icon: ic("M10 3v10M6 9l4 4 4-4M4 16h12") },
];
const reference: Item = { href: "/docs", label: "Project documents", icon: ic("M6 2h8l3 3v13H6V2ZM9 8h5M9 11h5M9 14h3") };

export function Nav() {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" || path.startsWith("/patients") : path.startsWith(href));
  const item = (n: Item) => (
    <Link
      key={n.href}
      href={n.href}
      aria-current={active(n.href) ? "page" : undefined}
      className={`press relative flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
        active(n.href) ? "bg-teal-50 text-teal-900 md:before:absolute md:before:-left-4 md:before:top-2 md:before:h-5 md:before:w-1 md:before:rounded-r md:before:bg-teal-600" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {n.icon}
      {n.label}
    </Link>
  );
  const head = (t: string, pt = "pt-5") => <div className={`hidden px-3 pb-1 ${pt} text-[11px] font-semibold uppercase tracking-wider text-slate-400 md:block`}>{t}</div>;
  return (
    <nav aria-label="Main" className="no-bar flex gap-1 overflow-x-auto border-b border-slate-200 bg-white/80 px-3 py-2 backdrop-blur md:w-60 md:shrink-0 md:flex-col md:overflow-visible md:border-b-0 md:border-r md:p-4">
      <div className="flex shrink-0 items-center gap-2 px-3 py-2 text-lg font-semibold text-teal-900 md:pb-3 md:pt-0">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-800 text-sm text-white shadow">I</span>
        Invicta
      </div>
      {head("Base module", "pt-1")}
      {base.map(item)}
      {head("Preview only")}
      {preview.map(item)}
      {head("Reference")}
      {item(reference)}
    </nav>
  );
}
