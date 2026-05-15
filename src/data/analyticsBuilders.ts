import type {
  AnalyticsPeriodId,
  ChannelPulseMetric,
  CrossChannelPoint,
  EmailCampaignRow,
  EmailContactRow,
  EmailPeriodBundle,
  EmailSequenceRow,
  EmailStat,
  EmailWeekBar,
  LinkedInEngagementPoint,
  LinkedInFeedRow,
  LinkedInPeriodBundle,
  LinkedInStat,
  NarrativeInsight,
  NosDemoPerson,
  SignalFeedRow,
  WorkspaceData,
  WorkspaceId,
} from "@/types/nos";

export const ANALYTICS_PERIODS: AnalyticsPeriodId[] = ["7d", "30d", "3m", "month"];

const feedPalette = ["#4940c6", "#f36901", "#01B574", "#EE5D50", "#3a32a0"];

export function periodMultiplier(period: AnalyticsPeriodId): number {
  switch (period) {
    case "7d":
      return 0.24;
    case "30d":
      return 1;
    case "3m":
      return 2.88;
    case "month":
      return 0.81;
    default:
      return 1;
  }
}

/** Deterministic pseudo-random 0–1 */
function hash01(workspaceId: string, seed: string): number {
  let h = 0;
  const s = `${workspaceId}:${seed}`;
  for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(Math.sin(h)) % 1;
}

export function toLinkedInFeedPeople(people: NosDemoPerson[], limit: number): LinkedInFeedRow[] {
  const linked = people.filter((p) => p.channel.toLowerCase().includes("linkedin"));
  const src = linked.length >= 20 ? linked : people;
  return src.slice(0, Math.min(limit, src.length)).map((p, i) => ({
    name: p.fullName,
    title: `${p.title} at ${p.company}`,
    engagementType:
      p.status === "Hot"
        ? "High intent · multi-touch"
        : p.status === "Warm"
          ? "Engaged · repeat"
          : "Surface intent",
    score: p.score,
    time: `${(i % 47) + 2} min ago`,
    avatarColor: feedPalette[i % feedPalette.length],
  }));
}

export function toSignalFeedFromPeople(people: NosDemoPerson[], limit = 14): SignalFeedRow[] {
  const signalTypes = [
    "Pricing Page Visit",
    "Product Tour",
    "Sequence Reply",
    "Webinar Registration",
    "Email Click",
    "LinkedIn engagement",
    "Lead magnet download",
  ];
  const channels: SignalFeedRow["channel"][] = ["Website", "LinkedIn", "Email", "Content"];
  const sorted = [...people].sort((a, b) => b.score - a.score);
  return sorted.slice(0, limit).map((p, i) => ({
    company: p.company,
    channel: channels[i % channels.length],
    signalType: signalTypes[i % signalTypes.length],
    score: p.score,
    time: `${(i % 50) + 1} min ago`,
  }));
}

function scaleLinkedInStats(stats: LinkedInStat[], workspaceId: WorkspaceId, period: AnalyticsPeriodId): LinkedInStat[] {
  const m = periodMultiplier(period) * (0.9 + hash01(workspaceId, `lk-stat:${period}`) * 0.2);
  return stats.map((s) => {
    const raw = s.value.trim();
    if (raw.startsWith("+")) {
      const n = parseInt(raw.slice(1).replace(/\D+/g, ""), 10) || 12;
      return { ...s, value: `+${Math.max(1, Math.round(n * m))}` };
    }
    const kMatch = /^([\d.]+)\s*K$/i.exec(raw.replace(/,/g, ""));
    if (kMatch) {
      const v = parseFloat(kMatch[1]) * 1000 * m;
      const k = v / 1000;
      return {
        ...s,
        value: `${k >= 100 ? Math.round(k) : Math.round(k * 10) / 10}K`,
      };
    }
    const bare = parseInt(raw.replace(/,/g, "").replace(/\D/g, "") || "", 10) || 420;
    return { ...s, value: `${Math.round(bare * m)}` };
  });
}

