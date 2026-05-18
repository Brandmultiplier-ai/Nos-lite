"use client";

import { useEffect, useRef, useState } from "react";
import { getWorkspaceSwitcherDisplay } from "@/data/anonymousWorkspace";
import { navItems, workspaceList } from "@/data/nosData";
import { useDashboard } from "@/context/DashboardContext";
import { useAuth } from "@/context/AuthContext";
import type { SectionId, WorkspaceId } from "@/types/nos";
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
  const { section, workspaceId, data, setSection, switchWorkspace } = useDashboard();
  const { profile, logout } = useAuth();
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const workspaceWrapRef = useRef<HTMLDivElement>(null);

  const currentWs = getWorkspaceSwitcherDisplay(workspaceId);

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
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[250px] flex-col border-r border-white/[0.08] bg-gradient-to-b from-[#141126]/95 via-[#0D1225]/95 to-[#06090F]/96 px-4 py-6 shadow-[12px_0_40px_rgba(0,0,0,0.42)] backdrop-blur-xl">
      <div className="mb-6">
        <NarrativeOsLogo size="sidebar" />
      </div>

      <div ref={workspaceWrapRef} className="relative mb-6">
        <button
          type="button"
          onClick={() => setWorkspaceMenuOpen((o) => !o)}
          className="flex w-full items-center gap-3 rounded-xl border border-white/[0.1] bg-black/30 px-3 py-2.5 text-left transition hover:border-[#4940c6]/35"
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
            <span className="block truncate text-sm font-semibold text-white">{currentWs.name}</span>
          </span>
          <HiOutlineChevronDown
            className={`h-4 w-4 shrink-0 text-[#A0AEC0] transition ${workspaceMenuOpen ? "rotate-180" : ""}`}
          />
        </button>

        {workspaceMenuOpen && (
          <div
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 rounded-xl border border-white/[0.1] bg-[#0c101c]/98 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl"
            role="listbox"
          >
            <p className="px-2 pb-1 pt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#718096]">
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
                    active
                      ? "bg-[#4940c6]/22 text-white ring-1 ring-[#4940c6]/40"
                      : "text-[#A0AEC0] hover:bg-white/[0.06] hover:text-white"
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
              onClick={() => setSection(item.id)}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-white/[0.06] text-white shadow-[0_0_0_1px_rgba(73,64,198,0.35)]"
                  : "text-[#A0AEC0] hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-[#4940c6]" />
              )}
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  active
                    ? "bg-gradient-to-br from-[#3a32a0] to-[#4940c6] text-white"
                    : "bg-[#1B254B] text-[#4940c6] group-hover:bg-[#1f2a56]"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2 border-t border-white/[0.06] pt-4">
        <button
          type="button"
          onClick={() => setAccountOpen((o) => !o)}
          className="flex w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-black/25 px-3 py-2.5 text-left transition hover:border-[#4940c6]/30"
          aria-expanded={accountOpen}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2B2F45] to-[#151823] text-white ring-2 ring-[#4940c6]/40">
            <HiOutlineUser className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-white">{profile.displayName}</span>
            <span className="block truncate text-[11px] text-[#A0AEC0]">{profile.workspaceEmail}</span>
          </span>
          <HiOutlineCog className="h-4 w-4 shrink-0 text-[#A0AEC0]" />
        </button>

        {accountOpen && (
          <div className="rounded-xl border border-white/[0.08] bg-black/35 p-3 backdrop-blur-md">
            <p className="text-xs font-semibold text-white">Account</p>
            <p className="mt-1 text-[11px] text-[#A0AEC0]">
              Signed in as{" "}
              <span className="font-medium text-white">{profile.loginEmail}</span>
            </p>
            <p className="mt-2 text-[11px] text-[#718096]">
              Active client: <span className="text-[#A0AEC0]">{data.name}</span>
            </p>
            <button
              type="button"
              className="mt-3 w-full rounded-lg border border-white/[0.1] py-2 text-center text-xs font-medium text-white transition hover:bg-white/[0.06]"
              onClick={() => {
                setAccountOpen(false);
                setSection("settings");
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
