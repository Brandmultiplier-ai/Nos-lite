"use client";

import { useState } from "react";
import { NarrativeOsLogo } from "@/components/branding/NarrativeOsLogo";
import { useAuth } from "@/context/AuthContext";

export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await login(email, password);
    setBusy(false);
    if (!res.ok) setError(res.error);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#000000] px-4 py-16 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-[#4940c6]/14 blur-[120px]" />
        <div className="absolute -bottom-32 right-0 h-[380px] w-[460px] rounded-full bg-[#00D4FF]/8 blur-[120px]" />
      </div>
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-[420px] rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 shadow-none backdrop-blur-xl supports-[backdrop-filter]:bg-white/[0.03]"
      >
        <div className="mb-10 flex justify-center">
          <NarrativeOsLogo size="hero" />
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="nos-email" className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A0AEC0]">
              Email
            </label>
            <input
              id="nos-email"
              name="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@workspace.com"
              className="mt-1 w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none backdrop-blur-sm placeholder:text-[#5C678A] focus:border-[#4940c6]/60"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="nos-password" className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A0AEC0]">
                Password
              </label>
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPw((s) => !s)}
                className="text-[11px] text-[#7C83A8] underline-offset-2 hover:text-white hover:underline"
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="nos-password"
              name="password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none backdrop-blur-sm focus:border-[#4940c6]/60"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-xs text-[#EE5D50]">{error}</p>}

        <button
          type="submit"
          disabled={busy || !email.trim() || password.length === 0}
          className="mt-6 w-full rounded-lg bg-[#4940c6] py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {busy ? "Signing in…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
