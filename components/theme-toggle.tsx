"use client";

import { useSyncExternalStore } from "react";

// The <html> class is the source of truth. layout.tsx sets it before first paint, so there is no flash.
const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
};
const isDark = () => document.documentElement.classList.contains("dark");

const sun = "M10 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.3 4.3l1 1M14.7 14.7l1 1M15.7 4.3l-1 1M5.3 14.7l-1 1";
const moon = "M16.5 11.5A6.5 6.5 0 0 1 8.5 3.5a6.5 6.5 0 1 0 8 8Z";

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);
  const set = (d: boolean) => {
    document.documentElement.classList.toggle("dark", d);
    try { localStorage.setItem("theme", d ? "dark" : "light"); } catch {}
  };
  const seg = (on: boolean) => `press flex h-6 w-6 items-center justify-center rounded-full transition-colors ${on ? "bg-surface text-stone-900 ring-1 ring-line-strong" : "text-stone-400 hover:text-stone-700"}`;
  const ic = (d: string) => (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>
  );
  return (
    <div role="group" aria-label="Theme" className="flex items-center gap-0.5 rounded-full bg-stone-100 p-0.5 ring-1 ring-line">
      <button type="button" aria-label="Light theme" aria-pressed={!dark} onClick={() => set(false)} className={seg(!dark)}>{ic(sun)}</button>
      <button type="button" aria-label="Dark theme" aria-pressed={dark} onClick={() => set(true)} className={seg(dark)}>{ic(moon)}</button>
    </div>
  );
}
