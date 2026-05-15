const channelColors: Record<string, string> = {
  Website: "bg-[#4940c6]/20 text-[#4940c6]",
  LinkedIn: "bg-[#00D4FF]/20 text-[#00D4FF]",
  Email: "bg-[#3a32a0]/20 text-[#A78BFA]",
  Content: "bg-[#01B574]/20 text-[#01B574]",
};

export function ChannelBadge({ channel }: { channel: string }) {
  return (
    <span
      className={`inline-flex rounded-lg border border-white/10 px-2.5 py-0.5 text-xs font-semibold ${channelColors[channel] ?? "bg-white/10 text-white"}`}
    >
      {channel}
    </span>
  );
}
