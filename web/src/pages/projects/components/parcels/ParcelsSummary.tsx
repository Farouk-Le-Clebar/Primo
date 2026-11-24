import type { ProjectPlotWithSummary } from "../../../../types/project/plots";
import { isEnergySieve, median, pricePerM2, vigilanceTags } from "../shared/plotInsights";

type ParcelsSummaryProps = { plots: ProjectPlotWithSummary[]; compareCount: number };

export default function ParcelsSummary({ plots, compareCount }: ParcelsSummaryProps) {
  const surface = plots.reduce((sum, plot) => sum + (plot.surfaceM2 ?? 0), 0);
  const medianPrice = median(plots.map(pricePerM2).filter((value): value is number => value != null));
  const copros = plots.reduce((sum, plot) => sum + (plot.summary?.coproprietes?.count ?? 0), 0);
  const lots = plots.reduce((sum, plot) => sum + (plot.summary?.coproprietes?.lots ?? 0), 0);
  const flagged = plots.filter((plot) => vigilanceTags(plot).length > 0).length;
  const stats = [
    { label: "Surface cumulée", value: `${surface.toLocaleString("fr-FR")} m²` },
    { label: "Prix médian", value: medianPrice ? `${medianPrice.toLocaleString("fr-FR")} €/m²` : "—" },
    { label: "Passoires F-G", value: String(plots.filter(isEnergySieve).length) },
    { label: "Copropriétés", value: copros ? `${copros} · ${lots} lots` : "0" },
    { label: "Avec vigilance", value: `${flagged} parcelle${flagged > 1 ? "s" : ""}` },
  ];
  const hint = compareCount === 2 ? "Prêt à comparer" : `Cochez ${2 - compareCount} parcelle${compareCount ? "" : "s"} pour les comparer`;

  return (
    <div className="animate-rise-in flex flex-wrap items-center gap-6 primo-card px-[18px] py-3.5">
      {stats.map(({ label, value }) => (
        <span key={label} className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-xs font-medium text-[#82828c]">{label}</span>
          <span className="text-[13px] font-bold text-[#1c1c1e] tabular-nums dark:text-[#fafafa]">{value}</span>
        </span>
      ))}
      <span className="flex-1" />
      <span className={`text-xs font-medium transition-colors ${compareCount === 2 ? "text-emerald-500" : "text-[#82828c]"}`}>{hint}</span>
    </div>
  );
}
