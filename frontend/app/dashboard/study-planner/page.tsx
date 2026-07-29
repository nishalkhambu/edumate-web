"use client";

import { useState, useEffect } from "react";
import { PageShell, SectionHeader, FadeIn } from "@/src/components/dashboard/PageShell";
import {
  createStudyPlanAction,
  deleteStudyPlanAction,
  listStudyPlansAction,
  updateStudyPlanAction,
} from "@/src/actions/study.actions";
import type { AuthActionResult } from "@/src/types/auth.types";
import type { StudyPlan } from "@/src/api/study.api";

export default function StudyPlannerPage() {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<StudyPlan | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subject: "",
    topic: "",
    deadline: "",
    progress: "0",
  });

  const loadPlans = async () => {
    setLoading(true);
    const result = await listStudyPlansAction();
    if (result.success && "data" in result) {
      setPlans(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const openCreate = () => {
    setEditingPlan(null);
    setForm({ title: "", subject: "", topic: "", deadline: "", progress: "0" });
    setShowModal(true);
  };

  const openEdit = (plan: StudyPlan) => {
    setEditingPlan(plan);
    setForm({
      title: plan.title,
      subject: plan.subject,
      topic: plan.topic,
      deadline: plan.deadline.slice(0, 10),
      progress: String(plan.progress),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: form.title,
      subject: form.subject,
      topic: form.topic,
      deadline: new Date(form.deadline).toISOString(),
      progress: Number(form.progress),
    };

    if (editingPlan) {
      const result = await updateStudyPlanAction(editingPlan.id, payload);
      if (result.success && "data" in result) {
        setPlans((prev) => prev.map((p) => (p.id === editingPlan.id ? result.data : p)));
      }
    } else {
      const result = await createStudyPlanAction(payload);
      if (result.success && "data" in result) {
        setPlans((prev) => [...prev, result.data]);
      }
    }

    setSubmitting(false);
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteStudyPlanAction(id);
    if (result.success) {
      setPlans((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <PageShell>
      <FadeIn>
        <SectionHeader
          label="Planning"
          title="Study Planner"
          action={
             <button
               onClick={openCreate}
               className="rounded-xl border border-indigo-500/40 bg-indigo-500/20 px-4 py-2 text-base font-semibold text-indigo-200 transition-colors hover:bg-indigo-500/30"
             >
              Create Plan
            </button>
          }
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="glass-card card-shadow rounded-3xl border border-slate-800/70">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />
            </div>
          ) : plans.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <p>No study plans yet. Create your first plan to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/70">
              {plans.map((plan) => (
                 <div
                   key={plan.id}
                   className="flex flex-col gap-3 p-8 sm:flex-row sm:items-center sm:justify-between"
                 >
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-slate-100">
                      {plan.title}
                    </h3>
                     <p className="mt-1 text-base text-slate-400">
                       {plan.subject} • {plan.topic}
                     </p>
<p className="mt-1 text-sm text-slate-500">
                       Deadline: {new Date(plan.deadline).toLocaleDateString()}
                     </p>
                  </div>
                  <div className="flex w-full items-center gap-4 sm:w-auto">
                    <div className="flex-1 sm:w-40">
               <div className="flex items-center justify-between text-sm text-slate-400">
                         <span>Progress</span>
                         <span>{plan.progress}%</span>
                       </div>
                      <div className="mt-1 h-2 rounded-full bg-slate-800">
                        <div
                          className="h-2 rounded-full gradient-primary"
                          style={{ width: `${Math.min(plan.progress, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button
                         onClick={() => openEdit(plan)}
                         className="rounded-lg border border-slate-700 bg-white/5 px-3 py-1.5 text-base font-medium text-slate-300 transition-colors hover:border-indigo-500/50 hover:text-indigo-200"
                       >
                         Edit
                       </button>
                       <button
                         onClick={() => handleDelete(plan.id)}
                         className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-base font-medium text-rose-300 transition-colors hover:bg-rose-500/20"
                       >
                         Delete
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </FadeIn>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
               <div className="w-full max-w-lg rounded-2xl border border-slate-800/70 bg-[#1e293b] p-8">
            <h3 className="text-lg font-semibold text-slate-100">
              {editingPlan ? "Edit Study Plan" : "Create Study Plan"}
            </h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
               <label className="mb-2 block text-base font-medium text-slate-300">Title</label>
                 <input
                   value={form.title}
                   onChange={(e) => setForm({ ...form, title: e.target.value })}
                   className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
                   required
                 />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                 <label className="mb-2 block text-base font-medium text-slate-300">Subject</label>
                   <input
                     value={form.subject}
                     onChange={(e) => setForm({ ...form, subject: e.target.value })}
                     className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
                     required
                   />
                </div>
                <div>
                 <label className="mb-2 block text-base font-medium text-slate-300">Topic</label>
                   <input
                     value={form.topic}
                     onChange={(e) => setForm({ ...form, topic: e.target.value })}
                     className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
                     required
                   />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                 <label className="mb-2 block text-base font-medium text-slate-300">Deadline</label>
                   <input
                     type="date"
                     value={form.deadline}
                     onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                     className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
                     required
                   />
                </div>
                <div>
                 <label className="mb-2 block text-base font-medium text-slate-300">Progress %</label>
                   <input
                     type="number"
                     min="0"
                     max="100"
                     value={form.progress}
                     onChange={(e) => setForm({ ...form, progress: e.target.value })}
                     className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
                     required
                   />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                 <button
                   type="button"
                   onClick={() => setShowModal(false)}
                   className="rounded-xl border border-slate-700 bg-white/5 px-4 py-2 text-base font-medium text-slate-300 transition-colors hover:bg-white/10"
                 >
                   Cancel
                 </button>
                 <button
                   type="submit"
                   disabled={submitting}
                   className="rounded-xl gradient-primary px-4 py-2 text-base font-semibold text-white shadow-lg shadow-indigo-900/40 transition-opacity hover:opacity-90 disabled:opacity-60"
                 >
                  {submitting ? "Saving..." : editingPlan ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageShell>
  );
}
