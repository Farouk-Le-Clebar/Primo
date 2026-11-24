import { Factory, FlaskConical, History, Wind } from "lucide-react";

import type { PollutionParcelle } from "../../../../../../../types/environnement";
import KpiGrid, { type Kpi } from "../shared/KpiGrid";
import { KPI_TONES } from "../shared/tones";
import { airLevel } from "./pollutionFormat";

export default function PollutionKpis({ data }: { data: PollutionParcelle }) {
  const { sols, air } = data;
  const sensitiveSites = sols ? sols.sis.length + sols.instructions.length + sols.servitudes.length : null;
  const kpis: Kpi[] = [
    {
      label: "Qualité de l'air",
      value: air?.indiceEuropeen != null ? String(air.indiceEuropeen) : "—",
      hint: `Indice européen · ${airLevel(air?.indiceEuropeen ?? null)}`,
      icon: Wind,
      tone: KPI_TONES.sky,
    },
    {
      label: "Sols pollués",
      value: sensitiveSites !== null ? String(sensitiveSites) : "—",
      hint: sols ? `SIS et sites suivis à ${sols.rayonSitesMetres} m` : "Géorisques indisponible",
      icon: FlaskConical,
      tone: KPI_TONES.rose,
    },
    {
      label: "Anciens sites industriels",
      value: sols ? String(sols.anciensSitesTotal) : "—",
      hint: sols ? `Inventaire CASIAS à ${sols.rayonSitesMetres} m` : "Géorisques indisponible",
      icon: History,
      tone: KPI_TONES.amber,
    },
    {
      label: "Installations classées",
      value: sols ? String(sols.installationsTotal) : "—",
      hint: sols ? `ICPE à ${sols.rayonInstallationsMetres / 1000} km` : "Géorisques indisponible",
      icon: Factory,
      tone: KPI_TONES.violet,
    },
  ];

  return <KpiGrid kpis={kpis} />;
}
