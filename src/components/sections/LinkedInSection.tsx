"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useChartTheme } from "@/components/charts/chartTheme";
import { CardInfoTip } from "@/components/ui/CardInfoTip";
import { GlassCard } from "@/components/ui/GlassCard";
import { IntegrationStrip } from "@/components/ui/IntegrationStrip";
import { SimpleStatCard } from "@/components/ui/SimpleStatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDashboard } from "@/context/DashboardContext";
import { HiOutlineChevronRight, HiOutlineX } from "react-icons/hi";
import { useEffect, useMemo, useState } from "react";
import { CHART_CARD_DESCRIPTIONS, METRIC_DESCRIPTIONS } from "@/data/metricDescriptions";
import { IntelligencePanelHeader, MboardChartFrame } from "@/components/intelligence/mboardUi";
import { useSectionThemeCopy } from "@/theme/sectionThemeCopy";

type LinkedInView = "overview" | "contacts" | "campaigns";
type TimeWindow = "7d" | "30d" | "3m" | "month";

interface ContactItem {
  id: string;
  name: string;
  title: string;
  company: string;
  signal: string;
  actions: string;
  email: string;
  impactDate: string;
  list: string;
  owner: string;
  location: string;
  industry: string;
  companySize: string;
  linkedinUrl: string;
  status: "Hot" | "Warm" | "Cold";
  notes: string[];
}

interface CampaignItem {
  id: string;
  name: string;
  status: "Running" | "Paused";
  connected: number;
  invited: number;
  acceptedRate: number;
  replies: number;
  owner: string;
}

