import { Building, Home, Percent, Scale } from "lucide-react";

import KpiGrid, { type Kpi } from "../shared/KpiGrid";
import { KPI_TONES } from "../shared/tones";
import { TERRITOIRE_LABELS, euroM2, marketRentFor, percent, type MarketRent } from "./data";

type LoyersKpisProps = {
  rents: MarketRent[];
  territoire: string | null;
  periode: string | null;
  yieldRate: number | null;
  priceM2: number | null;
};

const range = (rent: MarketRent | null): string =>
  rent?.low && rent.high ? `Fourchette ${euroM2(rent.low)} – ${euroM2(rent.high)}` : "Aucun indicateur pour cette commune";

export default function LoyersKpis({ rents, territoire, periode, yieldRate, priceM2 }: LoyersKpisProps) {
  const flat = marketRentFor(rents, "appartement");
  const house = rents.find((rent) => rent.type === "maison") ?? null;
  const kpis: Kpi[] = [
    { label: "Loyer appartement", value: euroM2(flat?.m2 ?? null), hint: range(flat), icon: Building, tone: KPI_TONES.sky },
    { label: "Loyer maison", value: euroM2(house?.m2 ?? null), hint: range(house), icon: Home, tone: KPI_TONES.emerald },
    {
      label: "Encadrement des loyers",
      value: <span className="text-xl">{territoire ? "Oui" : "Non concerné"}</span>,
      hint: territoire ? `${TERRITOIRE_LABELS[territoire] ?? territoire} · ${periode}` : "Pas de plafond légal publié ici",
      icon: Scale,
      tone: territoire ? KPI_TONES.rose : KPI_TONES.gray,
    },
    {
      label: "Rendement brut",
      value: percent(yieldRate),
      hint: priceM2 ? `Loyer de marché / ${Math.round(priceM2).toLocaleString("fr-FR")} €/m² (DVF)` : "Aucune vente d’appartement sur la parcelle",
      icon: Percent,
      tone: KPI_TONES.violet,
    },
  ];

  return <KpiGrid kpis={kpis} />;
}
