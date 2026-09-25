"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const base = [{ href: "/", label: "Patients" }];
const preview = [
  { href: "/remedies", label: "Remedy library" },
  { href: "/endoscopy", label: "Endoscopy reader" },
  { href: "/match", label: "Remedy match" },
  { href: "/analytics", label: "Analytics" },
  { href: "/export", label: "Research export" },
];

export function Nav() {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" || path.startsWith("/patients") : path.startsWith(href));
  const item = (n: { href: string; label: string }) => (
    <Link
      key={n.href}
      href={n.href}
      className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${
        active(n.href) ? "bg-teal-700 text-white" : "text-slate-700 hover:bg-slate-200"
      }`}
    >
      {n.label}
    </Link>
  );
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 md:w-60 md:shrink-0 md:flex-col md:overflow-visible md:border-b-0 md:border-r md:p-4">
      <div className="shrink-0 px-3 py-2 text-lg font-semibold text-teal-800 md:pb-4 md:pt-0">Invicta</div>
      <div className="hidden px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 md:block">Base module</div>
      {base.map(item)}
      <div className="hidden px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-slate-500 md:block">
        Preview only
      </div>
      {preview.map(item)}
      <div className="hidden px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-slate-500 md:block">
        Reference
      </div>
      {item({ href: "/docs", label: "Project documents" })}
    </nav>
  );
}
