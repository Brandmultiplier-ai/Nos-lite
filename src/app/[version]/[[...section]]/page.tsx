import { redirect } from "next/navigation";
import { isSectionId, isThemeVersion, normalizeVersion } from "@/routing/versionRoutes";

interface VersionPageProps {
  params: Promise<{
    version: string;
    section?: string[];
  }>;
}

/** Section UI lives in the version layout; this page only validates the URL segment. */
export default async function VersionPage({ params }: VersionPageProps) {
  const { version: versionParam, section: sectionSegments } = await params;

  if (!isThemeVersion(versionParam)) {
    redirect("/v1");
  }

  const version = normalizeVersion(versionParam);

  if (sectionSegments?.length && !isSectionId(sectionSegments[0])) {
    redirect(`/${version}`);
  }

  return null;
}
