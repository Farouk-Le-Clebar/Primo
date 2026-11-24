import { motion } from "framer-motion";
import { NEWS_KIND_ORDER, NEWS_KINDS, type NewsKind } from "./newsKinds";

type NewsFiltersProps = {
  counts: Partial<Record<NewsKind, number>>;
  total: number;
  active: NewsKind | "all";
  onChange: (filter: NewsKind | "all") => void;
};

const BASE = "relative flex items-center gap-1.5 rounded-full px-2.5 py-[5px] text-xs font-semibold transition-colors";

export default function NewsFilters({ counts, total, active, onChange }: NewsFiltersProps) {
  const kinds = NEWS_KIND_ORDER.filter((kind) => counts[kind]);

  return (
    <div className="flex flex-wrap gap-1.5 px-5 pb-3.5">
      <button onClick={() => onChange("all")} className={`${BASE} ${active === "all" ? "text-white dark:text-[#1c1c1e]" : "bg-[#1c1c1e]/5 text-[#52525b] hover:bg-[#1c1c1e]/10 dark:bg-white/7 dark:text-[#d4d4d8] dark:hover:bg-white/12"}`}>
        {active === "all" && <motion.span layoutId="news-filter" className="absolute inset-0 -z-10 rounded-full bg-[#1c1c1e] dark:bg-[#fafafa]" />}
        Tout <span>{total}</span>
      </button>
      {kinds.map((kind) => {
        const isActive = active === kind;
        return (
          <button
            key={kind}
            onClick={() => onChange(isActive ? "all" : kind)}
            className={`${BASE} ${isActive ? "text-white dark:text-[#1c1c1e]" : "bg-[#1c1c1e]/5 text-[#52525b] hover:bg-[#1c1c1e]/10 dark:bg-white/7 dark:text-[#d4d4d8] dark:hover:bg-white/12"}`}
          >
            {isActive && <motion.span layoutId="news-filter" className="absolute inset-0 -z-10 rounded-full bg-[#1c1c1e] dark:bg-[#fafafa]" />}
            <span className={`h-[7px] w-[7px] rounded-full ${NEWS_KINDS[kind].dot}`} />
            {NEWS_KINDS[kind].label}
            <span className={isActive ? "" : "text-[#82828c]"}>{counts[kind]}</span>
          </button>
        );
      })}
    </div>
  );
}
