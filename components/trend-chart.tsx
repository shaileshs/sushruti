"use client";

import { useId } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function TrendChart({
  data,
  dataKey,
  unit,
  domain,
  color,
}: {
  data: { date: string; [k: string]: number | string }[];
  dataKey: string;
  unit: string;
  domain?: [number, number];
  color: string;
}) {
  const gid = `g${useId().replace(/\W/g, "")}`;
  if (data.length < 2) return <p className="py-10 text-center text-sm text-stone-500">Add one more visit to see a trend.</p>;
  return (
    <div className="h-52">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 14, bottom: 0, left: -14 }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.32} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--color-line)" strokeDasharray="3 4" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--color-stone-500)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "var(--color-stone-500)" }} domain={domain} unit={unit} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ stroke: color, strokeDasharray: "4 4", strokeOpacity: 0.5 }}
            content={(p) =>
              p.active && p.payload?.length ? (
                <div className="rounded-xl border border-line bg-surface px-3 py-2 text-xs shadow-lg">
                  <div className="text-stone-500">{p.label}</div>
                  <div className="text-base font-semibold tnum" style={{ color }}>{p.payload[0].value}{unit}</div>
                </div>
              ) : null
            }
          />
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#${gid})`} dot={{ r: 4, fill: "var(--color-surface)", stroke: color, strokeWidth: 2 }} activeDot={{ r: 6, fill: color, stroke: "var(--color-surface)", strokeWidth: 2 }} animationDuration={900} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
