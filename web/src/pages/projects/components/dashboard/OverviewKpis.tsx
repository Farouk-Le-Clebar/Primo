import { AlertTriangle, Building2, Euro, MapPin, type LucideIcon } from "lucide-react";
import type { ProjectPlotWithSummary } from "../../../../types/project/plots";
import { isEnergySieve, isNewPlot, median, pricePerM2, vigilanceTags } from "../shared/plotInsights";

type Kpi = { label: string; icon: LucideIcon; value: string; detail: string; tone: string };

const plural = (count: number, word: string): string => `${count} ${word}${count > 1 ? "s" : ""}`;

function buildKpis(plots: ProjectPlotWithSummary[]): Kpi[] {
  const newCount = plots.filter((plot) => isNewPlot(plot)).length;
  const prices = plots.map(pricePerM2).filter((value): value is number => value != null);
  const medianPrice = median(prices);
  const flagged = plots.filter((plot) => vigilanceTags(plot).length > 0);
  const flood = plots.filter((plot) => vigilanceTags(plot).some((tag) => tag.label === "Inondation")).length;
  const sieves = plots.filter(isEnergySieve).length;
  const copros = plots.reduce((sum, plot) => sum + (plot.summary?.coproprietes?.count ?? 0), 0);
  const lots = plots.reduce((sum, plot) => sum + (plot.summary?.coproprietes?.lots ?? 0), 0);
  const aided = plots.reduce((sum, plot) => sum + (plot.summary?.coproprietes?.aided ?? 0), 0);

  return [
    { label: "Parcelles", icon: MapPin, value: String(plots.length), detail: newCount ? `+${newCount} cette semaine` : "Aucun ajout cette semaine", tone: newCount ? "text-emerald-500" : "text-[#82828c]" },
    { label: "Prix médian du secteur", icon: Euro, value: medianPrice ? `${medianPrice.toLocaleString("fr-FR")} €/m²` : "—", detail: prices.length ? `${plural(prices.length, "vente")} · DVF` : "Aucune vente DVF", tone: "text-[#82828c]" },
    { label: "Points de vigilance", icon: AlertTriangle, value: String(flagged.length), detail: [flood ? plural(flood, "zone inondable") : null, sieves ? `${sieves} DPE F-G` : null].filter(Boolean).join(" · ") || "Rien à signaler", tone: flagged.length ? "text-amber-500" : "text-[#82828c]" },
    { label: "Copropriétés", icon: Building2, value: String(copros), detail: copros ? `${lots} lots${aided ? ` · ${aided} en difficulté` : ""}` : "Aucune copropriété", tone: "text-[#82828c]" },
  ];
}

export default function OverviewKpis({ plots }: { plots: ProjectPlotWithSummary[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {buildKpis(plots).map(({ label, icon: Icon, value, detail, tone }, index) => (
        <div key={label} style={{ animationDelay: `${index * 50}ms` }} className="primo-card animate-fade-in flex flex-col gap-2.5 p-[18px]">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-[#82828c]">{label}</p>
            <span className="flex-1" />
            <Icon className="h-4 w-4 text-[#82828c]" strokeWidth={1.75} />
          </div>
          <p className="text-[26px] font-bold text-[#1c1c1e] tabular-nums dark:text-[#fafafa]">{value}</p>
          <p className={`text-xs font-medium ${tone}`}>{detail}</p>
        </div>
      ))}
    </div>
  );
}
