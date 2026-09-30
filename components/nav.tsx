"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { TestGuide } from "@/components/test-guide";
import { ThemeToggle } from "@/components/theme-toggle";

const ic = (d: string): ReactNode => (
  <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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
      className={`press flex items-center gap-2.5 whitespace-nowrap rounded-[7px] px-2 py-[5px] text-[13.5px] transition-colors ${
        active(n.href) ? "bg-stone-100 font-medium text-stone-900" : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
      }`}
    >
      <span className={active(n.href) ? "text-accent" : ""}>{n.icon}</span>
      {n.label}
    </Link>
  );
  return (
    <nav aria-label="Main" className="no-bar dash-b flex gap-1 overflow-x-auto px-3 py-2 md:dash-r md:w-60 md:shrink-0 md:flex-col md:overflow-visible md:border-b-0 md:p-5">
      <div className="flex shrink-0 items-center justify-between gap-2 md:pb-5">
        <div className="flex items-center gap-2 pr-2 text-[15px] font-semibold tracking-tight text-stone-900">
          <Image src="/logo-128.png" alt="" width={40} height={40} className="h-10 w-10" priority />
          Invicta
        </div>
        <div className="ml-auto hidden md:block"><ThemeToggle /></div>
      </div>
      <div className="dash-b hidden md:block" />
      <div className="hidden pt-2 md:block" />
      <TestGuide />
      {[...base, ...preview, reference].map(item)}
      <div className="ml-auto shrink-0 self-center md:hidden"><ThemeToggle /></div>
    </nav>
  );
}
