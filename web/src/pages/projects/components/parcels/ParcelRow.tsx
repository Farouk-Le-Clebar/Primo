import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ProjectPlotWithSummary } from "../../../../types/project/plots";
import { formatRelativeTime } from "../../../../utils/relativeTime";
import Avatar from "../ui/Avatar";
import DpeBadge from "../ui/DpeBadge";
import Tag from "../ui/Tag";
import { formatEuros, isNewPlot, plotTitle, pricePerM2, shortName, vigilanceTags } from "../shared/plotInsights";
import { COLUMNS } from "./parcelColumns";

type ParcelRowProps = {
  plot: ProjectPlotWithSummary;
  index: number;
  checked: boolean;
  onToggle: () => void;
  onOpen: () => void;
};

const MONTH_FORMAT = new Intl.DateTimeFormat("fr-FR", { month: "short", year: "numeric" });
const CELL = "flex h-6 items-center";

const formatSaleMonth = (date: string | null | undefined): string => {
  if (!date) return "—";
  const label = MONTH_FORMAT.format(new Date(date));
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export default function ParcelRow({ plot, index, checked, onToggle, onOpen }: ParcelRowProps) {
  const isNew = isNewPlot(plot);
  const tags = vigilanceTags(plot);
  const lots = plot.summary?.coproprietes?.lots;
  const commune = plot.adress?.split(",").pop()?.replace(/\d{5}/, "").trim();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index, 12) * 0.025 }}
      onClick={onOpen}
      className={`group flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors ${checked ? "bg-[#1c1c1e]/5 dark:bg-white/8" : isNew ? "bg-violet-500/4 hover:bg-violet-500/8" : "hover:bg-[#1c1c1e]/[0.03] dark:hover:bg-white/[0.04]"}`}
    >
      <span className={`${CELL} ${COLUMNS.check}`}>
        <button
          onClick={(event) => {
            event.stopPropagation();
            onToggle();
          }}
          aria-label={checked ? "Retirer de la comparaison" : "Ajouter à la comparaison"}
          className={`flex h-4 w-4 items-center justify-center rounded-[4px] border-[1.5px] transition-all ${checked ? "scale-110 border-[#1c1c1e] bg-[#1c1c1e] dark:border-white dark:bg-white" : "border-[#82828c] hover:border-[#1c1c1e] dark:hover:border-white"}`}
        >
          {checked && <Check className="h-3 w-3 text-white dark:text-[#1c1c1e]" strokeWidth={3} />}
        </button>
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <p className="truncate text-[13px] font-semibold text-[#1c1c1e] transition-transform group-hover:translate-x-0.5 dark:text-[#fafafa]">{plotTitle(plot)}</p>
          {isNew && <Tag tone="violet">Nouveau</Tag>}
        </div>
        <p className="truncate text-[11px] text-[#82828c]">{[plot.plotId, commune].filter(Boolean).join(" · ")}</p>
      </div>
      <span className={`${CELL} ${COLUMNS.surface} text-[13px] font-medium text-[#52525b] dark:text-[#d4d4d8]`}>{plot.surfaceM2 ? `${plot.surfaceM2.toLocaleString("fr-FR")} m²` : "—"}</span>
      <span className={`${CELL} ${COLUMNS.zone}`}>{plot.summary?.plu?.zones[0] ? <Tag tone="zinc" size="sm">{plot.summary.plu.zones[0]}</Tag> : <span className="text-[13px] text-[#82828c]">—</span>}</span>
      <span className={`${CELL} ${COLUMNS.price} text-[13px] font-semibold text-[#1c1c1e] tabular-nums dark:text-[#fafafa]`}>{formatEuros(pricePerM2(plot))}</span>
      <span className={`${CELL} ${COLUMNS.lastSale} text-[13px] text-[#52525b] dark:text-[#d4d4d8]`}>{formatSaleMonth(plot.summary?.dvf?.lastDate)}</span>
      <span className={`${CELL} ${COLUMNS.dpe}`}><DpeBadge label={plot.summary?.dpe?.lastLabel} /></span>
      <span className={`${CELL} ${COLUMNS.copro} text-[13px] text-[#52525b] dark:text-[#d4d4d8]`}>{lots ? `${lots} lots` : "—"}</span>
      <span className={`${CELL} ${COLUMNS.vigilance} gap-1`}>{tags.length ? tags.slice(0, 2).map((tag) => <Tag key={tag.label} tone={tag.tone} size="sm">{tag.label}</Tag>) : <span className="text-[13px] text-[#82828c]">—</span>}</span>
      <span className={`${CELL} ${COLUMNS.addedBy} gap-2`}>
        {plot.addedByName ? (
          <>
            <Avatar name={plot.addedByName} />
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{shortName(plot.addedByName)}</span>
              {plot.addedAt && <span className="text-[11px] text-[#82828c]">{formatRelativeTime(plot.addedAt)}</span>}
            </span>
          </>
        ) : (
          <span className="text-[13px] text-[#82828c]">—</span>
        )}
      </span>
    </motion.div>
  );
}
