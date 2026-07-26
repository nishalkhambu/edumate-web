"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import { motion } from "framer-motion";
import { Sidebar } from "@/src/components/dashboard/Sidebar";
import { DashboardHeader } from "@/src/components/dashboard/DashboardHeader";

export function PageShell({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="dashboard-root flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />
      </div>
    );
  }
  if (!user) return null;

  const studentName = user?.name || "Alex";

  return (
    <div
      className={`dashboard-root grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr] ${
        collapsed ? "lg:grid-cols-[80px_1fr]" : "lg:grid-cols-[260px_1fr]"
      }`}
    >
      <Sidebar
        name={studentName}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          name={studentName}
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          onToggleSidebar={() => setCollapsed((c) => !c)}
        />

        <main className="flex-1 overflow-x-hidden px-4 py-8 sm:px-6 lg:px-10">
          <div className="w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function SectionHeader({
  label,
  title,
  action,
}: {
  label?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {label && <p className="section-label mb-1.5">{label}</p>}
        <h2 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
