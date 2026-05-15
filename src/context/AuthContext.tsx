"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEMO_LOGIN_EMAIL,
  DEMO_LOGIN_PASSWORD,
  DEMO_DISPLAY_NAME,
  DEMO_WORKSPACE_EMAIL,
  SESSION_STORAGE_KEY,
} from "@/lib/demoAuthCredentials";

interface AuthSession {
  email: string;
}

interface AuthContextValue {
  ready: boolean;
  isAuthenticated: boolean;
  session: AuthSession | null;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => void;
  profile: {
    displayName: string;
    workspaceEmail: string;
    loginEmail: string;
  };
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredSession(): AuthSession | null {
  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { email?: string };
    if (parsed.email === DEMO_LOGIN_EMAIL) return { email: parsed.email };
  } catch {
    /* ignore */
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(readStoredSession());
    setReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const trimmed = email.trim().toLowerCase();
    if (trimmed !== DEMO_LOGIN_EMAIL.toLowerCase())
      return { ok: false as const, error: "Incorrect email." };
    if (password !== DEMO_LOGIN_PASSWORD) return { ok: false as const, error: "Incorrect password." };
    const next: AuthSession = { email: DEMO_LOGIN_EMAIL };
    setSession(next);
    try {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    return { ok: true as const };
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    try {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      isAuthenticated: session != null,
      session,
      login,
      logout,
      profile: {
        displayName: DEMO_DISPLAY_NAME,
        workspaceEmail: DEMO_WORKSPACE_EMAIL,
        loginEmail: DEMO_LOGIN_EMAIL,
      },
    }),
    [ready, session, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
