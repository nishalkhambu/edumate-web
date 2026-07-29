"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchAnalytics = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((c) => c.startsWith("edumate_session="))
          ?.split("=")[1];

        if (!token) {
          setError("No session token found");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/v1/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.message || "Failed to load analytics");
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (cancelled) return;
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load analytics");
        setLoading(false);
      }
    };

    fetchAnalytics();
    return () => { cancelled = true; };
  }, []);

  return (
    <AdminProtectedRoute>
      <div className="space-y-8">
        <SectionHeader label="Platform" title="Analytics Overview" />

        {loading && (
          <div className="rounded-3xl border border-slate-800/70 bg-white/[0.02] p-10 text-center">
             <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />
             <p className="mt-3 text-base text-slate-400">Loading analytics...</p>
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-300">
            {error}
          </div>
        )}

        {!loading && !error && (
           <div className="rounded-3xl border border-slate-800/70 bg-white/[0.02] p-8">
             <p className="text-base text-slate-400">Analytics data is available via the API. Connect this view to your preferred charts for platform-wide insights.</p>
          </div>
        )}
      </div>
    </AdminProtectedRoute>
  );
}
