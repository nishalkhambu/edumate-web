"use client";

import { motion } from "framer-motion";
import { insights } from "./data";

export function SmartInsights() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {insights.map((ins, i) => (
        <motion.div
          key={ins.title}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className={`rounded-2xl border bg-gradient-to-br p-5 ${ins.color}`}
        >
          <div className="text-2xl">{ins.icon}</div>
          <h4 className="mt-3 text-sm font-semibold text-slate-100">{ins.title}</h4>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">{ins.text}</p>
        </motion.div>
      ))}
    </div>
  );
}
