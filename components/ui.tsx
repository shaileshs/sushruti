import type { ReactNode } from "react";

export function PageHeader({ title, sub, action, no }: { title: string; sub?: string; action?: ReactNode; no?: string }) {
  return (
    <div className="rise dash-b mb-8 flex flex-wrap items-end justify-between gap-3 pb-6">
      <div>
        <h1 className="flex items-baseline gap-3 text-2xl font-semibold text-stone-900 md:text-[28px]">
          {no && <span className="font-mono text-xs font-normal tracking-normal text-stone-400">{no}</span>}
          {title}
        </h1>
        {sub && <p className="mt-2 max-w-2xl text-sm text-stone-500">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-line bg-surface p-4 md:p-5 ${className}`}>
      {title && <h2 className="mb-3 text-[13px] font-semibold text-stone-900">{title}</h2>}
      {children}
    </section>
  );
}

export function PreviewNote({ children }: { children: ReactNode }) {
  return (
    <p className="rise mb-6 flex items-start gap-2.5 rounded-xl border border-dashed border-line-strong bg-stone-50 px-3 py-2.5 text-[13px] text-stone-600">
      <span className="mt-px rounded-full bg-gold-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold-800">Preview</span>
      <span>{children}</span>
    </p>
  );
}

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
export const btn = `press inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2 text-[13.5px] font-medium text-on-accent hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${focus}`;
export const btnGhost = `press inline-flex items-center justify-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2 text-[13.5px] font-medium text-stone-800 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50 ${focus}`;
export const input =
  "w-full rounded-xl border border-line-strong bg-surface px-3 py-2.5 text-sm text-stone-900 transition placeholder:text-stone-400 hover:border-stone-400 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15";
