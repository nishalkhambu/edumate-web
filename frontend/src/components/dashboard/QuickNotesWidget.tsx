"use client";

import { Plus, StickyNote } from "lucide-react";
import { notes } from "./data";

export function QuickNotesWidget() {
  return (
    <div className="glass-card card-shadow rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-100">Quick Notes</h3>
        <button className="flex items-center gap-1 rounded-lg bg-indigo-500/15 px-2.5 py-1 text-xs font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/25">
          <Plus className="h-3.5 w-3.5" /> Add Note
        </button>
      </div>
      <div className="space-y-2">
        {notes.map((n) => (
          <div
            key={n.id}
            className="flex items-center gap-3 rounded-xl border border-slate-700/60 bg-white/[0.03] px-3 py-2.5 transition-colors hover:border-indigo-500/40"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700/50 text-slate-300">
              <StickyNote className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-100">{n.title}</p>
              <p className="truncate text-xs text-slate-400">{n.tag}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
