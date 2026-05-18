import type {
  BrandIntelligenceData,
  CompetitivePositioningData,
  IntelligenceAction,
  IntelligenceKpi,
  MeasurementFrameworkData,
  NarrativeIntelligenceData,
  NosDemoPerson,
  SearchIntelligenceData,
  StorylineVariant,
  WorkspaceId,
  WorkspaceIntelligence,
} from "@/types/nos";

function hash01(workspaceId: string, seed: string): number {
  let h = 0;
  const s = `${workspaceId}:${seed}`;
  for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(Math.sin(h)) % 1;
}

function scale(workspaceId: WorkspaceId, seed: string, min: number, max: number): number {
  return min + hash01(workspaceId, seed) * (max - min);
}

function pct(n: number, digits = 1): string {
  const r = Math.round(n * 10 ** digits) / 10 ** digits;
  return Number.isInteger(r) ? `${r}%` : `${r.toFixed(digits)}%`;
}

function action(
  title: string,
  body: string,
  priority: IntelligenceAction["priority"],
  confidence: number,
): IntelligenceAction {
  return { title, body, priority, confidence };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function buildSearchIntelligence(workspaceId: WorkspaceId, peopleCount: number): SearchIntelligenceData {
  const volBase = Math.max(120, Math.round(peopleCount * 2.4 + scale(workspaceId, "sq-vol", 80, 220)));
  const sov = scale(workspaceId, "sov", 18, 42);
  const aeo = scale(workspaceId, "aeo", 52, 78);

  const clusters = [
    { cluster: "Category + pricing intent", intent: "commercial" as const },
    { cluster: "Problem-aware thought leadership", intent: "informational" as const },
    { cluster: "Competitor comparison", intent: "commercial" as const },
    { cluster: "Implementation / integration", intent: "informational" as const },
    { cluster: "Brand navigational", intent: "navigational" as const },
    { cluster: "AI answer surfaces (GEO)", intent: "informational" as const },
  ].map((c, i) => ({
    ...c,
    volume: Math.round(volBase * (0.12 + hash01(workspaceId, `cl-${i}`) * 0.18)),
    shareOfVoice: Math.round(sov * (0.7 + hash01(workspaceId, `cl-sov-${i}`) * 0.6)),
    trendPct: Math.round((hash01(workspaceId, `cl-tr-${i}`) - 0.35) * 24),
    aeoCoverage: Math.round(aeo * (0.85 + hash01(workspaceId, `cl-aeo-${i}`) * 0.3)),
  }));

  const sovTrend = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"].map((period, i) => ({
    period,
    owned: Math.round(sov + i * 1.2 + hash01(workspaceId, `sov-${i}`) * 4),
    categoryAvg: Math.round(sov * 0.72 + i * 0.4),
  }));

  return {
    kpis: [
      {
        label: "Share of voice",
        value: pct(sov),
        change: Math.round(scale(workspaceId, "sov-ch", 4, 14)),
        context: "Blended SERP + AI citation surfaces vs category set",
      },
      {
        label: "GEO visibility index",
        value: pct(aeo),
        change: Math.round(scale(workspaceId, "geo-ch", 6, 18)),
        context: "Regional generative answer inclusion rate (modeled)",
      },
      {
        label: "AEO answer coverage",
        value: pct(aeo * 0.92),
        change: Math.round(scale(workspaceId, "aeo-ch", 3, 12)),
        context: "Structured answers citing brand-owned proof points",
      },
      {
        label: "High-intent cluster volume",
        value: volBase.toLocaleString("en-US"),
        change: Math.round(scale(workspaceId, "hi-ch", -2, 16)),
        context: "Commercial + comparison query demand (30d)",
      },
    ],
    queryClusters: clusters,
    sovTrend,
    aeoCoverage: [
      { engine: "Google AI Overviews", answerShare: Math.round(aeo * 1.05), citationGap: Math.round(12 + scale(workspaceId, "g-gap", 0, 18)) },
      { engine: "Perplexity", answerShare: Math.round(aeo * 0.88), citationGap: Math.round(18 + scale(workspaceId, "p-gap", 0, 22)) },
      { engine: "ChatGPT browse", answerShare: Math.round(aeo * 0.76), citationGap: Math.round(22 + scale(workspaceId, "c-gap", 0, 28)) },
      { engine: "Bing Copilot", answerShare: Math.round(aeo * 0.64), citationGap: Math.round(15 + scale(workspaceId, "b-gap", 0, 20)) },
    ],
    geoRegions: [
      { region: "North America", visibility: Math.round(aeo * 1.08), delta: Math.round(scale(workspaceId, "na", 2, 9)) },
      { region: "EMEA", visibility: Math.round(aeo * 0.94), delta: Math.round(scale(workspaceId, "emea", -1, 7)) },
      { region: "APAC", visibility: Math.round(aeo * 0.81), delta: Math.round(scale(workspaceId, "apac", 1, 11)) },
    ],
    recommendations: [
      action(
        "Close AEO citation gaps on comparison clusters",
        "Competitor comparison queries show 22–28% citation gap in AI surfaces — publish proof-led comparison pages and FAQ schema.",
        "high",
        86,
      ),
      action(
        "Shift GEO budget to rising regional demand",
        "APAC visibility delta outpaces EMEA; localize storyline variants before scaling paid.",
        "medium",
        74,
      ),
      action(
        "Defend navigational SERP with brand entity markup",
        "Navigational cluster SOV slipped 3pts — reinforce Organization schema and owned-domain sitelinks.",
        "medium",
        71,
      ),
    ],
    methodNote:
      "Modeled from query-cluster demand, SERP share proxies, and generative answer inclusion scoring (Searchable / Profound-style workflow). Swap to live connectors when briefed.",
  };
}

