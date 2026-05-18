import {
  augmentOverviewIntelligence,
  buildAllEmailPeriods,
  buildAllLinkedInPeriods,
  toSignalFeedFromPeople,
} from "@/data/analyticsBuilders";
import { buildWorkspaceIntelligence } from "@/data/v11IntelligenceBuilders";
import type {
  NosDemoDatabase,
  NosDemoPerson,
  SignalFeedRow,
  WebsiteRow,
  WebsiteStat,
  WorkspaceData,
  WorkspaceId,
} from "@/types/nos";
import rawDemo from "./nos_demo_data.json";
import { workspaces } from "./nosData";

const demoDb = rawDemo as NosDemoDatabase;

function statusRank(s: "Hot" | "Warm" | "Cold"): number {
  if (s === "Hot") return 3;
  if (s === "Warm") return 2;
  return 1;
}

function formatTimeOnSite(avgScore: number, memberCount: number): string {
  const base = Math.max(2, Math.min(12, Math.round(avgScore + memberCount * 0.15)));
  const secs = Math.min(59, Math.round((avgScore * 7 + memberCount * 3) % 59));
  return `${base}m ${String(secs).padStart(2, "0")}s`;
}

function formatPagesVisited(memberCount: number, industry: string): string {
  const paths =
    memberCount >= 5
      ? "/pricing, /demo, /security, /blog"
      : memberCount >= 3
        ? "/pricing, /product, /about"
        : "/pricing, /landing";
  return `${paths} · ${industry}`;
}

