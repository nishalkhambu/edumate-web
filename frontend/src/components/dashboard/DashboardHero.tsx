"use client";

import { motion } from "framer-motion";
import { Play, Clock, Zap, Flame, Target } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useCountUp } from "./useCountUp";

function ProgressRing({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-32 w-32">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="url(#heroRing)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (value / 100) * c }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="heroRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{value}%</span>
        <span className="text-[10px] uppercase tracking-wide text-white/60">weekly goal</span>
      </div>
    </div>
  );
}

export function DashboardHero() {
  const hours = useCountUp(5.4);
  const productivity = useCountUp(84);
  const streak = useCountUp(12);

  return (
    <section className="hero-gradient relative overflow-hidden rounded-3xl p-6 text-white shadow-2xl sm:p-8">
      <div className="hero-grid absolute inset-0 opacity-40" />
      <div className="animate-float-slow absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      <div className="animate-float-slow-2 absolute -bottom-12 right-24 h-40 w-40 rounded-full bg-violet-300/20 blur-3xl" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <Flame className="h-3.5 w-3.5 text-amber-300" /> 12-Day Streak Active
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Your learning is on fire today 🚀
          </h2>
          <p className="mt-2 text-sm text-indigo-100/90">
            You&apos;ve studied <span className="font-semibold text-white">{hours.toFixed(1)}h</span> today with an{" "}
            <span className="font-semibold text-white">{productivity}%</span> productivity score.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <HeroStat icon={<Clock className="h-4 w-4" />} label="Study Hours" value={`${hours.toFixed(1)}h`} />
            <HeroStat icon={<Zap className="h-4 w-4" />} label="Productivity" value={`${productivity}%`} />
            <HeroStat icon={<Target className="h-4 w-4" />} label="Streak" value={`${streak}d`} />
          </div>

          <div className="mt-6">
            <Button className="bg-white text-indigo-700 shadow-xl hover:bg-indigo-50">
              <Play className="h-4 w-4 fill-current" /> Start Focus Session
            </Button>
          </div>
        </div>

        <ProgressRing value={64} />
      </div>
    </section>
  );
}

function HeroStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 text-indigo-100">
        {icon}
        <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}
