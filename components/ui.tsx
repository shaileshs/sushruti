import type { ReactNode } from "react";

export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="rise mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">{title}</h1>
        {sub && <p className="mt-1 max-w-2xl text-sm text-slate-600">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_1px_2px_rgb(15_23_42/0.04),0_10px_28px_-16px_rgb(15_23_42/0.12)] backdrop-blur ${className}`}>
      {title && <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</h2>}
      {children}
    </section>
  );
}

export function PreviewNote({ children }: { children: ReactNode }) {
  return (
    <p className="rise mb-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2.5 text-sm text-amber-900">
      <span className="mt-0.5 rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Preview</span>
      <span>{children}</span>
    </p>
  );
}

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600";
export const btn = `press inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-teal-600 to-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-900/25 ring-1 ring-inset ring-white/10 hover:from-teal-500 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50 ${focus}`;
export const btnGhost = `press inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 ${focus}`;
export const input =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-600/15";
