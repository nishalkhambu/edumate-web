"use client";

import { useState, useEffect } from "react";
import { PageShell, SectionHeader, FadeIn } from "@/src/components/dashboard/PageShell";
import {
  createGoalAction,
  listGoalsAction,
  updateGoalAction,
} from "@/src/actions/study.actions";
import type { Goal } from "@/src/api/study.api";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    target: "",
    unit: "",
    type: "weekly" as Goal["type"],
    deadline: "",
  });

  const loadGoals = async () => {
    setLoading(true);
    const result = await listGoalsAction();
    if (result.success && "data" in result) {
      setGoals(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await createGoalAction({
      title: form.title,
      description: form.description || undefined,
      target: Number(form.target),
      unit: form.unit,
      type: form.type,
      deadline: form.deadline || undefined,
    });
    setSubmitting(false);
    if (result.success && "data" in result) {
      setGoals((prev) => [...prev, result.data]);
      setForm({ title: "", description: "", target: "", unit: "", type: "weekly", deadline: "" });
      setShowForm(false);
    }
  };

  const handleProgress = async (goal: Goal, delta: number) => {
    const newCurrent = Math.max(0, Math.min(goal.target, goal.current + delta));
    const optimistic = { ...goal, current: newCurrent };
    setGoals((prev) =>
      prev.map((g) => (g.id === goal.id ? optimistic : g))
    );
    try {
      await updateGoalAction(goal.id, { current: newCurrent });
    } catch {
      setGoals((prev) =>
        prev.map((g) => (g.id === goal.id ? goal : g))
      );
    }
  };

  return (
    <PageShell>
      <FadeIn>
        <SectionHeader
          label="Tracking"
          title="Goals"
          action={
            <button
              onClick={() => setShowForm((v) => !v)}
              className="rounded-xl border border-indigo-500/40 bg-indigo-500/20 px-4 py-2 text-sm font-semibold text-indigo-200 transition-colors hover:bg-indigo-500/30"
            >
              {showForm ? "Close" : "Add Goal"}
            </button>
          }
        />
      </FadeIn>

      {showForm && (
        <FadeIn delay={0.05}>
           <form
             onSubmit={handleSubmit}
             className="glass-card card-shadow mb-6 rounded-3xl border border-slate-800/70 p-8"
           >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
             <label className="mb-2 block text-base font-medium text-slate-300">Title</label>
                 <input
                   value={form.title}
                   onChange={(e) => setForm({ ...form, title: e.target.value })}
                   className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
                   required
                 />
              </div>
              <div>
             <label className="mb-2 block text-base font-medium text-slate-300">Target</label>
                 <input
                   type="number"
                   value={form.target}
                   onChange={(e) => setForm({ ...form, target: e.target.value })}
                   className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
                   required
                 />
              </div>
              <div>
             <label className="mb-2 block text-base font-medium text-slate-300">Unit</label>
                 <input
                   value={form.unit}
                   onChange={(e) => setForm({ ...form, unit: e.target.value })}
                   placeholder="e.g. hours, pages"
                   className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
                   required
                 />
              </div>
              <div>
             <label className="mb-2 block text-base font-medium text-slate-300">Type</label>
                 <select
                   value={form.type}
                   onChange={(e) => setForm({ ...form, type: e.target.value as Goal["type"] })}
                   className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
                 >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
             <label className="mb-2 block text-base font-medium text-slate-300">Deadline</label>
                 <input
                   type="date"
                   value={form.deadline}
                   onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                   className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
                 />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
               <button
                 type="button"
                 onClick={() => setShowForm(false)}
                 className="rounded-xl border border-slate-700 bg-white/5 px-4 py-2 text-base font-medium text-slate-300 transition-colors hover:bg-white/10"
               >
                 Cancel
               </button>
               <button
                 type="submit"
                 disabled={submitting}
                 className="rounded-xl gradient-primary px-4 py-2 text-base font-semibold text-white shadow-lg shadow-indigo-900/40 transition-opacity hover:opacity-90 disabled:opacity-60"
               >
                {submitting ? "Saving..." : "Save Goal"}
              </button>
            </div>
          </form>
        </FadeIn>
      )}

      <FadeIn delay={0.1}>
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />
            </div>
          ) : goals.length === 0 ? (
            <div className="glass-card card-shadow rounded-3xl border border-slate-800/70 py-20 text-center text-slate-400">
              No goals yet. Add your first goal above.
            </div>
          ) : (
            goals.map((goal) => {
              const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
              return (
<div
                    key={goal.id}
                    className="glass-card card-shadow rounded-3xl border border-slate-800/70 p-8"
                  >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-slate-100">{goal.title}</h3>
                      <p className="mt-1 text-sm text-slate-500 capitalize">{goal.type}</p>
                    </div>
                     <span className="text-base font-medium text-indigo-300">
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                  </div>
                  <div className="mt-3 h-3 rounded-full bg-slate-800">
                    <div
                      className="h-3 rounded-full gradient-primary transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-slate-400">{percentage}% complete</span>
                    <div className="flex gap-2">
<button
                  onClick={() => handleProgress(goal, 1)}
                  className="rounded-lg border border-slate-700 bg-white/5 px-3 py-1 text-base font-medium text-slate-300 transition-colors hover:border-indigo-500/50 hover:text-indigo-200"
                >
                  +1
                </button>
<button
                onClick={() => handleProgress(goal, -1)}
                className="rounded-lg border border-slate-700 bg-white/5 px-3 py-1 text-base font-medium text-slate-300 transition-colors hover:border-indigo-500/50 hover:text-indigo-200"
              >
                -1
              </button>
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
