"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getWorkspaceSwitcherDisplay } from "@/data/anonymousWorkspace";
import { navItems, workspaceList } from "@/data/nosData";
import { useDashboard } from "@/context/DashboardContext";
import { useAuth } from "@/context/AuthContext";
import { buildVersionPath } from "@/routing/versionRoutes";
import type { SectionId, WorkspaceId } from "@/types/nos";
import { useTheme } from "@/theme/ThemeProvider";
import { isBrandTheme, isCubicTheme, isMboardTheme, isVibrantTheme, useThemeClasses } from "@/theme/themeClasses";
import {
  HiOutlineChartPie,
  HiOutlineChevronDown,
  HiOutlineCog,
  HiOutlineDocumentText,
  HiOutlineGlobeAlt,
  HiOutlineLightningBolt,
  HiOutlineLogout,
  HiOutlineMail,
  HiOutlineSearch,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineTrendingUp,
  HiOutlineUser,
  HiOutlineUserGroup,
  HiOutlineViewGrid,
} from "react-icons/hi";
import type { IconType } from "react-icons";
import { NarrativeOsLogo } from "@/components/branding/NarrativeOsLogo";

const sectionIcons: Record<SectionId, IconType> = {
  overview: HiOutlineChartPie,
  "search-intelligence": HiOutlineSearch,
  "brand-intelligence": HiOutlineLightningBolt,
  "measurement-framework": HiOutlineTrendingUp,
  "competitive-positioning": HiOutlineViewGrid,
  "narrative-intelligence": HiOutlineSparkles,
  "website-signals": HiOutlineGlobeAlt,
  linkedin: HiOutlineUserGroup,
  "email-outreach": HiOutlineMail,
  content: HiOutlineDocumentText,
  settings: HiOutlineShieldCheck,
};

