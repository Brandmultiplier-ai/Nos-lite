import { useDashboard } from "@/context/DashboardContext";
import { buildWorkspaceIntelligence } from "@/data/v11IntelligenceBuilders";

export function useWorkspaceIntelligence() {
  const { data, workspaceId } = useDashboard();
  return data.intelligence ?? buildWorkspaceIntelligence(workspaceId, data.demoPeople ?? []);
}
