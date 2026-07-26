"use client";

import { notesDetailed } from "./data";
import { Star, Plus } from "lucide-react";
import { cn } from "@/src/lib/utils";

const tagColors: Record<string, string> = {
  "Operating Systems": "bg-indigo-500/15 text-indigo-300",
  "Data Structures": "bg-emerald-500/15 text-emerald-300",
  "Linear Algebra": "bg-violet-500/15 text-violet-300",
  "Computer Networks": "bg-rose-500/15 text-rose-300",
  "Web Dev": "bg-amber-500/15 text-amber-300",
  Mathematics: "bg-sky-500/15 text-sky-300",
};

export function NotesGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {notesDetailed.map((n) => (
        <button
          key={n.id}
          className="group flex flex-col rounded-2xl border border-slate-800/70 bg-white/[0.02] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-white/[0.05]"
        >
          <div className="flex items-start justify-between">
            <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-semibold", tagColors[n.tag] ?? "bg-slate-500/15 text-slate-300")}>
              {n.tag}
            </span>
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
  );
}