export function Sidebar() {
  const router = useRouter();
  const { version, theme } = useTheme();
  const tc = useThemeClasses();
  const onMboardSidebar = isMboardTheme(version);
  const sidebarInk = onMboardSidebar ? "text-white" : tc.inkText;
  const sidebarSecondary = onMboardSidebar ? "text-[#8B92B3]" : tc.secondaryText;
  const sidebarPanel = onMboardSidebar
    ? "rounded-xl border border-white/10 bg-white/[0.06]"
    : `${tc.panelFlat} ${tc.accentBorderMuted}`;
  const { section, workspaceId, data, setSection, switchWorkspace } = useDashboard();
  const { profile, logout } = useAuth();
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const workspaceWrapRef = useRef<HTMLDivElement>(null);

  const currentWs = getWorkspaceSwitcherDisplay(workspaceId);

  const navigateSection = (next: SectionId) => {
    if (next === section) return;
    setSection(next);
    router.replace(buildVersionPath(version, next), { scroll: false });
  };

  useEffect(() => {
    for (const item of navItems) {
      router.prefetch(buildVersionPath(version, item.id));
    }
  }, [router, version]);

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (!workspaceWrapRef.current?.contains(e.target as Node)) {
        setWorkspaceMenuOpen(false);
      }
    }
    if (workspaceMenuOpen) {
      document.addEventListener("mousedown", handlePointerDown);
    }
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [workspaceMenuOpen]);

  return (
    <aside
      className={`fixed left-0 top-0 z-30 flex h-screen flex-col px-4 py-6 ${theme.sidebarWidthClass} ${theme.sidebarClassName}`}
    >
      <div className="mb-6">
        <NarrativeOsLogo size="sidebar" />
      </div>

      <div ref={workspaceWrapRef} className="relative mb-6">
        <button
          type="button"
          onClick={() => setWorkspaceMenuOpen((o) => !o)}
          className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition ${sidebarPanel} hover:border-[var(--theme-hairline-strong,var(--theme-hairline))]`}
          aria-expanded={workspaceMenuOpen}
          aria-haspopup="listbox"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
            style={{ backgroundColor: currentWs.avatarColor }}
          >
            {currentWs.initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className={`block truncate text-sm font-semibold ${sidebarInk}`}>{currentWs.name}</span>
          </span>
          <HiOutlineChevronDown
            className={`h-4 w-4 shrink-0 ${sidebarSecondary} transition ${workspaceMenuOpen ? "rotate-180" : ""}`}
          />
        </button>

        {workspaceMenuOpen && (
          <div
            className={`absolute left-0 right-0 top-[calc(100%+6px)] z-40 ${tc.dropdown}`}
            role="listbox"
          >
            <p className={`px-2 pb-1 pt-0.5 ${version === "v2" ? "nos-section-eyebrow" : version === "v3" ? "nos-cubic-eyebrow" : version === "v4" ? "nos-vibrant-eyebrow" : version === "v5" ? "nos-mboard-eyebrow" : version === "v6" ? "nos-bm-eyebrow" : "text-[10px] font-semibold uppercase tracking-wider text-[#718096]"}`}>
              Client workspace
            </p>
            {workspaceList.map((ws) => {
              const active = workspaceId === ws.id;
              const row = getWorkspaceSwitcherDisplay(ws.id as WorkspaceId);
              return (
                <button
                  key={ws.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    switchWorkspace(ws.id as WorkspaceId);
                    setWorkspaceMenuOpen(false);
                  }}
                  className={`mb-0.5 flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition last:mb-0 ${
                    active ? tc.workspaceActive : tc.workspaceInactive
                  }`}
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
                    style={{ backgroundColor: row.avatarColor }}
                  >
                    {row.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{row.name}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = sectionIcons[item.id];
          const active = section === item.id;
          return (
            <button
              key={item.id}
              type="button"
              data-active={active || undefined}
              onClick={() => navigateSection(item.id)}
              className={`nos-sidebar-nav-item relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                version === "v3" || version === "v4" || version === "v5"
                  ? "rounded-lg"
                  : version === "v6"
                    ? "rounded-[2px]"
                    : "rounded-xl"
              } ${active ? "nos-sidebar-nav-item-active" : ""}`}
            >
              {active && version !== "v3" && version !== "v4" && version !== "v5" && version !== "v6" && (
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-full ${theme.navAccentBarClassName} h-6 w-0.5`}
                />
              )}
              <span className={active ? theme.navIconActiveClassName : theme.navIconClassName}>
                <Icon className="h-4 w-4" />
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className={`mt-auto space-y-2 border-t pt-4 ${tc.divider}`}>
        <button
          type="button"
          onClick={() => setAccountOpen((o) => !o)}
          className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${sidebarPanel} hover:border-[var(--theme-hairline-strong,var(--theme-hairline))]`}
          aria-expanded={accountOpen}
        >
          <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tc.accountAvatar}`}>
            <HiOutlineUser className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className={`block truncate text-sm font-semibold ${sidebarInk}`}>{profile.displayName}</span>
            <span className={`block truncate text-[11px] ${sidebarSecondary}`}>{profile.workspaceEmail}</span>
          </span>
          <HiOutlineCog className={`h-4 w-4 shrink-0 ${sidebarSecondary}`} />
        </button>

        {accountOpen && (
          <div className={tc.accountPanel}>
            <p className={`text-xs font-semibold ${onMboardSidebar ? "text-white" : tc.inkText}`}>Account</p>
            <p className={`mt-1 text-[11px] ${onMboardSidebar ? "text-[#8B92B3]" : tc.secondaryText}`}>
              Signed in as{" "}
              <span className={`font-medium ${onMboardSidebar ? "text-white" : tc.inkText}`}>{profile.loginEmail}</span>
            </p>
            <p className={`mt-2 text-[11px] ${onMboardSidebar ? "text-[#8B92B3]" : tc.mutedText}`}>
              Active client: <span className={onMboardSidebar ? "text-white" : tc.secondaryText}>{data.name}</span>
            </p>
            <button
              type="button"
              className={`mt-3 w-full rounded-lg border py-2 text-center text-xs font-medium transition ${onMboardSidebar ? "border-white/10 bg-white/[0.06] text-white hover:bg-white/10" : `${tc.panelFlat} ${tc.inkText} hover:bg-[var(--theme-canvas-card)]`}`}
              onClick={() => {
                setAccountOpen(false);
                navigateSection("settings");
              }}
            >
              Workspace settings
            </button>
            <button
              type="button"
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#EE5D50]/35 bg-[#EE5D50]/14 py-2 text-center text-xs font-semibold text-[#fca5a5] transition hover:bg-[#EE5D50]/22"
              onClick={() => {
                logout();
                setAccountOpen(false);
              }}
            >
              <HiOutlineLogout className="h-4 w-4" />
              Log out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
