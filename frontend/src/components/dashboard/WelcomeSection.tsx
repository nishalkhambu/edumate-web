"use client";

import { motion } from "framer-motion";
import { Flame, Target, Sparkles } from "lucide-react";
import { useAuth } from "@/src/contexts/AuthContext";
import { useCountUp } from "./useCountUp";
import { todayFocus, streak, weeklyGoal } from "./data";

export function WelcomeSection() {
  const { user } = useAuth();
  const name = user?.name?.split(" ")[0] || "there";
  const greeting =
    new Date().getHours() < 12
      ? "Good Morning"
      : new Date().getHours() < 17
      ? "Good Afternoon"
      : "Good Evening";
  const streakCount = useCountUp(streak);
  const goalCount = useCountUp(weeklyGoal);

  const messages = [
    "Small steps every day build remarkable results.",
    "Your focus today shapes your grades tomorrow.",
    "Consistency beats intensity — you've got this.",
  ];
  const message = messages[new Date().getDay() % messages.length];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-br from-[#161f38] to-[#0f172a] p-8 sm:p-10">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-40 h-48 w-48 rounded-full bg-violet-600/10 blur-3xl" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
           <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" /> {greeting}
          </span>
           <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-slate-50 sm:text-5xl">
            {greeting}, {name} <span className="inline-block">👋</span>
          </h1>
           <p className="mt-3 max-w-xl text-lg text-slate-400">{message}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-2xl border border-slate-700/60 bg-white/[0.03] px-4 py-2.5">
              <Target className="h-4 w-4 text-indigo-300" />
              <div className="leading-tight">
                 <p className="text-xs uppercase tracking-wide text-slate-500">Today&apos;s focus</p>
                 <p className="text-base font-semibold text-slate-100">{todayFocus}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center rounded-2xl border border-slate-700/60 bg-white/[0.03] px-5 py-4">
            <Flame className="h-5 w-5 text-amber-400" />
             <p className="mt-1 text-3xl font-bold text-slate-50">{Math.round(streakCount)}</p>
             <p className="text-xs uppercase tracking-wide text-slate-500">day streak</p>
          </div>

          <div className="relative flex h-28 w-28 items-center justify-center">
            <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" className="ring-track" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none" stroke="#8b5cf6" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={263.9}
                initial={{ strokeDashoffset: 263.9 }}
                animate={{ strokeDashoffset: 263.9 - (weeklyGoal / 100) * 263.9 }}
                transition={{ duration: 1.3, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
               <span className="text-2xl font-bold text-slate-50">{Math.round(goalCount)}%</span>
               <span className="text-xs uppercase tracking-wide text-slate-500">weekly</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
