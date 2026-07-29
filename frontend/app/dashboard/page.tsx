"use client";

import { PageShell, SectionHeader, FadeIn } from "@/src/components/dashboard/PageShell";
import { WelcomeSection } from "@/src/components/dashboard/WelcomeSection";
import { AgendaTimeline } from "@/src/components/dashboard/AgendaTimeline";
import { FocusRings } from "@/src/components/dashboard/FocusRings";
import { ProgressAnalytics } from "@/src/components/dashboard/ProgressAnalytics";
import { ExamsGrid } from "@/src/components/dashboard/ExamsGrid";
import { NotesGrid } from "@/src/components/dashboard/NotesGrid";
import { SmartInsights } from "@/src/components/dashboard/SmartInsights";
import { QuickActions } from "@/src/components/dashboard/QuickActions";

export default function DashboardPage() {
  return (
    <PageShell>
      <div className="space-y-12">
        <FadeIn>
          <WelcomeSection />
        </FadeIn>

        <section>
          <SectionHeader label="Today" title="Your Agenda" />
          <FadeIn delay={0.05}>
            <div className="rounded-3xl border border-slate-800/70 bg-white/[0.02] p-6">
              <AgendaTimeline />
            </div>
          </FadeIn>
        </section>

        <section>
          <SectionHeader label="Performance" title="Focus & Productivity" />
          <FadeIn delay={0.05}>
            <FocusRings />
          </FadeIn>
        </section>

        <section>
          <SectionHeader label="Analytics" title="Progress Overview" />
          <FadeIn delay={0.05}>
            <div className="rounded-3xl border border-slate-800/70 bg-white/[0.02] p-6">
              <ProgressAnalytics />
            </div>
          </FadeIn>
        </section>

        <section>
          <SectionHeader label="Preparation" title="Upcoming Exams" />
          <FadeIn delay={0.05}>
            <ExamsGrid />
          </FadeIn>
        </section>

        <section>
          <SectionHeader
            label="Workspace"
            title="Recent Notes"
            action={
               <button className="rounded-xl border border-slate-700 bg-white/5 px-3 py-2 text-base font-semibold text-slate-200 transition-colors hover:border-indigo-500/50 hover:text-indigo-200">
                 View all
               </button>
            }
          />
          <FadeIn delay={0.05}>
            <NotesGrid />
          </FadeIn>
        </section>

        <section>
          <SectionHeader label="AI" title="Smart Insights" />
          <FadeIn delay={0.05}>
            <SmartInsights />
          </FadeIn>
        </section>
      </div>

      <QuickActions />
    </PageShell>
  );
}
