"use client";

import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, PageHeader, PreviewNote } from "@/components/ui";
import { CountUp } from "@/components/viz";
import { monthlyVisits, outcomeTrend, prescriptionMix } from "@/lib/mock";

const grid = <CartesianGrid vertical={false} stroke="var(--color-line)" strokeDasharray="3 4" />;
const axis = { tick: { fontSize: 11, fill: "var(--color-stone-500)" }, axisLine: false, tickLine: false } as const;
const shades = ["#5f7a58", "#4c6649", "#5f7a58", "#788969", "#a4b89e", "#c8d5c2"];

// One tooltip style for every chart on this page.
const tip = (unit = "") => (
  <Tooltip
    cursor={{ fill: "rgb(15 118 110 / 0.06)" }}
    content={(p) =>
      p.active && p.payload?.length ? (
        <div className="rounded-xl border border-line bg-surface px-3 py-2 text-xs shadow-lg">
          <div className="mb-0.5 text-stone-500">{p.label ?? p.payload[0].payload.remedy}</div>
          {p.payload.map((x) => (
            <div key={String(x.dataKey)} className="tnum font-semibold" style={{ color: x.color ?? x.payload?.fill }}>{x.name === "count" || x.name === "visits" ? "" : `${x.name}: `}{x.value}{unit}</div>
          ))}
        </div>
      ) : null
    }
  />
);

const kpis = [
  { label: "Prescriptions", value: prescriptionMix.reduce((a, b) => a + b.count, 0), note: "all time" },
  { label: "Visits this month", value: monthlyVisits[monthlyVisits.length - 1].visits, note: "September" },
  { label: "Median size change", value: 24, unit: "%", note: "smaller at month 5" },
];

export default function Analytics() {
  return (
    <>
      <PageHeader title="Research analytics" sub="Live view of prescriptions and outcomes across your cases." />
      <PreviewNote>Numbers are invented. Real curves need real follow-up data, so early charts will be sparse.</PreviewNote>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {kpis.map((k, i) => (
          <div key={k.label} className="rise lift rounded-2xl border border-line bg-surface/90 p-4" style={{ "--i": i } as React.CSSProperties}>
            <p className="text-xs font-semibold text-stone-500">{k.label}</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight"><CountUp to={k.value} />{k.unit}</p>
            <p className="text-xs text-stone-500">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Prescriptions by remedy">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prescriptionMix} layout="vertical" margin={{ left: 24, right: 12 }}>
                <CartesianGrid horizontal={false} stroke="var(--color-line)" strokeDasharray="3 4" />
                <XAxis type="number" {...axis} />
                <YAxis type="category" dataKey="remedy" width={110} {...axis} />
                {tip()}
                <Bar dataKey="count" radius={[0, 8, 8, 0]} animationDuration={900}>
                  {prescriptionMix.map((_, i) => <Cell key={i} fill={shades[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Visits per month">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyVisits} margin={{ right: 12, left: -14 }}>
                {grid}
                <XAxis dataKey="month" {...axis} />
                <YAxis {...axis} />
                {tip()}
                <Bar dataKey="visits" fill="#c8903a" radius={[8, 8, 0, 0]} animationDuration={900} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Change in lesion size by remedy (%)" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={outcomeTrend} margin={{ right: 12, left: -10 }}>
                {grid}
                <XAxis dataKey="month" {...axis} />
                <YAxis {...axis} unit="%" />
                {tip("%")}
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="arsenicum" name="Arsenicum album" stroke="#5f7a58" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} animationDuration={1000} />
                <Line type="monotone" dataKey="phosphorus" name="Phosphorus" stroke="#c8903a" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} animationDuration={1000} />
                <Line type="monotone" dataKey="nitricum" name="Nitricum acidum" stroke="#b4553a" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} animationDuration={1000} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-stone-500">Curves show association in a small, uncontrolled group. They do not show that a remedy caused the change.</p>
        </Card>
      </div>
    </>
  );
}
