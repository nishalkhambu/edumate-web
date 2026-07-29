"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PageShell, SectionHeader, FadeIn } from "@/src/components/dashboard/PageShell";
import { createPomodoroAction } from "@/src/actions/study.actions";

type TimerMode = "focus" | "short_break" | "long_break";

const MODE_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
};

const MODE_LABELS: Record<TimerMode, string> = {
  focus: "Focus",
  short_break: "Short Break",
  long_break: "Long Break",
};

export default function PomodoroPage() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(MODE_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsToday, setSessionsToday] = useState(0);
  const completedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const switchMode = useCallback((newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setSecondsLeft(MODE_DURATIONS[newMode]);
    completedRef.current = false;
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (secondsLeft === 0 && !completedRef.current) {
      completedRef.current = true;
      if (mode === "focus") {
        setSessionsToday((c) => c + 1);
        createPomodoroAction({
          mode: "focus",
          durationMinutes: MODE_DURATIONS.focus / 60,
        }).catch(() => {});
      }
      setMode("short_break");
      setSecondsLeft(MODE_DURATIONS.short_break);
      setIsRunning(false);
    }
  }, [secondsLeft, mode]);

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const progress = ((MODE_DURATIONS[mode] - secondsLeft) / MODE_DURATIONS[mode]) * 100;

  return (
    <PageShell>
      <FadeIn>
        <SectionHeader label="Productivity" title="Pomodoro Timer" />
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="glass-card card-shadow mx-auto max-w-xl rounded-3xl border border-slate-800/70 p-8 text-center">
          <div className="mb-6 flex justify-center gap-2">
             {(Object.keys(MODE_LABELS) as TimerMode[]).map((m) => (
               <button
                 key={m}
                 onClick={() => switchMode(m)}
                 className={`rounded-xl px-4 py-2 text-base font-medium transition-colors ${
                   mode === m
                     ? "gradient-primary text-white shadow-lg shadow-indigo-900/40"
                     : "border border-slate-700 bg-white/5 text-slate-300 hover:border-indigo-500/50 hover:text-indigo-200"
                 }`}
               >
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>

          <div className="relative mx-auto mb-8 h-64 w-64">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="rgba(148, 163, 184, 0.14)"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="url(#timerGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
                className="transition-all duration-1000 ease-linear"
              />
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold tracking-tight text-slate-50">
                {formatted}
              </span>
               <span className="mt-2 text-base text-slate-400">
                {mode === "focus" ? "Stay focused" : mode === "short_break" ? "Take a breath" : "Rest up"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setIsRunning((r) => !r)}
              className="rounded-xl gradient-primary px-8 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-900/40 transition-opacity hover:opacity-90"
            >
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={() => switchMode(mode)}
              className="rounded-xl border border-slate-700 bg-white/5 px-6 py-3 text-base font-medium text-slate-300 transition-colors hover:bg-white/10"
            >
              Reset
            </button>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-800/70 bg-slate-900/40 p-4">
             <p className="text-base text-slate-400">
              Today&apos;s sessions:{" "}
              <span className="font-semibold text-indigo-300">{sessionsToday}</span>
            </p>
          </div>
        </div>
      </FadeIn>
    </PageShell>
  );
}
