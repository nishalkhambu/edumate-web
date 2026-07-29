"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Sun, Moon, ChevronDown, LogOut, PanelLeft } from "lucide-react";
import { Avatar } from "@/src/components/ui/avatar";
import { clearSessionToken } from "@/src/actions/auth.actions";
import { useRouter } from "next/navigation";

export function DashboardHeader({
  name,
  onToggleTheme,
  theme,
  onToggleSidebar,
}: {
  name: string;
  onToggleTheme: () => void;
  theme: "dark" | "light";
  onToggleSidebar: () => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const greeting = new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-[#0f172a]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={onToggleSidebar}
              aria-label="Toggle sidebar"
              className="rounded-xl border border-slate-700 bg-white/5 p-2.5 text-slate-300 transition-colors hover:text-white"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold text-slate-50 sm:text-2xl">
                {greeting}, {name.split(" ")[0]} <span className="inline-block">👋</span>
              </h1>
               <p className="truncate text-sm text-slate-400 sm:text-base">
                Let&apos;s make today productive
              </p>
            </div>
          </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
             <input
               placeholder="Search courses, tasks, notes..."
               className="w-64 rounded-xl border border-slate-700 bg-white/5 py-2 pl-9 pr-3 text-base text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
             />
          </div>

          <button
            aria-label="Notifications"
            className="relative rounded-xl border border-slate-700 bg-white/5 p-2.5 text-slate-300 transition-colors hover:text-white"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[#0f172a]" />
          </button>

          <button
            aria-label="Toggle theme"
            onClick={onToggleTheme}
            className="rounded-xl border border-slate-700 bg-white/5 p-2.5 text-slate-300 transition-colors hover:text-white"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-white/5 p-1.5 pr-2 transition-colors hover:bg-white/10"
            >
               <Avatar name={name} className="h-8 w-8 text-xs" />
               <span className="hidden text-base font-medium text-slate-200 sm:block">{name}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="glass-card absolute right-0 mt-2 w-48 overflow-hidden rounded-xl p-1.5"
                >
                  <button className="w-full rounded-lg px-3 py-2 text-left text-base text-slate-300 hover:bg-white/5">
                    Profile
                  </button>
                  <button className="w-full rounded-lg px-3 py-2 text-left text-base text-slate-300 hover:bg-white/5">
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      clearSessionToken();
                      router.push("/login");
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-base text-rose-400 hover:bg-rose-500/10"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
