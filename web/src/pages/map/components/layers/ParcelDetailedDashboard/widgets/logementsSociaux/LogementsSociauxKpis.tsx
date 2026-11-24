import { CalendarRange, KeyRound, Ruler, ThermometerSun } from "lucide-react";

import KpiGrid, { type Kpi } from "../shared/KpiGrid";
import { KPI_TONES } from "../shared/tones";
import type { SocialStats } from "./data";

export default function LogementsSociauxKpis({ stats }: { stats: SocialStats }) {
  const kpis: Kpi[] = [
    {
      label: "Logements sociaux",
      value: stats.count.toLocaleString("fr-FR"),
      hint: stats.topPieces ? `Surtout des ${stats.topPieces}` : "Typologie non renseignée",
      icon: KeyRound,
      tone: KPI_TONES.emerald,
    },
    {
      label: "Surface médiane",
      value: stats.medianSurface ? `${Math.round(stats.medianSurface)} m²` : "—",
      hint: "Surface habitable déclarée par le bailleur",
      icon: Ruler,
      tone: KPI_TONES.sky,
    },
    {
      label: "Passoires énergétiques",
      value: stats.poorShare === null ? "—" : `${stats.poorShare} %`,
      hint: stats.rated ? `Classes F et G sur ${stats.rated} DPE` : "Aucun DPE renseigné",
      icon: ThermometerSun,
      tone: stats.poorShare ? KPI_TONES.rose : KPI_TONES.gray,
      progress: stats.poorShare ? stats.poorShare : null,
      progressColor: "rose",
    },
    {
      label: "Construction",
      value: stats.years ? (stats.years[0] === stats.years[1] ? String(stats.years[0]) : `${stats.years[0]}–${stats.years[1]}`) : "—",
      hint: "Année d’achèvement",
      icon: CalendarRange,
      tone: KPI_TONES.violet,
    },
  ];

  return <KpiGrid kpis={kpis} />;
}
