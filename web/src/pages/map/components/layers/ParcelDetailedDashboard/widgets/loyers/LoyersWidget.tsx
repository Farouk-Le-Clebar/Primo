import { useMemo } from "react";
import type { Feature } from "geojson";

import ParcelAnalysisLayout from "../../ParcelAnalysisLayout";
import { useLoyers } from "../habitat/useHabitat";
import type { LogementTarget } from "../logement/types";
import { SourceNote, WidgetEmpty, WidgetLoading } from "../shared/WidgetStatus";
import { grossYield, marketRentFor, marketRents } from "./data";
import EncadrementGrid from "./EncadrementGrid";
import LoyersKpis from "./LoyersKpis";
import LoyerSimulator from "./LoyerSimulator";
import MarketRents from "./MarketRents";
import { useParcelPriceM2 } from "./useParcelPriceM2";

type LoyersWidgetProps = { feature: Feature; target?: LogementTarget };

export default function LoyersWidget({ feature, target }: LoyersWidgetProps) {
  const { data, isLoading, isError, refetch } = useLoyers(feature);
  const priceM2 = useParcelPriceM2(feature, "appartement");
  const rents = useMemo(() => marketRents(data?.commune ?? []), [data]);
  const encadrement = data?.encadrement ?? [];
  const zone = encadrement[0] ?? null;

  if (isLoading) return <WidgetLoading label="Récupération des loyers de la commune…" />;
  if (isError || !rents.length)
    return (
      <WidgetEmpty
        message={isError ? "Les données de loyers sont momentanément indisponibles." : "Aucun indicateur de loyer publié pour cette commune."}
        onRetry={isError ? () => void refetch() : undefined}
      />
    );

  return (
    <div className="flex w-full flex-col gap-4 font-inter lg:gap-6">
      <LoyersKpis
        rents={rents}
        territoire={zone?.territoire ?? null}
        periode={zone?.periode ?? null}
        priceM2={priceM2}
        yieldRate={grossYield(marketRentFor(rents, "appartement")?.m2 ?? null, priceM2)}
      />
      <ParcelAnalysisLayout summary={<LoyerSimulator rents={rents} encadrement={encadrement} target={target} />}>
        <MarketRents rents={rents} />
        {zone && <EncadrementGrid rows={encadrement} />}
        <SourceNote>
          Sources : « Carte des loyers » ANIL / ministère du Logement (annonces leboncoin et SeLoger, loyers charges
          comprises, bien non meublé) et arrêtés préfectoraux d’encadrement (Ville de Paris, Métropole de Lyon). Le
          rendement brut rapporte le loyer annuel de marché au prix médian au m² des ventes d’appartements de la parcelle.
        </SourceNote>
      </ParcelAnalysisLayout>
    </div>
  );
}
