export function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed border-white/[0.1] bg-white/[0.02] px-4 py-8 text-center text-sm text-[#A0AEC0]">
      {message}
    </p>
  );
}
