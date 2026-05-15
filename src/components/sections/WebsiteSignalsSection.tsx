"use client";

import { useEffect, useMemo, useState } from "react";
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
  HiOutlineTrendingUp,
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
import { axisStyle, chartGridStroke, tooltipContentStyle } from "@/components/charts/chartTheme";
import type { WebsiteRow } from "@/types/nos";

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

  const tabClass = (tab: WebsiteView) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
      activeView === tab
        ? "bg-white/[0.08] text-white shadow-[0_0_0_1px_rgba(73,64,198,0.35)]"
        : "text-[#A0AEC0] hover:text-white"
    }`;

  const statusPillClass = (status: VisitorStatus | "all") =>
    `rounded-lg border px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em] transition ${
      statusFilter === status
        ? "border-[#4940c6]/70 bg-[#4940c6]/20 text-white"
        : "border-white/[0.1] text-[#A0AEC0] hover:border-white/[0.25] hover:text-white"
    }`;

  const darkGradientGlass =
    "border-white/[0.08] bg-gradient-to-br from-[#100f24]/88 via-[#0C1029]/88 to-[#06080F]/92";

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
        <div className="inline-flex rounded-xl border border-white/[0.08] bg-[#111C44]/70 p-1">
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

        <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#111C44]/70 p-1.5">
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
            className="border-white/[0.08] bg-gradient-to-br from-[#1A1734]/78 via-[#11172f]/82 to-[#090c16]/90 backdrop-blur-md"
          />
        ))}
      </div>

      <GlassCard className={`${darkGradientGlass} p-0`}>
        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#4940c6]/20 bg-gradient-to-br from-[#2C2359]/82 via-[#1A1D3E]/86 to-[#0C101C]/92 p-4 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.08em] text-[#D6D0FF]">Visitor traffic</p>
            <p className="mt-2 text-3xl font-bold text-white">{dashboardMetrics.visitors}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-[#E1DEFF]">
              <HiOutlineTrendingUp className="h-3.5 w-3.5" />
              Active person-level profiles
            </p>
          </div>
          <div className="rounded-2xl border border-[#4940c6]/18 bg-gradient-to-br from-[#25214F]/84 via-[#181B39]/86 to-[#0A0D18]/92 p-4 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.08em] text-[#C9D8FF]">Company pulse</p>
            <p className="mt-2 text-3xl font-bold text-white">{dashboardMetrics.accounts}</p>
            <p className="mt-1 text-xs text-[#D4E0FF]">
              {dashboardMetrics.hotCount} hot · {dashboardMetrics.warmCount} warm
            </p>
          </div>
          <div className="rounded-2xl border border-[#4940c6]/16 bg-gradient-to-br from-[#1F2145]/84 via-[#131B35]/88 to-[#090C17]/94 p-4 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.08em] text-[#BDD0FF]">Average signal</p>
            <p className="mt-2 text-3xl font-bold text-white">{dashboardMetrics.avgScore}</p>
            <p className="mt-1 text-xs text-[#C8D7FF]">Intent score across visible accounts</p>
          </div>
          <div className="rounded-2xl border border-[#4940c6]/14 bg-gradient-to-br from-[#1D1F3F]/82 via-[#11172d]/88 to-[#080B14]/94 p-4 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.08em] text-[#D0D2FF]">Session depth</p>
            <p className="mt-2 text-3xl font-bold text-white">{dashboardMetrics.avgPages}</p>
            <p className="mt-1 text-xs text-[#DBDCFF]">Average pages viewed per person</p>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <GlassCard className={darkGradientGlass}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-white">Visitor Trend</h3>
            <span className="inline-flex items-center gap-1 rounded-lg border border-[#4940c6]/25 bg-[#4940c6]/12 px-2 py-1 text-xs text-[#D8CEFF]">
              <HiOutlineEye className="h-3.5 w-3.5" />
              Weekly
            </span>
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
                stroke="#7c73d8"
                strokeWidth={2.4}
                dot={{ r: 2.5, stroke: "#7c73d8", fill: "#0f1224" }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
        <GlassCard className={darkGradientGlass}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-white">Intent Wave</h3>
            <span className="inline-flex items-center gap-1 rounded-lg border border-[#4940c6]/25 bg-[#4940c6]/12 px-2 py-1 text-xs text-[#D8CEFF]">
              <HiOutlineChartBar className="h-3.5 w-3.5" />
              Hot vs Warm
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={intentWave} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="hotWaveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9d96e8" stopOpacity={0.38} />
                  <stop offset="100%" stopColor="#9d96e8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="warmWaveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4940c6" stopOpacity={0.34} />
                  <stop offset="100%" stopColor="#4940c6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
              <XAxis dataKey="step" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipContentStyle} />
              <Area type="monotone" dataKey="hot" stroke="#9d96e8" fill="url(#hotWaveGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="warm" stroke="#4940c6" fill="url(#warmWaveGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

          <GlassCard className={darkGradientGlass}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-[#4940c6]/14 bg-gradient-to-br from-[#221F45]/84 via-[#171A37]/88 to-[#0A0D18]/92 p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-[#A0AEC0]">Tracked people</p>
                <p className="mt-2 text-3xl font-bold text-white">{filteredPeople.length}</p>
                <p className="mt-1 text-xs text-[#A0AEC0]">Person-level visitors currently visible</p>
              </div>
              <div className="rounded-2xl border border-[#4940c6]/14 bg-gradient-to-br from-[#1F1C3E]/84 via-[#151830]/88 to-[#090C17]/92 p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-[#A0AEC0]">Tracked companies</p>
                <p className="mt-2 text-3xl font-bold text-white">{filteredCompanies.length}</p>
                <p className="mt-1 text-xs text-[#A0AEC0]">Company-level visitor records</p>
              </div>
              <div className="rounded-2xl border border-[#4940c6]/14 bg-gradient-to-br from-[#1B1A37]/84 via-[#12172D]/88 to-[#080B14]/92 p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-[#A0AEC0]">High-intent (Hot)</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {filteredCompanies.filter((row) => row.status === "Hot").length}
                </p>
                <p className="mt-1 text-xs text-[#A0AEC0]">Prioritize these accounts for outreach</p>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <GlassCard className={darkGradientGlass}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-white">Top Person-level Visitors</h2>
                <button
                  type="button"
                  onClick={() => setActiveView("person-visitors")}
                  className="text-sm text-[#4940c6] hover:text-white"
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
                      className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2.5 text-left transition hover:border-[#4940c6]/35"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3a32a0] to-[#4940c6] text-sm font-bold text-white shadow-[0_0_0_2px_rgba(73,64,198,0.35)]">
                          {visitor.name
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((p) => p[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white">{visitor.name}</p>
                          <p className="truncate text-xs text-[#A0AEC0]">{visitor.location}</p>
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
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-[11px] font-bold text-white shadow-inner ring-1 ring-white/10 transition hover:ring-[#4940c6]/50"
                          style={{ background: companyGradient(visitor.company) }}
                          title={`${visitor.company} profile`}
                          aria-label={`Open company ${visitor.company}`}
                        >
                          {companyMarkLabel(visitor.company)}
                        </button>
                        <HiOutlineChevronRight className="h-4 w-4 text-[#A0AEC0] transition group-hover:text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            <GlassCard className={darkGradientGlass}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-white">Top Company-level Visitors</h2>
                <button
                  type="button"
                  onClick={() => setActiveView("company-visitors")}
                  className="text-sm text-[#4940c6] hover:text-white"
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
                      className="flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-black/20 p-3 text-left transition hover:border-[#4940c6]/35"
                    >
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xs font-bold text-white ring-2 ring-white/10"
                        style={{ background: companyGradient(row.company) }}
                      >
                        {companyMarkLabel(row.company)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate font-semibold text-white">{row.company}</p>
                          <StatusBadge status={row.status} />
                        </div>
                        <p className="mt-0.5 truncate text-xs text-[#A0AEC0]">{row.pagesVisited}</p>
                        <p className="text-xs text-[#718096]">{row.timeOnSite} on site</p>
                      </div>
                      <HiOutlineChevronRight className="h-4 w-4 shrink-0 text-[#A0AEC0]" />
                    </button>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        </>
      )}

      {activeView === "person-visitors" && (
        <GlassCard className={darkGradientGlass}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-white">Person-level visitors</h2>
            <p className="text-sm text-[#A0AEC0]">
              Showing{" "}
              <span className="font-semibold text-white">
                {filteredPeople.length === 0 ? 0 : (safePersonPage - 1) * PERSON_PAGE_SIZE + 1}
                -
                {Math.min(safePersonPage * PERSON_PAGE_SIZE, filteredPeople.length)}
              </span>{" "}
              of <span className="font-semibold text-white">{filteredPeople.length}</span> profiles
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
                        className={`cursor-pointer border-l-4 text-white transition ${
                          selectedPersonId === visitor.id
                            ? "border-l-[#4940c6] bg-white/[0.06]"
                            : "border-l-transparent hover:bg-white/[0.035]"
                        }`}
                      >
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#3a32a0] to-[#4940c6] text-xs font-bold text-white">
                              {visitor.name
                                .split(" ")
                                .slice(0, 2)
                                .map((p) => p[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="font-semibold">{visitor.name}</p>
                              <p className="text-xs text-[#A0AEC0]">
                                {visitor.title} · {visitor.location}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="text-[#A0AEC0]">{visitor.contact}</td>
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
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[10px] font-bold text-white ring-1 ring-white/12 transition hover:ring-[#4940c6]/45"
                              style={{ background: companyGradient(visitor.company) }}
                              title={visitor.company}
                              aria-label={`Open ${visitor.company}`}
                            >
                              {companyMarkLabel(visitor.company)}
                            </button>
                            <span className="min-w-0 truncate font-medium text-white">{visitor.company}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2 text-[#A0AEC0]">
                            <HiOutlineClock className="h-4 w-4" />
                            {visitor.lastSeen}
                          </div>
                        </td>
                        <td className="text-[#A0AEC0]">{visitor.pagesViewed}</td>
                        <td className="text-[#A0AEC0]">www.{visitor.source}</td>
                        <td>
                          <StatusBadge status={visitor.status} />
                        </td>
                        <td className="text-right">
                          <HiOutlineChevronRight className="inline h-4 w-4 text-[#A0AEC0]" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-[#A0AEC0]">
                  Page {safePersonPage} of {personTotalPages}
                </p>
                <div className="inline-flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPersonPage((p) => Math.max(1, p - 1))}
                    disabled={safePersonPage === 1}
                    className="rounded-lg border border-white/[0.12] px-3 py-1 text-xs text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setPersonPage((p) => Math.min(personTotalPages, p + 1))}
                    disabled={safePersonPage === personTotalPages}
                    className="rounded-lg border border-white/[0.12] px-3 py-1 text-xs text-white disabled:cursor-not-allowed disabled:opacity-40"
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
        <GlassCard className={darkGradientGlass}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-white">Company-level visitors</h2>
            <p className="text-sm text-[#A0AEC0]">
              Showing{" "}
              <span className="font-semibold text-white">
                {filteredCompanies.length === 0 ? 0 : (safeCompanyPage - 1) * COMPANY_PAGE_SIZE + 1}
                -
                {Math.min(safeCompanyPage * COMPANY_PAGE_SIZE, filteredCompanies.length)}
              </span>{" "}
              of <span className="font-semibold text-white">{filteredCompanies.length}</span>
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
                        className="cursor-pointer text-white transition hover:bg-white/[0.035]"
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
                        <td className="text-[#A0AEC0]">{row.industry}</td>
                        <td className="text-[#A0AEC0]">{row.pagesVisited}</td>
                        <td>{row.timeOnSite}</td>
                        <td className="font-semibold text-[#00D4FF]">{row.score}</td>
                        <td>
                          <StatusBadge status={row.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-[#A0AEC0]">
                  Page {safeCompanyPage} of {companyTotalPages}
                </p>
                <div className="inline-flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCompanyPage((p) => Math.max(1, p - 1))}
                    disabled={safeCompanyPage === 1}
                    className="rounded-lg border border-white/[0.12] px-3 py-1 text-xs text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompanyPage((p) => Math.min(companyTotalPages, p + 1))}
                    disabled={safeCompanyPage === companyTotalPages}
                    className="rounded-lg border border-white/[0.12] px-3 py-1 text-xs text-white disabled:cursor-not-allowed disabled:opacity-40"
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
          <aside className="absolute right-0 top-0 z-50 h-full w-full max-w-[420px] overflow-y-auto border-l border-white/[0.08] bg-gradient-to-b from-[#16132A]/96 via-[#0E1324]/96 to-[#070A12]/97 p-5 shadow-[-20px_0_42px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-white">{selectedPerson.name}</h3>
            <button
                type="button"
                onClick={() => setSelectedPersonId(null)}
                className="rounded-lg p-1 text-[#A0AEC0] hover:bg-white/[0.06] hover:text-white"
                aria-label="Close visitor panel"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-[#A0AEC0]">
              {selectedPerson.title} · {selectedPerson.location}
            </p>
            <div className="mt-4 space-y-3 rounded-2xl border border-white/[0.08] bg-black/30 p-4 text-sm">
              <p className="font-semibold text-white">Visitor details</p>
              <p className="text-[#A0AEC0]">Company: {selectedPerson.company}</p>
              <p className="text-[#A0AEC0]">Contact: {selectedPerson.contact}</p>
              <p className="text-[#A0AEC0]">Pages viewed: {selectedPerson.pagesViewed}</p>
              <p className="text-[#A0AEC0]">Session depth: {selectedPerson.lastSeen}</p>
              <p className="text-[#A0AEC0]">Referrer: www.{selectedPerson.source}</p>
              <p className="text-[#A0AEC0]">
                Status: <span className="font-semibold text-white">{selectedPerson.status}</span>
              </p>
            </div>
            <div className="mt-4 rounded-2xl border border-white/[0.08] bg-black/30 p-4 text-sm">
              <p className="mb-2 font-semibold text-white">Suggested next action</p>
              <p className="text-[#A0AEC0]">
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
          <aside className="absolute right-0 top-0 z-50 h-full w-full max-w-[420px] overflow-y-auto border-l border-white/[0.08] bg-gradient-to-b from-[#16132A]/96 via-[#0E1324]/96 to-[#070A12]/97 p-5 shadow-[-20px_0_42px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white ring-2 ring-white/15"
                  style={{ background: companyGradient(selectedCompany.company) }}
                >
                  {companyMarkLabel(selectedCompany.company)}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">{selectedCompany.company}</h3>
                  <p className="text-sm text-[#A0AEC0]">{selectedCompany.industry}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCompany(null)}
                className="rounded-lg p-1 text-[#A0AEC0] hover:bg-white/[0.06] hover:text-white"
                aria-label="Close company panel"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              <StatusBadge status={selectedCompany.status} />
              <span className="rounded-lg border border-white/[0.1] bg-black/30 px-2.5 py-1 text-xs text-[#A0AEC0]">
                Score {selectedCompany.score}
              </span>
            </div>
            <div className="space-y-3 rounded-2xl border border-white/[0.08] bg-black/30 p-4 text-sm">
              <p className="font-semibold text-white">Session snapshot</p>
              <p className="text-[#A0AEC0]">Pages: {selectedCompany.pagesVisited}</p>
              <p className="text-[#A0AEC0]">Time on site: {selectedCompany.timeOnSite}</p>
              <p className="text-[#718096]">
                Visitor identification pulls from the combined integrations listed below — one unified signal, not
                isolated tool slices.
              </p>
            </div>
            <div className="mt-4 rounded-2xl border border-white/[0.08] bg-black/30 p-4 text-sm">
              <p className="mb-2 font-semibold text-white">Signal stack</p>
              <div className="flex flex-wrap gap-2">
                {data.integrations.website.map((t) => (
                  <span
                    key={t.id}
                    className="rounded-lg border border-white/[0.08] px-2 py-1 text-xs text-[#A0AEC0]"
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
