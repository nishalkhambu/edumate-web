"use client";

import { useEffect, useState } from "react";
import { PageShell, SectionHeader, FadeIn } from "@/src/components/dashboard/PageShell";
import {
  listTasksAction,
  createTaskAction,
  updateTaskAction,
  deleteTaskAction,
} from "@/src/actions/study.actions";
import type { TaskItem, TaskPayload } from "@/src/api/study.api";
import { cn } from "@/src/lib/utils";
import { LayoutGrid, List, CalendarDays, Plus } from "lucide-react";

type Task = TaskItem;
const priorityMeta: Record<Task["priority"], { label: string; cls: string; dot: string }> = {
  high: { label: "High", cls: "bg-rose-500/15 text-rose-300 border-rose-500/30", dot: "bg-rose-400" },
  medium: { label: "Medium", cls: "bg-amber-500/15 text-amber-300 border-amber-500/30", dot: "bg-amber-400" },
  low: { label: "Low", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", dot: "bg-emerald-400" },
};

const statusColumns = [
  { key: "todo", title: "To Do", status: "pending" as const },
  { key: "doing", title: "In Progress", status: "in_progress" as const },
  { key: "done", title: "Done", status: "completed" as const },
];

export default function TasksPage() {
  const [view, setView] = useState<"board" | "list" | "calendar">("list");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", subject: "", dueDate: "", priority: "medium" as Task["priority"], status: "pending" as Task["status"] });

  const loadTasks = async () => {
    setLoading(true);
    const result = await listTasksAction();
    if (result.success && "data" in result) {
      setTasks(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload: TaskPayload = {
      title: form.title,
      description: form.description || undefined,
      subject: form.subject || undefined,
      dueDate: form.dueDate || undefined,
      priority: form.priority,
      status: form.status,
    };
    const result = await createTaskAction(payload);
    if (result.success && "data" in result) {
      setTasks((prev) => [result.data, ...prev]);
      setForm({ title: "", description: "", subject: "", dueDate: "", priority: "medium", status: "pending" });
      setShowForm(false);
    }
    setSubmitting(false);
  };

  const handleStatusChange = async (task: Task, status: Task["status"]) => {
    const result = await updateTaskAction(task.id, { status, title: task.title, priority: task.priority });
    if (result.success && "data" in result) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? result.data : t)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    const result = await deleteTaskAction(id);
    if (result.success) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <PageShell>
      <SectionHeader
        label="Productivity"
        title="Tasks"
        action={
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-slate-700 bg-white/5 p-1">
              {(["board", "list", "calendar"] as const).map((v) => (
<button
                key={v}
                onClick={() => setView(v)}
                className={cn("flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-base font-medium capitalize transition-colors", view === v ? "bg-indigo-500/20 text-indigo-200" : "text-slate-400 hover:text-slate-200")}
>
                  {v === "board" && <LayoutGrid className="h-4 w-4" />}
                  {v === "list" && <List className="h-4 w-4" />}
                  {v === "calendar" && <CalendarDays className="h-4 w-4" />}
                </button>
              ))}
            </div>
            <button onClick={() => setShowForm((v) => !v)} className="flex items-center gap-1.5 rounded-xl gradient-primary px-3 py-2 text-base font-semibold text-white">
              <Plus className="h-4 w-4" /> Add Task
            </button>
          </div>
        }
      />

      {showForm && (
        <FadeIn delay={0.05}>
           <form onSubmit={handleSubmit} className="glass-card card-shadow mb-6 rounded-3xl border border-slate-800/70 p-8">
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
                 <label className="mb-2 block text-base font-medium text-slate-300">Subject</label>
                 <input
                   value={form.subject}
                   onChange={(e) => setForm({ ...form, subject: e.target.value })}
                   className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
                 />
               </div>
               <div>
                 <label className="mb-2 block text-base font-medium text-slate-300">Due Date</label>
                 <input
                   type="date"
                   value={form.dueDate}
                   onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                   className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
                 />
               </div>
               <div>
                 <label className="mb-2 block text-base font-medium text-slate-300">Priority</label>
                 <select
                   value={form.priority}
                   onChange={(e) => setForm({ ...form, priority: e.target.value as Task["priority"] })}
                   className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
                 >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
               <div>
                 <label className="mb-2 block text-base font-medium text-slate-300">Status</label>
                 <select
                   value={form.status}
                   onChange={(e) => setForm({ ...form, status: e.target.value as Task["status"] })}
                   className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
                 >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-700 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="rounded-xl gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition-opacity hover:opacity-90 disabled:opacity-60">
                {submitting ? "Saving..." : "Save Task"}
              </button>
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
          ) : tasks.length === 0 ? (
            <div className="py-20 text-center text-slate-400">No tasks yet. Add your first task above.</div>
          ) : (
            <>
              {view === "board" && (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  {statusColumns.map((col) => {
                    const colTasks = tasks.filter((t) => t.status === col.status);
                    return (
                      <div key={col.key}>
                        <div className="mb-3 flex items-center justify-between">
                           <h3 className="text-lg font-semibold text-slate-200">{col.title}</h3>
                           <span className="rounded-full bg-slate-700/60 px-2 py-0.5 text-xs font-medium text-slate-300">{colTasks.length}</span>
                        </div>
                        <div className="space-y-3">
                          {colTasks.map((t) => (
                             <div key={t.id} className="rounded-2xl border border-slate-800/70 bg-white/[0.02] p-6">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-base font-medium text-slate-100">{t.title}</p>
                                <span className={cn("flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold", priorityMeta[t.priority].cls)}>
                                  <span className={cn("h-1.5 w-1.5 rounded-full", priorityMeta[t.priority].dot)} /> {priorityMeta[t.priority].label}
                                </span>
                              </div>
                               <p className="mt-1 text-base text-slate-500">{t.description}</p>
                              <div className="mt-3 flex items-center justify-between">
<select
	                                   value={t.status}
	                                   onChange={(e) => handleStatusChange(t, e.target.value as Task["status"])}
	                                   className="rounded-lg border border-slate-700 bg-slate-900/50 px-2 py-1 text-sm text-slate-200 outline-none focus:border-indigo-500"
	                                 >
                                  <option value="pending">Pending</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="completed">Completed</option>
                                </select>
                                <button onClick={() => handleDelete(t.id)} className="text-xs text-rose-300 hover:text-rose-200">Delete</button>
                              </div>
                            </div>
                          ))}
                          {colTasks.length === 0 &&                                <p className="py-6 text-center text-sm text-slate-600">—</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {view === "list" && (
                <div className="space-y-2">
                  {tasks.map((t) => (
                    <div key={t.id} className="flex items-center gap-3 rounded-xl border border-slate-800/70 bg-white/[0.02] px-4 py-3">
                      <span className={cn("h-2 w-2 rounded-full", priorityMeta[t.priority].dot)} />
<p className="flex-1 text-base font-medium text-slate-100">{t.title}</p>
                       <span className="text-base text-slate-500">{t.subject}</span>
                       <span className="w-24 text-right text-base text-slate-500">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : ""}</span>
                       <button onClick={() => handleDelete(t.id)} className="text-base text-rose-300 hover:text-rose-200">Delete</button>
                    </div>
                  ))}
                </div>
              )}

              {view === "calendar" && (
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => {
                    const t = tasks[d % tasks.length];
                    return (
                      <div key={d} className="min-h-[90px] rounded-xl border border-slate-800/70 p-2">
                               <p className="text-xs font-medium text-slate-500">{d}</p>
                               {t && (
                                 <p className="mt-1 line-clamp-2 text-sm text-slate-300">{t.title}</p>
                               )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </FadeIn>
    </PageShell>
  );
}
