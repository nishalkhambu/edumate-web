"use client";

import { goals } from "./data";

function GoalBar({ label, pct, accent }: { label: string; pct: number; accent: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-300">{label}</span>
        <span className="font-bold text-slate-100">{pct}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-700/60">
        <div className={`h-full rounded-full ${accent}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function GoalWidget() {
  return (
    <div className="glass-card card-shadow rounded-2xl p-6">
      <h3 className="text-base font-semibold text-slate-100">Goal Progress</h3>
      <div className="mt-4 space-y-4">
        <GoalBar label="Daily Goal" pct={goals.daily} accent="bg-gradient-to-r from-indigo-500 to-violet-500" />
        <GoalBar label="Weekly Goal" pct={goals.weekly} accent="bg-gradient-to-r from-emerald-500 to-teal-500" />
      </div>
    </div>
  );
}
