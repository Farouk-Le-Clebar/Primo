import { Gauge, MapPin, Navigation, Ruler } from "lucide-react";

import { median } from "../dvf/data";
import KpiGrid, { type Kpi } from "../shared/KpiGrid";
import { KPI_TONES } from "../shared/tones";
import { INFRA_TYPE_BY_CODE } from "./constants";
import type { PoisProximityState } from "./usePoisProximity";
import { formatDistance, getDistance, getScoreLabel } from "./utils";

type PoisKpisProps = Pick<PoisProximityState, "displayedCodes" | "computed" | "globalScore">;

const progressColor = (score: number): Kpi["progressColor"] =>
  score >= 50 ? "emerald" : score >= 25 ? "amber" : "rose";

export default function PoisKpis({ displayedCodes, computed, globalScore }: PoisKpisProps) {
  const distances = displayedCodes
    .map((code) => ({ code, distance: getDistance(computed.get(code)) }))
    .filter((d): d is { code: string; distance: number } => d.distance != null)
    .sort((a, b) => a.distance - b.distance);
  const nearest = distances[0];
  const score = globalScore?.score ?? 0;
  const kpis: Kpi[] = [
    {
      label: "Score de proximité",
      value: `${score}/100`,
      hint: getScoreLabel(score),
      progress: score,
      progressColor: progressColor(score),
      icon: Gauge,
      tone: KPI_TONES.emerald,
    },
    {
      label: "Infrastructures trouvées",
      value: `${globalScore?.found ?? 0}/${globalScore?.total ?? 0}`,
      hint: "Les introuvables comptent pour 0",
      icon: MapPin,
      tone: KPI_TONES.sky,
    },
    {
      label: "Plus proche",
      value: formatDistance(nearest?.distance),
      hint: nearest ? (INFRA_TYPE_BY_CODE.get(nearest.code)?.label ?? nearest.code) : "Aucune infrastructure",
      icon: Navigation,
      tone: KPI_TONES.amber,
    },
    {
      label: "Distance médiane",
      value: formatDistance(median(distances.map((d) => d.distance))),
      hint: "À vol d’oiseau",
      icon: Ruler,
      tone: KPI_TONES.violet,
    },
  ];

  return <KpiGrid kpis={kpis} />;
}
