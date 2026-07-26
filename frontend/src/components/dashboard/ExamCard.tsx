"use client";

import { exams } from "./data";

export function ExamCard() {
  return (
    <div className="glass-card card-shadow rounded-2xl p-6">
      <h3 className="text-base font-semibold text-slate-100">Upcoming Exams</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {exams.map((e) => (
          <div
            key={e.id}
            className="rounded-xl border border-slate-700/60 bg-white/[0.03] p-4 transition-all hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-white/[0.06]"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-rose-500/15 px-2 py-1 text-xs font-bold text-rose-300">
                {e.date}
              </span>
              <span className="text-xs font-medium text-amber-300">{e.days}d left</span>
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-100">{e.subject}</p>
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>Preparation</span>
                <span className="font-semibold text-slate-200">{e.prep}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-700/60">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                  style={{ width: `${e.prep}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
