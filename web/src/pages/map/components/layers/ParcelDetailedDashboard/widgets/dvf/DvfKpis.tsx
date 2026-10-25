import { CalendarClock, Euro, Ruler, Scale } from "lucide-react";

import KpiGrid, { type Kpi } from "../shared/KpiGrid";
import { KPI_TONES } from "../shared/tones";
import type { DvfStats } from "./stats";
import { formatCurrency, formatDate } from "./utils";

export default function DvfKpis({ stats }: { stats: DvfStats }) {
  const kpis: Kpi[] = [
    {
      label: "Ventes",
      value: String(stats.count),
      hint: stats.period
        ? stats.period.from === stats.period.to
          ? `Enregistrées en ${stats.period.from}`
          : `De ${stats.period.from} à ${stats.period.to}`
        : "Dates non renseignées",
      icon: Scale,
      tone: KPI_TONES.sky,
    },
    {
      label: "Prix médian au m²",
      value: stats.medianPrice != null ? formatCurrency(stats.medianPrice) : "—",
      hint: `${stats.priceScope} · ${stats.usablePrices} vente${stats.usablePrices > 1 ? "s" : ""} d’un seul bien`,
      icon: Euro,
      tone: KPI_TONES.emerald,
    },
    {
      label: "Dernière vente",
      value: formatCurrency(stats.latest?.valeur_fonciere),
      hint: stats.latest
        ? `${stats.latest.nature_mutation} · ${formatDate(stats.latest.date_mutation)}`
        : "Aucune mutation",
      icon: CalendarClock,
      tone: KPI_TONES.amber,
    },
    {
      label: "Surface bâtie médiane",
      value: stats.medianSurface != null ? `${Math.round(stats.medianSurface).toLocaleString("fr-FR")} m²` : "—",
      hint: stats.excluded
        ? `${stats.excluded} vente${stats.excluded > 1 ? "s" : ""} sans prix au m² calculable`
        : "Toutes les ventes ont un prix au m²",
      icon: Ruler,
      tone: KPI_TONES.violet,
    },
  ];

  return <KpiGrid kpis={kpis} />;
}
