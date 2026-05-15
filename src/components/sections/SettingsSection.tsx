"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/context/AuthContext";

export function SettingsSection() {
  const { logout, profile } = useAuth();

  return (
    <div className="space-y-6">
      <GlassCard className="p-8">
        <h2 className="font-display text-xl font-bold text-white">Workspace settings</h2>
        <p className="mt-1 max-w-xl text-sm text-[#A0AEC0]">
          Identity used across sequences, attribution notes, and client-facing dashboards.
        </p>

        <dl className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.08] bg-black/25 p-4">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#718096]">Full name</dt>
            <dd className="mt-2 text-lg font-semibold text-white">{profile.displayName}</dd>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-black/25 p-4">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#718096]">Workspace email</dt>
            <dd className="mt-2 text-lg font-semibold text-[#00D4FF]">{profile.workspaceEmail}</dd>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-black/25 p-4 sm:col-span-2">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#718096]">Dashboard login email</dt>
            <dd className="mt-2 text-sm font-medium text-white">{profile.loginEmail}</dd>
            <p className="mt-2 text-[11px] text-[#5C6689]">Password is validated only in this demo build.</p>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => logout()}
          className="mt-10 w-full rounded-lg border border-[#EE5D50]/35 bg-[#EE5D50]/14 py-3 text-sm font-semibold text-[#fca5a5] transition hover:bg-[#EE5D50]/22"
        >
          Log out
        </button>
      </GlassCard>
    </div>
  );
}