export function buildBrandIntelligence(workspaceId: WorkspaceId): BrandIntelligenceData {
  const selfShare = scale(workspaceId, "self-sh", 22, 38);
  const competitors = [
    { brand: "You", isSelf: true },
    { brand: "Competitor A" },
    { brand: "Competitor B" },
    { brand: "Competitor C" },
    { brand: "Competitor D" },
  ].map((c, i) => ({
    brand: c.brand,
    shareOfMention: c.isSelf ? Math.round(selfShare) : Math.round(scale(workspaceId, `cmp-${i}`, 8, 28)),
    deltaPct: Math.round((hash01(workspaceId, `cmp-d-${i}`) - 0.45) * 16),
    sentimentScore: Math.round(scale(workspaceId, `cmp-s-${i}`, 42, 88)),
    isSelf: c.isSelf,
  }));

  const sentimentTrend = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"].map((period, i) => {
    const pos = 48 + i * 1.5 + hash01(workspaceId, `pos-${i}`) * 12;
    const neg = 12 - i * 0.3 + hash01(workspaceId, `neg-${i}`) * 6;
    return {
      period,
      positive: Math.round(pos),
      neutral: Math.round(100 - pos - neg),
      negative: Math.round(neg),
    };
  });

  return {
    kpis: [
      {
        label: "Net sentiment",
        value: `+${Math.round(scale(workspaceId, "net-s", 18, 42))}`,
        change: Math.round(scale(workspaceId, "net-ch", 3, 11)),
        context: "Weighted mention polarity across earned + social",
      },
      {
        label: "Share of mention",
        value: pct(selfShare),
        change: Math.round(scale(workspaceId, "som-ch", -2, 9)),
        context: "Category conversation share vs tracked set",
      },
      {
        label: "Brand health index",
        value: `${Math.round(scale(workspaceId, "bhi", 62, 84))}`,
        change: Math.round(scale(workspaceId, "bhi-ch", 2, 8)),
        context: "Composite of sentiment, consistency, and share momentum",
      },
      {
        label: "Risk signals",
        value: `${Math.round(scale(workspaceId, "risk", 2, 9))}`,
        change: Math.round(scale(workspaceId, "risk-ch", -4, 2)),
        context: "Emerging negative theme velocity (7d)",
      },
    ],
    sentimentTrend,
    competitorMentions: competitors,
    themes: [
      { theme: "Product innovation", volume: 420, sentiment: 78, momentum: 12 },
      { theme: "Pricing & ROI", volume: 310, sentiment: 54, momentum: -4 },
      { theme: "Customer proof", volume: 280, sentiment: 82, momentum: 18 },
      { theme: "Support experience", volume: 190, sentiment: 61, momentum: 3 },
      { theme: "Category leadership", volume: 240, sentiment: 71, momentum: 9 },
    ].map((t, i) => ({
      ...t,
      volume: Math.round(t.volume * (0.8 + hash01(workspaceId, `th-v-${i}`) * 0.5)),
      sentiment: Math.round(t.sentiment + (hash01(workspaceId, `th-s-${i}`) - 0.5) * 20),
      momentum: Math.round(t.momentum + (hash01(workspaceId, `th-m-${i}`) - 0.5) * 10),
    })),
    revenueProxy: [
      { label: "Modeled pipeline influenced", value: `$${Math.round(scale(workspaceId, "pi", 1.2, 3.8))}M`, note: "Attribution window: 90d blended touch" },
      { label: "Content efficiency index", value: pct(scale(workspaceId, "cei", 68, 88)), note: "Reach per storyline variant" },
    ],
    recommendations: [
      action(
        "Counter negative pricing narrative with proof assets",
        "Pricing & ROI theme sentiment trails category by 14pts — deploy customer ROI calculator and third-party benchmarks.",
        "high",
        83,
      ),
      action(
        "Amplify innovation storyline where share is rising",
        "Product innovation momentum +12 — align LinkedIn thought leadership with GEO comparison pages.",
        "medium",
        77,
      ),
      action(
        "Monitor Competitor B share surge",
        "Competitor B mention share up — trigger competitive battlecard refresh and sales enablement.",
        "high",
        81,
      ),
    ],
    methodNote:
      "Brand layer modeled on mention share, sentiment decomposition, and theme velocity (BlueOcean.ai-style performance framing).",
  };
}

