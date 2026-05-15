/** Tooltip copy for KPI-style metrics (keyed by card label where shown). */

export const METRIC_DESCRIPTIONS: Record<string, string> = {
  // Website Signals — primary stats
  "Visitors Identified":
    "Count of person-level identities resolved from anonymous traffic via the connected enrichment stack.",
  "Companies Detected":
    "Distinct accounts inferred from IP, firmographics, or matched contacts visiting your properties.",
  "Avg Time on Site":
    "Blended dwell time across visible sessions — a coarse engagement proxy before CRM tie-in.",
  "Return Visitors":
    "Share of identifiable visitors flagged as returning in this demo cohort (warming profile density).",

  // Website Signals — dashboard tiles / mini cards (overview)
  "Visitor traffic":
    "Person-level profiles currently visible after filters — browse volume in this lens, not lifetime unique reach.",
  "Company pulse":
    "Company-level rollup after filters — hot vs warm counts show where urgency clusters versus nurture.",
  "Average signal":
    "Mean modeled intent score for companies in view — compare cohorts, not a Salesforce lead grade.",
  "Session depth":
    "Average pages viewed per person in the filtered set — depth hints at real research motions.",
  "Tracked people":
    "Modeled person records surfaced in Website Signals respecting the HOT/WARM/COLD filter.",
  "Tracked companies":
    "Distinct company visitor rows after filters — pair with enrichment for outbound targeting.",
  "High-intent (Hot)":
    "Companies labeled Hot in the demo scorer — tighten sequences and personalization here first.",

  // Overview KPIs
  "Signals Captured":
    "All inbound cues ingested across website, LinkedIn, email touches, and content surfaces for the period.",
  "Leads Identified":
    "People or accounts that crossed a demo qualification threshold from those signals.",
  "Outreach Sent":
    "Outbound touches attempted (sequences, invitations, replies) attributable to outreach tooling.",
  "Meetings Booked":
    "Pipeline meetings tied to attributable signals — demo rollup, not CRM truth.",

  // Content stats
  "Posts Published": "Pieces scheduled or published across the content calendar slice shown.",
  "Total Reach":
    "Estimated impressions or audience exposure for published or scheduled assets (demo heuristic).",
  "Earned Media Value": "Rough PR-style value rollup for comparative reporting in the demo narrative.",
  "Avg Engagement Rate": "Engagement divided by reach for surfaced content — benchmarking only.",

  // LinkedIn native telemetry (byPeriod stats)
  Impressions:
    "Native LinkedIn surface impressions aggregated for the selected time window (organic + some paid proxies).",
  "Profile Views": "How often your profile surfaced to members in the cohort — inbound curiosity signal.",
  "Post Engagements": "Comments, reshares, and reactions summed for posts attributed to this workspace.",
  "New Followers": "Net follower change over the slice — directional reach growth.",

  // LinkedIn overview tiles
  "Next actions":
    "Demo queue length of unresolved follow-ups your team still owes on LinkedIn motions for this range.",
  "Hot Opportunities":
    "Accounts or threads scored as high intent in-model — prioritize research and personalization.",
  "Leads Engaged": "Outbound invitations or connection motions launched during the window.",
  Conversations:
    "Direct messages or thread replies sent beyond the invitation — conversational throughput.",

  // LinkedIn — campaign drill-in
  "Invitations Sent": "Outbound LinkedIn invitations issued from the selected sequence or campaign slice.",
  "Invitations Accepted": "Accepted invites attributable to sends in this cohort (timing skew possible).",
  "Acceptance Rate": "Accepted divided by invitations where both are modeled in the demo dataset.",

  // Email — overview / telemetry row
  "Emails Sent": "Total sends attempted across pooled mailboxes in the modeled Instantly ladder.",
  "Open Rate":
    "Unique opens ÷ sends for attributed tracking pixels across the pooled mailboxes in this slice.",
  "Reply Rate":
    "Replies versus sends wherever modeled (campaign or LinkedIn drill-in) — directional health signal in sandbox data, not webhook truth.",
  "Bounce Rate": "Permanent or hard bounces ÷ sends — watch deliverability corridors when this climbs.",
  Deliverability:
    "Modeled inbox placement score inverted from bounce/complaints — illustrative trend only.",
  "Complaint Rate": "Spam complaints ÷ sends — keep under ESP guardrails before scaling ladders.",
};

