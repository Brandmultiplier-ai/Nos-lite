import { HiOutlineBeaker } from "react-icons/hi";

export function IntelligenceMethodBanner({ note }: { note: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-[#4940c6]/25 bg-gradient-to-r from-[#4940c6]/12 via-transparent to-[#f36901]/8 px-4 py-3">
      <HiOutlineBeaker className="mt-0.5 h-5 w-5 shrink-0 text-[#f36901]" aria-hidden />
      <p className="text-xs leading-relaxed text-[#A0AEC0]">
        <span className="font-semibold text-white">Method: </span>
        {note}
      </p>
    </div>
  );
}
