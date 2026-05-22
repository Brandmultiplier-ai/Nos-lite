"use client";

import { useEffect, useMemo, useState } from "react";
import { CardInfoTip } from "@/components/ui/CardInfoTip";
import { GlassCard } from "@/components/ui/GlassCard";
import { IntegrationStrip } from "@/components/ui/IntegrationStrip";
import { SimpleStatCard } from "@/components/ui/SimpleStatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDashboard } from "@/context/DashboardContext";
import {
  HiOutlineChartBar,
  HiOutlineChevronRight,
  HiOutlineClock,
  HiOutlineEye,
  HiOutlineX,
} from "react-icons/hi";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useChartTheme } from "@/components/charts/chartTheme";
import { CHART_CARD_DESCRIPTIONS, METRIC_DESCRIPTIONS } from "@/data/metricDescriptions";
import type { WebsiteRow } from "@/types/nos";
import { IntelligencePanelHeader, MboardChartFrame } from "@/components/intelligence/mboardUi";
import { useThemeClasses } from "@/theme/themeClasses";
import { useSectionThemeCopy } from "@/theme/sectionThemeCopy";
import { useTheme } from "@/theme/ThemeProvider";

type WebsiteView = "overview" | "person-visitors" | "company-visitors";
type VisitorStatus = "Hot" | "Warm" | "Cold";
const PERSON_PAGE_SIZE = 120;
const COMPANY_PAGE_SIZE = 80;

function companyGradient(company: string): string {
  let h = 0;
  for (let i = 0; i < company.length; i++) h = company.charCodeAt(i) + ((h << 5) - h);
  const hue = Math.abs(h) % 360;
  return `linear-gradient(135deg, hsla(${hue}, 72%, 48%, 0.95), hsla(${(hue + 42) % 360}, 62%, 34%, 0.92))`;
}

function companyMarkLabel(company: string) {
  const parts = company.split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "?";
  const b = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return (a + b).toUpperCase().slice(0, 2);
}

interface PersonVisitor {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  contact: string;
  lastSeen: string;
  pagesViewed: number;
  source: string;
  status: VisitorStatus;
}

