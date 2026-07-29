"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { weeklyAnalytics, subjectPerformance } from "./data";
import { cn } from "@/src/lib/utils";

export function ProgressAnalytics() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
         <p className="section-label mb-4">Weekly Study Hours</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyAnalytics} margin={{ left: -18, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="hoursFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
              <XAxis dataKey="day" stroke="#64748b" fontSize={13} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={13} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ stroke: "rgba(148,163,184,0.2)" }}
                contentStyle={{ background: "#1e293b", border: "1px solid #2a3852", borderRadius: 12, color: "#f8fafc", fontSize: 13 }}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={2.5} fill="url(#hoursFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:col-span-2">
         <p className="section-label mb-4">Subject Performance</p>
        <div className="space-y-3.5">
          {subjectPerformance.map((s) => (
            <div key={s.subject}>
               <div className="mb-1 flex items-center justify-between text-base">
                <span className="font-medium text-slate-300">{s.subject}</span>
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-slate-100">{s.score}</span>
                     <span className={cn("text-xs font-semibold", s.trend >= 0 ? "text-emerald-400" : "text-rose-400")}>
                    {s.trend >= 0 ? "▲" : "▼"} {Math.abs(s.trend)}%
                  </span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-700/60">
                <div className="h-full rounded-full" style={{ width: `${s.score}%`, backgroundColor: s.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
