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
import { EmailBarChart } from "@/components/charts/EmailBarChart";
import { CardInfoTip } from "@/components/ui/CardInfoTip";
import { GlassCard } from "@/components/ui/GlassCard";
import { IntegrationStrip } from "@/components/ui/IntegrationStrip";
import { SimpleStatCard } from "@/components/ui/SimpleStatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDashboard } from "@/context/DashboardContext";
import type { AnalyticsPeriodId, EmailCampaignRow, EmailContactRow } from "@/types/nos";
import { HiOutlineChevronRight, HiOutlineX } from "react-icons/hi";
import { useEffect, useMemo, useState } from "react";
import { CHART_CARD_DESCRIPTIONS, METRIC_DESCRIPTIONS, emailCampaignInsightHint } from "@/data/metricDescriptions";
import { IntelligencePanelHeader, MboardChartFrame } from "@/components/intelligence/mboardUi";
import { useSectionThemeCopy } from "@/theme/sectionThemeCopy";

type EmailView = "overview" | "campaigns" | "contacts";

export function EmailOutreachSection() {
  const { chartGridStroke, tooltipContentStyle, chartColors, axisStyle } = useChartTheme();
  const copy = useSectionThemeCopy();
  const { tc, isV5, darkGradientGlass } = copy;
  const { data, workspaceId } = useDashboard();
  const { email } = data;
  const [activeView, setActiveView] = useState<EmailView>("overview");
  const [timeWindow, setTimeWindow] = useState<AnalyticsPeriodId>("30d");
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<"all" | EmailCampaignRow["status"]>("all");
  const [contactStatusFilter, setContactStatusFilter] = useState<"all" | EmailContactRow["status"]>("all");
  const [contactsCampaignScope, setContactsCampaignScope] = useState<"all_campaigns" | "selected_campaign">(
    "all_campaigns",
  );
  const [emailInsightTrendFilter, setEmailInsightTrendFilter] = useState<"sent_replies" | "sent_opens">("sent_replies");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  const slice = email.byPeriod?.[timeWindow];
  const effectiveStats = slice?.stats ?? email.stats;
  const effectiveWeekly = slice?.weeklyChart ?? email.weeklyChart;
  const effectiveSequences = slice?.sequences ?? email.sequences;
  const effectiveCampaigns = slice?.campaigns ?? email.campaigns ?? [];

  /** Demo-only cadence mirrors LinkedIn chips */
  const periodLabel =
    timeWindow === "7d"
      ? "Last 7 days"
      : timeWindow === "30d"
        ? "Last 30 days"
        : timeWindow === "3m"
          ? "Last 90 days"
          : "This month";

  useEffect(() => {
    setSelectedContactId(null);
  }, [timeWindow]);

  useEffect(() => {
    setSelectedContactId(null);
  }, [activeView]);

  useEffect(() => {
    if (!selectedCampaignId && contactsCampaignScope === "selected_campaign") setContactsCampaignScope("all_campaigns");
  }, [contactsCampaignScope, selectedCampaignId]);

  const contacts = slice?.contacts ?? email.contacts ?? [];

  const filteredCampaigns = useMemo(() => {
    if (campaignStatusFilter === "all") return effectiveCampaigns;
    return effectiveCampaigns.filter((c) => c.status === campaignStatusFilter);
  }, [campaignStatusFilter, effectiveCampaigns]);

  const pinnedCampaign = useMemo(
    () => (selectedCampaignId ? effectiveCampaigns.find((c) => c.id === selectedCampaignId) ?? null : null),
    [effectiveCampaigns, selectedCampaignId],
  );

  const rosterCampaigns = useMemo(() => {
    if (!pinnedCampaign) return filteredCampaigns;
    if (filteredCampaigns.some((c) => c.id === pinnedCampaign.id)) return filteredCampaigns;
    return [pinnedCampaign, ...filteredCampaigns];
  }, [filteredCampaigns, pinnedCampaign]);

  const cohortContacts = useMemo(() => {
    if (contactsCampaignScope !== "selected_campaign" || !selectedCampaignId) return contacts;
    return contacts.filter((c) => c.campaignId === selectedCampaignId);
  }, [contacts, contactsCampaignScope, selectedCampaignId]);

  const filteredContacts = useMemo(() => {
    if (contactStatusFilter === "all") return cohortContacts;
    return cohortContacts.filter((c) => c.status === contactStatusFilter);
  }, [cohortContacts, contactStatusFilter]);

  useEffect(() => {
    if (!selectedContactId) return;
    if (!filteredContacts.some((c) => c.id === selectedContactId)) setSelectedContactId(null);
  }, [filteredContacts, selectedContactId]);

  const selectedCampaign = useMemo(
    () => effectiveCampaigns.find((c) => c.id === selectedCampaignId) ?? null,
    [effectiveCampaigns, selectedCampaignId],
  );

  const selectedContact = useMemo(
    () => contacts.find((c) => c.id === selectedContactId) ?? null,
    [contacts, selectedContactId],
  );

  const campaignTrend = useMemo(() => {
    const openPct = ((selectedCampaign?.openRate ?? 38) / 100) || 0.38;
    return Array.from({ length: timeWindow === "7d" ? 7 : timeWindow === "30d" ? 10 : timeWindow === "3m" ? 12 : 6 }, (_, i) => {
      const sent = Math.max(
        120,
        Math.round((selectedCampaign?.sent ?? 8400) * 0.04 * (0.92 + Math.sin(i / 2) * 0.06 + ((i + 7) % 5) * 0.02)),
      );
      const replies = Math.max(
        14,
        Math.round(
          (selectedCampaign?.replies ?? 320) * 0.035 * (0.94 + Math.cos(i / 2.3) * 0.08 + ((i + 4) % 4) * 0.025),
        ),
      );
      const opens = Math.max(24, Math.round(sent * openPct * (0.91 + Math.sin(i / 1.9) * 0.05)));
      return {
        bucket: `${timeWindow === "3m" ? "M" : "W"}${i + 1}`,
        sent,
        replies,
        opens,
      };
    });
  }, [selectedCampaign, timeWindow]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className={copy.tabShell}>
          {(
            [
              ["overview", "Overview"],
              ["campaigns", "Campaigns"],
              ["contacts", "Contacts"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveView(id)}
              className={copy.tabClass(activeView === id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={copy.tabShell}>
          {(
            [
              ["7d", "7 days"],
              ["30d", "30 days"],
              ["3m", "3 months"],
              ["month", "This month"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTimeWindow(id)}
              className={copy.tabClass(timeWindow === id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <IntegrationStrip
        title="Email & sequencing tools for this client"
        description="Deliverability-aware sending (Instantly-style) with Apollo-grade campaign controls — sliced by the selected range."
        items={data.integrations.email}
      />

      {activeView === "overview" && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {effectiveStats.map((stat) => (
              <SimpleStatCard
                key={`${workspaceId}-${timeWindow}-${stat.label}`}
                label={stat.label}
                value={stat.value}
                info={METRIC_DESCRIPTIONS[stat.label]}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <GlassCard className={darkGradientGlass}>
              {isV5 ? (
                <>
                  <IntelligencePanelHeader
                    eyebrow="Weekly buckets"
                    title="Send volume vs replies"
                    hint={CHART_CARD_DESCRIPTIONS["Send volume vs replies"]}
                  />
                  <p className={`mb-4 text-sm ${copy.muted}`}>{periodLabel}</p>
                  <MboardChartFrame>
                    <EmailBarChart key={`${workspaceId}-${timeWindow}`} data={effectiveWeekly} />
                  </MboardChartFrame>
                </>
              ) : (
                <>
                  <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
                    <h2 className={copy.h2}>Send volume vs replies</h2>
                    <CardInfoTip subject="Send volume vs replies" text={CHART_CARD_DESCRIPTIONS["Send volume vs replies"]} />
                  </div>
                  <p className={`mb-4 text-sm ${copy.muted}`}>Weekly buckets · {periodLabel}</p>
                  <EmailBarChart key={`${workspaceId}-${timeWindow}`} data={effectiveWeekly} />
                </>
              )}
            </GlassCard>
            <GlassCard className={darkGradientGlass}>
              {isV5 ? (
                <>
                  <IntelligencePanelHeader
                    eyebrow="Sequence health"
                    title="Sequence health snapshot"
                    hint={CHART_CARD_DESCRIPTIONS["Sequence health snapshot"]}
                  />
                  <p className={`mb-4 text-sm ${copy.muted}`}>
                    {effectiveSequences.filter((s) => s.status === "Active").length} active sequences · blended
                    open/reply deltas
                  </p>
                  <MboardChartFrame>
                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart data={effectiveWeekly} margin={{ left: -8, right: 8, top: 6, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`emailEng-${workspaceId}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#01B574" stopOpacity={0.32} />
                            <stop offset="100%" stopColor="#01B574" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id={`emailSent-${workspaceId}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={chartColors.primaryDark} stopOpacity={0.35} />
                            <stop offset="100%" stopColor={chartColors.primaryDark} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />
                        <XAxis dataKey="week" tick={axisStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipContentStyle} />
                        <Area type="monotone" dataKey="sent" stroke={chartColors.primaryDark} fill={`url(#emailSent-${workspaceId})`} strokeWidth={2.5} />
                        <Area type="monotone" dataKey="replies" stroke="#01B574" fill={`url(#emailEng-${workspaceId})`} strokeWidth={2.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </MboardChartFrame>
                </>
              ) : (
                <>
                  <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className={copy.h2}>Sequence health snapshot</h2>
                        <CardInfoTip
                          subject="Sequence health snapshot"
                          text={CHART_CARD_DESCRIPTIONS["Sequence health snapshot"]}
                        />
                      </div>
                      <p className={`mb-4 mt-1 text-sm ${copy.muted}`}>
                        {effectiveSequences.filter((s) => s.status === "Active").length} active sequences · blended
                        open/reply deltas
                      </p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={effectiveWeekly} margin={{ left: -8, right: 8, top: 6, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`emailEng-${workspaceId}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#01B574" stopOpacity={0.32} />
                          <stop offset="100%" stopColor="#01B574" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id={`emailSent-${workspaceId}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chartColors.primaryDark} stopOpacity={0.35} />
                          <stop offset="100%" stopColor={chartColors.primaryDark} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                      <XAxis dataKey="week" tick={axisStyle} axisLine={false} tickLine={false} />
                      <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipContentStyle} />
                      <Area type="monotone" dataKey="sent" stroke={chartColors.primaryDark} fill={`url(#emailSent-${workspaceId})`} strokeWidth={2} />
                      <Area type="monotone" dataKey="replies" stroke="#01B574" fill={`url(#emailEng-${workspaceId})`} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </>
              )}
            </GlassCard>
          </div>

          <GlassCard className={darkGradientGlass}>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
              <h2 className={copy.h2}>Active sequences</h2>
              <CardInfoTip subject="Active sequences" text={CHART_CARD_DESCRIPTIONS["Active sequences"]} />
            </div>
            {effectiveSequences.length === 0 ? (
              <EmptyState message="No sequences to show." />
            ) : (
              <div className="nos-table-wrap">
                <table className="nos-table min-w-[760px]">
                  <thead>
                    <tr>
                      <th>Sequence Name</th>
                      <th>Status</th>
                      <th>Contacts</th>
                      <th>Open Rate</th>
                      <th>Reply Rate</th>
                      <th>Meetings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {effectiveSequences.map((row) => (
                      <tr key={row.name} className={copy.ink}>
                        <td className="font-semibold">{row.name}</td>
                        <td>
                          <StatusBadge status={row.status} />
                        </td>
                        <td>{row.contacts}</td>
                        <td>{row.openRate}%</td>
                        <td>{row.replyRate}%</td>
                        <td className="font-semibold text-[#01B574]">{row.meetings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </>
      )}

      {activeView === "campaigns" && (
        <div className="space-y-5">
          <GlassCard className={darkGradientGlass}>
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <div>
                  <h2 className={copy.h2}>Campaign cockpit</h2>
                  <p className={`mt-1 text-sm ${copy.muted}`}>Mailbox pools + Instantly ladders · {periodLabel}</p>
                </div>
                <CardInfoTip subject="Campaign cockpit" text={CHART_CARD_DESCRIPTIONS["Campaign cockpit"]} />
              </div>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
                <div className={copy.tabShellTight}>
                  {(["all", "Running", "Paused", "Completed"] as const).map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setCampaignStatusFilter(id)}
                      className={copy.filterClass(campaignStatusFilter === id)}
                    >
                      {id === "all" ? "All" : id}
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
                      selectedCampaign?.id === campaign.id ? tc.rowSelectedBorder : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18]"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <p className={`font-medium ${copy.ink}`}>{campaign.name}</p>
                      <StatusBadge status={campaign.status} />
                    </div>
                    <p className={`mb-3 text-xs ${copy.muted}`}>Owner · {campaign.owner}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className={copy.muted}>
                        Contacts: <span className={`font-semibold ${copy.ink}`}>{campaign.contacts}</span>
                      </p>
                      <p className={copy.muted}>
                        Sent: <span className={`font-semibold ${copy.ink}`}>{campaign.sent.toLocaleString("en-US")}</span>
                      </p>
                      <p className={copy.muted}>
                        Opens: <span className={`font-semibold ${copy.ink}`}>{campaign.openRate}%</span>
                      </p>
                      <p className={copy.muted}>
                        Replies: <span className={`font-semibold ${copy.ink}`}>{campaign.replyRate}%</span>
                      </p>
                      <p className={copy.muted}>
                        Bounce: <span className={`font-semibold ${copy.ink}`}>{campaign.bounceRate}%</span>
                      </p>
                      <p className={copy.muted}>
                        Meetings: <span className="font-semibold text-[#01B574]">{campaign.meetingsBooked}</span>
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </GlassCard>

          {selectedCampaign && (
            <GlassCard className={darkGradientGlass}>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className={copy.h3}>Campaign insights</h3>
                  <p className={`text-sm ${copy.muted}`}>{selectedCampaign.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCampaignId(null)}
                  className={`inline-flex items-center gap-2 self-start sm:self-auto ${copy.closeBtn}`}
                  aria-label="Close campaign insights"
                >
                  <HiOutlineX className="h-5 w-5" />
                  <span className="text-sm">Close</span>
                </button>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
                {[
                  { label: "Campaign contacts", value: String(selectedCampaign.contacts) },
                  { label: "Emails sent", value: selectedCampaign.sent.toLocaleString("en-US") },
                  { label: "Open rate", value: `${selectedCampaign.openRate}%` },
                  { label: "Reply rate", value: `${selectedCampaign.replyRate}%` },
                  { label: "Bounce rate", value: `${selectedCampaign.bounceRate}%` },
                  { label: "Clicks (est.)", value: selectedCampaign.clicks.toLocaleString("en-US") },
                  { label: "Unsubs", value: selectedCampaign.unsubscribes.toLocaleString("en-US") },
                  { label: "Meetings", value: String(selectedCampaign.meetingsBooked) },
                ].map((row) => (
                  <SimpleStatCard
                    key={row.label}
                    label={row.label}
                    value={row.value}
                    info={emailCampaignInsightHint(row.label) ?? "Modeled email signal for this campaign slice."}
                  />
                ))}
              </div>

              <div className={`mb-5 flex flex-wrap items-center gap-2 ${copy.tabShellTight}`}>
                <span className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${copy.muteSm}`}>
                  Insight trend lens
                </span>
                {(
                  [
                    ["sent_replies", "Sends × replies"],
                    ["sent_opens", "Sends × opens"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setEmailInsightTrendFilter(id)}
                    className={copy.filterClass(emailInsightTrendFilter === id)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {isV5 ? (
                <>
                  <IntelligencePanelHeader
                    eyebrow="Campaign trajectory"
                    title={
                      emailInsightTrendFilter === "sent_replies"
                        ? "Sends vs replies"
                        : "Sends vs modeled opens"
                    }
                    hint={
                      emailInsightTrendFilter === "sent_replies"
                        ? `Sends vs replies trajectory for ${selectedCampaign.name} (${periodLabel.toLowerCase()})`
                        : `Sends vs modeled opens trajectory for ${selectedCampaign.name} (${periodLabel.toLowerCase()})`
                    }
                  />
                  <MboardChartFrame>
                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart data={campaignTrend} margin={{ left: 8, right: 12, top: 8, bottom: 4 }}>
                        <defs>
                          <linearGradient id={`emCmpSent-${workspaceId}-${selectedCampaign.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={chartColors.primaryDark} stopOpacity={0.38} />
                            <stop offset="100%" stopColor={chartColors.primaryDark} stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id={`emCmpRep-${workspaceId}-${selectedCampaign.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#EE8A50" stopOpacity={0.34} />
                            <stop offset="100%" stopColor="#EE8A50" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id={`emCmpOpens-${workspaceId}-${selectedCampaign.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#01B574" stopOpacity={0.32} />
                            <stop offset="100%" stopColor="#01B574" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />
                        <XAxis dataKey="bucket" tick={axisStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={42} />
                        <Tooltip contentStyle={tooltipContentStyle} />
                        <Area
                          type="monotone"
                          dataKey="sent"
                          stroke={chartColors.primaryDark}
                          fill={`url(#emCmpSent-${workspaceId}-${selectedCampaign.id})`}
                          strokeWidth={2.5}
                        />
                        {emailInsightTrendFilter === "sent_replies" && (
                          <Area
                            type="monotone"
                            dataKey="replies"
                            stroke="#EE8A50"
                            fill={`url(#emCmpRep-${workspaceId}-${selectedCampaign.id})`}
                            strokeWidth={2.5}
                          />
                        )}
                        {emailInsightTrendFilter === "sent_opens" && (
                          <Area
                            type="monotone"
                            dataKey="opens"
                            stroke="#01B574"
                            fill={`url(#emCmpOpens-${workspaceId}-${selectedCampaign.id})`}
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
                    {emailInsightTrendFilter === "sent_replies"
                      ? `Sends vs replies trajectory for ${selectedCampaign.name} (${periodLabel.toLowerCase()})`
                      : `Sends vs modeled opens trajectory for ${selectedCampaign.name} (${periodLabel.toLowerCase()})`}
                  </p>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={campaignTrend} margin={{ left: 8, right: 12, top: 8, bottom: 4 }}>
                      <defs>
                        <linearGradient id={`emCmpSent-${workspaceId}-${selectedCampaign.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chartColors.primaryDark} stopOpacity={0.38} />
                          <stop offset="100%" stopColor={chartColors.primaryDark} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id={`emCmpRep-${workspaceId}-${selectedCampaign.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#EE8A50" stopOpacity={0.34} />
                          <stop offset="100%" stopColor="#EE8A50" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id={`emCmpOpens-${workspaceId}-${selectedCampaign.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#01B574" stopOpacity={0.32} />
                          <stop offset="100%" stopColor="#01B574" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                      <XAxis dataKey="bucket" tick={axisStyle} axisLine={false} tickLine={false} />
                      <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={42} />
                      <Tooltip contentStyle={tooltipContentStyle} />
                      <Area
                        type="monotone"
                        dataKey="sent"
                        stroke={chartColors.primaryDark}
                        fill={`url(#emCmpSent-${workspaceId}-${selectedCampaign.id})`}
                        strokeWidth={2}
                      />
                      {emailInsightTrendFilter === "sent_replies" && (
                        <Area
                          type="monotone"
                          dataKey="replies"
                          stroke="#EE8A50"
                          fill={`url(#emCmpRep-${workspaceId}-${selectedCampaign.id})`}
                          strokeWidth={2}
                        />
                      )}
                      {emailInsightTrendFilter === "sent_opens" && (
                        <Area
                          type="monotone"
                          dataKey="opens"
                          stroke="#01B574"
                          fill={`url(#emCmpOpens-${workspaceId}-${selectedCampaign.id})`}
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

      {activeView === "contacts" && (
        <>
          <GlassCard className={darkGradientGlass}>
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className={copy.h2}>Contacts inside sequences</h2>
                <p className={`mt-1 text-sm ${copy.muted}`}>
                  Touches respect the selected mailbox window · {periodLabel}
                </p>
                {selectedCampaignId && selectedCampaign ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setContactsCampaignScope("all_campaigns")}
                      className={`rounded-lg border px-3 py-1.5 text-[11px] font-semibold ${
                        contactsCampaignScope === "all_campaigns"
                          ? `${tc.rowSelectedBorder} border-l-0`
                          : `border-white/[0.1] ${copy.muted}`
                      }`}
                    >
                      All campaigns
                    </button>
                    <button
                      type="button"
                      onClick={() => setContactsCampaignScope("selected_campaign")}
                      className={`rounded-lg border px-3 py-1.5 text-[11px] font-semibold ${
                        contactsCampaignScope === "selected_campaign"
                          ? `${tc.rowSelectedBorder} border-l-0`
                          : `border-white/[0.1] ${copy.muted}`
                      }`}
                    >
                      Only: {selectedCampaign.name}
                    </button>
                  </div>
                ) : (
                  <p className={`mt-3 max-w-xl text-[11px] ${copy.muteSm}`}>
                    Select a campaign on the Campaigns tab to constrain this roster to its cohort — status filters stay
                    independent.
                  </p>
                )}
              </div>
              <div className={copy.tabShellTight}>
                <button
                  type="button"
                  onClick={() => setContactStatusFilter("all")}
                  className={copy.filterClass(contactStatusFilter === "all")}
                >
                  All contacts
                </button>
                {(["In sequence", "Replied", "Bounced", "Paused", "Unsubscribed", "Opened only"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setContactStatusFilter(st)}
                    className={copy.filterClass(contactStatusFilter === st)}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {filteredContacts.length === 0 ? (
              <EmptyState message="No contacts in this cohort." />
            ) : (
              <div className="nos-table-wrap">
                <table className="nos-table min-w-[1020px]">
                  <thead>
                    <tr>
                      <th>Contact</th>
                      <th>Sequence</th>
                      <th>Status</th>
                      <th>Opens</th>
                      <th>Clicks</th>
                      <th>Replies</th>
                      <th>Last touch</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((row) => (
                      <tr
                        key={row.id}
                        className={`${copy.tableRow} border-l-transparent ${copy.tableRowHover} ${
                          selectedContactId === row.id ? tc.rowSelected : ""
                        }`}
                        onClick={() => setSelectedContactId(row.id)}
                      >
                        <td>
                          <p className="font-semibold">{row.name}</p>
                          <p className={`text-xs ${copy.muted}`}>{row.company}</p>
                          <p className={`truncate text-[11px] ${copy.muteSm}`}>{row.email}</p>
                        </td>
                        <td className={`max-w-[200px] ${copy.muted}`}>
                          <span className="line-clamp-2">{row.sequenceName}</span>
                        </td>
                        <td>
                          <StatusBadge status={row.status} />
                        </td>
                        <td>{row.opens}</td>
                        <td>{row.clicks}</td>
                        <td>{row.replies}</td>
                        <td className={copy.muted}>{row.lastTouch}</td>
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
        </>
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
            <p className={`text-sm ${copy.muted}`}>{selectedContact.company}</p>
            <div className={`mt-5 space-y-4 ${copy.drawerPanel}`}>
              <StatusBadge status={selectedContact.status} />
              <p className={copy.muted}>{selectedContact.email}</p>
              <p className={copy.ink}>
                Campaign / sequence lane:{" "}
                <span className={copy.muted}>{selectedContact.sequenceName}</span>
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <SimpleStatCard label="Opens" value={String(selectedContact.opens)} />
                <SimpleStatCard label="Clicks" value={String(selectedContact.clicks)} />
                <SimpleStatCard label="Replies" value={String(selectedContact.replies)} />
              </div>
              <p className={`text-xs ${copy.muted}`}>Last inbox touch · {selectedContact.lastTouch}</p>
              <button
                type="button"
                className={`w-full ${tc.buttonPrimary}`}
              >
                Open in Instantly
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
