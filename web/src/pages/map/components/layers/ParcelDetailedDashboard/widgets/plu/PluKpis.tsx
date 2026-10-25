import { Info, Landmark, Layers, ScrollText } from "lucide-react";

import KpiGrid, { type Kpi } from "../shared/KpiGrid";
import { KPI_TONES } from "../shared/tones";
import type { GpuFeature, PluRule } from "./types";
import { formatDate, zoneInfo } from "./utils";

type PluKpisProps = {
  zones: GpuFeature[];
  prescriptions: PluRule[] | undefined;
  informations: PluRule[] | undefined;
};

const countLabel = (rules: PluRule[] | undefined): string => (rules ? String(rules.length) : "—");

export default function PluKpis({ zones, prescriptions, informations }: PluKpisProps) {
  const main = zones[0]?.properties;
  const kpis: Kpi[] = [
    {
      label: "Zone principale",
      value: main?.libelle || "—",
      hint: zoneInfo(main?.libelle).label,
      icon: Landmark,
      tone: KPI_TONES.emerald,
    },
    {
      label: "Zonages",
      value: String(zones.length),
      hint: zones.length > 1 ? "Parcelle multi-zonée" : `Approuvé ${formatDate(main?.datvalid)}`,
      icon: Layers,
      tone: KPI_TONES.violet,
    },
    {
      label: "Prescriptions",
      value: countLabel(prescriptions),
      hint: "Servitudes et règles graphiques",
      icon: ScrollText,
      tone: KPI_TONES.amber,
    },
    {
      label: "Informations",
      value: countLabel(informations),
      hint: "Périmètres et droits annexes",
      icon: Info,
      tone: KPI_TONES.sky,
    },
  ];

  return <KpiGrid kpis={kpis} />;
}
