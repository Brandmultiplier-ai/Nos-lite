import { getVersionTheme } from "@/theme/versionThemes";
import { DEFAULT_THEME_VERSION } from "@/routing/versionRoutes";

/** Default stat card classes (v1 baseline) for non-themed contexts. */
export const orangeStatCardClassName = getVersionTheme(DEFAULT_THEME_VERSION).statCardClassName;
