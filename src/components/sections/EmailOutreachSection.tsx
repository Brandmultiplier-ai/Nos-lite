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
import { axisStyle, chartGridStroke, tooltipContentStyle } from "@/components/charts/chartTheme";
import { EmailBarChart } from "@/components/charts/EmailBarChart";
import { CardInfoTip, MetricHeadingWithInfo } from "@/components/ui/CardInfoTip";
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

type EmailView = "overview" | "campaigns" | "contacts";

export function EmailOutreachSection() {
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
        <div className="inline-flex rounded-xl border border-white/[0.08] bg-[#111C44]/70 p-1">
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
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                activeView === id
                  ? "bg-white/[0.08] text-white shadow-[0_0_0_1px_rgba(73,64,198,0.35)]"
                  : "text-[#A0AEC0] hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-xl border border-white/[0.08] bg-[#111C44]/70 p-1">
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
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                timeWindow === id ? "bg-[#4940c6] text-white" : "text-[#A0AEC0] hover:text-white"
              }`}
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
            <GlassCard>
              <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
                <h2 className="font-display text-xl font-bold text-white">Send volume vs replies</h2>
                <CardInfoTip subject="Send volume vs replies" text={CHART_CARD_DESCRIPTIONS["Send volume vs replies"]} />
              </div>
              <p className="mb-4 text-sm text-[#A0AEC0]">Weekly buckets · {periodLabel}</p>
              <EmailBarChart key={`${workspaceId}-${timeWindow}`} data={effectiveWeekly} />
            </GlassCard>
            <GlassCard>
              <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl font-bold text-white">Sequence health snapshot</h2>
                    <CardInfoTip
                      subject="Sequence health snapshot"
                      text={CHART_CARD_DESCRIPTIONS["Sequence health snapshot"]}
                    />
                  </div>
                  <p className="mb-4 mt-1 text-sm text-[#A0AEC0]">
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
                      <stop offset="0%" stopColor="#4940c6" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#4940c6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                  <XAxis dataKey="week" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipContentStyle} />
                  <Area type="monotone" dataKey="sent" stroke="#4940c6" fill={`url(#emailSent-${workspaceId})`} strokeWidth={2} />
                  <Area type="monotone" dataKey="replies" stroke="#01B574" fill={`url(#emailEng-${workspaceId})`} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          <GlassCard>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
              <h2 className="font-display text-xl font-bold text-white">Active sequences</h2>
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
                      <tr key={row.name} className="text-white">
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
          <GlassCard>
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">Campaign cockpit</h2>
                  <p className="mt-1 text-sm text-[#A0AEC0]">Mailbox pools + Instantly ladders · {periodLabel}</p>
                </div>
                <CardInfoTip subject="Campaign cockpit" text={CHART_CARD_DESCRIPTIONS["Campaign cockpit"]} />
              </div>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
                <div className="inline-flex flex-wrap gap-2 rounded-xl border border-white/[0.08] bg-black/25 p-1">
                  {(["all", "Running", "Paused", "Completed"] as const).map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setCampaignStatusFilter(id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] transition ${
                        campaignStatusFilter === id ? "bg-[#4940c6]/80 text-white" : "text-[#A0AEC0] hover:text-white"
                      }`}
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
                      selectedCampaign?.id === campaign.id ? "border-[#4940c6]/60 bg-white/[0.05]" : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18]"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <p className="font-medium text-white">{campaign.name}</p>
                      <StatusBadge status={campaign.status} />
                    </div>
                    <p className="mb-3 text-xs text-[#A0AEC0]">Owner · {campaign.owner}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-[#A0AEC0]">
                        Contacts: <span className="font-semibold text-white">{campaign.contacts}</span>
                      </p>
                      <p className="text-[#A0AEC0]">
                        Sent: <span className="font-semibold text-white">{campaign.sent.toLocaleString("en-US")}</span>
                      </p>
                      <p className="text-[#A0AEC0]">
                        Opens: <span className="font-semibold text-white">{campaign.openRate}%</span>
                      </p>
                      <p className="text-[#A0AEC0]">
                        Replies: <span className="font-semibold text-white">{campaign.replyRate}%</span>
                      </p>
                      <p className="text-[#A0AEC0]">
                        Bounce: <span className="font-semibold text-white">{campaign.bounceRate}%</span>
                      </p>
                      <p className="text-[#A0AEC0]">
                        Meetings: <span className="font-semibold text-[#01B574]">{campaign.meetingsBooked}</span>
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </GlassCard>

          {selectedCampaign && (
            <GlassCard>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">Campaign insights</h3>
                  <p className="text-sm text-[#A0AEC0]">{selectedCampaign.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCampaignId(null)}
                  className="inline-flex items-center gap-2 self-start text-[#A0AEC0] hover:text-white sm:self-auto"
                  aria-label="Close campaign insights"
                >
                  <HiOutlineX className="h-5 w-5" />
                  <span className="text-sm">Close</span>
                </button>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
                {[
                  { label: "Campaign contacts", value: selectedCampaign.contacts },
                  { label: "Emails sent", value: selectedCampaign.sent.toLocaleString("en-US") },
                  { label: "Open rate", value: `${selectedCampaign.openRate}%` },
                  { label: "Reply rate", value: `${selectedCampaign.replyRate}%` },
                  { label: "Bounce rate", value: `${selectedCampaign.bounceRate}%` },
                  { label: "Clicks (est.)", value: selectedCampaign.clicks.toLocaleString("en-US") },
                  { label: "Unsubs", value: selectedCampaign.unsubscribes.toLocaleString("en-US") },
                  { label: "Meetings", value: String(selectedCampaign.meetingsBooked) },
                ].map((row) => (
                  <div key={row.label} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
                    <MetricHeadingWithInfo
                      title={row.label}
                      hint={emailCampaignInsightHint(row.label) ?? "Modeled email signal for this campaign slice."}
                      titleClassName="text-xs font-semibold uppercase tracking-[0.08em] text-[#A0AEC0]"
                    />
                    <p className="mt-2 text-xl font-bold text-white">{row.value}</p>
                  </div>
                ))}
              </div>

              <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-white/[0.08] bg-black/25 px-3 py-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#718096]">
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
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      emailInsightTrendFilter === id ? "bg-[#4940c6]/75 text-white" : "text-[#A0AEC0] hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <p className="mb-4 text-sm text-[#A0AEC0]">
                {emailInsightTrendFilter === "sent_replies"
                  ? `Sends vs replies trajectory for ${selectedCampaign.name} (${periodLabel.toLowerCase()})`
                  : `Sends vs modeled opens trajectory for ${selectedCampaign.name} (${periodLabel.toLowerCase()})`}
              </p>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={campaignTrend} margin={{ left: 8, right: 12, top: 8, bottom: 4 }}>
                  <defs>
                    <linearGradient id={`emCmpSent-${workspaceId}-${selectedCampaign.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4940c6" stopOpacity={0.38} />
                      <stop offset="100%" stopColor="#4940c6" stopOpacity={0} />
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
                    stroke="#4940c6"
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
            </GlassCard>
          )}
        </div>
      )}

      {activeView === "contacts" && (
        <>
          <GlassCard>
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-white">Contacts inside sequences</h2>
                <p className="mt-1 text-sm text-[#A0AEC0]">
                  Touches respect the selected mailbox window · {periodLabel}
                </p>
                {selectedCampaignId && selectedCampaign ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setContactsCampaignScope("all_campaigns")}
                      className={`rounded-lg border px-3 py-1.5 text-[11px] font-semibold ${
                        contactsCampaignScope === "all_campaigns"
                          ? "border-[#4940c6]/50 bg-[#4940c6]/22 text-white"
                          : "border-white/[0.1] text-[#A0AEC0]"
                      }`}
                    >
                      All campaigns
                    </button>
                    <button
                      type="button"
                      onClick={() => setContactsCampaignScope("selected_campaign")}
                      className={`rounded-lg border px-3 py-1.5 text-[11px] font-semibold ${
                        contactsCampaignScope === "selected_campaign"
                          ? "border-[#4940c6]/50 bg-[#4940c6]/22 text-white"
                          : "border-white/[0.1] text-[#A0AEC0]"
                      }`}
                    >
                      Only: {selectedCampaign.name}
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 max-w-xl text-[11px] text-[#5C6689]">
                    Select a campaign on the Campaigns tab to constrain this roster to its cohort — status filters stay
                    independent.
                  </p>
                )}
              </div>
              <div className="inline-flex flex-wrap gap-2 rounded-xl border border-white/[0.08] bg-black/25 p-1">
                <button
                  type="button"
                  onClick={() => setContactStatusFilter("all")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] transition ${
                    contactStatusFilter === "all" ? "bg-[#4940c6]/75 text-white" : "text-[#A0AEC0] hover:text-white"
                  }`}
                >
                  All contacts
                </button>
                {(["In sequence", "Replied", "Bounced", "Paused", "Unsubscribed", "Opened only"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setContactStatusFilter(st)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      contactStatusFilter === st ? "bg-[#4940c6]/75 text-white" : "text-[#A0AEC0] hover:text-white"
                    }`}
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
                        className={`cursor-pointer border-l-4 border-l-transparent text-white transition hover:bg-white/[0.035] ${
                          selectedContactId === row.id ? "border-l-[#4940c6] bg-white/[0.06]" : ""
                        }`}
                        onClick={() => setSelectedContactId(row.id)}
                      >
                        <td>
                          <p className="font-semibold">{row.name}</p>
                          <p className="text-xs text-[#A0AEC0]">{row.company}</p>
                          <p className="truncate text-[11px] text-[#6B728E]">{row.email}</p>
                        </td>
                        <td className="max-w-[200px] text-[#A0AEC0]">
                          <span className="line-clamp-2">{row.sequenceName}</span>
                        </td>
                        <td>
                          <StatusBadge status={row.status} />
                        </td>
                        <td>{row.opens}</td>
                        <td>{row.clicks}</td>
                        <td>{row.replies}</td>
                        <td className="text-[#A0AEC0]">{row.lastTouch}</td>
                        <td className="text-right">
                          <HiOutlineChevronRight className="inline h-4 w-4 text-[#A0AEC0]" />
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
          <aside className="absolute right-0 top-0 z-50 h-full w-full max-w-[420px] overflow-y-auto border-l border-white/[0.08] bg-gradient-to-b from-[#16132A]/96 via-[#0E1324]/96 to-[#070A12]/97 p-5 shadow-[-20px_0_42px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-white">{selectedContact.name}</h3>
              <button
                type="button"
                onClick={() => setSelectedContactId(null)}
                className="text-[#A0AEC0] hover:text-white"
                aria-label="Close contact panel"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-[#A0AEC0]">{selectedContact.company}</p>
            <div className="mt-5 space-y-4 rounded-2xl border border-white/[0.08] bg-black/30 p-4 text-sm">
              <StatusBadge status={selectedContact.status} />
              <p className="text-[#A0AEC0]">{selectedContact.email}</p>
              <p className="text-white">
                Campaign / sequence lane:{" "}
                <span className="text-[#A0AEC0]">{selectedContact.sequenceName}</span>
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-2">
                  <p className="text-[10px] uppercase tracking-[0.08em] text-[#A0AEC0]">Opens</p>
                  <p className="mt-1 text-lg font-semibold text-white">{selectedContact.opens}</p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-2">
                  <p className="text-[10px] uppercase tracking-[0.08em] text-[#A0AEC0]">Clicks</p>
                  <p className="mt-1 text-lg font-semibold text-white">{selectedContact.clicks}</p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-2">
                  <p className="text-[10px] uppercase tracking-[0.08em] text-[#A0AEC0]">Replies</p>
                  <p className="mt-1 text-lg font-semibold text-white">{selectedContact.replies}</p>
                </div>
              </div>
              <p className="text-xs text-[#A0AEC0]">Last inbox touch · {selectedContact.lastTouch}</p>
              <button
                type="button"
                className="w-full rounded-lg bg-[#4940c6] px-3 py-2 text-xs font-semibold text-white hover:opacity-95"
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
