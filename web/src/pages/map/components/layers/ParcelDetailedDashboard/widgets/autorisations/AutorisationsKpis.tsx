import { Ban, CalendarClock, CheckCircle2, FileStack } from "lucide-react";

import KpiGrid, { type Kpi } from "../shared/KpiGrid";
import { dateLabel } from "../shared/format";
import { KPI_TONES } from "../shared/tones";
import { dossierState, types, type Dossier } from "./data";

export default function AutorisationsKpis({ dossiers }: { dossiers: Dossier[] }) {
  const rows = dossiers.reduce((sum, d) => sum + d.rows.length, 0);
  const done = dossiers.filter((d) => dossierState(d) === "6").length;
  const cancelled = dossiers.filter((d) => dossierState(d) === "4").length;
  const latest = dossiers[0];
  const kpis: Kpi[] = [
    {
      label: "Dossiers",
      value: String(dossiers.length),
      hint: `${rows} ligne${rows > 1 ? "s" : ""} source${rows > 1 ? "s" : ""}`,
      icon: FileStack,
      tone: KPI_TONES.sky,
    },
    {
      label: "Plus récent",
      value: <span className="text-xl">{dateLabel(latest?.date)}</span>,
      hint: latest ? types[latest.type] || latest.type : "Aucun dossier",
      icon: CalendarClock,
      tone: KPI_TONES.amber,
    },
    {
      label: "Travaux achevés",
      value: String(done),
      hint: "Achèvement déclaré dans la source",
      progress: dossiers.length ? Math.round((done / dossiers.length) * 100) : 0,
      progressColor: "emerald",
      icon: CheckCircle2,
      tone: KPI_TONES.emerald,
    },
    {
      label: "Dossiers annulés",
      value: String(cancelled),
      hint: cancelled ? "Projet initial non réalisé" : "Aucune annulation enregistrée",
      icon: Ban,
      tone: KPI_TONES.rose,
    },
  ];

  return <KpiGrid kpis={kpis} />;
}
