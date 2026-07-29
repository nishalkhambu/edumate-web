"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/src/contexts/AuthContext";
import { SectionHeader, FadeIn } from "@/src/components/dashboard/PageShell";

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) router.replace("/login");
      else if (user.role !== "admin") router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="dashboard-root flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;
  return <>{children}</>;
}

export default function AdminDashboardPage() {
  return (
    <AdminProtectedRoute>
      <div className="space-y-8">
        <FadeIn>
          <SectionHeader label="Overview" title="Admin Dashboard" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Users", value: "—", href: "/dashboard/admin/users", accent: "#6366f1" },
              { label: "Study Plans", value: "—", href: "/dashboard/study-planner", accent: "#8b5cf6" },
              { label: "Tasks", value: "—", href: "/dashboard/tasks", accent: "#10b981" },
              { label: "Sessions", value: "—", href: "/dashboard/progress", accent: "#f59e0b" },
            ].map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="block rounded-2xl border border-slate-800/70 bg-white/[0.02] p-5 transition-all hover:border-slate-700 hover:bg-white/[0.05]"
              >
                 <p className="text-base text-slate-500">{stat.label}</p>
                 <p className="mt-2 text-4xl font-bold text-slate-100">{stat.value}</p>
                 <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-300">View →</span>
              </Link>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
<div className="rounded-3xl border border-slate-800/70 bg-white/[0.02] p-10">
             <SectionHeader label="Management" title="Quick Actions" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
               <Link href="/dashboard/admin/users" className="block rounded-2xl border border-slate-800/70 bg-white/[0.02] p-10 transition-all hover:border-slate-700 hover:bg-white/[0.05]">
<p className="text-lg font-semibold text-slate-100">User Management</p>
                  <p className="mt-1 text-base text-slate-500">Create, edit, and manage user accounts.</p>
                </Link>
                <Link href="/dashboard/study-planner" className="block rounded-2xl border border-slate-800/70 bg-white/[0.02] p-10 transition-all hover:border-slate-700 hover:bg-white/[0.05]">
                  <p className="text-lg font-semibold text-slate-100">Study Plans</p>
                  <p className="mt-1 text-base text-slate-500">View all study plans across users.</p>
                </Link>
                <Link href="/dashboard/progress" className="block rounded-2xl border border-slate-800/70 bg-white/[0.02] p-10 transition-all hover:border-slate-700 hover:bg-white/[0.05]">
                  <p className="text-lg font-semibold text-slate-100">Analytics</p>
                  <p className="mt-1 text-base text-slate-500">Platform-wide productivity and usage stats.</p>
               </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </AdminProtectedRoute>
  );
}
