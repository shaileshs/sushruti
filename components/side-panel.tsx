"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Slides in over the page so the user keeps the form behind it.
export function SidePanel({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => { window.removeEventListener("keydown", esc); prev?.focus(); };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} className="rise absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col border-l border-line bg-page shadow-2xl focus:outline-none">
        <div className="dash-b flex items-center justify-between gap-3 px-5 py-3">
          <h2 className="text-[15px] font-semibold text-stone-900">{title}</h2>
          <button type="button" onClick={onClose} className="press rounded-full px-3 py-1 text-sm text-stone-600 hover:bg-stone-100">Close ✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
