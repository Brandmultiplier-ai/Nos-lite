"use client";

import { useMemo, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { IntegrationStrip } from "@/components/ui/IntegrationStrip";
import { SimpleStatCard } from "@/components/ui/SimpleStatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDashboard } from "@/context/DashboardContext";
import { HiOutlineX } from "react-icons/hi";

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
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [drafts, setDrafts] = useState<LinkedInDraft[]>([]);
  const [title, setTitle] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [body, setBody] = useState("");
  const [hashtags, setHashtags] = useState("");

  const dotColors = ["#4940c6", "#f36901", "#01B574", "#00D4FF"];
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
      const copy = [...prev];
      copy[idx] = next;
      return copy;
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
          <SimpleStatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <GlassCard className="xl:col-span-1">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="font-display text-xl font-bold text-white">LinkedIn Content Calendar</h2>
            <button
              type="button"
              onClick={() => openComposer(selectedDay ?? 1)}
              className="rounded-lg bg-[#4940c6] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-95"
            >
              Create Content
            </button>
          </div>
          <p className="mb-4 text-xs text-[#A0AEC0]">
            Click any date to create or edit a LinkedIn post for this workspace.
          </p>
          <div className="grid grid-cols-7 gap-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div
                key={`${d}-${i}`}
                className="text-center text-[10px] font-medium text-[#A0AEC0]"
              >
                {d}
              </div>
            ))}
            {calendarWithDrafts.map((day) => (
              <button
                key={day.day}
                type="button"
                onClick={() => setSelectedDay(day.day)}
                className={`flex min-h-[36px] flex-col items-center justify-center rounded-lg border p-1 transition ${
                  selectedDay === day.day
                    ? "border-[#4940c6]/60 bg-[#161A43]"
                    : "border-white/[0.05] bg-[#0B1437]/60 hover:border-white/[0.2]"
                }`}
              >
                <span className="text-xs text-[#A0AEC0]">{day.day}</span>
                <div className="mt-0.5 flex gap-0.5">
                  {Array.from({ length: day.posts }).map((_, i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: dotColors[i % dotColors.length] }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-white/[0.08] bg-black/20 p-3">
            {selectedDay == null ? (
              <p className="text-xs text-[#A0AEC0]">Select a day to see post details.</p>
            ) : selectedDraft ? (
              <div className="space-y-1.5 text-xs">
                <p className="font-semibold text-white">{selectedDraft.title}</p>
                <p className="text-[#A0AEC0]">Day {selectedDraft.day} · LinkedIn</p>
                <p className="line-clamp-2 text-[#A0AEC0]">{selectedDraft.body}</p>
                <p className="text-[#00D4FF]">
                  Impressions: {selectedDraft.impressions.toLocaleString("en-US")}
                </p>
                <button
                  type="button"
                  onClick={() => openComposer(selectedDraft.day)}
                  className="mt-1 rounded-md border border-white/[0.15] px-2 py-1 text-[11px] text-white"
                >
                  Edit post
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-[#A0AEC0]">No post scheduled on day {selectedDay}.</p>
                <button
                  type="button"
                  onClick={() => openComposer(selectedDay)}
                  className="rounded-md border border-[#4940c6]/50 px-2 py-1 text-[11px] text-white"
                >
                  Create post for this day
                </button>
              </div>
            )}
          </div>
        </GlassCard>

        <GlassCard className="xl:col-span-2">
          <h2 className="mb-4 font-display text-xl font-bold text-white">
            Content Performance
          </h2>
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
                  <tr key={row.piece} className="text-white">
                    <td className="font-semibold">{row.piece}</td>
                    <td className="text-[#A0AEC0]">{row.channel}</td>
                    <td>
                      <StatusBadge status={row.status} />
                    </td>
                    <td>{row.reach}</td>
                    <td>{row.engagement}</td>
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
          <aside className="absolute right-0 top-0 z-50 h-full w-full max-w-[520px] overflow-y-auto border-l border-white/[0.08] bg-gradient-to-b from-[#16132A]/96 via-[#0E1324]/96 to-[#070A12]/97 p-5 shadow-[-20px_0_42px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-white">
                Create LinkedIn Content {selectedDay ? `· Day ${selectedDay}` : ""}
              </h3>
              <button
                type="button"
                onClick={() => setIsComposerOpen(false)}
                className="rounded-lg p-1 text-[#A0AEC0] hover:bg-white/[0.06] hover:text-white"
                aria-label="Close content composer"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-[#A0AEC0]">
                  LinkedIn Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post title..."
                  className="w-full rounded-lg border border-white/[0.14] bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-[#6F7AA6] focus:border-[#4940c6]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-[#A0AEC0]">
                  Images or Videos Link
                </label>
                <input
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-white/[0.14] bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-[#6F7AA6] focus:border-[#4940c6]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-[#A0AEC0]">
                  Body
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  placeholder="Write your LinkedIn post body..."
                  className="w-full rounded-lg border border-white/[0.14] bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-[#6F7AA6] focus:border-[#4940c6]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-[#A0AEC0]">
                  Hashtags
                </label>
                <input
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="#b2b #growth #linkedin"
                  className="w-full rounded-lg border border-white/[0.14] bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-[#6F7AA6] focus:border-[#4940c6]"
                />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsComposerOpen(false)}
                className="rounded-lg border border-white/[0.15] px-4 py-2 text-sm text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveDraft}
                className="rounded-lg bg-[#4940c6] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
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
