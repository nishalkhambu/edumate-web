"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { weeklyAnalytics } from "./data";

export function AnalyticsChart() {
  return (
    <div className="glass-card card-shadow rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-100">Weekly Study Analytics</h3>
          <p className="text-xs text-slate-400">Last 7 days · study hours & productivity</p>
        </div>
        <span className="rounded-lg bg-indigo-500/15 px-2.5 py-1 text-xs font-medium text-indigo-300">
          +12% this week
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyAnalytics} margin={{ left: -20, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="hoursFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="prodFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
            <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid #2a3852",
                borderRadius: 12,
                color: "#f8fafc",
                fontSize: 12,
              }}
              labelStyle={{ color: "#94a3b8" }}
            />
            <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={2.5} fill="url(#hoursFill)" />
            <Area type="monotone" dataKey="productivity" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#prodFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
