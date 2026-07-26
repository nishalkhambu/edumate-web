"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

export interface StatProps {
  label: string;
  value: string;
  trend: string;
  positive?: boolean;
  icon: React.ReactNode;
  accent: string;
  spark: number[];
}

export function StatsCard({ stat }: { stat: StatProps }) {
  const data = stat.spark.map((v, i) => ({ i, v }));
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass-card card-shadow group rounded-2xl p-5"
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
          style={{ background: stat.accent }}
        >
          {stat.icon}
        </div>
        <span
          className={`flex items-center gap-0.5 text-xs font-semibold ${
            stat.positive ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {stat.positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {stat.trend}
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-50">{stat.value}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-400">{stat.label}</p>

      <div className="mt-3 h-10 opacity-70 transition-opacity group-hover:opacity-100">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`spark-${stat.label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stat.accent} stopOpacity={0.6} />
                <stop offset="100%" stopColor={stat.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={stat.accent}
              strokeWidth={2}
              fill={`url(#spark-${stat.label})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
