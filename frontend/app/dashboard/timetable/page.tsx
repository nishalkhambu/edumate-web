"use client";

import { useState } from "react";
import { PageShell, SectionHeader, FadeIn } from "@/src/components/dashboard/PageShell";
import { timetable, type TimetableEntry } from "@/src/components/dashboard/data";
import { cn } from "@/src/lib/utils";
import { CalendarDays, List } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const typeLabel: Record<TimetableEntry["type"], string> = { class: "Lecture", lab: "Lab", study: "Study" };

function Block({ e, compact }: { e: TimetableEntry; compact?: boolean }) {
  return (
    <div
      className="rounded-xl border-l-4 bg-white/[0.04] p-2.5 text-left"
      style={{ borderLeftColor: e.color }}
    >
      <p className="text-xs font-semibold text-slate-100">{e.subject}</p>
      {!compact && (
        <p className="mt-0.5 text-[11px] text-slate-400">
          {e.start} – {e.end} · {typeLabel[e.type]}
        </p>
      )}
    </div>
  );
}

export default function TimetablePage() {
  const [view, setView] = useState<"week" | "day">("week");
  const today = new Date().getDay();

  return (
    <PageShell>
      <SectionHeader
        label="Schedule"
        title="Timetable"
        action={
          <div className="flex rounded-xl border border-slate-700 bg-white/5 p-1">
            <button
              onClick={() => setView("week")}
              className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors", view === "week" ? "bg-indigo-500/20 text-indigo-200" : "text-slate-400 hover:text-slate-200")}
            >
              <CalendarDays className="h-4 w-4" /> Week
            </button>
            <button
              onClick={() => setView("day")}
              className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors", view === "day" ? "bg-indigo-500/20 text-indigo-200" : "text-slate-400 hover:text-slate-200")}
            >
              <List className="h-4 w-4" /> Day
            </button>
          </div>
        }
      />

      <FadeIn>
        <div className="rounded-3xl border border-slate-800/70 bg-white/[0.02] p-6">
          {view === "week" ? (
            <div className="grid grid-cols-7 gap-3">
              {DAYS.map((d, di) => {
                const items = timetable.filter((e) => e.day === di).sort((a, b) => a.start.localeCompare(b.start));
                return (
                  <div key={d} className={cn("min-h-[160px] rounded-2xl border p-2", di === today ? "border-indigo-500/50 bg-indigo-500/5" : "border-slate-800/70")}>
                    <p className={cn("mb-2 text-center text-xs font-semibold", di === today ? "text-indigo-300" : "text-slate-400")}>{d}</p>
                    <div className="space-y-2">
                      {items.map((e) => (
                        <Block key={e.subject + e.start} e={e} />
                      ))}
                      {items.length === 0 && <p className="py-6 text-center text-[11px] text-slate-600">—</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {HOURS.map((h) => {
                const items = timetable.filter((e) => e.day === today && e.start <= h && e.end > h);
                return (
                  <div key={h} className="flex gap-4">
                    <span className="w-14 flex-shrink-0 pt-2 text-right text-xs font-medium text-slate-500">{h}</span>
                    <div className="flex-1 border-t border-slate-800/60 pb-3 pt-2">
                      {items.length ? (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {items.map((e) => (
                            <Block key={e.subject + e.start} e={e} compact />
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-600">Free</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </FadeIn>
    </PageShell>
  );
}
