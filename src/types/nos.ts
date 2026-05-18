export type WorkspaceId = "alpha" | "beta" | "gamma";

export type AnalyticsPeriodId = "7d" | "30d" | "3m" | "month";

export type SectionId =
  | "overview"
  | "search-intelligence"
  | "brand-intelligence"
  | "measurement-framework"
  | "competitive-positioning"
  | "narrative-intelligence"
  | "website-signals"
  | "linkedin"
  | "email-outreach"
  | "content"
  | "settings";

/** v1.1 — shared insight action block */
export interface IntelligenceAction {
  title: string;
  body: string;
  priority: "high" | "medium" | "low";
  confidence: number;
}

export interface IntelligenceKpi {
  label: string;
  value: string;
  change: number;
  context: string;
}

/** SEO / GEO / AEO */
export interface SearchQueryCluster {
  cluster: string;
  volume: number;
  shareOfVoice: number;
  trendPct: number;
  aeoCoverage: number;
  intent: "informational" | "commercial" | "navigational";
}

export interface SearchSovPoint {
  period: string;
  owned: number;
  categoryAvg: number;
}

export interface AeoEngineCoverage {
  engine: string;
  answerShare: number;
  citationGap: number;
}

export interface SearchIntelligenceData {
  kpis: IntelligenceKpi[];
  queryClusters: SearchQueryCluster[];
  sovTrend: SearchSovPoint[];
  aeoCoverage: AeoEngineCoverage[];
  geoRegions: { region: string; visibility: number; delta: number }[];
  recommendations: IntelligenceAction[];
  methodNote: string;
}

