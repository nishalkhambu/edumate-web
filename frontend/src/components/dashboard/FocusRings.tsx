"use client";

import { motion } from "framer-motion";
import { focusMetrics } from "./data";
import { useCountUp } from "./useCountUp";

function Ring({ metric }: { metric: (typeof focusMetrics)[number] }) {
  const value = useCountUp(metric.value, 1100);
  const len = 2 * Math.PI * 42;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center rounded-2xl border border-slate-800/70 bg-white/[0.02] p-5"
    >
      <div className="relative h-28 w-28">
        <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" className="ring-track" strokeWidth="7" />
          <motion.circle
            cx="50" cy="50" r="42" fill="none" stroke={metric.accent} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={len}
            initial={{ strokeDashoffset: len }}
            whileInView={{ strokeDashoffset: len - (metric.pct / 100) * len }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-slate-50">
            {metric.value % 1 === 0 ? Math.round(value) : value.toFixed(1)}
            <span className="text-sm text-slate-400">{metric.suffix}</span>
          </span>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-slate-300">{metric.label}</p>
    </motion.div>
  );
}

export function FocusRings() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {focusMetrics.map((m) => (
        <Ring key={m.label} metric={m} />
      ))}
    </div>
  );
}
