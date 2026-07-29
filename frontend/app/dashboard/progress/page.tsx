"use client";

import { PageShell, SectionHeader, FadeIn } from "@/src/components/dashboard/PageShell";
import { studyHeatmap, monthlyPerformance, subjectBreakdown } from "@/src/components/dashboard/data";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";

const heatColor = ["#1e293b", "#3730a3", "#4f46e5", "#6366f1", "#8b5cf6"];
const WEEKS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ProgressPage() {
  return (
    <PageShell>
      <SectionHeader label="Analytics" title="Progress" />

      <div className="space-y-6">
        <FadeIn>
<div className="rounded-3xl border border-slate-800/70 bg-white/[0.02] p-10">
             <p className="section-label mb-4">Study Consistency</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {studyHeatmap.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1.5">
                  {week.map((v, di) => (
                    <div
                      key={di}
                      title={`${WEEKS[di]}: ${v * 20} min`}
                      className="heat-cell h-4 w-4"
                      style={{ backgroundColor: heatColor[v] }}
                    />
                  ))}
                </div>
              ))}
            </div>
             <div className="mt-3 flex items-center gap-2 text-base text-slate-500">
              Less
              {heatColor.map((c) => (
                <span key={c} className="h-3 w-3 rounded-sm" style={{ backgroundColor: c }} />
              ))}
              More
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FadeIn>
<div className="rounded-3xl border border-slate-800/70 bg-white/[0.02] p-10">
               <p className="section-label mb-4">Monthly Performance</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyPerformance} margin={{ left: -18, right: 8, top: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                     <XAxis dataKey="month" stroke="#64748b" fontSize={13} tickLine={false} axisLine={false} />
                     <YAxis stroke="#64748b" fontSize={13} tickLine={false} axisLine={false} />
                     <Tooltip cursor={{ fill: "rgba(148,163,184,0.08)" }} contentStyle={{ background: "#1e293b", border: "1px solid #2a3852", borderRadius: 12, color: "#f8fafc", fontSize: 13 }} />
                    <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                      {monthlyPerformance.map((_, i) => (
                        <Cell key={i} fill={i === monthlyPerformance.length - 1 ? "#8b5cf6" : "#6366f1"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>
<div className="rounded-3xl border border-slate-800/70 bg-white/[0.02] p-10">
               <p className="section-label mb-4">Subject Breakdown</p>
              <div className="space-y-4">
                {subjectBreakdown.map((s) => {
                  const max = Math.max(...subjectBreakdown.map((x) => x.hours));
                  return (
                    <div key={s.subject}>
                      <div className="mb-1 flex items-center justify-between text-base">
                        <span className="font-medium text-slate-300">{s.subject}</span>
                        <span className="font-semibold text-slate-100">{s.hours}h</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-700/60">
                        <div className="h-full rounded-full" style={{ width: `${(s.hours / max) * 100}%`, backgroundColor: s.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </PageShell>
  );
}
