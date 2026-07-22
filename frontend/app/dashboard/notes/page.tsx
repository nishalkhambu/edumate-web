"use client";

import { useState } from "react";
import { PageShell, SectionHeader, FadeIn } from "@/src/components/dashboard/PageShell";
import { notesDetailed } from "@/src/components/dashboard/data";
import { cn } from "@/src/lib/utils";
import { Star, Plus, Search } from "lucide-react";

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
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = notesDetailed.filter((n) => {
    const matchQ = n.title.toLowerCase().includes(query.toLowerCase()) || n.tag.toLowerCase().includes(query.toLowerCase());
    const matchC = cat === "All" || (cat === "Favorites" ? n.favorite : n.tag === cat);
    return matchQ && matchC;
  });

  return (
    <PageShell>
      <SectionHeader
        label="Workspace"
        title="Notes"
        action={
          <button className="flex items-center gap-1.5 rounded-xl gradient-primary px-3 py-2 text-sm font-semibold text-white">
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
              className="w-full rounded-xl border border-slate-700 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  cat === c ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-200" : "border-slate-700 text-slate-400 hover:text-slate-200"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((n) => (
            <button key={n.id} className="group flex flex-col rounded-2xl border border-slate-800/70 bg-white/[0.02] p-5 text-left transition-all hover:-translate-y-1 hover:border-slate-700 hover:bg-white/[0.05]">
              <div className="flex items-start justify-between">
                <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-semibold", tagColors[n.tag] ?? "bg-slate-500/15 text-slate-300")}>{n.tag}</span>
                <Star className={cn("h-4 w-4", n.favorite ? "fill-amber-400 text-amber-400" : "text-slate-600")} />
              </div>
              <h3 className="mt-3 text-base font-semibold text-slate-100">{n.title}</h3>
              <p className="mt-auto pt-4 text-xs text-slate-500">Edited {n.edited}</p>
            </button>
          ))}
          <button className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700 bg-white/[0.01] p-5 text-slate-400 transition-all hover:border-indigo-500/50 hover:bg-white/[0.04] hover:text-indigo-300">
            <Plus className="h-5 w-5" />
            <span className="text-sm font-medium">New note</span>
          </button>
        </div>
      </FadeIn>
    </PageShell>
  );
}
