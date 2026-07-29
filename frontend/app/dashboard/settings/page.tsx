"use client";

import { PageShell, SectionHeader, FadeIn } from "@/src/components/dashboard/PageShell";
import { useAuth } from "@/src/contexts/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();
  return (
    <PageShell>
      <SectionHeader label="Account" title="Settings" />

      <FadeIn>
        <div className="max-w-2xl space-y-4">
          <div className="rounded-3xl border border-slate-800/70 bg-white/[0.02] p-6">
             <h3 className="text-base font-semibold text-slate-200">Profile</h3>
<div className="mt-4 space-y-3">
                <div>
                  <p className="text-sm text-slate-500">Name</p>
                  <p className="text-base font-medium text-slate-100">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="text-base font-medium text-slate-100">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Role</p>
                  <p className="text-base font-medium capitalize text-slate-100">{user?.role}</p>
                </div>
              </div>
           </div>
<div className="rounded-3xl border border-slate-800/70 bg-white/[0.02] p-10">
              <h3 className="text-base font-semibold text-slate-200">Preferences</h3>
             <p className="mt-2 text-base text-slate-400">Theme, notifications and study preferences will live here.</p>
          </div>
        </div>
      </FadeIn>
    </PageShell>
  );
}
