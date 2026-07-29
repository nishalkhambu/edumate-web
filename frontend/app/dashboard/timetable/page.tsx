"use client";

import { useEffect, useState } from "react";
import { PageShell, SectionHeader, FadeIn } from "@/src/components/dashboard/PageShell";
import { listTimetableEntriesAction, createTimetableEntryAction } from "@/src/actions/study.actions";
import type { TimetableEntryItem } from "@/src/api/study.api";
import { cn } from "@/src/lib/utils";
import { CalendarDays, List, Plus } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const typeLabel: Record<string, string> = { class: "Lecture", lab: "Lab", study: "Study" };

function Block({ e, compact }: { e: TimetableEntryItem; compact?: boolean }) {
  return (
    <div
      className="rounded-xl border-l-4 bg-white/[0.04] p-4 text-left"
      style={{ borderLeftColor: e.color }}
    >
      <p className="text-base font-semibold text-slate-100">{e.subject}</p>
      {!compact && (
        <p className="mt-0.5 text-sm text-slate-400">
          {e.start} – {e.end} · {typeLabel[e.type] || e.type}
        </p>
      )}
    </div>
  );
}

export default function TimetablePage() {
  const [view, setView] = useState<"week" | "day">("week");
  const [entries, setEntries] = useState<TimetableEntryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: "", day: 1, start: "09:00", end: "10:00", type: "class", color: "#6366f1" });
  const today = new Date().getDay();

  const load = async () => {
    setLoading(true);
    const result = await listTimetableEntriesAction();
    if (result.success && "data" in result) {
      setEntries(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await createTimetableEntryAction(form);
    if (result.success && "data" in result) {
      setEntries((prev) => [...prev, result.data]);
      setShowForm(false);
      setForm({ subject: "", day: 1, start: "09:00", end: "10:00", type: "class", color: "#6366f1" });
    }
    setSubmitting(false);
  };

  return (
    <PageShell>
      <SectionHeader
        label="Schedule"
        title="Timetable"
        action={
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-slate-700 bg-white/5 p-1">
              <button onClick={() => setView("week")} className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors", view === "week" ? "bg-indigo-500/20 text-indigo-200" : "text-slate-400 hover:text-slate-200")}><CalendarDays className="h-4 w-4" /> Week</button>
              <button onClick={() => setView("day")} className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors", view === "day" ? "bg-indigo-500/20 text-indigo-200" : "text-slate-400 hover:text-slate-200")}><List className="h-4 w-4" /> Day</button>
            </div>
            <button onClick={() => setShowForm((v) => !v)} className="flex items-center gap-1.5 rounded-xl gradient-primary px-3 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Add</button>
          </div>
        }
      />

      {showForm && (
        <FadeIn delay={0.05}>
          <form onSubmit={handleSubmit} className="glass-card card-shadow mb-6 rounded-3xl border border-slate-800/70 p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-300">Subject</label>
                <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">Day</label>
                <select value={form.day} onChange={(e) => setForm({ ...form, day: Number(e.target.value) })} className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500">
                  {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500">
                  <option value="class">Lecture</option>
                  <option value="lab">Lab</option>
                  <option value="study">Study</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">Start</label>
                <input type="time" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">End</label>
                <input type="time" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-700 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10">Cancel</button>
              <button type="submit" disabled={submitting} className="rounded-xl gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition-opacity hover:opacity-90 disabled:opacity-60">{submitting ? "Saving..." : "Add Entry"}</button>
            </div>
          </form>
        </FadeIn>
      )}

      <FadeIn delay={0.05}>
        <div className="rounded-3xl border border-slate-800/70 bg-white/[0.02] p-10">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />
            </div>
          ) : view === "week" ? (
            <div className="grid grid-cols-7 gap-3">
              {DAYS.map((d, di) => {
                const items = entries.filter((e) => e.day === di).sort((a, b) => a.start.localeCompare(b.start));
                return (
                  <div key={d} className={cn("min-h-[160px] rounded-2xl border p-2", di === today ? "border-indigo-500/50 bg-indigo-500/5" : "border-slate-800/70")}>
                    <p className={cn("mb-2 text-center text-base font-semibold", di === today ? "text-indigo-300" : "text-slate-400")}>{d}</p>
                    <div className="space-y-2">
                      {items.map((e) => (
                        <Block key={e.id} e={e} />
                      ))}
                      {items.length === 0 && <p className="py-6 text-center text-sm text-slate-600">—</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {HOURS.map((h) => {
                const items = entries.filter((e) => e.day === today && e.start <= h && e.end > h);
                return (
                  <div key={h} className="flex gap-4">
                    <span className="w-14 flex-shrink-0 pt-2 text-right text-base font-medium text-slate-500">{h}</span>
                    <div className="flex-1 border-t border-slate-800/60 pb-3 pt-2">
                      {items.length ? (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {items.map((e) => (
                            <Block key={e.id} e={e} compact />
                          ))}
                        </div>
                      ) : (
                        <p className="text-base text-slate-600">Free</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </FadeIn>
    </PageShell>
  );
}
