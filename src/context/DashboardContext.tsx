"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useParams } from "next/navigation";
import { mergeAnonymousWorkspaceProfile } from "@/data/anonymousWorkspace";
import { getWorkspaceDataWithDemo } from "@/data/demoWorkspace";
import { parseSectionSlug } from "@/routing/versionRoutes";
import type { SectionId, WorkspaceData, WorkspaceId } from "@/types/nos";

interface DashboardContextValue {
  workspaceId: WorkspaceId;
  section: SectionId;
  data: WorkspaceData;
  workspaceTransitioning: boolean;
  setWorkspaceId: (id: WorkspaceId) => void;
  switchWorkspace: (id: WorkspaceId) => void;
  setSection: (section: SectionId) => void;
}

const WORKSPACE_SWITCH_DELAY_MS = 520;

const DashboardContext = createContext<DashboardContextValue | null>(null);

function sectionFromParams(params: ReturnType<typeof useParams>): SectionId {
  const sectionParam = params.section;
  const segments = Array.isArray(sectionParam)
    ? sectionParam
    : sectionParam
      ? [sectionParam]
      : undefined;
  return parseSectionSlug(segments);
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const [workspaceId, setWorkspaceId] = useState<WorkspaceId>("alpha");
  const [section, setSection] = useState<SectionId>(() => sectionFromParams(params));
  const [workspaceTransitioning, setWorkspaceTransitioning] = useState(false);
  const switchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const data = useMemo(
    () => mergeAnonymousWorkspaceProfile(workspaceId, getWorkspaceDataWithDemo(workspaceId)),
    [workspaceId],
  );

  const handleSetWorkspaceId = useCallback((id: WorkspaceId) => {
    setWorkspaceId(id);
  }, []);

  const switchWorkspace = useCallback(
    (id: WorkspaceId) => {
      if (id === workspaceId) return;
      if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
      setWorkspaceTransitioning(true);
      switchTimerRef.current = setTimeout(() => {
        switchTimerRef.current = null;
        setWorkspaceId(id);
        setWorkspaceTransitioning(false);
      }, WORKSPACE_SWITCH_DELAY_MS);
    },
    [workspaceId],
  );

  const handleSetSection = useCallback((next: SectionId) => {
    setSection(next);
  }, []);

  const value = useMemo(
    () => ({
      workspaceId,
      section,
      data,
      workspaceTransitioning,
      setWorkspaceId: handleSetWorkspaceId,
      switchWorkspace,
      setSection: handleSetSection,
    }),
    [workspaceId, section, data, workspaceTransitioning, handleSetWorkspaceId, switchWorkspace, handleSetSection],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return ctx;
}
