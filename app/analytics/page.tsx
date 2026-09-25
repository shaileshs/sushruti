"use client";

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, PageHeader, PreviewNote } from "@/components/ui";
import { monthlyVisits, outcomeTrend, prescriptionMix } from "@/lib/mock";

const grid = <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />;

export default function Analytics() {
  return (
    <>
      <PageHeader title="Research analytics" sub="Live view of prescriptions and outcomes across your cases." />
      <PreviewNote>Numbers are invented. Real curves need real follow-up data, so early charts will be sparse.</PreviewNote>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Prescriptions by remedy">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prescriptionMix} layout="vertical" margin={{ left: 24, right: 12 }}>
                {grid}
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="remedy" width={110} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#0f766e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Visits per month">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyVisits} margin={{ right: 12 }}>
                {grid}
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="visits" fill="#0369a1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Change in lesion size by remedy (%)" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={outcomeTrend} margin={{ right: 12 }}>
                {grid}
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="arsenicum" name="Arsenicum album" stroke="#0f766e" strokeWidth={2.5} />
                <Line type="monotone" dataKey="phosphorus" name="Phosphorus" stroke="#b45309" strokeWidth={2.5} />
                <Line type="monotone" dataKey="nitricum" name="Nitricum acidum" stroke="#6d28d9" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">Curves show association in a small, uncontrolled group. They do not show that a remedy caused the change.</p>
        </Card>
      </div>
    </>
  );
}