/** Brand intelligence */
export interface BrandSentimentPoint {
  period: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface CompetitorMentionRow {
  brand: string;
  shareOfMention: number;
  deltaPct: number;
  sentimentScore: number;
  isSelf?: boolean;
}

export interface BrandThemeRow {
  theme: string;
  volume: number;
  sentiment: number;
  momentum: number;
}

export interface BrandIntelligenceData {
  kpis: IntelligenceKpi[];
  sentimentTrend: BrandSentimentPoint[];
  competitorMentions: CompetitorMentionRow[];
  themes: BrandThemeRow[];
  revenueProxy: { label: string; value: string; note: string }[];
  recommendations: IntelligenceAction[];
  methodNote: string;
}

/** Measurement framework (FURCR) */
export type BrandAttributeId =
  | "familiarity"
  | "uniqueness"
  | "consistency"
  | "relevance"
  | "reverence";

export interface BrandAttributeScore {
  id: BrandAttributeId;
  label: string;
  score: number;
  benchmark: number;
  trendPct: number;
  methodNote: string;
}

export interface MeasurementTrendPoint {
  month: string;
  familiarity: number;
  uniqueness: number;
  consistency: number;
  relevance: number;
  reverence: number;
}

export interface MeasurementFrameworkData {
  compositeIndex: number;
  compositeTrendPct: number;
  attributes: BrandAttributeScore[];
  trendSeries: MeasurementTrendPoint[];
  recommendations: IntelligenceAction[];
  methodNote: string;
}

/** Competitive positioning */
export interface CompetitorPosition {
  id: string;
  name: string;
  x: number;
  y: number;
  isSelf?: boolean;
}

export interface PositioningSnapshot {
  period: string;
  competitors: CompetitorPosition[];
}

export interface CompetitivePositioningData {
  axisXLabel: string;
  axisYLabel: string;
  quadrantLabels: { q1: string; q2: string; q3: string; q4: string };
  snapshots: PositioningSnapshot[];
  rankHistory: { period: string; rank: number; total: number }[];
  movementHighlights: { competitor: string; delta: string; direction: "up" | "down" | "flat" }[];
  recommendations: IntelligenceAction[];
  methodNote: string;
}

/** Narrative intelligence */
export interface StorylineVariant {
  id: string;
  name: string;
  summary: string;
  channels: ("Website" | "LinkedIn" | "Email" | "Content")[];
  deploymentPct: number;
  cacDeltaPct: number;
  velocityDeltaDays: number;
  conversionLiftPct: number;
}

export interface NarrativeChannelDeployment {
  channel: "Website" | "LinkedIn" | "Email" | "Content";
  variantId: string;
  variantName: string;
  touchpoints: number;
  pipelineShare: number;
}

export interface PipelineImpactRow {
  metric: string;
  baseline: string;
  optimized: string;
  liftPct: number;
  attributionNote: string;
}

export interface NarrativeIntelligenceData {
  coreStoryline: string;
  variants: StorylineVariant[];
  channelDeployments: NarrativeChannelDeployment[];
  pipelineImpact: PipelineImpactRow[];
  recommendations: IntelligenceAction[];
  methodNote: string;
}

export interface WorkspaceIntelligence {
  search: SearchIntelligenceData;
  brand: BrandIntelligenceData;
  measurement: MeasurementFrameworkData;
  competitive: CompetitivePositioningData;
  narrative: NarrativeIntelligenceData;
}

export interface KpiStat {
  label: string;
  value: string;
  change: number;
  iconColor: "purple" | "teal" | "blue" | "green";
}

export interface ChartPoint {
  month: string;
  signals: number;
  leads: number;
}

export interface ChannelBar {
  channel: string;
  volume: number;
}

export interface SignalFeedRow {
  company: string;
  channel: "Website" | "LinkedIn" | "Email" | "Content";
  signalType: string;
  score: number;
  time: string;
}

export interface FunnelStep {
  label: string;
  value: number;
  percent: number;
}

export interface NarrativeInsight {
  id: string;
  headline: string;
  body: string;
  channel: "Website" | "LinkedIn" | "Email" | "Content" | "Mixed";
}

export interface CrossChannelPoint {
  label: string;
  website: number;
  linkedin: number;
  email: number;
  content: number;
}

export interface ChannelPulseMetric {
  channel: string;
  signals: number;
  qualifiedLeads: number;
  takeaway: string;
}

export interface WebsiteStat {
  label: string;
  value: string;
}

export interface WebsiteRow {
  company: string;
  industry: string;
  pagesVisited: string;
  timeOnSite: string;
  score: number;
  status: "Hot" | "Warm" | "Cold";
}

export interface LinkedInStat {
  label: string;
  value: string;
}

export interface LinkedInEngagementPoint {
  week: string;
  engagement: number;
}

export interface LinkedInFeedRow {
  name: string;
  title: string;
  engagementType: string;
  score: number;
  time: string;
  avatarColor: string;
}

export interface EmailStat {
  label: string;
  value: string;
}

export interface EmailWeekBar {
  week: string;
  sent: number;
  replies: number;
}

export interface EmailSequenceRow {
  name: string;
  status: "Active" | "Paused" | "Completed";
  contacts: number;
  openRate: number;
  replyRate: number;
  meetings: number;
}

export interface EmailCampaignRow {
  id: string;
  name: string;
  status: "Running" | "Paused" | "Completed";
  contacts: number;
  sent: number;
  opens: number;
  clicks: number;
  replies: number;
  bounces: number;
  unsubscribes: number;
  openRate: number;
  replyRate: number;
  bounceRate: number;
  meetingsBooked: number;
  owner: string;
}

export interface EmailContactRow {
  id: string;
  name: string;
  email: string;
  company: string;
  sequenceName: string;
  campaignId: string;
  status:
    | "In sequence"
    | "Replied"
    | "Bounced"
    | "Paused"
    | "Unsubscribed"
    | "Opened only";
  opens: number;
  clicks: number;
  replies: number;
  lastTouch: string;
}

export interface EmailPeriodBundle {
  stats: EmailStat[];
  weeklyChart: EmailWeekBar[];
  sequences: EmailSequenceRow[];
  campaigns: EmailCampaignRow[];
  contacts: EmailContactRow[];
}

export interface LinkedInPeriodBundle {
  stats: LinkedInStat[];
  feed: LinkedInFeedRow[];
  engagementChart: LinkedInEngagementPoint[];
}

export interface ContentStat {
  label: string;
  value: string;
}

export interface CalendarDay {
  day: number;
  posts: number;
}

export interface ContentRow {
  piece: string;
  channel: string;
  status: "Published" | "Scheduled" | "Draft";
  reach: string;
  engagement: string;
}

/** Third-party tools feeding each channel for demo storytelling */
export interface StackItem {
  id: string;
  name: string;
  role: string;
}

export interface WorkspaceIntegrations {
  website: StackItem[];
  linkedin: StackItem[];
  email: StackItem[];
  content: StackItem[];
}

/** Rows in `nos_demo_data.json` — bulk demo people / companies */
export interface NosDemoCompany {
  name: string;
  industry: string;
  domain: string;
}

export interface NosDemoPerson {
  id: number;
  workspaceId: WorkspaceId;
  firstName: string;
  lastName: string;
  fullName: string;
  title: string;
  company: string;
  companyIndustry: string;
  location: string;
  email: string;
  linkedinUrl: string;
  status: "Hot" | "Warm" | "Cold";
  score: number;
  channel: string;
}

export interface NosDemoDatabase {
  companies: NosDemoCompany[];
  people: NosDemoPerson[];
}

export interface WorkspaceData {
  id: WorkspaceId;
  name: string;
  subtitle: string;
  avatarColor: string;
  initials: string;
  overview: {
    kpis: KpiStat[];
    signalChart: ChartPoint[];
    channelBreakdown: ChannelBar[];
    signalFeed: SignalFeedRow[];
    funnel: FunnelStep[];
    signalGrowth: string;
    narrativeInsights?: NarrativeInsight[];
    crossChannelWeekly?: CrossChannelPoint[];
    channelPulse?: ChannelPulseMetric[];
  };
  website: {
    stats: WebsiteStat[];
    rows: WebsiteRow[];
  };
  linkedin: {
    stats: LinkedInStat[];
    engagementChart: LinkedInEngagementPoint[];
    feed: LinkedInFeedRow[];
    /** Date-range slices (instantly Apollo-style UX) — defaults align with feed when unset */
    byPeriod?: Record<AnalyticsPeriodId, LinkedInPeriodBundle>;
  };
  email: {
    stats: EmailStat[];
    weeklyChart: EmailWeekBar[];
    sequences: EmailSequenceRow[];
    /** Default slice (e.g. 30d) when demo periods are merged */
    campaigns?: EmailCampaignRow[];
    contacts?: EmailContactRow[];
    byPeriod?: Record<AnalyticsPeriodId, EmailPeriodBundle>;
  };
  content: {
    stats: ContentStat[];
    calendar: CalendarDay[];
    rows: ContentRow[];
  };
  integrations: WorkspaceIntegrations;
  /** v1.1 intelligence layers — synthesized per workspace (set in demoWorkspace merge) */
  intelligence?: WorkspaceIntelligence;
  /** Present when `nos_demo_data.json` is merged into this workspace */
  demoPeople?: NosDemoPerson[];
}
