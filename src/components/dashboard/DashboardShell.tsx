"use client";

// AUTH DISABLED — re-enable when login is required again.
// import { LoginScreen } from "@/components/auth/LoginScreen";
import { DashboardRouteSync } from "@/components/dashboard/DashboardRouteSync";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { ContentSection } from "@/components/sections/ContentSection";
import { EmailOutreachSection } from "@/components/sections/EmailOutreachSection";
import { LinkedInSection } from "@/components/sections/LinkedInSection";
import { OverviewSection } from "@/components/sections/OverviewSection";
import { BrandIntelligenceSection } from "@/components/sections/BrandIntelligenceSection";
import { CompetitivePositioningSection } from "@/components/sections/CompetitivePositioningSection";
import { MeasurementFrameworkSection } from "@/components/sections/MeasurementFrameworkSection";
import { NarrativeIntelligenceSection } from "@/components/sections/NarrativeIntelligenceSection";
import { SearchIntelligenceSection } from "@/components/sections/SearchIntelligenceSection";
import { SettingsSection } from "@/components/sections/SettingsSection";
import { WebsiteSignalsSection } from "@/components/sections/WebsiteSignalsSection";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";
import type { ThemeVersion } from "@/routing/versionRoutes";
import type { SectionId } from "@/types/nos";
import { ThemeProvider, useTheme } from "@/theme/ThemeProvider";

function SectionContent() {
  const { section, workspaceId } = useDashboard();
  const contentKey = `${workspaceId}-${section}`;

  switch (section) {
    case "overview":
      return <OverviewSection key={contentKey} />;
    case "search-intelligence":
      return <SearchIntelligenceSection key={contentKey} />;
    case "brand-intelligence":
      return <BrandIntelligenceSection key={contentKey} />;
    case "measurement-framework":
      return <MeasurementFrameworkSection key={contentKey} />;
    case "competitive-positioning":
      return <CompetitivePositioningSection key={contentKey} />;
    case "narrative-intelligence":
      return <NarrativeIntelligenceSection key={contentKey} />;
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
  const { theme, version } = useTheme();

  return (
    <div className={`relative min-h-screen ${theme.pageClassName}`}>
      <DashboardRouteSync />
      {theme.showAmbientGlow && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div
            className="absolute -left-32 -top-32 h-96 w-96 rounded-full blur-[130px]"
            style={{ backgroundColor: theme.cssVars["--theme-glow-primary"] }}
          />
          <div
            className="absolute right-0 top-1/4 h-72 w-80 rounded-full blur-[120px]"
            style={{ backgroundColor: theme.cssVars["--theme-glow-accent"] }}
          />
          {version !== "v3" && version !== "v4" && (
            <>
              <div className="absolute top-1/3 h-80 w-[42vw] rounded-full bg-[#2a2460]/18 blur-[130px]" />
              <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#0a0a0a]/60 blur-[140px]" />
            </>
          )}
          {version === "v4" && (
            <>
              <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full blur-[120px]" style={{ backgroundColor: "rgba(168, 85, 247, 0.08)" }} />
              <div className="absolute -bottom-24 right-1/3 h-64 w-64 rounded-full blur-[100px]" style={{ backgroundColor: "rgba(252, 211, 77, 0.06)" }} />
            </>
          )}
        </div>
      )}

      <Sidebar />

      <main className={`relative ${theme.mainOffsetClass} min-h-screen px-5 py-5 md:px-8 ${theme.isLightTheme ? "md:px-10 md:py-8" : ""}`}>
        <div className="mx-auto w-full max-w-[1400px] min-w-0">
          <TopBar />
          <SectionContent />
        </div>
      </main>

      {workspaceTransitioning && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm ${theme.isLightTheme ? "bg-[#141413]/40" : "bg-black/75"}`}
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className={`flex flex-col items-center gap-4 rounded-[24px] border px-10 py-8 shadow-[var(--theme-elevated-shadow)] ${theme.isLightTheme ? "border-[var(--theme-hairline)] bg-[#FFFFFF]" : "border-white/[0.1] bg-[#0a0a0a] shadow-[0_24px_48px_rgba(0,0,0,0.55)]"}`}>
            <div
              className="h-11 w-11 animate-spin rounded-full border-2 border-t-transparent"
              style={{ borderColor: theme.cssVars["--theme-spinner"], borderTopColor: "transparent" }}
              aria-hidden
            />
            <p className={`text-sm font-semibold ${theme.isLightTheme ? "text-[var(--theme-ink)]" : "text-white"}`}>
              Switching workspace…
            </p>
            <p className={`max-w-[220px] text-center text-xs ${theme.isLightTheme ? "text-[var(--theme-mute)]" : "text-[#A0AEC0]"}`}>
              Updating signals, KPIs, and dashboards for your client workspace.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function AuthenticatedShell({ initialSection }: { initialSection: SectionId }) {
  const { ready, isAuthenticated } = useAuth();
  const { theme } = useTheme();

  if (!ready) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${theme.pageClassName} ${theme.isLightTheme ? "text-[var(--theme-ink)]" : "text-white"}`}>
        <div
          className="h-11 w-11 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: theme.cssVars["--theme-spinner"], borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  // AUTH DISABLED — restore login gate before production auth rollout.
  // if (!isAuthenticated) {
  //   return <LoginScreen />;
  // }

  return (
    <DashboardProvider initialSection={initialSection}>
      <DashboardContent />
    </DashboardProvider>
  );
}

export function DashboardShell({
  version,
  initialSection = "overview",
}: {
  version: ThemeVersion;
  initialSection?: SectionId;
}) {
  return (
    <AuthProvider>
      <ThemeProvider version={version}>
        <AuthenticatedShell initialSection={initialSection} />
      </ThemeProvider>
    </AuthProvider>
  );
}