function scaleEngagementChart(
  pts: LinkedInEngagementPoint[],
  period: AnalyticsPeriodId,
  workspaceId: WorkspaceId,
): LinkedInEngagementPoint[] {
  const m = periodMultiplier(period) * (0.85 + hash01(workspaceId, `lk-eg:${period}`) * 0.25);
  const len =
    period === "7d" ? 7 : period === "30d" ? Math.min(pts.length, 8) : period === "3m" ? 12 : Math.min(pts.length, 5);
  return pts.slice(0, Math.max(len, 4)).map((p, i) => ({
    week: period === "3m" ? `M${i + 1}` : `W${i + 1}`,
    engagement: Math.max(120, Math.round(p.engagement * m * (0.94 + Math.sin(i) * 0.06))),
  }));
}

export function buildLinkedInPeriodBundle(
  base: WorkspaceData["linkedin"],
  people: NosDemoPerson[],
  workspaceId: WorkspaceId,
  period: AnalyticsPeriodId,
): LinkedInPeriodBundle {
  const m = periodMultiplier(period);
  const feedLimits: Record<AnalyticsPeriodId, number> = {
    "7d": Math.max(35, Math.round(people.length * 0.12 * m)),
    "30d": Math.max(60, Math.round(people.length * 0.35 * Math.sqrt(m))),
    "3m": Math.min(people.length || 160, Math.max(100, Math.round(people.length * 0.5))),
    month: Math.max(48, Math.round(people.length * 0.2 * Math.sqrt(m))),
  };
  return {
    stats: scaleLinkedInStats(base.stats, workspaceId, period),
    feed: toLinkedInFeedPeople(people, Math.min(feedLimits[period], 200)),
    engagementChart: scaleEngagementChart(base.engagementChart, period, workspaceId),
  };
}

function buildWeeklyChartForEmail(
  base: EmailWeekBar[],
  period: AnalyticsPeriodId,
  workspaceId: WorkspaceId,
  m: number,
): EmailWeekBar[] {
  const target =
    period === "7d" ? 7 : period === "30d" ? 6 : period === "3m" ? 12 : 4;
  const src =
    period === "3m"
      ? Array.from({ length: 12 }, (_, i) => base[i % base.length])
      : base.slice(0, Math.min(base.length, target));
  return src.map((row, i) => ({
    week: `${period === "3m" ? "M" : "W"}${i + 1}`,
    sent: Math.max(
      20,
      Math.round(row.sent * m * (0.88 + hash01(workspaceId, `em-sent-${period}-${i}`) * 0.2)),
    ),
    replies: Math.max(
      3,
      Math.round(row.replies * m * (0.85 + hash01(workspaceId, `em-reply-${period}-${i}`) * 0.25)),
    ),
  }));
}

function sequenceToCampaign(
  s: EmailSequenceRow,
  idx: number,
  workspaceId: WorkspaceId,
  period: AnalyticsPeriodId,
  campaignStatus: EmailCampaignRow["status"],
): EmailCampaignRow {
  const m = periodMultiplier(period);
  const jitter = hash01(workspaceId, `camp-${period}-${idx}`);
  const contacts = Math.max(28, Math.round(s.contacts * m * (0.9 + jitter * 0.15)));
  const sent = Math.max(contacts + 120, Math.round(contacts * 4.8 * (0.95 + jitter * 0.1)));
  const openRate = Math.min(71, Math.max(26, Math.round(s.openRate * (0.96 + jitter * 0.06))));
  const replyRate = Math.min(42, Math.max(9, Math.round(s.replyRate * (0.95 + jitter * 0.08))));
  const bounces = Math.max(8, Math.round(sent * (0.015 + jitter * 0.012)));
  const bounceRate = Math.round((bounces / sent) * 1000) / 10;
  const opens = Math.round(sent * (openRate / 100));
  const replies = Math.round(sent * (replyRate / 100));
  const clicks = Math.round(opens * (0.38 + jitter * 0.12));

  return {
    id: `${workspaceId}-em-cmp-${idx}`,
    name: s.name.includes("Outbound") ? s.name : `${s.name} · Instantly lane`,
    status: campaignStatus,
    contacts,
    sent,
    opens,
    clicks,
    replies,
    bounces,
    unsubscribes: Math.max(1, Math.round(contacts * 0.018)),
    openRate,
    replyRate,
    bounceRate,
    meetingsBooked: s.meetings,
    owner: "Chris Rubin",
  };
}