export function WebsiteSignalsSection() {
  const { chartGridStroke, tooltipContentStyle, chartColors, axisStyle } = useChartTheme();
  const { version } = useTheme();
  const tc = useThemeClasses();
  const copy = useSectionThemeCopy();
  const { themed, isV5 } = copy;
  const { data } = useDashboard();
  const { website } = data;
  const [activeView, setActiveView] = useState<WebsiteView>("overview");
  const [statusFilter, setStatusFilter] = useState<VisitorStatus | "all">("all");
  const [personPage, setPersonPage] = useState(1);
  const [companyPage, setCompanyPage] = useState(1);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<WebsiteRow | null>(null);

  const companyRows = website.rows;

  const personVisitors = useMemo<PersonVisitor[]>(() => {
    if (data.demoPeople && data.demoPeople.length > 0) {
      return data.demoPeople.map((p) => ({
        id: `person-${p.id}`,
        name: p.fullName,
        title: p.title,
        company: p.company,
        location: p.location,
        contact: p.email,
        lastSeen: `${4 + (p.id % 8)}m ${String((p.id * 3) % 59).padStart(2, "0")}s`,
        pagesViewed: Math.max(1, Math.round(p.score * 0.45) + (p.id % 4)),
        source: p.channel.toLowerCase().includes("linkedin")
          ? "linkedin.com"
          : p.channel.toLowerCase().includes("email")
            ? "email / sequences"
            : "direct / website",
        status: p.status,
      }));
    }
    return website.rows.map((row, idx) => {
      const first = ["Mason", "Emma", "Aiden", "Sophia", "Noah", "Olivia", "Liam", "Ava"][
        idx % 8
      ];
      const last = ["Taylor", "Hayes", "Brooks", "Reed", "Morgan", "Diaz", "Bennett", "Foster"][
        (idx + 2) % 8
      ];
      const city = [
        "Richardson, TX",
        "San Francisco, CA",
        "Baltimore, MD",
        "Philadelphia, PA",
        "West Bloomfield, MI",
        "Glenwood Springs, CO",
      ][idx % 6];
      const domain = row.company.toLowerCase().replace(/[^a-z0-9]/g, "");

      return {
        id: `${data.id}-person-${idx}`,
        name: `${first} ${last}`,
        title: idx % 3 === 0 ? "Marketing Director" : idx % 3 === 1 ? "Revenue Lead" : "Founder",
        company: row.company,
        location: city,
        contact: `${first.toLowerCase()}.${last.toLowerCase()}@${domain}.com`,
        lastSeen: row.timeOnSite,
        pagesViewed: Math.max(1, row.pagesVisited.split(",").length + Math.round(row.score / 3)),
        source: idx % 2 === 0 ? "google.com" : "bing.com",
        status: row.status,
      };
    });
  }, [data.demoPeople, website.rows, data.id]);

  const filteredCompanies = companyRows.filter(
    (row) => statusFilter === "all" || row.status === statusFilter,
  );

  const filteredPeople = personVisitors.filter((visitor) => {
    return statusFilter === "all" || visitor.status === statusFilter;
  });

  const selectedPerson = filteredPeople.find((person) => person.id === selectedPersonId) ?? null;

  useEffect(() => {
    setPersonPage(1);
    setCompanyPage(1);
  }, [statusFilter, activeView]);

  const personTotalPages = Math.max(1, Math.ceil(filteredPeople.length / PERSON_PAGE_SIZE));
  const companyTotalPages = Math.max(1, Math.ceil(filteredCompanies.length / COMPANY_PAGE_SIZE));
  const safePersonPage = Math.min(personPage, personTotalPages);
  const safeCompanyPage = Math.min(companyPage, companyTotalPages);

  const pagedPeople = useMemo(() => {
    const start = (safePersonPage - 1) * PERSON_PAGE_SIZE;
    return filteredPeople.slice(start, start + PERSON_PAGE_SIZE);
  }, [filteredPeople, safePersonPage]);

  const pagedCompanies = useMemo(() => {
    const start = (safeCompanyPage - 1) * COMPANY_PAGE_SIZE;
    return filteredCompanies.slice(start, start + COMPANY_PAGE_SIZE);
  }, [filteredCompanies, safeCompanyPage]);

  const dashboardMetrics = useMemo(() => {
    const hotCount = filteredCompanies.filter((row) => row.status === "Hot").length;
    const warmCount = filteredCompanies.filter((row) => row.status === "Warm").length;
    const avgScore =
      filteredCompanies.length === 0
        ? 0
        : filteredCompanies.reduce((sum, row) => sum + row.score, 0) / filteredCompanies.length;

    const avgPages =
      filteredPeople.length === 0
        ? 0
        : filteredPeople.reduce((sum, row) => sum + row.pagesViewed, 0) / filteredPeople.length;

    return {
      visitors: filteredPeople.length,
      accounts: filteredCompanies.length,
      avgScore: avgScore.toFixed(1),
      hotCount,
      warmCount,
      avgPages: avgPages.toFixed(1),
    };
  }, [filteredCompanies, filteredPeople]);

  const tabClass = (tab: WebsiteView) => copy.tabClass(activeView === tab);
  const statusPillClass = (status: VisitorStatus | "all") => copy.filterClass(statusFilter === status);

  const visitorsTrend = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        label: `W${i + 1}`,
        visitors: Math.max(
          8,
          Math.round((filteredPeople.length * 0.55 + (i * 2.3 + Math.sin(i) * 4)) * 1.1),
        ),
      })),
    [filteredPeople.length],
  );

  const intentWave = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        step: `D${i + 1}`,
        hot: Math.max(
          2,
          Math.round((dashboardMetrics.hotCount + 2 + Math.sin(i / 1.7) * 2.1) * 1.5),
        ),
        warm: Math.max(
          3,
          Math.round((dashboardMetrics.warmCount + 2 + Math.cos(i / 2) * 2.4) * 1.4),
        ),
      })),
    [dashboardMetrics.hotCount, dashboardMetrics.warmCount],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className={copy.tabShell}>
          <button type="button" onClick={() => setActiveView("overview")} className={tabClass("overview")}>
            Overview
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveView("person-visitors");
              setSelectedPersonId(null);
            }}
            className={tabClass("person-visitors")}
          >
            Person-level visitors
          </button>
          <button type="button" onClick={() => setActiveView("company-visitors")} className={tabClass("company-visitors")}>
            Company-level visitors
          </button>
        </div>

        <div className={copy.tabShellTight}>
          {(["all", "Hot", "Warm", "Cold"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={statusPillClass(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {activeView === "overview" && (
        <>
      <IntegrationStrip
        title="Tools feeding website traffic for this client"
        description="These integrations work together as one pipeline — not separate filters. Traffic and intent here reflect the combined signal."
        items={data.integrations.website}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {website.stats.map((stat) => (
          <SimpleStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            info={METRIC_DESCRIPTIONS[stat.label]}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SimpleStatCard
          label="Visitor traffic"
          value={String(dashboardMetrics.visitors)}
          info={METRIC_DESCRIPTIONS["Visitor traffic"]}
          context="Active person-level profiles"
        />
        <SimpleStatCard
          label="Company pulse"
          value={String(dashboardMetrics.accounts)}
          info={METRIC_DESCRIPTIONS["Company pulse"]}
          context={`${dashboardMetrics.hotCount} hot · ${dashboardMetrics.warmCount} warm`}
        />
        <SimpleStatCard
          label="Average signal"
          value={dashboardMetrics.avgScore}
          info={METRIC_DESCRIPTIONS["Average signal"]}
          context="Intent score across visible accounts"
        />
        <SimpleStatCard
          label="Session depth"
          value={dashboardMetrics.avgPages}
          info={METRIC_DESCRIPTIONS["Session depth"]}
          context="Average pages viewed per person"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <GlassCard className={copy.darkGradientGlass}>
          {isV5 ? (
            <>
              <IntelligencePanelHeader eyebrow="Weekly trend" title="Visitor Trend" hint={CHART_CARD_DESCRIPTIONS["Visitor Trend"]} />
              <MboardChartFrame>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={visitorsTrend} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />
                    <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipContentStyle} />
                    <Line
                      dataKey="visitors"
                      type="monotone"
                      stroke={chartColors.primaryDark}
                      strokeWidth={2.5}
                      dot={{ r: 3, stroke: chartColors.primaryDark, fill: "#ffffff" }}
                      activeDot={{ r: 5, fill: chartColors.primaryDark }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </MboardChartFrame>
            </>
          ) : (
            <>
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <h3 className={copy.h3}>Visitor Trend</h3>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 ${tc.badge}`}>
                    <HiOutlineEye className="h-3.5 w-3.5" />
                    Weekly
                  </span>
                  <CardInfoTip subject="Visitor Trend" text={CHART_CARD_DESCRIPTIONS["Visitor Trend"]} />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={visitorsTrend} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                  <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipContentStyle} />
                  <Line
                    dataKey="visitors"
                    type="monotone"
                    stroke={chartColors.primaryDark}
                    strokeWidth={2.4}
                    dot={{ r: 2.5, stroke: chartColors.primaryDark, fill: "#0f1224" }}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
        </GlassCard>
        <GlassCard className={copy.darkGradientGlass}>
          {isV5 ? (
            <>
              <IntelligencePanelHeader eyebrow="Intent mix" title="Intent Wave" hint={CHART_CARD_DESCRIPTIONS["Intent Wave"]} />
              <MboardChartFrame>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={intentWave} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="hotWaveGradV5" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={chartColors.teal} stopOpacity={0.28} />
                        <stop offset="100%" stopColor={chartColors.teal} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="warmWaveGradV5" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={chartColors.primaryDark} stopOpacity={0.16} />
                        <stop offset="100%" stopColor={chartColors.primaryDark} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />
                    <XAxis dataKey="step" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipContentStyle} />
                    <Area type="monotone" dataKey="hot" stroke={chartColors.teal} fill="url(#hotWaveGradV5)" strokeWidth={2.5} />
                    <Area type="monotone" dataKey="warm" stroke={chartColors.primaryDark} fill="url(#warmWaveGradV5)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </MboardChartFrame>
            </>
          ) : (
            <>
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <h3 className={copy.h3}>Intent Wave</h3>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 ${tc.badge}`}>
                    <HiOutlineChartBar className="h-3.5 w-3.5" />
                    Hot vs Warm
                  </span>
                  <CardInfoTip subject="Intent Wave" text={CHART_CARD_DESCRIPTIONS["Intent Wave"]} />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={intentWave} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hotWaveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartColors.teal} stopOpacity={0.38} />
                      <stop offset="100%" stopColor={chartColors.teal} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="warmWaveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartColors.primaryDark} stopOpacity={0.34} />
                      <stop offset="100%" stopColor={chartColors.primaryDark} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                  <XAxis dataKey="step" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipContentStyle} />
                  <Area type="monotone" dataKey="hot" stroke={chartColors.teal} fill="url(#hotWaveGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="warm" stroke={chartColors.primaryDark} fill="url(#warmWaveGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </>
          )}
        </GlassCard>
      </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <SimpleStatCard
              label="Tracked people"
              value={String(filteredPeople.length)}
              info={METRIC_DESCRIPTIONS["Tracked people"]}
              context="Person-level visitors currently visible"
            />
            <SimpleStatCard
              label="Tracked companies"
              value={String(filteredCompanies.length)}
              info={METRIC_DESCRIPTIONS["Tracked companies"]}
              context="Company-level visitor records"
            />
            <SimpleStatCard
              label="High-intent (Hot)"
              value={String(filteredCompanies.filter((row) => row.status === "Hot").length)}
              info={METRIC_DESCRIPTIONS["High-intent (Hot)"]}
              context="Prioritize these accounts for outreach"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <GlassCard className={copy.darkGradientGlass}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className={copy.h2}>Top Person-level Visitors</h2>
                <button
                  type="button"
                  onClick={() => setActiveView("person-visitors")}
                  className={`text-sm ${tc.link}`}
                >
                  View all
                </button>
              </div>
              {filteredPeople.length === 0 ? (
                <EmptyState message="No person-level visitors match your filters." />
              ) : (
                <div className="space-y-3">
                  {filteredPeople.slice(0, 5).map((visitor) => (
                    <div
                      key={visitor.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setActiveView("person-visitors");
                        setSelectedPersonId(visitor.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveView("person-visitors");
                          setSelectedPersonId(visitor.id);
                        }
                      }}
                      className={`group flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-left ${tc.rowInteractive}`}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${themed ? tc.avatar : "bg-gradient-to-br from-[#3a32a0] to-[#4940c6] text-white shadow-[0_0_0_2px_rgba(73,64,198,0.35)]"}`}>
                          {visitor.name
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((p) => p[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className={`font-semibold ${copy.ink}`}>{visitor.name}</p>
                          <p className={`truncate text-xs ${copy.muted}`}>{visitor.location}</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const full = website.rows.find((r) => r.company === visitor.company);
                            if (full) {
                              setSelectedCompany(full);
                              setSelectedPersonId(null);
                            }
                          }}
                          className={`flex h-10 w-10 items-center justify-center rounded-xl text-[11px] font-bold text-white shadow-inner ring-1 ring-white/10 transition ${themed ? "hover:ring-[var(--theme-primary)]" : "hover:ring-[#4940c6]/50"}`}
                          style={{ background: companyGradient(visitor.company) }}
                          title={`${visitor.company} profile`}
                          aria-label={`Open company ${visitor.company}`}
                        >
                          {companyMarkLabel(visitor.company)}
                        </button>
                        <HiOutlineChevronRight className={`h-4 w-4 ${copy.muted} transition ${themed ? "group-hover:text-[var(--theme-ink)]" : "group-hover:text-white"}`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            <GlassCard className={copy.darkGradientGlass}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className={copy.h2}>Top Company-level Visitors</h2>
                <button
                  type="button"
                  onClick={() => setActiveView("company-visitors")}
                  className={`text-sm ${tc.link}`}
                >
                  View all
                </button>
              </div>
              {filteredCompanies.length === 0 ? (
                <EmptyState message="No company visitors match your filters." />
              ) : (
                <div className="space-y-3">
                  {filteredCompanies.slice(0, 5).map((row) => (
                    <button
                      key={`${row.company}-overview`}
                      type="button"
                      onClick={() => setSelectedCompany(row)}
                      className={`flex w-full items-center gap-3 p-3 text-left ${tc.rowInteractive}`}
                    >
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xs font-bold text-white ring-2 ring-white/10"
                        style={{ background: companyGradient(row.company) }}
                      >
                        {companyMarkLabel(row.company)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`truncate font-semibold ${copy.ink}`}>{row.company}</p>
                          <StatusBadge status={row.status} />
                        </div>
                        <p className={`mt-0.5 truncate text-xs ${copy.muted}`}>{row.pagesVisited}</p>
                        <p className={`text-xs ${copy.muteSm}`}>{row.timeOnSite} on site</p>
                      </div>
                      <HiOutlineChevronRight className={`h-4 w-4 shrink-0 ${copy.muted}`} />
                    </button>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        </>
      )}

      {activeView === "person-visitors" && (
        <GlassCard className={copy.darkGradientGlass}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className={copy.h2}>Person-level visitors</h2>
            <p className={`text-sm ${copy.muted}`}>
              Showing{" "}
              <span className={`font-semibold ${copy.ink}`}>
                {filteredPeople.length === 0 ? 0 : (safePersonPage - 1) * PERSON_PAGE_SIZE + 1}
                -
                {Math.min(safePersonPage * PERSON_PAGE_SIZE, filteredPeople.length)}
              </span>{" "}
              of <span className={`font-semibold ${copy.ink}`}>{filteredPeople.length}</span> profiles
            </p>
          </div>
          {filteredPeople.length === 0 ? (
            <EmptyState message="No person-level visitors match your filters." />
          ) : (
            <>
              <div className="nos-table-wrap">
                <table className="nos-table min-w-[1020px]">
                  <thead>
                    <tr>
                      <th>Visitor</th>
                      <th>Contact</th>
                      <th>Company</th>
                      <th>Last Seen</th>
                      <th>Pages</th>
                      <th>Referred By</th>
                      <th>Status</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {pagedPeople.map((visitor) => (
                      <tr
                        key={visitor.id}
                        onClick={() => setSelectedPersonId(visitor.id)}
                        className={`${copy.tableRow} ${
                          selectedPersonId === visitor.id
                            ? tc.rowSelected
                            : `border-l-transparent ${copy.tableRowHover}`
                        }`}
                      >
                        <td>
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ${themed ? tc.avatar : "bg-gradient-to-br from-[#3a32a0] to-[#4940c6] text-white"}`}>
                              {visitor.name
                                .split(" ")
                                .slice(0, 2)
                                .map((p) => p[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="font-semibold">{visitor.name}</p>
                              <p className={`text-xs ${copy.muted}`}>
                                {visitor.title} · {visitor.location}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={copy.muted}>{visitor.contact}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const full = website.rows.find((r) => r.company === visitor.company);
                                if (full) {
                                  setSelectedCompany(full);
                                  setSelectedPersonId(null);
                                }
                              }}
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[10px] font-bold text-white ring-1 ring-white/12 transition ${themed ? "hover:ring-[var(--theme-primary)]" : "hover:ring-[#4940c6]/45"}`}
                              style={{ background: companyGradient(visitor.company) }}
                              title={visitor.company}
                              aria-label={`Open ${visitor.company}`}
                            >
                              {companyMarkLabel(visitor.company)}
                            </button>
                            <span className={`min-w-0 truncate font-medium ${copy.ink}`}>{visitor.company}</span>
                          </div>
                        </td>
                        <td>
                          <div className={`flex items-center gap-2 ${copy.muted}`}>
                            <HiOutlineClock className="h-4 w-4" />
                            {visitor.lastSeen}
                          </div>
                        </td>
                        <td className={copy.muted}>{visitor.pagesViewed}</td>
                        <td className={copy.muted}>www.{visitor.source}</td>
                        <td>
                          <StatusBadge status={visitor.status} />
                        </td>
                        <td className="text-right">
                          <HiOutlineChevronRight className={`inline h-4 w-4 ${copy.muted}`} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className={`text-xs ${copy.muted}`}>
                  Page {safePersonPage} of {personTotalPages}
                </p>
                <div className="inline-flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPersonPage((p) => Math.max(1, p - 1))}
                    disabled={safePersonPage === 1}
                    className={copy.pagBtn}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setPersonPage((p) => Math.min(personTotalPages, p + 1))}
                    disabled={safePersonPage === personTotalPages}
                    className={copy.pagBtn}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </GlassCard>
      )}

      {activeView === "company-visitors" && (
        <GlassCard className={copy.darkGradientGlass}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className={copy.h2}>Company-level visitors</h2>
            <p className={`text-sm ${copy.muted}`}>
              Showing{" "}
              <span className={`font-semibold ${copy.ink}`}>
                {filteredCompanies.length === 0 ? 0 : (safeCompanyPage - 1) * COMPANY_PAGE_SIZE + 1}
                -
                {Math.min(safeCompanyPage * COMPANY_PAGE_SIZE, filteredCompanies.length)}
              </span>{" "}
              of <span className={`font-semibold ${copy.ink}`}>{filteredCompanies.length}</span>
            </p>
          </div>
          {filteredCompanies.length === 0 ? (
            <EmptyState message="No company visitors match your filters." />
          ) : (
            <>
              <div className="nos-table-wrap">
                <table className="nos-table min-w-[760px]">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Industry</th>
                      <th>Pages Visited</th>
                      <th>Time on Site</th>
                      <th>Signal Score</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedCompanies.map((row) => (
                      <tr
                        key={row.company}
                        className={`${copy.tableRow} cursor-pointer ${copy.tableRowHover}`}
                        onClick={() => setSelectedCompany(row)}
                      >
                        <td>
                          <div className="flex items-center gap-3">
                            <span
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold text-white ring-2 ring-white/12"
                              style={{ background: companyGradient(row.company) }}
                            >
                              {companyMarkLabel(row.company)}
                            </span>
                            <span className="font-semibold">{row.company}</span>
                          </div>
                        </td>
                        <td className={copy.muted}>{row.industry}</td>
                        <td className={copy.muted}>{row.pagesVisited}</td>
                        <td>{row.timeOnSite}</td>
                        <td className={`font-semibold ${themed ? tc.accentText : "text-[#00D4FF]"}`}>{row.score}</td>
                        <td>
                          <StatusBadge status={row.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className={`text-xs ${copy.muted}`}>
                  Page {safeCompanyPage} of {companyTotalPages}
                </p>
                <div className="inline-flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCompanyPage((p) => Math.max(1, p - 1))}
                    disabled={safeCompanyPage === 1}
                    className={copy.pagBtn}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompanyPage((p) => Math.min(companyTotalPages, p + 1))}
                    disabled={safeCompanyPage === companyTotalPages}
                    className={copy.pagBtn}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </GlassCard>
      )}

      {activeView === "person-visitors" && selectedPerson && (
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            className="absolute inset-0 bg-black/55 backdrop-blur-[1px]"
            aria-label="Close visitor panel"
            onClick={() => setSelectedPersonId(null)}
          />
          <aside className={copy.drawerAside}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className={copy.h2}>{selectedPerson.name}</h3>
            <button
                type="button"
                onClick={() => setSelectedPersonId(null)}
                className={`rounded-lg p-1 ${copy.muted} ${themed ? "hover:bg-[var(--theme-canvas-soft)] hover:text-[var(--theme-ink)]" : "hover:bg-white/[0.06] hover:text-white"}`}
                aria-label="Close visitor panel"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>
            <p className={`text-sm ${copy.muted}`}>
              {selectedPerson.title} · {selectedPerson.location}
            </p>
            <div className={`mt-4 space-y-3 ${copy.drawerPanel}`}>
              <p className={`font-semibold ${copy.ink}`}>Visitor details</p>
              <p className={copy.muted}>Company: {selectedPerson.company}</p>
              <p className={copy.muted}>Contact: {selectedPerson.contact}</p>
              <p className={copy.muted}>Pages viewed: {selectedPerson.pagesViewed}</p>
              <p className={copy.muted}>Session depth: {selectedPerson.lastSeen}</p>
              <p className={copy.muted}>Referrer: www.{selectedPerson.source}</p>
              <p className={copy.muted}>
                Status: <span className={`font-semibold ${copy.ink}`}>{selectedPerson.status}</span>
              </p>
            </div>
            <div className={`mt-4 ${copy.drawerPanel}`}>
              <p className={`mb-2 font-semibold ${copy.ink}`}>Suggested next action</p>
              <p className={copy.muted}>
                Trigger a personalized LinkedIn touchpoint and prioritize this lead in the outreach queue.
              </p>
            </div>
          </aside>
        </div>
      )}

      {selectedCompany && (
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            className="absolute inset-0 bg-black/55 backdrop-blur-[1px]"
            aria-label="Close company panel"
            onClick={() => setSelectedCompany(null)}
          />
          <aside className={copy.drawerAside}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white ring-2 ring-white/15"
                  style={{ background: companyGradient(selectedCompany.company) }}
                >
                  {companyMarkLabel(selectedCompany.company)}
                </span>
                <div>
                  <h3 className={copy.h2}>{selectedCompany.company}</h3>
                  <p className={`text-sm ${copy.muted}`}>{selectedCompany.industry}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCompany(null)}
                className={`rounded-lg p-1 ${copy.muted} ${themed ? "hover:bg-[var(--theme-canvas-soft)] hover:text-[var(--theme-ink)]" : "hover:bg-white/[0.06] hover:text-white"}`}
                aria-label="Close company panel"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              <StatusBadge status={selectedCompany.status} />
              <span className={`rounded-lg border px-2.5 py-1 text-xs ${themed ? "border-[var(--theme-hairline)] bg-[var(--theme-canvas-soft)] " + copy.muted : "border-white/[0.1] bg-black/30 text-[#A0AEC0]"}`}>
                Score {selectedCompany.score}
              </span>
            </div>
            <div className={`space-y-3 ${copy.drawerPanel}`}>
              <p className={`font-semibold ${copy.ink}`}>Session snapshot</p>
              <p className={copy.muted}>Pages: {selectedCompany.pagesVisited}</p>
              <p className={copy.muted}>Time on site: {selectedCompany.timeOnSite}</p>
              <p className={copy.muteSm}>
                Visitor identification pulls from the combined integrations listed below — one unified signal, not
                isolated tool slices.
              </p>
            </div>
            <div className={`mt-4 ${copy.drawerPanel}`}>
              <p className={`mb-2 font-semibold ${copy.ink}`}>Signal stack</p>
              <div className="flex flex-wrap gap-2">
                {data.integrations.website.map((t) => (
                  <span
                    key={t.id}
                    className={`rounded-lg border px-2 py-1 text-xs ${themed ? "border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] " + copy.muted : "border-white/[0.08] text-[#A0AEC0]"}`}
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
