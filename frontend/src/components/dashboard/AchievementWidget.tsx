"use client";

import { achievements } from "./data";

export function AchievementWidget() {
  return (
    <div className="glass-card card-shadow rounded-2xl p-6">
      <h3 className="text-base font-semibold text-slate-100">Achievements</h3>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl gradient-primary text-white shadow-lg shadow-indigo-900/40">
          <span className="text-2xl font-bold leading-none">{achievements.level}</span>
          <span className="text-[10px] uppercase tracking-wide text-indigo-100">level</span>
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-400">Total XP</p>
          <p className="text-xl font-bold text-slate-100">{achievements.xp.toLocaleString()}</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700/60">
            <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
          </div>
          <p className="mt-1 text-[11px] text-slate-500">840 XP to Level 13</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {achievements.badges.map((b) => (
          <span
            key={b.label}
            className="flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-200"
          >
            <span className="text-sm">{b.icon}</span>
            {b.label}
          </span>
        ))}
      </div>
    </div>
  );
}