export function LinkedInSection() {
  const { chartGridStroke, tooltipContentStyle, chartColors, axisStyle } = useChartTheme();
  const copy = useSectionThemeCopy();
  const { tc, isV5, darkGradientGlass } = copy;
  const { data, workspaceId } = useDashboard();
  const { linkedin } = data;

  const [activeView, setActiveView] = useState<LinkedInView>("overview");
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("30d");
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<"all" | "Running" | "Paused">("all");
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [linkedinInsightTrendFilter, setLinkedinInsightTrendFilter] = useState<"both" | "invitations" | "messages">(
    "both",
  );

  const periodSlice = linkedin.byPeriod?.[timeWindow];
  const effectiveFeed = periodSlice?.feed ?? linkedin.feed;
  const effectiveStats = periodSlice?.stats ?? linkedin.stats;
  const effectiveEngagement = periodSlice?.engagementChart ?? linkedin.engagementChart;

  /** Demo-only: KPI + chart density react to LinkedIn period chips */
  const timeMetrics = useMemo(() => {
    switch (timeWindow) {
      case "7d":
        return { kpiMult: 0.26, chartLen: 7, insightsLen: 7, periodLabel: "Last 7 days" };
      case "30d":
        return { kpiMult: 1, chartLen: 30, insightsLen: 26, periodLabel: "Last 30 days" };
      case "3m":
        return { kpiMult: 2.9, chartLen: 14, insightsLen: 14, periodLabel: "Last 90 days" };
      default:
        return { kpiMult: 0.86, chartLen: 18, insightsLen: 18, periodLabel: "This month" };
    }
  }, [timeWindow]);

  const scale = workspaceId === "alpha" ? 1 : workspaceId === "beta" ? 0.64 : 0.38;

  useEffect(() => {
    setSelectedContactId(null);
  }, [activeView]);

  useEffect(() => {
    setSelectedContactId(null);
  }, [timeWindow]);


  const activitySeries = useMemo(
    () =>
      Array.from({ length: timeMetrics.chartLen }, (_, i) => ({
        day: `D${i + 1}`,
        leads: Math.max(
          2,
          Math.round((9 + Math.sin(i / 2.5) * 7 + (i % 5)) * scale * Math.sqrt(timeMetrics.kpiMult)),
        ),
        invites: Math.max(
          3,
          Math.round((12 + Math.cos(i / 2.8) * 8 + ((i * 2) % 6)) * scale * Math.sqrt(timeMetrics.kpiMult)),
        ),
        messages: Math.max(
          2,
          Math.round((10 + Math.sin(i / 3) * 9 + ((i * 3) % 5)) * scale * Math.sqrt(timeMetrics.kpiMult)),
        ),
      })),
    [scale, timeMetrics.chartLen, timeMetrics.kpiMult],
  );

  const contacts = useMemo<ContactItem[]>(
    () =>
      effectiveFeed.map((row, i) => ({
        id: `${workspaceId}-contact-${i}`,
        name: row.name,
        title: row.title.split(" at ")[0] ?? row.title,
        company: row.title.split(" at ")[1] ?? "Unknown Co",
        signal: row.engagementType,
        actions: `${Math.max(1, Math.round(row.score - 6))} interactions`,
        email: `${row.name.toLowerCase().replace(/\s+/g, ".")}@${(row.title.split(" at ")[1] ?? "example").toLowerCase().replace(/\s+/g, "")}.com`,
        impactDate: row.time,
        list: `${data.name} ICP List`,
        owner: "Chris Rubin",
        location: workspaceId === "gamma" ? "Austin, United States" : "Loveland, United States",
        industry: workspaceId === "alpha" ? "SaaS" : workspaceId === "beta" ? "Professional Services" : "E-commerce",
        companySize: workspaceId === "gamma" ? "50-200" : "53-500",
        linkedinUrl: "https://linkedin.com/company/sample",
        status: row.score >= 8.6 ? "Hot" : row.score >= 7.4 ? "Warm" : "Cold",
        notes: [
          "Triggered engagement with latest outreach asset.",
          "Company shows intent from profile and content interactions.",
        ],
      })),
    [effectiveFeed, workspaceId, data.name],
  );

  const engagementTrendSeries = useMemo(
    () => effectiveEngagement.map((p) => ({ period: p.week, engagements: p.engagement })),
    [effectiveEngagement],
  );
  const campaigns = useMemo<CampaignItem[]>(() => {
    const base: CampaignItem[] = [
      {
        id: `${workspaceId}-cmp-1`,
        name: "ICP SaaS Founders $3-$50M - V1",
        status: "Running",
        connected: Math.round(968 * scale * timeMetrics.kpiMult),
        invited: Math.round(407 * scale * timeMetrics.kpiMult),
        acceptedRate: Math.max(18, Math.round(42 * scale + 12)),
        replies: Math.round(95 * scale * timeMetrics.kpiMult),
        owner: "Chris Rubin",
      },
      {
        id: `${workspaceId}-cmp-2`,
        name: "Warm Accounts ABM Expansion",
        status: "Running",
        connected: Math.round(610 * scale * timeMetrics.kpiMult),
        invited: Math.round(284 * scale * timeMetrics.kpiMult),
        acceptedRate: Math.max(16, Math.round(39 * scale + 10)),
        replies: Math.round(66 * scale * timeMetrics.kpiMult),
        owner: "Chris Rubin",
      },
      {
        id: `${workspaceId}-cmp-3`,
        name: "Cold Outreach Refresh Sequence",
        status: "Paused",
        connected: Math.round(322 * scale * timeMetrics.kpiMult),
        invited: Math.round(121 * scale * timeMetrics.kpiMult),
        acceptedRate: Math.max(12, Math.round(31 * scale + 8)),
        replies: Math.round(34 * scale * timeMetrics.kpiMult),
        owner: "Chris Rubin",
      },
    ];

    if (workspaceId === "alpha") {
      base.push(
        {
          id: `${workspaceId}-cmp-4`,
          name: "Enterprise CMO Expansion",
          status: "Running",
          connected: Math.round(458 * scale * timeMetrics.kpiMult),
          invited: Math.round(176 * scale * timeMetrics.kpiMult),
          acceptedRate: Math.max(21, Math.round(36 * scale + 14)),
          replies: Math.round(52 * scale * timeMetrics.kpiMult),
          owner: "Chris Rubin",
        },
        {
          id: `${workspaceId}-cmp-5`,
          name: "Founder Podcast Guest Outreach",
          status: "Paused",
          connected: Math.round(284 * scale * timeMetrics.kpiMult),
          invited: Math.round(118 * scale * timeMetrics.kpiMult),
          acceptedRate: Math.max(18, Math.round(34 * scale + 12)),
          replies: Math.round(29 * scale * timeMetrics.kpiMult),
          owner: "Chris Rubin",
        },
      );
    } else if (workspaceId === "beta") {
      base.push({
        id: `${workspaceId}-cmp-4`,
        name: "Advisory Partner Reactivation",
        status: "Running",
        connected: Math.round(274 * scale * timeMetrics.kpiMult),
        invited: Math.round(109 * scale * timeMetrics.kpiMult),
        acceptedRate: Math.max(16, Math.round(33 * scale + 11)),
        replies: Math.round(28 * scale * timeMetrics.kpiMult),
        owner: "Chris Rubin",
      });
    }

    return base;
  }, [workspaceId, scale, timeMetrics.kpiMult]);

  const filteredFeed = effectiveFeed;

  const filteredCampaigns = useMemo(() => {
    const list =
      campaignStatusFilter === "all" ? campaigns : campaigns.filter((c) => c.status === campaignStatusFilter);
    return list;
  }, [campaigns, campaignStatusFilter]);

  const pinnedCampaign = useMemo(
    () => (selectedCampaignId ? campaigns.find((c) => c.id === selectedCampaignId) ?? null : null),
    [campaigns, selectedCampaignId],
  );

  const rosterCampaigns = useMemo(() => {
    if (!pinnedCampaign) return filteredCampaigns;
    if (filteredCampaigns.some((c) => c.id === pinnedCampaign.id)) return filteredCampaigns;
    return [pinnedCampaign, ...filteredCampaigns];
  }, [filteredCampaigns, pinnedCampaign]);

  const filteredContacts = contacts;

  const selectedContact = useMemo(() => {
    if (!selectedContactId) return null;
    return contacts.find((c) => c.id === selectedContactId) ?? null;
  }, [contacts, selectedContactId]);

  const selectedCampaign = useMemo(() => {
    if (!selectedCampaignId) return null;
    return campaigns.find((c) => c.id === selectedCampaignId) ?? null;
  }, [campaigns, selectedCampaignId]);

  const campaignInsightsSeries = useMemo(
    () =>
      Array.from({ length: timeMetrics.insightsLen }, (_, i) => ({
        day: `D${i + 1}`,
        invitations: Math.max(
          1,
          Math.round((9 + Math.sin(i / 1.7) * 5 + (i % 4)) * scale * Math.sqrt(timeMetrics.kpiMult)),
        ),
        messages: Math.max(
          1,
          Math.round((6 + Math.cos(i / 2) * 4 + ((i * 3) % 3)) * scale * Math.sqrt(timeMetrics.kpiMult)),
        ),
      })),
    [scale, timeMetrics.insightsLen, timeMetrics.kpiMult],
  );

  const activityLeadColor = isV5 ? chartColors.teal : "#01B574";
  const activityMsgColor = isV5 ? chartColors.accent : "#f36901";
  const engagementColor = isV5 ? chartColors.teal : "#00D4FF";
  const campaignMsgColor = isV5 ? chartColors.accent : "#EE8A50";

  return (
    <div className="space-y-6 pb-2">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className={copy.tabShell}>
          {[
            { id: "overview" as const, label: "Overview" },
            { id: "contacts" as const, label: "Contacts" },
            { id: "campaigns" as const, label: "Campaigns" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveView(tab.id)}
              className={copy.tabClass(activeView === tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={copy.tabShell}>
          {[
            { id: "7d" as const, label: "7 days" },
            { id: "30d" as const, label: "30 days" },
            { id: "3m" as const, label: "3 months" },
            { id: "month" as const, label: "This month" },
          ].map((range) => (
            <button
              key={range.id}
              type="button"
              onClick={() => setTimeWindow(range.id)}
              className={copy.tabClass(timeWindow === range.id)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {activeView === "overview" && (
        <>
      <IntegrationStrip
        title="LinkedIn & outreach stack for this client"
        description="These tools work together as one acquisition motion. Metrics and activity reflect the full stack — not a single integration."
        items={data.integrations.linkedin}
      />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <SimpleStatCard
              label="Next actions"
              value={String(Math.max(2, Math.round(12 * timeMetrics.kpiMult)))}
              info={METRIC_DESCRIPTIONS["Next actions"]}
              context={`Pending tasks · ${timeMetrics.periodLabel}`}
            />
            <SimpleStatCard
              label="Hot Opportunities"
              value={String(Math.round(2190 * scale * timeMetrics.kpiMult))}
              info={METRIC_DESCRIPTIONS["Hot Opportunities"]}
              context={timeMetrics.periodLabel}
            />
            <SimpleStatCard
              label="Leads Engaged"
              value={String(Math.round(398 * scale * timeMetrics.kpiMult))}
              info={METRIC_DESCRIPTIONS["Leads Engaged"]}
              context="Invitations sent"
            />
            <SimpleStatCard
              label="Conversations"
              value={String(Math.round(418 * scale * timeMetrics.kpiMult))}
              info={METRIC_DESCRIPTIONS["Conversations"]}
              context="Messages sent"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {effectiveStats.map((s) => (
              <SimpleStatCard
                key={s.label}
                label={s.label}
                value={s.value}
                info={METRIC_DESCRIPTIONS[s.label]}
                context={`Telemetry · ${timeMetrics.periodLabel}`}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <GlassCard className={darkGradientGlass}>
              {isV5 ? (
                <>
                  <IntelligencePanelHeader
                    eyebrow="Outbound volume"
                    title="Activity Overview"
                    hint={CHART_CARD_DESCRIPTIONS["Activity Overview"]}
                  />
                  <p className={`mb-4 mt-1 text-sm ${copy.muted}`}>
                    Lead generation and outbound volume · {timeMetrics.periodLabel.toLowerCase()}
                  </p>
                  <MboardChartFrame>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={activitySeries} margin={{ left: -8, right: 8, top: 6, bottom: 0 }}>
                        <defs>
                          <linearGradient id="overviewLeadGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={activityLeadColor} stopOpacity={0.38} />
                            <stop offset="100%" stopColor={activityLeadColor} stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="overviewInviteGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={chartColors.primaryDark} stopOpacity={0.35} />
                            <stop offset="100%" stopColor={chartColors.primaryDark} stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="overviewMsgGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={activityMsgColor} stopOpacity={0.34} />
                            <stop offset="100%" stopColor={activityMsgColor} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                        <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipContentStyle} />
                        <Area type="monotone" dataKey="leads" stroke={activityLeadColor} fill="url(#overviewLeadGrad)" strokeWidth={2.5} />
                        <Area type="monotone" dataKey="invites" stroke={chartColors.primaryDark} fill="url(#overviewInviteGrad)" strokeWidth={2.5} />
                        <Area type="monotone" dataKey="messages" stroke={activityMsgColor} fill="url(#overviewMsgGrad)" strokeWidth={2.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </MboardChartFrame>
                </>
              ) : (
                <>
                  <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
                    <h2 className={copy.h2}>Activity Overview</h2>
                    <CardInfoTip subject="Activity Overview" text={CHART_CARD_DESCRIPTIONS["Activity Overview"]} />
                  </div>
                  <p className={`mb-4 mt-1 text-sm ${copy.muted}`}>
                    Lead generation and outbound volume · {timeMetrics.periodLabel.toLowerCase()}
                  </p>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={activitySeries} margin={{ left: -8, right: 8, top: 6, bottom: 0 }}>
                      <defs>
                        <linearGradient id="overviewLeadGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#01B574" stopOpacity={0.38} />
                          <stop offset="100%" stopColor="#01B574" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="overviewInviteGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chartColors.primaryDark} stopOpacity={0.35} />
                          <stop offset="100%" stopColor={chartColors.primaryDark} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="overviewMsgGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f36901" stopOpacity={0.34} />
                          <stop offset="100%" stopColor="#f36901" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                      <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
                      <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipContentStyle} />
                      <Area type="monotone" dataKey="leads" stroke="#01B574" fill="url(#overviewLeadGrad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="invites" stroke={chartColors.primaryDark} fill="url(#overviewInviteGrad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="messages" stroke="#f36901" fill="url(#overviewMsgGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </>
              )}
            </GlassCard>

            <GlassCard className={darkGradientGlass}>
              {isV5 ? (
                <>
                  <IntelligencePanelHeader
                    eyebrow="Engagement buckets"
                    title="Engagement trend"
                    hint={CHART_CARD_DESCRIPTIONS["Engagement trend"]}
                  />
                  <p className={`mb-4 mt-1 text-sm ${copy.muted}`}>
                    Native impressions + interactions by bucket · {timeMetrics.periodLabel.toLowerCase()}
                  </p>
                  <MboardChartFrame>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={engagementTrendSeries} margin={{ left: -8, right: 8, top: 6, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`liEngTrendGrad-${workspaceId}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={engagementColor} stopOpacity={0.35} />
                            <stop offset="100%" stopColor={engagementColor} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                        <XAxis dataKey="period" tick={axisStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipContentStyle} />
                        <Area
                          type="monotone"
                          dataKey="engagements"
                          stroke={engagementColor}
                          fill={`url(#liEngTrendGrad-${workspaceId})`}
                          strokeWidth={2.5}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </MboardChartFrame>
                </>
              ) : (
                <>
                  <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
                    <h2 className={copy.h2}>Engagement trend</h2>
                    <CardInfoTip subject="Engagement trend" text={CHART_CARD_DESCRIPTIONS["Engagement trend"]} />
                  </div>
                  <p className={`mb-4 mt-1 text-sm ${copy.muted}`}>
                    Native impressions + interactions by bucket · {timeMetrics.periodLabel.toLowerCase()}
                  </p>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={engagementTrendSeries} margin={{ left: -8, right: 8, top: 6, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`liEngTrendGrad-${workspaceId}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                      <XAxis dataKey="period" tick={axisStyle} axisLine={false} tickLine={false} />
                      <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipContentStyle} />
                      <Area
                        type="monotone"
                        dataKey="engagements"
                        stroke="#00D4FF"
                        fill={`url(#liEngTrendGrad-${workspaceId})`}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </>
              )}
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <GlassCard className={darkGradientGlass}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className={copy.h2}>Latest Hot Leads</h2>
                <button type="button" className={`text-sm ${tc.link}`}>
                  View More
                </button>
              </div>
              {filteredFeed.length === 0 ? (
                <EmptyState message="No leads to show." />
              ) : (
                <div className="space-y-3">
                  {filteredFeed.slice(0, 5).map((row) => (
                    <div key={`${row.name}-${row.time}`} className={`flex items-center justify-between rounded-xl p-3 ${tc.rowInteractive}`}>
                      <div className="min-w-0">
                        <p className={`truncate font-medium ${copy.ink}`}>{row.name}</p>
                        <p className={`truncate text-xs ${copy.muted}`}>{row.title}</p>
                      </div>
                      <p className="ml-3 text-xs font-semibold text-[#EE5D50]">🔥🔥🔥</p>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            <GlassCard className={darkGradientGlass}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className={copy.h2}>Latest Replies</h2>
                <button type="button" className={`text-sm ${tc.link}`}>
                  View More
                </button>
              </div>
              {filteredFeed.length === 0 ? (
                <EmptyState message="No replies to show." />
              ) : (
                <div className="space-y-3">
                  {filteredFeed.slice(0, 5).map((row) => (
                    <div key={`${row.name}-${row.time}-reply`} className={`rounded-xl p-3 ${tc.rowInteractive}`}>
                      <p className={`text-sm font-semibold ${copy.ink}`}>{row.name}</p>
                      <p className={`mt-1 text-xs ${copy.muted}`}>
                        {row.engagementType} · {row.time}
                      </p>
                      <p className={`mt-2 text-sm ${copy.muted}`}>
                        Interested in discussing next steps for collaboration and potential campaign fit.
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        </>
      )}

      {activeView === "contacts" && (
        <GlassCard className={darkGradientGlass}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className={copy.h2}>Contacts</h2>
          </div>
          {filteredContacts.length === 0 ? (
            <EmptyState message="No contacts to show." />
          ) : (
            <div className="nos-table-wrap">
              <table className="nos-table min-w-[980px]">
                <thead>
                  <tr>
                    <th>Contact</th>
                    <th>Signal</th>
                    <th>Actions</th>
                    <th>Email</th>
                    <th>Impact Date</th>
                    <th>List</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className={`${copy.tableRow} border-l-transparent ${copy.tableRowHover} ${
                        selectedContactId === contact.id ? tc.rowSelected : ""
                      }`}
                      onClick={() => setSelectedContactId(contact.id)}
                    >
                      <td>
                        <p className="font-semibold">{contact.name}</p>
                        <p className={`text-xs ${copy.muted}`}>
                          {contact.title} · {contact.company}
                        </p>
                      </td>
                      <td className={copy.muted}>{contact.signal}</td>
                      <td className="text-[#EE5D50]">🔥🔥🔥</td>
                      <td className={copy.muted}>{contact.email}</td>
                      <td className={copy.muted}>{contact.impactDate}</td>
                      <td className={copy.muted}>{contact.list}</td>
                      <td className="text-right">
                        <HiOutlineChevronRight className={`inline h-4 w-4 ${copy.muted}`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      )}

      {activeView === "campaigns" && (
        <div className="space-y-5">
          <GlassCard className={darkGradientGlass}>
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className={copy.h2}>Outreach Campaigns</h2>
                <p className={`mt-1 text-sm ${copy.muted}`}>Filter launchers · {timeMetrics.periodLabel}</p>
              </div>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
                <div className={copy.tabShellTight}>
                  {(
                    [
                      ["all", "All"],
                      ["Running", "Running"],
                      ["Paused", "Paused"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setCampaignStatusFilter(id)}
                      className={copy.filterClass(campaignStatusFilter === id)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {rosterCampaigns.length === 0 ? (
              <EmptyState message="No campaigns to show." />
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {rosterCampaigns.map((campaign) => (
                  <button
                    key={campaign.id}
                    type="button"
                    onClick={() => setSelectedCampaignId(campaign.id)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selectedCampaign?.id === campaign.id
                        ? tc.rowSelectedBorder
                        : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18]"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className={`font-medium ${copy.ink}`}>{campaign.name}</p>
                      <span
                        className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${
                          campaign.status === "Running"
                            ? "bg-[#01B574]/20 text-[#01B574]"
                            : "bg-[#A0AEC0]/20 text-[#A0AEC0]"
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className={copy.muted}>Connected: <span className={`font-semibold ${copy.ink}`}>{campaign.connected}</span></p>
                      <p className={copy.muted}>Invited: <span className={`font-semibold ${copy.ink}`}>{campaign.invited}</span></p>
                      <p className={copy.muted}>Accepted: <span className={`font-semibold ${copy.ink}`}>{campaign.acceptedRate}%</span></p>
                      <p className={copy.muted}>Replies: <span className={`font-semibold ${copy.ink}`}>{campaign.replies}</span></p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </GlassCard>

          {selectedCampaign && (
            <GlassCard className={darkGradientGlass}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className={copy.h3}>Campaign Insights</h3>
                  <p className={`text-sm ${copy.muted}`}>{selectedCampaign.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCampaignId(null)}
                  className={copy.closeBtn}
                  aria-label="Close campaign insights"
                >
                  <HiOutlineX className="h-5 w-5" />
                </button>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  { label: "Invitations Sent", value: String(selectedCampaign.connected) },
                  { label: "Invitations Accepted", value: String(selectedCampaign.invited) },
                  { label: "Acceptance Rate", value: `${selectedCampaign.acceptedRate}%` },
                  { label: "Reply Rate", value: `${Math.max(5, Math.round((selectedCampaign.replies / Math.max(1, selectedCampaign.invited)) * 100))}%` },
                ].map((k) => (
                  <SimpleStatCard
                    key={k.label}
                    label={k.label}
                    value={k.value}
                    info={METRIC_DESCRIPTIONS[k.label]}
                  />
                ))}
              </div>
              <div className={`mb-4 flex flex-wrap items-center gap-2 ${copy.tabShellTight}`}>
                <span className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${copy.muteSm}`}>
                  Trend breakdown
                </span>
                {(
                  [
                    ["both", "Both"],
                    ["invitations", "Invites"],
                    ["messages", "Messages"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setLinkedinInsightTrendFilter(id)}
                    className={copy.filterClass(linkedinInsightTrendFilter === id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {isV5 ? (
                <>
                  <IntelligencePanelHeader
                    eyebrow="Campaign trajectory"
                    title="Campaign insights trend"
                    hint={`Invitation and message volume for ${selectedCampaign.name} (${timeMetrics.periodLabel.toLowerCase()})`}
                  />
                  <MboardChartFrame>
                    <ResponsiveContainer width="100%" height={240}>
                      <AreaChart
                        data={campaignInsightsSeries}
                        margin={{ left: 6, right: 10, top: 8, bottom: 4 }}
                      >
                        <defs>
                          <linearGradient id={`campaignInvitesGrad-${workspaceId}-${selectedCampaign.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={chartColors.primaryDark} stopOpacity={0.36} />
                            <stop offset="100%" stopColor={chartColors.primaryDark} stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id={`campaignMessagesGrad-${workspaceId}-${selectedCampaign.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={campaignMsgColor} stopOpacity={0.34} />
                            <stop offset="100%" stopColor={campaignMsgColor} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                        <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={36} />
                        <Tooltip contentStyle={tooltipContentStyle} />
                        {(linkedinInsightTrendFilter === "both" || linkedinInsightTrendFilter === "invitations") && (
                          <Area
                            type="monotone"
                            dataKey="invitations"
                            stroke={chartColors.primaryDark}
                            fill={`url(#campaignInvitesGrad-${workspaceId}-${selectedCampaign.id})`}
                            strokeWidth={2.5}
                          />
                        )}
                        {(linkedinInsightTrendFilter === "both" || linkedinInsightTrendFilter === "messages") && (
                          <Area
                            type="monotone"
                            dataKey="messages"
                            stroke={campaignMsgColor}
                            fill={`url(#campaignMessagesGrad-${workspaceId}-${selectedCampaign.id})`}
                            strokeWidth={2.5}
                          />
                        )}
                      </AreaChart>
                    </ResponsiveContainer>
                  </MboardChartFrame>
                </>
              ) : (
                <>
                  <p className={`mb-4 text-sm ${copy.muted}`}>
                    Invitation and message volume for {selectedCampaign.name} ({timeMetrics.periodLabel.toLowerCase()})
                  </p>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart
                      data={campaignInsightsSeries}
                      margin={{ left: 6, right: 10, top: 8, bottom: 4 }}
                    >
                      <defs>
                        <linearGradient id={`campaignInvitesGrad-${workspaceId}-${selectedCampaign.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chartColors.primaryDark} stopOpacity={0.36} />
                          <stop offset="100%" stopColor={chartColors.primaryDark} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id={`campaignMessagesGrad-${workspaceId}-${selectedCampaign.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#EE8A50" stopOpacity={0.34} />
                          <stop offset="100%" stopColor="#EE8A50" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                      <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
                      <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={36} />
                      <Tooltip contentStyle={tooltipContentStyle} />
                      {(linkedinInsightTrendFilter === "both" || linkedinInsightTrendFilter === "invitations") && (
                        <Area
                          type="monotone"
                          dataKey="invitations"
                          stroke={chartColors.primaryDark}
                          fill={`url(#campaignInvitesGrad-${workspaceId}-${selectedCampaign.id})`}
                          strokeWidth={2}
                        />
                      )}
                      {(linkedinInsightTrendFilter === "both" || linkedinInsightTrendFilter === "messages") && (
                        <Area
                          type="monotone"
                          dataKey="messages"
                          stroke="#EE8A50"
                          fill={`url(#campaignMessagesGrad-${workspaceId}-${selectedCampaign.id})`}
                          strokeWidth={2}
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </>
              )}
            </GlassCard>
          )}
        </div>
      )}

      {selectedContact && activeView === "contacts" && (
        <div className="fixed inset-0 z-40" aria-hidden={false}>
          <button
            type="button"
            className="absolute inset-0 bg-black/55 backdrop-blur-[1px]"
            aria-label="Close contact panel overlay"
            onClick={() => setSelectedContactId(null)}
          />
          <aside className={copy.drawerAside}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className={copy.h2}>{selectedContact.name}</h3>
              <button
                type="button"
                onClick={() => setSelectedContactId(null)}
                className={copy.closeBtn}
                aria-label="Close contact panel"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>
            <p className={`text-sm ${copy.muted}`}>
              {selectedContact.title} · {selectedContact.company}
            </p>
            <div className={`mt-4 space-y-3 ${copy.drawerPanel}`}>
              <p className={`text-sm font-semibold ${copy.ink}`}>Signal</p>
              <p className={`text-sm ${copy.muted}`}>{selectedContact.signal}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <p className={copy.muted}>Status: <span className={`font-semibold ${copy.ink}`}>{selectedContact.status}</span></p>
                <p className={copy.muted}>Owner: <span className={`font-semibold ${copy.ink}`}>{selectedContact.owner}</span></p>
              </div>
            </div>
            <div className={`mt-4 space-y-3 ${copy.drawerPanel}`}>
              <p className={`font-semibold ${copy.ink}`}>Company Information</p>
              <p className={copy.muted}>Industry: {selectedContact.industry}</p>
              <p className={copy.muted}>Company Size: {selectedContact.companySize}</p>
              <p className={copy.muted}>Location: {selectedContact.location}</p>
              <a className={tc.link} href={selectedContact.linkedinUrl} target="_blank" rel="noreferrer">
                View LinkedIn company
              </a>
            </div>
            <div className={`mt-4 space-y-2 ${copy.drawerPanel}`}>
              <p className={`text-sm font-semibold ${copy.ink}`}>Internal Notes</p>
              {selectedContact.notes.map((note, idx) => (
                <p key={idx} className={`text-sm ${copy.muted}`}>
                  • {note}
                </p>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
