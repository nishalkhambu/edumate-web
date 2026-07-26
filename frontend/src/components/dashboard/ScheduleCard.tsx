"use client";

import { schedule } from "./data";

const statusStyles: Record<string, { dot: string; label: string; chip: string }> = {
  done: { dot: "bg-emerald-400", label: "Completed", chip: "bg-emerald-500/15 text-emerald-300" },
  live: { dot: "bg-rose-400 animate-pulse", label: "Live now", chip: "bg-rose-500/15 text-rose-300" },
  upcoming: { dot: "bg-slate-500", label: "Upcoming", chip: "bg-slate-500/15 text-slate-300" },
};

export function ScheduleCard() {
  return (
    <div className="glass-card card-shadow rounded-2xl p-6">
      <h3 className="text-base font-semibold text-slate-100">Today&apos;s Schedule</h3>
      <div className="mt-4 space-y-1">
        {schedule.map((s, i) => {
          const st = statusStyles[s.status];
          return (
            <div key={i} className="relative flex gap-4 pb-5 last:pb-0">
              <div className="flex flex-col items-center">
                <span className={`mt-1 h-3 w-3 rounded-full ${st.dot} ring-4 ring-indigo-500/10`} />
                {i < schedule.length - 1 && <span className="mt-1 w-px flex-1 bg-slate-700/70" />}
              </div>
              <div className="flex flex-1 items-center justify-between rounded-xl border border-slate-700/60 bg-white/[0.03] px-4 py-3 transition-colors hover:border-indigo-500/40 hover:bg-white/[0.06]">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-100">{s.subject}</p>
                  <p className="truncate text-xs text-slate-400">{s.topic}</p>
                </div>
                <div className="ml-3 flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-200">{s.time}</span>
                  <span className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.chip}`}>
                    {st.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
