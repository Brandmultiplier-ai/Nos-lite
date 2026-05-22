import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { isThemeVersion, normalizeVersion } from "@/routing/versionRoutes";

interface VersionLayoutProps {
  children: React.ReactNode;
  params: Promise<{ version: string }>;
}

export default async function VersionLayout({ children, params }: VersionLayoutProps) {
  const { version: versionParam } = await params;

  if (!isThemeVersion(versionParam)) {
    redirect("/v1");
  }

  const version = normalizeVersion(versionParam);

  return (
    <>
      <DashboardShell version={version} />
      {children}
    </>
  );
}
