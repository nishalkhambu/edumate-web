"use client";

import { exams } from "./data";
import { cn } from "@/src/lib/utils";
import { CalendarClock, ArrowUpRight } from "lucide-react";

const priority = (days: number) =>
  days <= 4
    ? { label: "High", cls: "bg-rose-500/15 text-rose-300 border-rose-500/30" }
    : days <= 8
    ? { label: "Medium", cls: "bg-amber-500/15 text-amber-300 border-amber-500/30" }
    : { label: "Low", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" };

export function ExamsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {exams.map((e) => {
        const p = priority(e.days);
        return (
          <div
            key={e.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-800/70 bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-white/[0.05]"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-600/10 blur-2xl transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500">{e.date}</p>
                <h3 className="mt-1 text-base font-semibold text-slate-100">{e.subject}</h3>
              </div>
              <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", p.cls)}>{p.label}</span>
            </div>

            <div className="relative mt-5 flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-50">{e.days}</p>
                <p className="text-xs text-slate-500">days remaining</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-indigo-300">
                <CalendarClock className="h-3.5 w-3.5" /> Countdown
              </div>
            </div>

            <div className="relative mt-4">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-slate-400">Revision progress</span>
                <span className="font-semibold text-slate-200">{e.prep}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-700/60">
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${e.prep}%` }} />
              </div>
            </div>

            <button className="relative mt-4 flex w-full items-center justify-center gap-1 rounded-xl border border-slate-700/70 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-indigo-500/50 hover:text-indigo-200">
              Start revision <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
