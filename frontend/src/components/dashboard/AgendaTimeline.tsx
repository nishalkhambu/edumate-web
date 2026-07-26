"use client";

import { agenda } from "./data";
import { cn } from "@/src/lib/utils";
import { BookOpen, CheckSquare, GraduationCap, Zap, Clock } from "lucide-react";

const typeMeta: Record<string, { icon: React.ReactNode; chip: string; label: string }> = {
  class: { icon: <BookOpen className="h-3.5 w-3.5" />, chip: "bg-indigo-500/15 text-indigo-300", label: "Class" },
  task: { icon: <CheckSquare className="h-3.5 w-3.5" />, chip: "bg-amber-500/15 text-amber-300", label: "Task" },
  exam: { icon: <GraduationCap className="h-3.5 w-3.5" />, chip: "bg-rose-500/15 text-rose-300", label: "Exam" },
  focus: { icon: <Zap className="h-3.5 w-3.5" />, chip: "bg-violet-500/15 text-violet-300", label: "Focus" },
};

export function AgendaTimeline() {
  return (
    <div className="space-y-2">
      {agenda.map((item) => {
        const meta = typeMeta[item.type];
        return (
          <div key={item.id} className="group flex gap-4">
            <div className="flex w-14 flex-shrink-0 flex-col items-end pt-1">
              <span className="text-sm font-semibold text-slate-200">{item.time}</span>
            </div>

            <div className="relative flex flex-col items-center">
              <span
                className="mt-2 h-3 w-3 flex-shrink-0 rounded-full ring-4 ring-[#0f172a]"
                style={{ backgroundColor: item.accent }}
              />
              <span className="mt-1 w-px flex-1 bg-slate-700/60" />
            </div>

            <div className="mb-3 flex flex-1 items-center justify-between gap-3 rounded-2xl border border-slate-800/70 bg-white/[0.02] px-4 py-3 transition-all duration-200 hover:border-slate-700 hover:bg-white/[0.05]">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold", meta.chip)}>
                    {meta.icon} {meta.label}
                  </span>
                </div>
                <p className="mt-1.5 truncate text-sm font-semibold text-slate-100">{item.title}</p>
                <p className="truncate text-xs text-slate-500">{item.meta}</p>
              </div>
              <Clock className="h-4 w-4 flex-shrink-0 text-slate-600" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
