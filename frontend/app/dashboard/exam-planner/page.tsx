"use client";

import { useEffect, useState } from "react";
import { PageShell, SectionHeader, FadeIn } from "@/src/components/dashboard/PageShell";
import { listExamPlansAction, createExamPlanAction } from "@/src/actions/study.actions";
import type { ExamPlanItem } from "@/src/api/study.api";
import { cn } from "@/src/lib/utils";
import { CalendarClock, BookOpen, Target, Plus } from "lucide-react";

const priorityMeta: Record<string, string> = {
  High: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  Medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Low: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

export default function ExamPlannerPage() {
  const [plans, setPlans] = useState<ExamPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: "", date: "", days: 7, prep: 0, priority: "Medium", syllabus: 100, completed: 0 });

  const load = async () => {
    setLoading(true);
    const result = await listExamPlansAction();
    if (result.success && "data" in result) {
      setPlans(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await createExamPlanAction(form);
    if (result.success && "data" in result) {
      setPlans((prev) => [result.data, ...prev]);
      setShowForm(false);
      setForm({ subject: "", date: "", days: 7, prep: 0, priority: "Medium", syllabus: 100, completed: 0 });
    }
    setSubmitting(false);
  };

  return (
    <PageShell>
      <SectionHeader
        label="Preparation"
        title="Exam Planner"
        action={
             <button onClick={() => setShowForm((v) => !v)} className="flex items-center gap-1.5 rounded-xl gradient-primary px-3 py-2 text-base font-semibold text-white">
            <Plus className="h-4 w-4" /> Add Exam
          </button>
        }
      />

      {showForm && (
        <FadeIn delay={0.05}>
           <form onSubmit={handleSubmit} className="glass-card card-shadow mb-6 rounded-3xl border border-slate-800/70 p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
             <label className="mb-2 block text-base font-medium text-slate-300">Subject</label>
                 <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500" required />
              </div>
              <div>
             <label className="mb-2 block text-base font-medium text-slate-300">Date</label>
                 <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500" />
              </div>
              <div>
             <label className="mb-2 block text-base font-medium text-slate-300">Days Left</label>
                 <input type="number" value={form.days} onChange={(e) => setForm({ ...form, days: Number(e.target.value) })} className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500" />
              </div>
              <div>
             <label className="mb-2 block text-base font-medium text-slate-300">Priority</label>
                 <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500">
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
             <label className="mb-2 block text-base font-medium text-slate-300">Syllabus %</label>
                 <input type="number" value={form.syllabus} onChange={(e) => setForm({ ...form, syllabus: Number(e.target.value) })} className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
               <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-700 bg-white/5 px-4 py-2 text-base font-medium text-slate-300 transition-colors hover:bg-white/10">Cancel</button>
               <button type="submit" disabled={submitting} className="rounded-xl gradient-primary px-4 py-2 text-base font-semibold text-white shadow-lg shadow-indigo-900/40 transition-opacity hover:opacity-90 disabled:opacity-60">{submitting ? "Saving..." : "Add Exam"}</button>
            </div>
          </form>
        </FadeIn>
      )}

      <FadeIn delay={0.05}>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />
            </div>
          ) : plans.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-400">No exams yet. Add your first exam above.</div>
          ) : (
            plans.map((e) => {
              const syllabusPct = e.syllabus > 0 ? Math.round((e.completed / e.syllabus) * 100) : 0;
              return (
                 <div key={e.id} className="group relative overflow-hidden rounded-3xl border border-slate-800/70 bg-white/[0.02] p-10 transition-all hover:border-slate-700 hover:bg-white/[0.05]">
                  <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-indigo-600/10 blur-2xl" />
                  <div className="relative flex items-start justify-between">
                    <div>
<p className="text-base text-slate-500">{e.date}</p>
                       <h3 className="mt-1 text-xl font-semibold text-slate-100">{e.subject}</h3>
                    </div>
                       <span className={cn("rounded-full border px-2.5 py-0.5 text-sm font-semibold", priorityMeta[e.priority])}>{e.priority}</span>
                  </div>

                  <div className="relative mt-5 flex items-end gap-2">
                    <span className="text-4xl font-bold text-slate-50">{e.days}</span>
                    <span className="mb-1 text-sm text-slate-400">days to go</span>
                    <CalendarClock className="mb-1 ml-auto h-5 w-5 text-indigo-300" />
                  </div>

                  <div className="relative mt-5 space-y-4">
                    <div>
<div className="mb-1 flex items-center justify-between text-base">
                          <span className="flex items-center gap-1 text-slate-400"><BookOpen className="h-3.5 w-3.5" /> Syllabus</span>
                          <span className="font-semibold text-slate-200">{syllabusPct}%</span>
                        </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-700/60">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${syllabusPct}%` }} />
                      </div>
                    </div>
                    <div>
<div className="mb-1 flex items-center justify-between text-base">
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
            })
          )}
        </div>
      </FadeIn>
    </PageShell>
  );
}
