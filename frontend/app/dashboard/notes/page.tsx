"use client";

import { useEffect, useState } from "react";
import { PageShell, SectionHeader, FadeIn } from "@/src/components/dashboard/PageShell";
import { listNotesAction, createNoteAction, updateNoteAction, deleteNoteAction } from "@/src/actions/study.actions";
import type { NoteItem } from "@/src/api/study.api";
import { cn } from "@/src/lib/utils";
import { Star, Plus, Search, Edit, Trash2 } from "lucide-react";

const tagColors: Record<string, string> = {
  "Operating Systems": "bg-indigo-500/15 text-indigo-300",
  "Data Structures": "bg-emerald-500/15 text-emerald-300",
  "Linear Algebra": "bg-violet-500/15 text-violet-300",
  "Computer Networks": "bg-rose-500/15 text-rose-300",
  "Web Dev": "bg-amber-500/15 text-amber-300",
  Mathematics: "bg-sky-500/15 text-sky-300",
};

const categories = ["All", "Favorites", "Operating Systems", "Data Structures", "Linear Algebra", "Web Dev", "Mathematics"];

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", tag: "", favorite: false });
  const [deleteTarget, setDeleteTarget] = useState<NoteItem | null>(null);

  const loadNotes = async () => {
    setLoading(true);
    const result = await listNotesAction();
    if (result.success && "data" in result) {
      setNotes(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const safeNotes = Array.isArray(notes) ? notes : [];
  const filtered = safeNotes.filter((n) => {
    const matchQ = n.title.toLowerCase().includes(query.toLowerCase()) || n.tag.toLowerCase().includes(query.toLowerCase());
    const matchC = cat === "All" || (cat === "Favorites" ? n.favorite : n.tag === cat);
    return matchQ && matchC;
  });

  const openCreate = () => {
    setEditingNote(null);
    setForm({ title: "", content: "", tag: "", favorite: false });
    setShowForm(true);
  };

  const openEdit = (note: NoteItem) => {
    setEditingNote(note);
    setForm({ title: note.title, content: note.content, tag: note.tag, favorite: note.favorite });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (editingNote) {
      const result = await updateNoteAction(editingNote.id, form);
      if (result.success && "data" in result) {
        setNotes((prev) => prev.map((n) => (n.id === editingNote.id ? result.data : n)));
        setShowForm(false);
      }
    } else {
      const result = await createNoteAction(form);
      if (result.success && "data" in result) {
        setNotes((prev) => [result.data, ...prev]);
        setShowForm(false);
      }
    }
    setSubmitting(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const result = await deleteNoteAction(deleteTarget.id);
    if (result.success) {
      setNotes((prev) => prev.filter((n) => n.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  return (
    <PageShell>
      <SectionHeader
        label="Workspace"
        title="Notes"
        action={
             <button onClick={openCreate} className="flex items-center gap-1.5 rounded-xl gradient-primary px-3 py-2 text-base font-semibold text-white">
            <Plus className="h-4 w-4" /> New Note
          </button>
        }
      />

      <FadeIn>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
           <input
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               placeholder="Search notes..."
               className="w-full rounded-xl border border-slate-700 bg-white/5 py-2.5 pl-9 pr-3 text-base text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
             />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  cat === c ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-200" : "border-slate-700 text-slate-400 hover:text-slate-200"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((n) => (
              <div key={n.id} className="group flex flex-col rounded-2xl border border-slate-800/70 bg-white/[0.02] p-5 text-left transition-all hover:-translate-y-1 hover:border-slate-700 hover:bg-white/[0.05]">
                <div className="flex items-start justify-between">
                     <span className={cn("rounded-md px-2 py-0.5 text-sm font-semibold", tagColors[n.tag] ?? "bg-slate-500/15 text-slate-300")}>{n.tag}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(n)} className="text-slate-400 hover:text-indigo-300"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => setDeleteTarget(n)} className="text-slate-400 hover:text-rose-300"><Trash2 className="h-4 w-4" /></button>
                    <Star className={cn("h-4 w-4", n.favorite ? "fill-amber-400 text-amber-400" : "text-slate-600")} />
                  </div>
                </div>
<h3 className="mt-3 text-lg font-semibold text-slate-100">{n.title}</h3>
                  <p className="mt-2 line-clamp-3 text-base text-slate-400">{n.content || "No content"}</p>
                  <p className="mt-auto pt-4 text-base text-slate-500">Edited {new Date(n.updatedAt).toLocaleDateString()}</p>
              </div>
            ))}
            <button onClick={openCreate} className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700 bg-white/[0.01] p-5 text-slate-400 transition-all hover:border-indigo-500/50 hover:bg-white/[0.04] hover:text-indigo-300">
               <Plus className="h-5 w-5" />
               <span className="text-base font-medium">New note</span>
            </button>
          </div>
        )}
      </FadeIn>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg rounded-2xl border border-slate-800/70 bg-[#1e293b] p-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-100">{editingNote ? "Edit Note" : "Create Note"}</h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
             <label className="mb-2 block text-base font-medium text-slate-300">Title</label>
                 <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500" required />
              </div>
              <div>
             <label className="mb-2 block text-base font-medium text-slate-300">Tag</label>
                 <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500" />
              </div>
              <div>
             <label className="mb-2 block text-base font-medium text-slate-300">Content</label>
                 <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500" />
              </div>
              <div className="flex items-center gap-2">
                <input id="favorite" type="checkbox" checked={form.favorite} onChange={(e) => setForm({ ...form, favorite: e.target.checked })} className="h-4 w-4 rounded border-slate-700" />
                 <label htmlFor="favorite" className="text-base text-slate-300">Favorite</label>
              </div>
              <div className="flex justify-end gap-3">
                 <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-700 bg-white/5 px-4 py-2 text-base font-medium text-slate-300 transition-colors hover:bg-white/10">Cancel</button>
                 <button type="submit" disabled={submitting} className="rounded-xl gradient-primary px-4 py-2 text-base font-semibold text-white shadow-lg shadow-indigo-900/40 transition-opacity hover:opacity-90 disabled:opacity-60">{submitting ? "Saving..." : "Save Note"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setDeleteTarget(null)}>
          <div className="w-full max-w-md rounded-2xl border border-slate-800/70 bg-[#1e293b] p-8 text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-100">Delete Note</h3>
            <p className="mt-2 text-sm text-slate-400">Are you sure you want to delete <strong>{deleteTarget.title}</strong>?</p>
            <div className="mt-6 flex justify-center gap-3">
               <button onClick={() => setDeleteTarget(null)} className="rounded-xl border border-slate-700 bg-white/5 px-4 py-2 text-base font-medium text-slate-300 transition-colors hover:bg-white/10">Cancel</button>
               <button onClick={confirmDelete} className="rounded-xl bg-rose-500 px-4 py-2 text-base font-semibold text-white transition-colors hover:bg-rose-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