export const CHART_CARD_DESCRIPTIONS: Record<string, string> = {
  "Visitor Trend": "Weekly visitor counts derived from modeled traffic — pacing view, not raw analytics warehouse.",
  "Intent Wave":
    "Stacked modeled hot vs warm visitors through the sequence — contrasts urgency vs nurture backlog.",
  "Activity Overview":
    "Synthetic blend of modeled leads produced, outbound invites, and conversational sends for pacing.",
  "Engagement trend": "Historical weekly engagement rollup from modeled LinkedIn native metrics.",
  "Send volume vs replies": "Weekly sent volume vs modeled replies across campaigns in the cohort.",
  "Sequence health snapshot": "Rolling weekly totals used for reply pacing vs send cadence QA.",
  "Signal throughput":
    "Time series of modeled signal volume — shows cadence spikes when inbound motion accelerates.",
  "Channel breakdown": "Share of modeled volume by acquisition channel — where demand concentrates.",
  "Cross-channel ingestion":
    "Weekly modeled signal volume stacked by motion — contrasts how inbound pulls vs outbound pushes contribute.",
  "Channel pulse grid": "Tiles per channel tying raw ingest to qualified counts with narrative takeaway lines.",
  "Qualification & raw scale":
    "Qualified rate by channel paired with normalized ingest so big channels do not bury efficient ones.",
  "Synthetic momentum":
    "Modeled pacing bars for gross channel throughput — illustrative spark trend, not an event warehouse.",
  "Operational narratives":
    "Short executive reads generated from augmented demo intelligence across channel mix.",
  "Active signal feed":
    "Sampled newest high-interest rows prioritized for reviewers — excludes low-signal boilerplate noise.",
  "Funnel progression":
    "Modeled funnel widths from signals through meetings — use for pacing discussion, not revenue recognition.",
  "LinkedIn Content Calendar":
    "Publishing grid for this workspace — click dates to compose synthetic LinkedIn posts tracked in the sandbox.",
  "Content Performance":
    "Table of assets with reach and engagement — blends published rows plus drafts injected from your calendar.",
  "Active sequences":
    "All modeled nurture ladders with cohort contact counts and headline rates — reconcile with mailbox pools.",
  "Campaign cockpit":
    "High-level outbound desk for multi-mailbox ladders — slice by lifecycle state before editing copy.",
};

const PULSE_CHANNEL: Record<string, string> = {
  Website:
    "Compares modeled website ingest volume vs qualified visitors for demo scoring — reconcile with outbound.",
  LinkedIn:
    "Compares modeled LinkedIn pull-through vs qualified personas — informs sequence creative refresh.",
  Email:
    "Compares modeled email touches vs replies or meetings signaled — ladders may need pacing edits.",
  Content:
    "Compares modeled content-driven touches vs attributable qualified interest — validates asset mix.",
};

export function pulseGridCardHint(channel: string): string {
  return PULSE_CHANNEL[channel] ?? "Raw modeled ingest vs qualified rollup for this channel in the cohort.";
}

const EMAIL_CAMPAIGN_INSIGHT: Record<string, string> = {
  "Campaign contacts": "People enrolled in modeled sends for this campaign ID in the sandbox.",
  "Emails sent":
    "Total attempted deliveries after warm-up ladders — pacing should respect domain reputation.",
  "Open rate":
    "Unique opens ÷ sends for attributable tracking pixels on this modeled campaign rollup.",
  "Reply rate":
    "Human-authored replies ÷ sends — directional signal before CRM hygiene rules apply.",
  "Bounce rate": "Hard/soft modeled bounces ÷ sends — trim lists when this climbs week over week.",
  "Clicks (est.)":
    "Heuristic modeled clicks aggregated from webhook-style assumptions — illustrative depth metric.",
  Unsubs:
    "Unsubscribe events attributed to modeled sends — keep below ESP tolerance when scaling ladders.",
  Meetings:
    "Pipeline meetings flagged from replies or calendars for this modeled campaign rollup.",
};

export function emailCampaignInsightHint(label: string): string | undefined {
  return EMAIL_CAMPAIGN_INSIGHT[label];
}
