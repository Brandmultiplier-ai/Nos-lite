const statusColors: Record<string, string> = {
  Hot: "bg-[#EE5D50]/20 text-[#EE5D50]",
  Warm: "bg-orange-500/20 text-orange-400",
  Cold: "bg-[#00D4FF]/20 text-[#00D4FF]",
  Active: "bg-[#01B574]/20 text-[#01B574]",
  Running: "bg-[#01B574]/20 text-[#01B574]",
  Paused: "bg-[#A0AEC0]/20 text-[#A0AEC0]",
  Completed: "bg-[#4940c6]/20 text-[#4940c6]",
  "In sequence": "bg-[#00D4FF]/14 text-[#00D4FF]",
  Replied: "bg-[#01B574]/20 text-[#01B574]",
  Bounced: "bg-[#EE5D50]/22 text-[#EE5D50]",
  Unsubscribed: "bg-[#A0AEC0]/18 text-[#A0AEC0]",
  "Opened only": "bg-[#4940c6]/16 text-[#C4BEFF]",
  Published: "bg-[#01B574]/20 text-[#01B574]",
  Scheduled: "bg-[#00D4FF]/20 text-[#00D4FF]",
  Draft: "bg-[#A0AEC0]/20 text-[#A0AEC0]",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-lg border border-white/10 px-2.5 py-0.5 text-xs font-semibold ${statusColors[status] ?? "bg-white/10 text-white"}`}
    >
      {status}
    </span>
  );
}
