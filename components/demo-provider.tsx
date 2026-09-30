"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { patients as seed, type Patient, type Visit } from "@/lib/mock";

// In-memory only. A page refresh resets the demo.
type Ctx = {
  patients: Patient[];
  addVisit: (patientId: string, visit: Visit) => void;
  notify: (message: string) => void;
};
const DemoCtx = createContext<Ctx | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(seed);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addVisit = (patientId: string, visit: Visit) =>
    setPatients((all) => all.map((p) => (p.id === patientId ? { ...p, visits: [...p.visits, visit] } : p)));
  const notify = (text: string) => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ id: Date.now(), text });
    timer.current = setTimeout(() => setToast(null), 3200);
  };

  return (
    <DemoCtx.Provider value={{ patients, addVisit, notify }}>
      {children}
      {toast && (
        <div key={toast.id} role="status" className="toast fixed bottom-24 left-1/2 z-50 flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 text-sm text-white shadow-2xl lg:bottom-8">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs">✓</span>
          {toast.text}
        </div>
      )}
    </DemoCtx.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoCtx);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}
