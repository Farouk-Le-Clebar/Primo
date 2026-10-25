import { CalendarClock, Flame, Gauge, ThermometerSnowflake } from "lucide-react";

import KpiGrid, { type Kpi } from "../shared/KpiGrid";
import type { DpeStats } from "./data";
import { DPE_LABELS_FR, formatEuro, getDpeColors } from "./utils";

export default function DpeKpis({ stats }: { stats: DpeStats }) {
  const dominant = getDpeColors(stats.dominant);
  const kpis: Kpi[] = [
    {
      label: "Diagnostics",
      value: String(stats.count),
      hint: stats.period
        ? stats.period.from === stats.period.to
          ? `Réalisés en ${stats.period.from}`
          : `De ${stats.period.from} à ${stats.period.to}`
        : "Dates non renseignées",
      icon: CalendarClock,
      tone: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
    },
    {
      label: "Classe dominante",
      value: (
        <span className="flex items-center gap-2">
          <span className={`flex h-8 w-8 items-center justify-center rounded-md text-lg font-bold ${dominant.bg} ${dominant.text}`}>
            {stats.dominant}
          </span>
          <span className="truncate text-sm font-medium text-gray-600 dark:text-gray-300">
            {DPE_LABELS_FR[stats.dominant] ?? "Inconnue"}
          </span>
        </span>
      ),
      hint: `Émissions GES dominantes : classe ${stats.dominantGes}`,
      icon: Gauge,
      tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    {
      label: "Consommation médiane",
      value: stats.medianConso != null ? (
        <>
          {Math.round(stats.medianConso).toLocaleString("fr-FR")}
          <span className="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">kWh/m²/an</span>
        </>
      ) : (
        "—"
      ),
      hint: `Coût médian ${formatEuro(stats.medianCost ?? undefined)} / an`,
      icon: Flame,
      tone: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    },
    {
      label: "Classes E · F · G",
      value: `${stats.poorShare} %`,
      hint: `${stats.poor} concerné${stats.poor > 1 ? "s" : ""} par le calendrier Loi Climat`,
      progress: stats.poorShare,
      progressColor: "rose",
      icon: ThermometerSnowflake,
      tone: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
    },
  ];

  return <KpiGrid kpis={kpis} />;
}