function formatReturnVisitorPct(hotPct: number, peopleLen: number): string {
  if (peopleLen === 0) return "—";
  const raw = Math.min(45, 18 + hotPct / 3);
  const rounded = Math.round(raw * 100) / 100;
  return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(2)}%`;
}

function buildWebsiteRows(people: NosDemoPerson[]): WebsiteRow[] {
  const byCompany = new Map<string, NosDemoPerson[]>();
  for (const p of people) {
    const arr = byCompany.get(p.company) ?? [];
    arr.push(p);
    byCompany.set(p.company, arr);
  }

  const rows: WebsiteRow[] = [];
  for (const plist of byCompany.values()) {
    const company = plist[0].company;
    const industry = plist[0].companyIndustry;
    const avgScore = plist.reduce((s, x) => s + x.score, 0) / plist.length;
    const status = plist.reduce(
      (best, x) => (statusRank(x.status) > statusRank(best) ? x.status : best),
      plist[0].status,
    );
    rows.push({
      company,
      industry,
      pagesVisited: formatPagesVisited(plist.length, industry),
      timeOnSite: formatTimeOnSite(avgScore, plist.length),
      score: Math.round(avgScore * 10) / 10,
      status,
    });
  }
  rows.sort((a, b) => b.score - a.score);
  return rows;
}

function buildWebsiteStats(people: NosDemoPerson[], companyCount: number): WebsiteStat[] {
  const identified = people.length;
  const hotPct =
    people.length === 0
      ? 0
      : Math.round((people.filter((p) => p.status === "Hot").length / people.length) * 100);

  return [
    { label: "Visitors Identified", value: identified.toLocaleString("en-US") },
    { label: "Companies Detected", value: companyCount.toLocaleString("en-US") },
    {
      label: "Avg Time on Site",
      value: people.length === 0 ? "—" : `${(4 + (identified % 7) / 10).toFixed(1)}m`,
    },
    {
      label: "Return Visitors",
      value: formatReturnVisitorPct(hotPct, people.length),
    },
  ];
}

function scaleKpiValue(label: string, baseValue: string, peopleCount: number): string {
  const n = peopleCount;
  if (label.includes("Signals")) return Math.max(800, n * 3 + 400).toLocaleString("en-US");
  if (label.includes("Leads")) return Math.max(120, Math.round(n * 0.45)).toLocaleString("en-US");
  if (label.includes("Outreach")) return Math.max(200, Math.round(n * 1.2)).toLocaleString("en-US");
  if (label.includes("Meetings")) return Math.max(12, Math.round(n * 0.04)).toLocaleString("en-US");
  return baseValue;
}

export function getDemoPeople(workspaceId: WorkspaceId): NosDemoPerson[] {
  return demoDb.people.filter((p) => p.workspaceId === workspaceId);
}

export function getWorkspaceDataWithDemo(workspaceId: WorkspaceId): WorkspaceData {
  const base = workspaces[workspaceId];
  const people = getDemoPeople(workspaceId);
  if (people.length === 0) {
    const emailByPeriod = buildAllEmailPeriods(base.email, [], workspaceId);
    const linkedinByPeriod = buildAllLinkedInPeriods(base.linkedin, [], workspaceId);
    const e30 = emailByPeriod["30d"];
    const intel = augmentOverviewIntelligence(base.overview, [], false);

    return {
      ...base,
      intelligence: buildWorkspaceIntelligence(workspaceId, []),
      overview: {
        ...base.overview,
        narrativeInsights: intel.narrativeInsights,
        crossChannelWeekly: intel.crossChannelWeekly,
        channelPulse: intel.channelPulse,
      },
      linkedin: {
        stats: linkedinByPeriod["30d"].stats,
        engagementChart: linkedinByPeriod["30d"].engagementChart,
        feed: linkedinByPeriod["30d"].feed,
        byPeriod: linkedinByPeriod,
      },
      email: {
        stats: e30.stats,
        weeklyChart: e30.weeklyChart,
        sequences: e30.sequences,
        campaigns: e30.campaigns,
        contacts: e30.contacts,
        byPeriod: emailByPeriod,
      },
      demoPeople: [],
    };
  }

  const websiteRows = buildWebsiteRows(people);
  const websiteStats = buildWebsiteStats(people, websiteRows.length);

  const intel = augmentOverviewIntelligence(base.overview, people, true);

  let signalFeed: SignalFeedRow[] = toSignalFeedFromPeople(people, 22);
  if (signalFeed.length < 6) signalFeed = base.overview.signalFeed;

  const overview = {
    ...base.overview,
    kpis: base.overview.kpis.map((k) => ({
      ...k,
      value: scaleKpiValue(k.label, k.value, people.length),
    })),
    signalFeed,
    narrativeInsights: intel.narrativeInsights,
    crossChannelWeekly: intel.crossChannelWeekly,
    channelPulse: intel.channelPulse,
  };

  const emailByPeriod = buildAllEmailPeriods(base.email, people, workspaceId);
  const e30 = emailByPeriod["30d"];

  const linkedinByPeriod = buildAllLinkedInPeriods(base.linkedin, people, workspaceId);
  const l30 = linkedinByPeriod["30d"];

  return {
    ...base,
    intelligence: buildWorkspaceIntelligence(workspaceId, people),
    overview,
    website: {
      stats: websiteStats,
      rows: websiteRows,
    },
    linkedin: {
      stats: l30.stats,
      engagementChart: l30.engagementChart,
      feed: l30.feed,
      byPeriod: linkedinByPeriod,
    },
    email: {
      stats: e30.stats,
      weeklyChart: e30.weeklyChart,
      sequences: e30.sequences,
      campaigns: e30.campaigns,
      contacts: e30.contacts,
      byPeriod: emailByPeriod,
    },
    demoPeople: people,
  };
}

export const DEMO_STATS = {
  companyCount: demoDb.companies.length,
  peopleCount: demoDb.people.length,
  peopleByWorkspace: {
    alpha: demoDb.people.filter((p) => p.workspaceId === "alpha").length,
    beta: demoDb.people.filter((p) => p.workspaceId === "beta").length,
    gamma: demoDb.people.filter((p) => p.workspaceId === "gamma").length,
  } as Record<WorkspaceId, number>,
};