export function buildMeasurementFramework(workspaceId: WorkspaceId): MeasurementFrameworkData {
  const attrs = [
    { id: "familiarity" as const, label: "Familiarity" },
    { id: "uniqueness" as const, label: "Uniqueness" },
    { id: "consistency" as const, label: "Consistency" },
    { id: "relevance" as const, label: "Relevance" },
    { id: "reverence" as const, label: "Reverence" },
  ].map((a) => ({
    ...a,
    score: Math.round(scale(workspaceId, a.id, 58, 88)),
    benchmark: Math.round(scale(workspaceId, `${a.id}-bm`, 52, 72)),
    trendPct: Math.round((hash01(workspaceId, `${a.id}-tr`) - 0.4) * 14),
    methodNote:
      a.id === "familiarity"
        ? "Unaided + aided recall proxies from search demand and direct traffic."
        : a.id === "uniqueness"
          ? "Differentiation language share vs category corpus."
          : a.id === "consistency"
            ? "Cross-channel message alignment score (NLP similarity)."
            : a.id === "relevance"
              ? "ICP fit of inbound narratives vs firmographic match."
              : "Trust signals: reviews, executive visibility, advocacy depth.",
  }));

  const composite = Math.round(attrs.reduce((s, a) => s + a.score, 0) / attrs.length);

  const trendSeries = MONTHS.slice(0, 8).map((month, i) => ({
    month,
    familiarity: attrs[0].score - 8 + i * 1.2,
    uniqueness: attrs[1].score - 6 + i * 0.9,
    consistency: attrs[2].score - 5 + i * 1.1,
    relevance: attrs[3].score - 7 + i * 1.0,
    reverence: attrs[4].score - 6 + i * 0.8,
  }));

  return {
    compositeIndex: composite,
    compositeTrendPct: Math.round(scale(workspaceId, "comp-tr", 3, 12)),
    attributes: attrs,
    trendSeries,
    recommendations: [
      action(
        "Prioritize consistency lift before scale spend",
        "Consistency trails uniqueness by 11pts — audit storyline deployment across email vs website before paid amplification.",
        "high",
        84,
      ),
      action(
        "Invest in reverence drivers",
        "Reverence scores highest upside — executive POV + customer proof in category journals.",
        "medium",
        72,
      ),
    ],
    methodNote:
      "FURCR framework: traditionally soft brand attributes scored via blended signal proxies (search, social, content, pipeline).",
  };
}

export function buildCompetitivePositioning(workspaceId: WorkspaceId): CompetitivePositioningData {
  const names = ["You", "Competitor A", "Competitor B", "Competitor C", "Competitor D"];
  const periods = ["Q1", "Q2", "Q3", "Q4"];

  const snapshots = periods.map((period, pi) => ({
    period,
    competitors: names.map((name, i) => {
      const isSelf = i === 0;
      const drift = pi * 3 + hash01(workspaceId, `${period}-${name}`) * 8;
      return {
        id: `c-${i}`,
        name,
        x: Math.round((isSelf ? 62 : 35 + i * 9) + drift * (isSelf ? 0.4 : 0.2)),
        y: Math.round((isSelf ? 58 : 40 + i * 7) + drift * 0.35),
        isSelf,
      };
    }),
  }));

  return {
    axisXLabel: "Differentiation strength",
    axisYLabel: "Category salience",
    quadrantLabels: {
      q1: "Leaders",
      q2: "Challengers",
      q3: "Niche",
      q4: "Emerging",
    },
    snapshots,
    rankHistory: periods.map((period, i) => ({
      period,
      rank: Math.max(1, 3 - (workspaceId === "alpha" ? 1 : 0) + (i % 2)),
      total: 5,
    })),
    movementHighlights: [
      { competitor: "Competitor B", delta: "+6.2 pts", direction: "up" as const },
      { competitor: "You", delta: "+3.8 pts", direction: "up" as const },
      { competitor: "Competitor C", delta: "-2.1 pts", direction: "down" as const },
    ],
    recommendations: [
      action(
        "Defend leader quadrant against Challenger B",
        "Competitor B crossing into Leaders — reinforce differentiation on integration depth narrative.",
        "high",
        85,
      ),
      action(
        "Exploit salience gap in Q4",
        "Salience index flat while differentiation rose — increase category POV cadence on LinkedIn.",
        "medium",
        73,
      ),
    ],
    methodNote: "Dynamic quadrant positions from blended awareness proxies and message differentiation scoring over time.",
  };
}