function buildExtraCampaigns(
  workspaceId: WorkspaceId,
  period: AnalyticsPeriodId,
): EmailCampaignRow[] {
  const m = periodMultiplier(period);
  const o = hash01(workspaceId, `extrac-${period}`);
  const sent = Math.round(4200 * m * (1 + o * 0.2));
  const openRate = 46;
  const replyRate = 19;
  const bounces = Math.round(sent * 0.022);
  return [
    {
      id: `${workspaceId}-em-infra`,
      name: "Mailbox rotation · Deliverability watchdog",
      status: "Running",
      contacts: Math.round(380 * m),
      sent,
      opens: Math.round(sent * (openRate / 100)),
      clicks: Math.round(sent * (openRate / 100) * 0.42),
      replies: Math.round(sent * (replyRate / 100)),
      bounces,
      unsubscribes: Math.round(380 * m * 0.021),
      openRate,
      replyRate,
      bounceRate: Math.round((bounces / sent) * 1000) / 10,
      meetingsBooked: Math.max(16, Math.round(28 * m)),
      owner: "Chris Rubin",
    },
    {
      id: `${workspaceId}-em-apollo-seq`,
      name: "Apollo → Instantly hybrid sequence",
      status: Math.round(o * 10) % 5 === 0 ? "Paused" : "Running",
      contacts: Math.round(920 * m),
      sent: Math.round(9100 * m),
      opens: Math.round(9100 * m * 0.41),
      clicks: Math.round(9100 * m * 0.41 * 0.36),
      replies: Math.round(9100 * m * 0.176),
      bounces: Math.round(9100 * m * 0.026),
      unsubscribes: Math.round(920 * m * 0.023),
      openRate: 41,
      replyRate: Math.round((176 / 910) * 10) / 10,
      bounceRate: 2.6,
      meetingsBooked: Math.max(10, Math.round(52 * m)),
      owner: "Chris Rubin",
    },
  ];
}

export function buildEmailContacts(
  emailPeople: NosDemoPerson[],
  campaigns: EmailCampaignRow[],
  workspaceId: WorkspaceId,
  cap: number,
): EmailContactRow[] {
  return emailPeople.slice(0, cap).map((p, i) => {
    const c = campaigns[i % campaigns.length];
    const statuses: EmailContactRow["status"][] = [
      "In sequence",
      "Replied",
      "Bounced",
      "Paused",
      "Unsubscribed",
      "Opened only",
    ];
    const idx = Math.floor(hash01(workspaceId, `eco-${p.id}`) * 6);
    return {
      id: `${workspaceId}-em-con-${p.id}`,
      name: p.fullName,
      email: p.email,
      company: p.company,
      sequenceName: c.name.split(" · ")[0] ?? c.name,
      campaignId: c.id,
      status: statuses[idx] ?? "In sequence",
      opens: Math.round(1 + hash01(workspaceId, `op-${p.id}`) * 8),
      clicks: Math.round(hash01(workspaceId, `clk-${p.id}`) * 4),
      replies: idx === 1 ? Math.max(1, Math.round(hash01(workspaceId, `rep-${p.id}`) * 3)) : 0,
      lastTouch: `${(i % 54) + 1} hours ago`,
    };
  });
}

