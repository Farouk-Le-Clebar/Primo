import { Activity, CloudLightning, Radiation, ShieldAlert } from "lucide-react";

import KpiGrid, { type Kpi } from "../shared/KpiGrid";
import { dateLabel, text } from "../shared/format";
import { KPI_TONES } from "../shared/tones";
import type { GeorisquesData } from "./data";

export default function GeorisquesKpis({ data }: { data: GeorisquesData }) {
  const latest = data.catnat?.[0];
  const kpis: Kpi[] = [
    {
      label: "Risques recensés",
      value: data.risques ? String(data.risques.length) : "—",
      hint: "Types et sous-types GASPAR",
      icon: ShieldAlert,
      tone: KPI_TONES.amber,
    },
    {
      label: "Zone de sismicité",
      value: <span className="text-xl">{text(data.properties.zone_sismicite, "—")}</span>,
      hint: "Zonage réglementaire communal",
      icon: Activity,
      tone: KPI_TONES.violet,
    },
    {
      label: "Potentiel radon",
      value: <span className="text-xl">{data.radon}</span>,
      hint: "Potentiel communal, pas une mesure",
      icon: Radiation,
      tone: KPI_TONES.sky,
    },
    {
      label: "Arrêtés CatNat",
      value: data.catnat ? String(data.catnat.length) : "—",
      hint: latest ? `Dernier : ${dateLabel(latest.date_debut)}` : "Aucun arrêté référencé",
      icon: CloudLightning,
      tone: KPI_TONES.rose,
    },
  ];

  return <KpiGrid kpis={kpis} />;
}
