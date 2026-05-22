"use client";

import { useMemo, useState } from "react";
import { CardInfoTip } from "@/components/ui/CardInfoTip";
import { GlassCard } from "@/components/ui/GlassCard";
import { IntegrationStrip } from "@/components/ui/IntegrationStrip";
import { SimpleStatCard } from "@/components/ui/SimpleStatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDashboard } from "@/context/DashboardContext";
import { CHART_CARD_DESCRIPTIONS, METRIC_DESCRIPTIONS } from "@/data/metricDescriptions";
import { HiOutlineX } from "react-icons/hi";
import { useChartTheme } from "@/components/charts/chartTheme";
import { useSectionThemeCopy } from "@/theme/sectionThemeCopy";

interface LinkedInDraft {
  id: string;
  day: number;
  title: string;
  mediaUrl: string;
  body: string;
  hashtags: string;
  impressions: number;
}

export function ContentSection() {
  const { data } = useDashboard();
  const { content } = data;
  const copy = useSectionThemeCopy();
  const { tc, themed, darkGradientGlass } = copy;
  const { chartColors } = useChartTheme();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [drafts, setDrafts] = useState<LinkedInDraft[]>([]);
  const [title, setTitle] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [body, setBody] = useState("");
  const [hashtags, setHashtags] = useState("");

  const dotColors = [chartColors.primaryDark, chartColors.accent, chartColors.green, chartColors.teal];
  const selectedDraft = selectedDay == null ? null : drafts.find((d) => d.day === selectedDay) ?? null;
  const calendarWithDrafts = useMemo(
    () =>
      content.calendar.map((day) => ({
        ...day,
        posts: day.posts + drafts.filter((d) => d.day === day.day).length,
      })),
    [content.calendar, drafts],
  );

  const filteredRows = useMemo(
    () => [
      ...drafts.map((d) => ({
        piece: d.title,
        channel: "LinkedIn",
        status: "Scheduled" as const,
        reach: d.impressions.toLocaleString("en-US"),
        engagement: `${Math.max(2.1, Math.round((d.impressions % 120) / 10 + 2))}%`,
      })),
      ...content.rows,
    ],
    [content.rows, drafts],
  );

  const openComposer = (day: number) => {
    setSelectedDay(day);
    const existing = drafts.find((d) => d.day === day);
    if (existing) {
      setTitle(existing.title);
      setMediaUrl(existing.mediaUrl);
      setBody(existing.body);
      setHashtags(existing.hashtags);
    } else {
      setTitle("");
      setMediaUrl("");
      setBody("");
      setHashtags("");
    }
    setIsComposerOpen(true);
  };

  const saveDraft = () => {
    if (!selectedDay || !title.trim() || !body.trim()) return;
    const id = `${data.id}-${selectedDay}`;
    const base = title.length * 220 + body.length * 18 + hashtags.length * 35;
    const impressions = Math.max(640, Math.round(base * 0.9));
    const next: LinkedInDraft = {
      id,
      day: selectedDay,
      title: title.trim(),
      mediaUrl: mediaUrl.trim(),
      body: body.trim(),
      hashtags: hashtags.trim(),
      impressions,
    };
    setDrafts((prev) => {
      const idx = prev.findIndex((d) => d.day === selectedDay);
      if (idx === -1) return [next, ...prev];
      const draftCopy = [...prev];
      draftCopy[idx] = next;
      return draftCopy;
    });
    setIsComposerOpen(false);
  };

  return (
    <div className="space-y-6">
      <IntegrationStrip
        title="Content production & distribution stack"
        description="LinkedIn-focused scheduling for this workspace with calendar-based creation and expected reach."
        items={data.integrations.content}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {content.stats.map((stat) => (
          <SimpleStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            info={METRIC_DESCRIPTIONS[stat.label]}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <GlassCard className={`xl:col-span-1 ${darkGradientGlass}`}>
          <p className={copy.isV5 ? "nos-mboard-chart-eyebrow" : `text-xs font-semibold uppercase tracking-[0.08em] ${copy.muteSm}`}>
            Publishing
          </p>
          <div className="mb-4 mt-1 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className={copy.h2}>LinkedIn Content Calendar</h2>
              <CardInfoTip
                subject="LinkedIn Content Calendar"
                text={CHART_CARD_DESCRIPTIONS["LinkedIn Content Calendar"]}
              />
            </div>
            <button
              type="button"
              onClick={() => openComposer(selectedDay ?? 1)}
              className={tc.buttonPrimary}
            >
              Create Content
            </button>
          </div>
          <p className={`mb-4 text-xs ${copy.muted}`}>
            Click any date to create or edit a LinkedIn post for this workspace.
          </p>
          <div className={`grid grid-cols-7 gap-2 ${themed ? "rounded-xl border border-[var(--theme-hairline)] bg-[var(--theme-canvas-soft)] p-3" : ""}`}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div
                key={`${d}-${i}`}
                className={`text-center text-[10px] font-semibold uppercase tracking-wide ${copy.muteSm}`}
              >
                {d}
              </div>
            ))}
            {calendarWithDrafts.map((day) => {
              const isSelected = selectedDay === day.day;
              const dayClass = themed
                ? isSelected
                  ? "border-[var(--theme-primary)] bg-[var(--theme-primary-soft)] shadow-[var(--theme-card-shadow)] ring-1 ring-[var(--theme-primary-soft)]"
                  : "border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] hover:border-[var(--theme-primary)] hover:shadow-[var(--theme-card-shadow)]"
                : isSelected
                  ? "border-[#4940c6]/60 bg-[#161A43]"
                  : "border-white/[0.05] bg-[#0B1437]/60 hover:border-white/[0.2]";

              return (
              <button
                key={day.day}
                type="button"
                onClick={() => setSelectedDay(day.day)}
                className={`flex min-h-[40px] flex-col items-center justify-center rounded-xl border p-1.5 transition ${dayClass}`}
              >
                <span className={`text-xs font-semibold ${themed ? copy.ink : copy.muted}`}>{day.day}</span>
                <div className="mt-1 flex min-h-[6px] gap-0.5">
                  {Array.from({ length: Math.min(day.posts, 4) }).map((_, i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: dotColors[i % dotColors.length] }}
                    />
                  ))}
                </div>
              </button>
              );
            })}
          </div>
          <div className={`mt-4 rounded-xl border p-4 ${themed ? `${tc.innerPanel} border-[var(--theme-hairline)]` : "border-white/[0.08] bg-black/20"}`}>
            {selectedDay == null ? (
              <p className={`text-xs ${copy.muted}`}>Select a day to see post details.</p>
            ) : selectedDraft ? (
              <div className="space-y-1.5 text-xs">
                <p className={`font-semibold ${copy.ink}`}>{selectedDraft.title}</p>
                <p className={copy.muted}>Day {selectedDraft.day} · LinkedIn</p>
                <p className={`line-clamp-2 ${copy.muted}`}>{selectedDraft.body}</p>
                <p className={themed ? tc.accentText : "text-[#00D4FF]"}>
                  Impressions: {selectedDraft.impressions.toLocaleString("en-US")}
                </p>
                <button
                  type="button"
                  onClick={() => openComposer(selectedDraft.day)}
                  className={
                    themed
                      ? `${tc.buttonSecondary} !mt-1 !min-h-0 !px-2.5 !py-1 !text-[11px]`
                      : `mt-1 rounded-md border px-2 py-1 text-[11px] ${copy.ink} border-white/[0.15]`
                  }
                >
                  Edit post
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className={`text-xs ${copy.muted}`}>No post scheduled on day {selectedDay}.</p>
                <button
                  type="button"
                  onClick={() => openComposer(selectedDay)}
                  className={
                    themed
                      ? `${tc.buttonPrimary} !min-h-0 !px-2.5 !py-1 !text-[11px]`
                      : `rounded-md border px-2 py-1 text-[11px] ${copy.ink} border-[#4940c6]/50`
                  }
                >
                  Create post for this day
                </button>
              </div>
            )}
          </div>
        </GlassCard>

        <GlassCard className={`xl:col-span-2 ${darkGradientGlass}`}>
          <p className={copy.isV5 ? "nos-mboard-chart-eyebrow" : `text-xs font-semibold uppercase tracking-[0.08em] ${copy.muteSm}`}>
            Performance
          </p>
          <div className="mb-4 mt-1 flex flex-wrap items-start justify-between gap-2">
            <h2 className={copy.h2}>
              Content Performance
            </h2>
            <CardInfoTip
              subject="Content Performance"
              text={CHART_CARD_DESCRIPTIONS["Content Performance"]}
            />
          </div>
          {filteredRows.length === 0 ? (
            <EmptyState message="No content to show." />
          ) : (
          <div className="nos-table-wrap">
            <table className="nos-table min-w-[600px]">
              <thead>
                <tr>
                  <th>Content Piece</th>
                  <th>Channel</th>
                  <th>Status</th>
                  <th>Reach</th>
                  <th>Engagement</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.piece} className={themed ? "" : copy.ink}>
                    <td className={`font-semibold ${copy.ink}`}>{row.piece}</td>
                    <td>
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${themed ? "border-[var(--theme-hairline)] bg-[var(--theme-canvas-soft)] text-[var(--theme-ink-secondary)]" : copy.muted}`}>
                        {row.channel}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={row.status} />
                    </td>
                    <td className={`font-medium ${copy.ink}`}>{row.reach}</td>
                    <td className={themed ? tc.accentText : "text-[#00D4FF]"}>{row.engagement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </GlassCard>
      </div>

      {isComposerOpen && (
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            className="absolute inset-0 bg-black/55 backdrop-blur-[1px]"
            onClick={() => setIsComposerOpen(false)}
            aria-label="Close content composer"
          />
          <aside className={`${copy.drawerAside} !max-w-[520px]`}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className={copy.h2}>
                Create LinkedIn Content {selectedDay ? `· Day ${selectedDay}` : ""}
              </h3>
              <button
                type="button"
                onClick={() => setIsComposerOpen(false)}
                className={copy.closeBtn}
                aria-label="Close content composer"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={`mb-1 block text-xs font-semibold uppercase tracking-[0.08em] ${copy.muted}`}>
                  LinkedIn Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post title..."
                  className={copy.inputClass}
                />
              </div>
              <div>
                <label className={`mb-1 block text-xs font-semibold uppercase tracking-[0.08em] ${copy.muted}`}>
                  Images or Videos Link
                </label>
                <input
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://..."
                  className={copy.inputClass}
                />
              </div>
              <div>
                <label className={`mb-1 block text-xs font-semibold uppercase tracking-[0.08em] ${copy.muted}`}>
                  Body
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  placeholder="Write your LinkedIn post body..."
                  className={copy.inputClass}
                />
              </div>
              <div>
                <label className={`mb-1 block text-xs font-semibold uppercase tracking-[0.08em] ${copy.muted}`}>
                  Hashtags
                </label>
                <input
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="#b2b #growth #linkedin"
                  className={copy.inputClass}
                />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsComposerOpen(false)}
                className={copy.pagBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveDraft}
                className={`${tc.buttonPrimary} !min-h-[44px] disabled:opacity-40`}
                disabled={!title.trim() || !body.trim() || selectedDay == null}
              >
                Save LinkedIn Post
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