export function buildEmailPeriodBundle(
  base: WorkspaceData["email"],
  people: NosDemoPerson[],
  workspaceId: WorkspaceId,
  period: AnalyticsPeriodId,
): EmailPeriodBundle {
  const m = periodMultiplier(period);
  const jitter = hash01(workspaceId, `em-bundle-${period}`);

  const emailPeopleAll = people.filter((p) => p.channel.toLowerCase().includes("email"));
  const contactCap =
    period === "7d"
      ? Math.min(320, Math.max(60, Math.round(emailPeopleAll.length * 0.38 * m)))
      : period === "30d"
        ? Math.min(900, Math.max(220, Math.round(emailPeopleAll.length * 0.92)))
        : period === "3m"
          ? Math.min(emailPeopleAll.length, 980)
          : Math.min(500, Math.max(160, Math.round(emailPeopleAll.length * 0.55 * m)));

  const scaledSequences: EmailSequenceRow[] = base.sequences.map((s) => ({
    ...s,
    contacts: Math.max(24, Math.round(s.contacts * m * (0.94 + jitter * 0.1))),
    openRate: Math.min(58, Math.max(31, Math.round(s.openRate * (0.98 + jitter * 0.03)))),
    replyRate: Math.min(38, Math.max(10, Math.round(s.replyRate * (0.97 + jitter * 0.04)))),
    meetings: Math.max(1, Math.round(s.meetings * m * (0.9 + jitter * 0.1))),
  }));

  let campaignStatuses: EmailCampaignRow["status"][] = scaledSequences.map((s) =>
    s.status === "Active" ? "Running" : s.status === "Completed" ? "Completed" : "Paused",
  ) as EmailCampaignRow["status"][];

  campaignStatuses = campaignStatuses.map((st, idx) =>
    st === "Running" && hash01(workspaceId, `pst-${period}-${idx}`) > 0.88 ? ("Paused" as const) : st,
  );

  const campaignsFromSeq = scaledSequences.map((s, idx) =>
    sequenceToCampaign(s, idx, workspaceId, period, campaignStatuses[idx] ?? "Running"),
  );

  const campaigns = [...campaignsFromSeq, ...buildExtraCampaigns(workspaceId, period)].sort((a, b) =>
    b.replyRate !== a.replyRate ? b.replyRate - a.replyRate : b.sent - a.sent,
  );

  const contacts = buildEmailContacts(emailPeopleAll, campaigns, workspaceId, contactCap);

  const totalSent = campaigns.reduce((a, x) => a + x.sent, 0);
  const totalReplies = campaigns.reduce((a, x) => a + x.replies, 0);
  const totalBounces = campaigns.reduce((a, x) => a + x.bounces, 0);
  const totalOpens = campaigns.reduce((a, x) => a + x.opens, 0);
  const aggOpen = totalSent === 0 ? 0 : Math.round((totalOpens / totalSent) * 1000) / 10;
  const aggReply = totalSent === 0 ? 0 : Math.round((totalReplies / totalSent) * 1000) / 10;
  const aggBounce = totalSent === 0 ? 0 : Math.round((totalBounces / totalSent) * 1000) / 10;
  const deliverability = Math.max(93.8, Math.min(99.1, 99.2 - aggBounce * 1.1 - jitter * 0.35));
  const meetings = campaigns.reduce((a, x) => a + x.meetingsBooked, 0);

  const stats: EmailStat[] = [
    { label: "Emails Sent", value: totalSent.toLocaleString("en-US") },
    { label: "Open Rate", value: `${aggOpen}%` },
    { label: "Reply Rate", value: `${aggReply}%` },
    { label: "Bounce Rate", value: `${aggBounce}%` },
    { label: "Deliverability", value: `${Math.round(deliverability * 10) / 10}%` },
    { label: "Meetings Booked", value: String(meetings) },
    {
      label: "Complaint Rate",
      value: `${(0.024 + jitter * 0.012).toFixed(3)}%`,
    },
  ];

  const weeklyChart = buildWeeklyChartForEmail(base.weeklyChart, period, workspaceId, m);

  return {
    stats,
    weeklyChart,
    sequences: scaledSequences,
    campaigns,
    contacts,
  };
}

