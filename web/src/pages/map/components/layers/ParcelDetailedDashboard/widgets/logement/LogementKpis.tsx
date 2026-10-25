import { Euro, Flame, Gauge, Scale } from "lucide-react";

import type { DpeEntry } from "../dpe/data";
import { DPE_LABELS_FR, formatEuro, getDpeColors } from "../dpe/utils";
import { formatCurrency } from "../dvf/utils";
import KpiGrid, { type Kpi } from "../shared/KpiGrid";
import { dateLabel } from "../shared/format";
import { KPI_TONES } from "../shared/tones";
import type { RentalOutlook } from "./climateLaw";
import type { Valuation } from "./valuation";

type LogementKpisProps = {
  dpe: DpeEntry | null;
  valuation: Valuation;
  outlook: RentalOutlook;
};

export default function LogementKpis({ dpe, valuation, outlook }: LogementKpisProps) {
  const colors = getDpeColors(dpe?.label);
  const kpis: Kpi[] = [
    {
      label: "Étiquette énergie",
      value: (
        <span className="flex items-center gap-2">
          <span className={`flex h-8 w-8 items-center justify-center rounded-md text-lg font-bold ${colors.bg} ${colors.text}`}>{dpe?.label ?? "?"}</span>
          <span className="truncate text-sm font-medium text-gray-600 dark:text-gray-300">{DPE_LABELS_FR[dpe?.label ?? ""] ?? "Inconnue"}</span>
        </span>
      ),
      hint: dpe ? `DPE du ${dateLabel(dpe.date)}${dpe.expired ? " · expiré" : ""}` : "Aucun DPE correspondant",
      icon: Gauge,
      tone: KPI_TONES.emerald,
    },
    {
      label: "Facture énergétique",
      value: dpe?.cost ? `${formatEuro(dpe.cost)}` : "—",
      hint: dpe?.conso ? `Par an · ${Math.round(dpe.conso)} kWh/m²/an` : "Estimation conventionnelle du DPE",
      icon: Flame,
      tone: KPI_TONES.amber,
    },
    {
      label: "Valeur indicative",
      value: valuation ? formatCurrency(valuation.mid) : "—",
      hint: valuation
        ? `${formatCurrency(valuation.low)} – ${formatCurrency(valuation.high)} · ${valuation.comparables} vente${valuation.comparables > 1 ? "s" : ""}`
        : "Surface ou ventes comparables manquantes",
      icon: Euro,
      tone: KPI_TONES.sky,
    },
    {
      label: "Loi Climat",
      value: <span className="text-xl">{outlook.title}</span>,
      hint: outlook.detail,
      icon: Scale,
      tone: KPI_TONES[outlook.tone],
    },
  ];

  return <KpiGrid kpis={kpis} />;
}
