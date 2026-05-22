import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  isSectionId,
  isThemeVersion,
  normalizeVersion,
  parseSectionSlug,
} from "@/routing/versionRoutes";

interface VersionPageProps {
  params: Promise<{
    version: string;
    section?: string[];
  }>;
}

export default async function VersionPage({ params }: VersionPageProps) {
  const { version: versionParam, section: sectionSegments } = await params;

  if (!isThemeVersion(versionParam)) {
    redirect("/v1");
  }

  const version = normalizeVersion(versionParam);
  const section = parseSectionSlug(sectionSegments);

  if (sectionSegments?.length && !isSectionId(sectionSegments[0])) {
    redirect(`/${version}`);
  }

  return <DashboardShell version={version} initialSection={section} />;
}
