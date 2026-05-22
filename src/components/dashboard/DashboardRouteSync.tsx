"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { parseSectionSlug } from "@/routing/versionRoutes";
import { useDashboard } from "@/context/DashboardContext";

/** Keeps dashboard section state aligned with the URL (back/forward, direct links). */
export function DashboardRouteSync() {
  const params = useParams();
  const { setSection } = useDashboard();

  const sectionParam = params.section;
  const segments = Array.isArray(sectionParam)
    ? sectionParam
    : sectionParam
      ? [sectionParam]
      : undefined;
  const sectionFromUrl = parseSectionSlug(segments);

  useEffect(() => {
    setSection(sectionFromUrl);
  }, [sectionFromUrl, setSection]);

  return null;
}
