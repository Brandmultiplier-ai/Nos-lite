"use client";

import { LoginScreen } from "@/components/auth/LoginScreen";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { ContentSection } from "@/components/sections/ContentSection";
import { EmailOutreachSection } from "@/components/sections/EmailOutreachSection";
import { LinkedInSection } from "@/components/sections/LinkedInSection";
import { OverviewSection } from "@/components/sections/OverviewSection";
import { SettingsSection } from "@/components/sections/SettingsSection";
import { WebsiteSignalsSection } from "@/components/sections/WebsiteSignalsSection";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";

function SectionContent() {
  const { section, workspaceId } = useDashboard();
  const contentKey = `${workspaceId}-${section}`;

  switch (section) {
    case "overview":
      return <OverviewSection key={contentKey} />;
    case "website-signals":
      return <WebsiteSignalsSection key={contentKey} />;
    case "linkedin":
      return <LinkedInSection key={contentKey} />;
    case "email-outreach":
      return <EmailOutreachSection key={contentKey} />;
    case "content":
      return <ContentSection key={contentKey} />;
    case "settings":
      return <SettingsSection key={contentKey} />;
    default:
      return <OverviewSection key={contentKey} />;
  }
}

function DashboardContent() {
  const { workspaceTransitioning } = useDashboard();

  return (
    <div className="relative min-h-screen bg-[#000000]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#4940c6]/14 blur-[130px]" />
        <div className="absolute right-0 top-1/4 h-72 w-80 rounded-full bg-[#f36901]/8 blur-[120px]" />
        <div className="absolute top-1/3 h-80 w-[42vw] rounded-full bg-[#2a2460]/18 blur-[130px]" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#0a0a0a]/60 blur-[140px]" />
      </div>

      <Sidebar />

      <main className="relative ml-[250px] min-h-screen px-5 py-5 md:px-8">
        <div className="mx-auto w-full max-w-[1400px] min-w-0">
          <TopBar />
          <SectionContent />
        </div>
      </main>

      {workspaceTransitioning && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/[0.1] bg-[#0a0a0a] px-10 py-8 shadow-[0_24px_48px_rgba(0,0,0,0.55)]">
            <div
              className="h-11 w-11 animate-spin rounded-full border-2 border-[#4940c6] border-t-transparent"
              aria-hidden
            />
            <p className="text-sm font-semibold text-white">Switching workspace…</p>
            <p className="max-w-[220px] text-center text-xs text-[#A0AEC0]">
              Updating signals, KPIs, and dashboards for your client workspace.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function AuthenticatedShell() {
  const { ready, isAuthenticated } = useAuth();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#000000] text-white">
        <div className="h-11 w-11 animate-spin rounded-full border-2 border-[#4940c6] border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}

export function DashboardShell() {
  return (
    <AuthProvider>
      <AuthenticatedShell />
    </AuthProvider>
  );
}
