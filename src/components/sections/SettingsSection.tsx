"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { useSectionThemeCopy } from "@/theme/sectionThemeCopy";

export function SettingsSection() {
  const { logout, profile } = useAuth();
  const copy = useSectionThemeCopy();

  const fieldClass = copy.themed
    ? `${copy.tc.innerPanel} p-4`
    : "rounded-xl border border-white/[0.08] bg-black/25 p-4";
  const labelClass = copy.themed
    ? copy.tc.eyebrow
    : "text-[11px] font-semibold uppercase tracking-[0.08em] text-[#718096]";

  return (
    <div className="space-y-6">
      <GlassCard className="p-8">
        <h2 className={copy.h2}>Workspace settings</h2>
        <p className={`mt-1 max-w-xl text-sm ${copy.muted}`}>
          Identity used across sequences, attribution notes, and client-facing dashboards.
        </p>

        <dl className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className={fieldClass}>
            <dt className={labelClass}>Full name</dt>
            <dd className={`mt-2 text-lg font-semibold ${copy.ink}`}>{profile.displayName}</dd>
          </div>
          <div className={fieldClass}>
            <dt className={labelClass}>Workspace email</dt>
            <dd className={`mt-2 text-lg font-semibold ${copy.themed ? copy.tc.link : "text-[#00D4FF]"}`}>
              {profile.workspaceEmail}
            </dd>
          </div>
          <div className={`${fieldClass} sm:col-span-2`}>
            <dt className={labelClass}>Dashboard login email</dt>
            <dd className={`mt-2 text-sm font-medium ${copy.ink}`}>{profile.loginEmail}</dd>
            <p className={`mt-2 text-[11px] ${copy.muteSm}`}>Password is validated only in this demo build.</p>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => logout()}
          className={
            copy.themed
              ? `mt-10 w-full rounded-[999px] border border-[var(--theme-danger)]/35 bg-[var(--theme-danger-soft)] py-3 text-sm font-medium ${copy.tc.dangerText} transition hover:opacity-90`
              : "mt-10 w-full rounded-lg border border-[#EE5D50]/35 bg-[#EE5D50]/14 py-3 text-sm font-semibold text-[#fca5a5] transition hover:bg-[#EE5D50]/22"
          }
        >
          Log out
        </button>
      </GlassCard>
    </div>
  );
}
