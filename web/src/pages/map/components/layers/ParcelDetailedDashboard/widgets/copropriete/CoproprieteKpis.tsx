import { Car, DoorOpen, Layers, UserCheck } from "lucide-react";

import type { Copropriete } from "../habitat/types";
import KpiGrid, { type Kpi } from "../shared/KpiGrid";
import { KPI_TONES } from "../shared/tones";
import { coproTotals, mandatTone, syndicLabel } from "./data";

export default function CoproprieteKpis({ coproprietes }: { coproprietes: Copropriete[] }) {
  const totals = coproTotals(coproprietes);
  const main = coproprietes[0];
  const several = totals.syndicats > 1;
  const kpis: Kpi[] = [
    {
      label: "Lots",
      value: totals.lots.toLocaleString("fr-FR"),
      hint: `${totals.principaux.toLocaleString("fr-FR")} principaux · ${totals.syndicats} syndicat${several ? "s" : ""}`,
      icon: Layers,
      tone: KPI_TONES.violet,
    },
    {
      label: "Logements",
      value: totals.habitation.toLocaleString("fr-FR"),
      hint: "Lots à usage total ou partiel d’habitation",
      icon: DoorOpen,
      tone: KPI_TONES.emerald,
    },
    {
      label: "Stationnements",
      value: totals.stationnement.toLocaleString("fr-FR"),
      hint: "Parkings, boxes et garages",
      icon: Car,
      tone: KPI_TONES.sky,
    },
    {
      label: "Syndic",
      value: <span className="text-xl capitalize">{several ? `${totals.enCours} / ${totals.syndicats} actifs` : main.type_syndic ?? "Non connu"}</span>,
      hint: several ? "Syndicats avec un mandat en cours" : main.mandat ? `${main.mandat} · ${syndicLabel(main)}` : syndicLabel(main),
      icon: UserCheck,
      tone: KPI_TONES[several ? (totals.enCours === totals.syndicats ? "emerald" : "amber") : mandatTone(main.mandat)],
    },
  ];

  return <KpiGrid kpis={kpis} />;
}
