"use client";

import { useState } from "react";
import { tasks as initialTasks } from "./data";
import { Check } from "lucide-react";

export function TaskWidget() {
  const [state, setState] = useState<Record<number, boolean>>(
    () => Object.fromEntries(initialTasks.map((t) => [t.id, t.done]))
  );
  const toggle = (id: number) => setState((p) => ({ ...p, [id]: !p[id] }));
  const done = Object.values(state).filter(Boolean).length;
  const total = initialTasks.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="glass-card card-shadow rounded-2xl p-6">
      <h3 className="text-base font-semibold text-slate-100">Task Overview</h3>
      <div className="mt-3 flex items-center gap-4">
        <div className="relative h-16 w-16">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={94.2} strokeDashoffset={94.2 - (pct / 100) * 94.2}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-100">{pct}%</span>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-slate-100">{done} completed</p>
          <p className="text-slate-400">{total - done} pending</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {initialTasks.map((t) => (
          <button
            key={t.id}
            onClick={() => toggle(t.id)}
            className="flex w-full items-center gap-3 rounded-xl border border-slate-700/60 bg-white/[0.03] px-3 py-2.5 text-left transition-colors hover:border-indigo-500/40"
          >
            <span
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                state[t.id] ? "border-emerald-500 bg-emerald-500" : "border-slate-500"
              }`}
            >
              {state[t.id] && <Check className="h-3 w-3 text-white" />}
            </span>
            <span className={`flex-1 truncate text-sm ${state[t.id] ? "text-slate-500 line-through" : "text-slate-200"}`}>
              {t.title}
            </span>
            <span className="text-[11px] text-slate-500">{t.due.split(",")[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
