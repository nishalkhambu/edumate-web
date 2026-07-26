"use client";

import { useState } from "react";

type MarkerType = "exam" | "task" | "session";

const WEEK = ["S", "M", "T", "W", "T", "F", "S"] as const;
// sample markers: day-of-month -> type
const markers: { [day: number]: MarkerType } = {
  4: "session",
  8: "task",
  11: "exam",
  15: "session",
  18: "task",
  22: "exam",
  25: "exam",
};

const dotColor = {
  exam: "bg-rose-400",
  task: "bg-amber-400",
  session: "bg-indigo-400",
};

export function MiniCalendar() {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const firstDay = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const monthName = new Date(view.y, view.m, 1).toLocaleString("en-US", { month: "long" });

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="glass-card card-shadow rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-100">{monthName} {view.y}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { ...v, m: v.m - 1 }))}
            className="rounded-lg border border-slate-700 bg-white/5 px-2 py-1 text-xs text-slate-300 hover:bg-white/10"
          >
            ‹
          </button>
          <button
            onClick={() => setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { ...v, m: v.m + 1 }))}
            className="rounded-lg border border-slate-700 bg-white/5 px-2 py-1 text-xs text-slate-300 hover:bg-white/10"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-slate-500">
        {WEEK.map((d, i) => (
          <div key={i} className="py-1">{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const isToday = day === today.getDate() && view.m === today.getMonth() && view.y === today.getFullYear();
          const mk = markers[day];
          return (
            <div
              key={i}
              className={`relative flex h-9 items-center justify-center rounded-lg text-xs transition-colors ${
                isToday ? "gradient-primary font-bold text-white" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              {day}
              {mk && (
                <span className={`absolute bottom-1 h-1 w-1 rounded-full ${dotColor[mk]}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-slate-400">
        <Legend color="bg-rose-400" label="Exam" />
        <Legend color="bg-amber-400" label="Task" />
        <Legend color="bg-indigo-400" label="Session" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${color}`} /> {label}
    </span>
  );
}