/** Build merged `byPeriod` maps for workspace */
export function buildAllEmailPeriods(
  base: WorkspaceData["email"],
  people: NosDemoPerson[],
  workspaceId: WorkspaceId,
): Record<AnalyticsPeriodId, EmailPeriodBundle> {
  return {
    "7d": buildEmailPeriodBundle(base, people, workspaceId, "7d"),
    "30d": buildEmailPeriodBundle(base, people, workspaceId, "30d"),
    "3m": buildEmailPeriodBundle(base, people, workspaceId, "3m"),
    month: buildEmailPeriodBundle(base, people, workspaceId, "month"),
  };
}

export function buildAllLinkedInPeriods(
  base: WorkspaceData["linkedin"],
  people: NosDemoPerson[],
  workspaceId: WorkspaceId,
): Record<AnalyticsPeriodId, LinkedInPeriodBundle> {
  return {
    "7d": buildLinkedInPeriodBundle(base, people, workspaceId, "7d"),
    "30d": buildLinkedInPeriodBundle(base, people, workspaceId, "30d"),
    "3m": buildLinkedInPeriodBundle(base, people, workspaceId, "3m"),
    month: buildLinkedInPeriodBundle(base, people, workspaceId, "month"),
  };
}

/** Overview cross-channel augmentation */
export function augmentOverviewIntelligence(
  overview: WorkspaceData["overview"],
  people: NosDemoPerson[],
  demoPeopleSample: boolean,
): {
  narrativeInsights: NarrativeInsight[];
  crossChannelWeekly: CrossChannelPoint[];
  channelPulse: ChannelPulseMetric[];
} {
  const byChan = people.reduce(
    (acc, p) => {
      const ch = p.channel.toLowerCase();
      let k = "LinkedIn";
      if (ch.includes("email")) k = "Email";
      else if (ch.includes("website") || ch.includes("direct")) k = "Website";
      else if (ch.includes("content")) k = "Content";
      else if (ch.includes("linkedin")) k = "LinkedIn";
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const website = byChan["Website"] ?? 0;
  const linkedin = byChan["LinkedIn"] ?? Math.round((people.length * 0.32) || 140);
  const email = byChan["Email"] ?? Math.round((people.length * 0.28) || 120);
  const content = byChan["Content"] ?? Math.max(42, Math.round(people.length * 0.12));

  const breakdown = overview.channelBreakdown.reduce(
    (m, row) => {
      m[row.channel] = row.volume;
      return m;
    },
    {} as Record<string, number>,
  );

  const totalVol =
    (breakdown["Website"] ?? 0) +
      (breakdown["LinkedIn"] ?? 0) +
      (breakdown["Email"] ?? 0) +
      (breakdown["Content"] ?? 0) || 1;

  const ingestShares: Record<string, number> = {
    Website: website,
    LinkedIn: linkedin,
    Email: email,
    Content: content,
  };

  const channelPulse: ChannelPulseMetric[] = overview.channelBreakdown.map((row) => {
    const ingest = demoPeopleSample
      ? Math.max(
          Math.round(row.volume * 0.065),
          ingestShares[row.channel] ?? Math.round(row.volume * (people.length > 600 ? 0.018 : 0.082)),
        )
      : Math.round(row.volume * 0.12);
      const ql = Math.max(34, Math.round(ingest * (0.32 + hash01(`${row.channel}`, "ql") * 0.18)));
      const share = Math.round((row.volume / totalVol) * 100);
      const takeaways: Record<string, string> = {
        Website:
          share >= 26
            ? "High-intent pages driving firmographic matches — prioritize recap ads + retarget lists."
            : "Surface traffic is healthy — tighten form-depth on pricing and tighten MQL thresholds.",
        LinkedIn:
          "Engagements cluster on exec titles; expand nurture with persona-specific creative this week.",
        Email:
          "Sequences show strong reply deltas on touch 3–4 — expand Instantly pacing for non-responders.",
        Content:
          "Top-of-funnel assets pull mid-funnel back — schedule one BOFU asset remix from last month’s winners.",
      };
    return {
      channel: row.channel,
      signals: row.volume,
      qualifiedLeads: ql,
      takeaway: takeaways[row.channel] ?? "Monitor conversion velocity vs last period.",
    };
  });

  const weeks = 14;
  const crossChannelWeekly: CrossChannelPoint[] = Array.from({ length: weeks }, (_, i) => {
    const t = Math.sin(i / 3) * 0.08 + Math.cos(i / 5) * 0.06;
    return {
      label: `W${i + 1}`,
      website: Math.max(210, Math.round((breakdown["Website"] ?? 920) / 16 * (1 + t + i * 0.01))),
      linkedin: Math.max(180, Math.round((breakdown["LinkedIn"] ?? 780) / 14 * (1 + t + i * 0.015))),
      email: Math.max(155, Math.round((breakdown["Email"] ?? 640) / 13 * (1 + t))),
      content: Math.max(90, Math.round((breakdown["Content"] ?? 507) / 12 * (1 + t * 0.8))),
    };
  });

  const hotPct = people.length === 0 ? 0 : Math.round((people.filter((p) => p.status === "Hot").length / people.length) * 100);

  const touchMixDen = Math.max(1, linkedin + email + Math.max(website, 1));
  const liTouchPct = Math.round((linkedin / touchMixDen) * 100);

  const narrativeInsights: NarrativeInsight[] = [
    {
      id: "mix",
      headline: "Channel blend is asymmetric",
      body: `About ${liTouchPct}% of recent touches originate from LinkedIn-style motions versus other channels — keep Instantly ladders tight on day ${people.length % 9 > 5 ? "3" : "4"} for bridging replies.`,
      channel: "Mixed",
    },
    {
      id: "web",
      headline: "Website is your intent amplifier",
      body: `${website || Math.round(totalVol * 0.06)} surfaced accounts show repeat pricing or solution pages — push those cohorts immediately into outbound + Instantly warmup lanes.`,
      channel: "Website",
    },
    {
      id: "li",
      headline: "LinkedIn motion shows title concentration",
      body: "Executive-level responders cluster in SaaS buyer titles; clone the top-performing snippet into two micro-campaign splits for speed tests.",
      channel: "LinkedIn",
    },
    {
      id: "mail",
      headline: "Email reply curve has a predictable cliff",
      body: "Touches 4–7 carry most replies; refresh subject lines before pausing stalled contacts entirely — mirrors typical Instantly pacing wins.",
      channel: "Email",
    },
    {
      id: "hot",
      headline: `${hotPct}% of visible pipeline is “Hot”`,
      body: "Route hottest accounts across human review + tighter sync to CRM segments so sales sees one unified prioritization ladder.",
      channel: "Mixed",
    },
    {
      id: "content",
      headline: "Content retarget pulls mid-funnel",
      body: "Newsletter + LinkedIn hybrids outperform single-channel bursts by ~18% inferred lift on repeat sessions — recycle top posts into snippets.",
      channel: "Content",
    },
    {
      id: "risk",
      headline: "Data hygiene protects deliverability",
      body: `Keep bounce aggregates under institutional norms — current blended motion suggests watch mailboxes rotated every ${people.length > 400 ? "48" : "72"}h.`,
      channel: "Email",
    },
    {
      id: "next",
      headline: "Unified next-best-action",
      body: "For each inbound signal, enqueue: website → LinkedIn polite touch → Instantly drip + manual bridge on reply — minimizes channel collision.",
      channel: "Mixed",
    },
  ];

  return {
    narrativeInsights,
    crossChannelWeekly,
    channelPulse,
  };
}