import { Building2, Home, Layers, Ruler } from "lucide-react";

import KpiGrid, { type Kpi } from "../shared/KpiGrid";
import { coverageRatio, squareMeters, type BuildingStats } from "./stats";

type BuildingKpisProps = {
  stats: BuildingStats;
  parcelArea: number | null;
};

export function BuildingKpis({ stats, parcelArea }: BuildingKpisProps) {
  const coverage = coverageRatio(stats.footprint, parcelArea);
  const kpis: Kpi[] = [
    {
      label: "Bâtiments",
      value: String(stats.count),
      hint: stats.oldestYear
        ? `Plus ancien apparu en ${stats.oldestYear}`
        : "Année d’apparition non renseignée",
      icon: Building2,
      tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    {
      label: "Emprise au sol",
      value: squareMeters(stats.footprint),
      hint:
        coverage != null
          ? `${coverage} % de la surface cadastrale`
          : "Surface cadastrale inconnue",
      progress: coverage,
      icon: Ruler,
      tone: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    },
    {
      label: "Surface de plancher",
      value: squareMeters(stats.floorArea),
      hint: "Estimation : emprise × niveaux",
      icon: Layers,
      tone: "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
    },
    {
      label: "Logements",
      value: stats.dwellings != null ? String(stats.dwellings) : "—",
      hint: stats.maxHeight
        ? `Hauteur max. ${stats.maxHeight.toLocaleString("fr-FR")} m`
        : "Hauteur non renseignée",
      icon: Home,
      tone: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
    },
  ];

  return <KpiGrid kpis={kpis} />;
}
