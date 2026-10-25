import { TONES } from "../shared/tones";
import type { MatchLevel } from "./types";

const LEVELS: Record<MatchLevel, { label: string; tone: string }> = {
  forte: { label: "Correspondance forte", tone: TONES.emerald },
  probable: { label: "Probable", tone: TONES.sky },
  possible: { label: "Possible", tone: TONES.gray },
};

export default function MatchBadge({ level, reasons }: { level: MatchLevel; reasons?: string[] }) {
  const { label, tone } = LEVELS[level];
  return (
    <span title={reasons?.join(" · ")} className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${tone}`}>
      {label}
    </span>
  );
}
