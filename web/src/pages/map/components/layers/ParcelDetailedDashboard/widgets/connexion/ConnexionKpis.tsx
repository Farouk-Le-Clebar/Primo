import { Antenna, Cable, Gauge, Signal } from "lucide-react";

import type { ConnectiviteParcelle, Generation } from "../../../../../../../types/environnement";
import KpiGrid, { type Kpi } from "../shared/KpiGrid";
import { KPI_TONES } from "../shared/tones";
import { formatDistance } from "../shared/useParcelPoint";

const GENERATION_ORDER: Generation[] = ["5G", "4G", "3G", "2G"];

const percent = (value: number | undefined): string => (value === undefined ? "—" : `${value.toLocaleString("fr-FR")} %`);

export default function ConnexionKpis({ data }: { data: ConnectiviteParcelle }) {
  const operators = data.mobile?.operateurs ?? [];
  const best = GENERATION_ORDER.find((generation) => operators.some((operator) => operator.meilleureGeneration === generation)) ?? null;
  const distances4g = operators.map((operator) => operator.distance4gMetres).filter((distance): distance is number => distance !== null);
  const covering5g = operators.filter((operator) => operator.distance5gMetres !== null && operator.distance5gMetres <= 1000).length;
  const kpis: Kpi[] = [
    {
      label: "Fibre optique",
      value: percent(data.fixe?.partFibre),
      hint: data.fixe ? `Locaux éligibles à ${data.fixe.commune}` : "Arcep indisponible",
      icon: Cable,
      tone: KPI_TONES.emerald,
    },
    {
      label: "Très haut débit",
      value: percent(data.fixe?.partGigabit),
      hint: "Locaux éligibles à 1 Gbit/s",
      icon: Gauge,
      tone: KPI_TONES.sky,
    },
    {
      label: "Meilleur réseau mobile",
      value: best ?? "—",
      hint: `${covering5g} opérateur${covering5g > 1 ? "s" : ""} en 5G à moins d'1 km`,
      icon: Signal,
      tone: KPI_TONES.violet,
    },
    {
      label: "Antenne 4G la plus proche",
      value: distances4g.length ? formatDistance(Math.min(...distances4g)) : "—",
      hint: data.mobile ? `${data.mobile.antennesActives} émetteurs actifs à 1 km` : "ANFR indisponible",
      icon: Antenna,
      tone: KPI_TONES.amber,
    },
  ];

  return <KpiGrid kpis={kpis} />;
}
