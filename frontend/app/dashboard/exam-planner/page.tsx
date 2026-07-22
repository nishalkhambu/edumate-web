"use client";

import { PageShell, SectionHeader, FadeIn } from "@/src/components/dashboard/PageShell";
import { examDetail } from "@/src/components/dashboard/data";
import { cn } from "@/src/lib/utils";
import { CalendarClock, BookOpen, Target } from "lucide-react";

const priorityMeta: Record<string, string> = {
  High: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  Medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Low: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

export default function ExamPlannerPage() {
  return (
    <PageShell>
      <SectionHeader label="Preparation" title="Exam Planner" />

      <FadeIn>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {examDetail.map((e) => {
            const syllabusPct = Math.round((e.completed / e.syllabus) * 100);
            return (
              <div key={e.id} className="group relative overflow-hidden rounded-3xl border border-slate-800/70 bg-white/[0.02] p-6 transition-all hover:border-slate-700 hover:bg-white/[0.05]">
                <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-indigo-600/10 blur-2xl" />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500">{e.date}</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-100">{e.subject}</h3>
                  </div>
                  <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", priorityMeta[e.priority])}>{e.priority}</span>
                </div>

                <div className="relative mt-5 flex items-end gap-2">
                  <span className="text-4xl font-bold text-slate-50">{e.days}</span>
                  <span className="mb-1 text-xs text-slate-400">days to go</span>
                  <CalendarClock className="mb-1 ml-auto h-5 w-5 text-indigo-300" />
                </div>

                <div className="relative mt-5 space-y-4">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-slate-400"><BookOpen className="h-3.5 w-3.5" /> Syllabus</span>
                      <span className="font-semibold text-slate-200">{syllabusPct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-700/60">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${syllabusPct}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-slate-400"><Target className="h-3.5 w-3.5" /> Revision</span>
                      <span className="font-semibold text-slate-200">{e.prep}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-700/60">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${e.prep}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </FadeIn>
    </PageShell>
  );
}