export function buildNarrativeIntelligence(workspaceId: WorkspaceId): NarrativeIntelligenceData {
  const variants = [
    {
      id: "v1",
      name: "Efficiency & ROI",
      summary: "Operational outcomes and payback period for mid-market buyers.",
      channels: ["Website", "Email"] as const,
    },
    {
      id: "v2",
      name: "Category POV",
      summary: "Thought leadership framing the future of the category.",
      channels: ["LinkedIn", "Content"] as const,
    },
    {
      id: "v3",
      name: "Proof-led transformation",
      summary: "Customer stories tied to measurable pipeline impact.",
      channels: ["Website", "LinkedIn", "Email", "Content"] as const,
    },
  ].map((v, i) => ({
    ...v,
    channels: [...v.channels] as StorylineVariant["channels"],
    deploymentPct: Math.round(scale(workspaceId, `dep-${i}`, 18, 42)),
    cacDeltaPct: Math.round((hash01(workspaceId, `cac-${i}`) - 0.55) * -18),
    velocityDeltaDays: Math.round((hash01(workspaceId, `vel-${i}`) - 0.3) * -12),
    conversionLiftPct: Math.round(scale(workspaceId, `conv-${i}`, 4, 22)),
  }));

  const channelDeploymentsBase = [
    { channel: "Website" as const, variantId: "v3", variantName: "Proof-led transformation", touchpoints: 1240, pipelineShare: 34 },
    { channel: "LinkedIn" as const, variantId: "v2", variantName: "Category POV", touchpoints: 890, pipelineShare: 28 },
    { channel: "Email" as const, variantId: "v1", variantName: "Efficiency & ROI", touchpoints: 2100, pipelineShare: 22 },
    { channel: "Content" as const, variantId: "v2", variantName: "Category POV", touchpoints: 560, pipelineShare: 16 },
  ];
  const channelDeployments = channelDeploymentsBase.map((row, i) => ({
    ...row,
    touchpoints: Math.round(row.touchpoints * (0.85 + hash01(workspaceId, `nd-${i}`) * 0.35)),
    pipelineShare: Math.round(row.pipelineShare * (0.9 + hash01(workspaceId, `np-${i}`) * 0.2)),
  }));

  return {
    coreStoryline:
      workspaceId === "alpha"
        ? "Narrative OS turns fragmented GTM signals into a single operating storyline — measurable from first touch to revenue."
        : workspaceId === "beta"
          ? "Professional services buyers need proof of expertise before speed — storyline emphasizes outcomes and trust."
          : "Commerce brands win on relevance and repeat engagement — storyline ties content velocity to conversion efficiency.",
    variants,
    channelDeployments,
    pipelineImpact: [
      {
        metric: "CAC (blended)",
        baseline: "$412",
        optimized: "$348",
        liftPct: -15.5,
        attributionNote: "Storyline v3 on website + email",
      },
      {
        metric: "Deal velocity",
        baseline: "47 days",
        optimized: "39 days",
        liftPct: -17,
        attributionNote: "Proof-led variant across mid-funnel",
      },
      {
        metric: "SQL conversion",
        baseline: "3.8%",
        optimized: "4.6%",
        liftPct: 21,
        attributionNote: "Category POV + retargeting alignment",
      },
    ],
    recommendations: [
      action(
        "Scale proof-led variant on website",
        "v3 shows strongest CAC delta — increase hero placement and retargeting creative match.",
        "high",
        87,
      ),
      action(
        "Rebalance email toward efficiency narrative for bottom funnel",
        "Efficiency & ROI variant under-deployed on email vs website — align sequences to stage.",
        "medium",
        76,
      ),
    ],
    methodNote:
      "Storyline variants mapped to channel deployments with modeled pipeline attribution (CAC, velocity, conversion). Assumptions labeled for stakeholder review.",
  };
}

export function buildWorkspaceIntelligence(
  workspaceId: WorkspaceId,
  people: NosDemoPerson[] = [],
): WorkspaceIntelligence {
  const peopleCount = people.length;
  return {
    search: buildSearchIntelligence(workspaceId, peopleCount),
    brand: buildBrandIntelligence(workspaceId),
    measurement: buildMeasurementFramework(workspaceId),
    competitive: buildCompetitivePositioning(workspaceId),
    narrative: buildNarrativeIntelligence(workspaceId),
  };
}
