import { useQuery } from "@tanstack/react-query";

import { getConnectivite } from "../../../../../../../requests/environnement/information";
import ParcelAnalysisLayout from "../../ParcelAnalysisLayout";
import type { ParcelWidgetProps } from "../../types";
import { useParcelPoint } from "../shared/useParcelPoint";
import { SourceNote, WidgetEmpty, WidgetLoading } from "../shared/WidgetStatus";
import ConnexionKpis from "./ConnexionKpis";
import FixedCoverageCard from "./FixedCoverageCard";
import OperatorsCard from "./OperatorsCard";

export default function ConnexionWidget({ feature }: ParcelWidgetProps) {
  const point = useParcelPoint(feature);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["connectivite", point],
    queryFn: () => getConnectivite(point!),
    enabled: !!point,
    staleTime: 300000,
    retry: false,
  });

  if (isLoading) return <WidgetLoading label="Analyse de la couverture réseau…" />;

  if (!point || isError || !data || (!data.mobile && !data.fixe))
    return (
      <WidgetEmpty
        message={!point ? "La position de cette parcelle est indisponible." : "Les données de couverture sont momentanément indisponibles."}
        onRetry={point ? () => void refetch() : undefined}
      />
    );

  return (
    <div className="flex w-full flex-col gap-4 font-inter lg:gap-6">
      <ConnexionKpis data={data} />
      <ParcelAnalysisLayout summary={<OperatorsCard mobile={data.mobile} />}>
        {data.fixe ? (
          <FixedCoverageCard fixe={data.fixe} />
        ) : (
          <WidgetEmpty message="L’éligibilité internet de la commune est momentanément indisponible." onRetry={() => void refetch()} />
        )}
        <SourceNote>
          Sources : ANFR (antennes 4G et 5G en service) et Arcep, Ma connexion internet (éligibilité fixe par commune).
          La Wi-Fi dépend de l’abonnement internet fixe du logement.
        </SourceNote>
      </ParcelAnalysisLayout>
    </div>
  );
}
