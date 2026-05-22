import type { SectionId } from "@/types/nos";

export const THEME_VERSIONS = ["v1", "v2", "v3", "v4", "v5", "v6"] as const;
export type ThemeVersion = (typeof THEME_VERSIONS)[number];

export const DEFAULT_THEME_VERSION: ThemeVersion = "v1";
export const DEFAULT_SECTION: SectionId = "overview";

const SECTION_IDS: SectionId[] = [
  "overview",
  "search-intelligence",
  "brand-intelligence",
  "measurement-framework",
  "competitive-positioning",
  "narrative-intelligence",
  "website-signals",
  "linkedin",
  "email-outreach",
  "content",
  "settings",
];

export function isThemeVersion(value: string): value is ThemeVersion {
  return (THEME_VERSIONS as readonly string[]).includes(value);
}

export function isSectionId(value: string): value is SectionId {
  return (SECTION_IDS as readonly string[]).includes(value);
}

/** Parse optional catch-all segment(s) into a section id. */
export function parseSectionSlug(segments?: string[]): SectionId {
  if (!segments?.length) return DEFAULT_SECTION;
  const slug = segments[0];
  if (isSectionId(slug)) return slug;
  return DEFAULT_SECTION;
}

export function sectionToSlug(section: SectionId): string {
  return section === DEFAULT_SECTION ? "" : section;
}

export function buildVersionPath(version: ThemeVersion, section: SectionId = DEFAULT_SECTION): string {
  const slug = sectionToSlug(section);
  return slug ? `/${version}/${slug}` : `/${version}`;
}

export function normalizeVersion(value: string): ThemeVersion {
  return isThemeVersion(value) ? value : DEFAULT_THEME_VERSION;
}
