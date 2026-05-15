import { workspaceList } from "@/data/nosData";
import type { WorkspaceData, WorkspaceId } from "@/types/nos";

const ANONYMOUS: Record<WorkspaceId, { name: string; initials: string }> = {
  alpha: { name: "Anonymous Client 1", initials: "C1" },
  beta: { name: "Anonymous Client 2", initials: "C2" },
  gamma: { name: "Anonymous Client 3", initials: "C3" },
};

export function mergeAnonymousWorkspaceProfile(workspaceId: WorkspaceId, data: WorkspaceData): WorkspaceData {
  const anon = ANONYMOUS[workspaceId];
  return {
    ...data,
    name: anon.name,
    initials: anon.initials,
  };
}

export function getWorkspaceSwitcherDisplay(id: WorkspaceId) {
  const base = workspaceList.find((w) => w.id === id) ?? workspaceList[0];
  const anon = ANONYMOUS[id];
  return {
    id,
    name: anon.name,
    initials: anon.initials,
    avatarColor: base.avatarColor,
  };
}
