"use client";

import { useEffect, useState } from "react";
import { PageShell, SectionHeader, FadeIn } from "@/src/components/dashboard/PageShell";
import { listStudySessionsAction, createStudySessionAction } from "@/src/actions/study.actions";
import type { StudySession } from "@/src/api/study.api";
import { Play, Plus } from "lucide-react";

export default function StudySessionsPage() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: "", topic: "", durationMinutes: 25, notes: "" });

  const load = async () => {
    setLoading(true);
    const result = await listStudySessionsAction();
    if (result.success && "data" in result) {
      setSessions(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await createStudySessionAction({ ...form, startedAt: new Date().toISOString() });
    if (result.success && "data" in result) {
      setSessions((prev) => [result.data, ...prev]);
      setForm({ subject: "", topic: "", durationMinutes: 25, notes: "" });
      setShowForm(false);
    }
    setSubmitting(false);
  };

  return (
    <PageShell>
      <SectionHeader
        label="Study Time"
        title="Study Sessions"
        action={
           <button onClick={() => setShowForm((v) => !v)} className="flex items-center gap-1.5 rounded-xl gradient-primary px-3 py-2 text-base font-semibold text-white">
            <Plus className="h-4 w-4" /> New Session
          </button>
        }
      />

      {showForm && (
        <FadeIn delay={0.05}>
           <form onSubmit={handleSubmit} className="glass-card card-shadow mb-6 rounded-3xl border border-slate-800/70 p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
               <label className="mb-2 block text-base font-medium text-slate-300">Subject</label>
                 <input
                   value={form.subject}
                   onChange={(e) => setForm({ ...form, subject: e.target.value })}
                   className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
                 />
              </div>
              <div>
               <label className="mb-2 block text-base font-medium text-slate-300">Topic</label>
                 <input
                   value={form.topic}
                   onChange={(e) => setForm({ ...form, topic: e.target.value })}
                   className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
                 />
              </div>
              <div>
               <label className="mb-2 block text-base font-medium text-slate-300">Duration (minutes)</label>
                 <input
                   type="number"
                   value={form.durationMinutes}
                   onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                   className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
                 />
              </div>
              <div>
               <label className="mb-2 block text-base font-medium text-slate-300">Notes</label>
                 <input
                   value={form.notes}
                   onChange={(e) => setForm({ ...form, notes: e.target.value })}
                   className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
                 />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
               <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-700 bg-white/5 px-4 py-2 text-base font-medium text-slate-300 transition-colors hover:bg-white/10">
                 Cancel
               </button>
               <button type="submit" disabled={submitting} className="rounded-xl gradient-primary px-4 py-2 text-base font-semibold text-white shadow-lg shadow-indigo-900/40 transition-opacity hover:opacity-90 disabled:opacity-60">
                 {submitting ? "Saving..." : "Start Session"}
               </button>
            </div>
          </form>
        </FadeIn>
      )}

      <FadeIn delay={0.05}>
               <div className="rounded-3xl border border-slate-800/70 bg-white/[0.02] p-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-20 text-center text-slate-400">No study sessions yet. Start your first session above.</div>
          ) : (
            <div className="space-y-3">
              {sessions.map((s) => (
                <div key={s.id} className="flex flex-col gap-1 rounded-2xl border border-slate-800/70 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                     <p className="text-base font-semibold text-slate-100">{s.subject || "General"}</p>
                     <p className="text-sm text-slate-500">{s.topic} • {s.durationMinutes} min • {new Date(s.startedAt).toLocaleString()}</p>
                  </div>
                   <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Play className="h-3.5 w-3.5 text-indigo-300" /> Session
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </FadeIn>
    </PageShell>
  );
}
