"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { patients as seed, type Patient, type Visit } from "@/lib/mock";

// In-memory only. A page refresh resets the demo.
type Ctx = { patients: Patient[]; addVisit: (patientId: string, visit: Visit) => void };
const DemoCtx = createContext<Ctx | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(seed);
  const addVisit = (patientId: string, visit: Visit) =>
    setPatients((all) => all.map((p) => (p.id === patientId ? { ...p, visits: [...p.visits, visit] } : p)));
  return <DemoCtx.Provider value={{ patients, addVisit }}>{children}</DemoCtx.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoCtx);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}
