const DPE_COLORS: Record<string, string> = {
  A: "bg-emerald-600",
  B: "bg-green-500",
  C: "bg-lime-500",
  D: "bg-[#fad200]",
  E: "bg-amber-500",
  F: "bg-orange-600",
  G: "bg-red-600",
};

export default function DpeBadge({ label, size = "sm" }: { label: string | null | undefined; size?: "sm" | "md" }) {
  const letter = label?.toUpperCase();
  if (!letter || !DPE_COLORS[letter]) return <span className="text-[13px] text-[#82828c]">—</span>;
  return (
    <span className={`inline-flex items-center justify-center font-bold ${size === "md" ? "h-[22px] w-[22px] rounded-[5px] text-[11px]" : "h-[18px] w-[18px] rounded-[4px] text-[10px]"} text-white transition-transform hover:scale-110 ${DPE_COLORS[letter]}`}>
      {letter}
    </span>
  );
}
