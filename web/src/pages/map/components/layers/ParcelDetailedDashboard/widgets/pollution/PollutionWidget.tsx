import { useQuery } from "@tanstack/react-query";

import { getPollution } from "../../../../../../../requests/environnement/information";
import ParcelAnalysisLayout from "../../ParcelAnalysisLayout";
import type { ParcelWidgetProps } from "../../types";
import { useParcelPoint } from "../shared/useParcelPoint";
import { SourceNote, WidgetEmpty, WidgetLoading } from "../shared/WidgetStatus";
import AirQualityCard from "./AirQualityCard";
import PollutionKpis from "./PollutionKpis";
import PollutionList from "./PollutionList";
import { installationRow, siteRow } from "./pollutionFormat";

export default function PollutionWidget({ feature }: ParcelWidgetProps) {
  const point = useParcelPoint(feature);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["pollution", point],
    queryFn: () => getPollution(point!),
    enabled: !!point,
    staleTime: 300000,
    retry: false,
  });
  const sols = data?.sols;

  if (isLoading) return <WidgetLoading label="Recherche des sources de pollution…" />;

  if (!point || isError || !data || (!sols && !data.air))
    return (
      <WidgetEmpty
        message={!point ? "La position de cette parcelle est indisponible." : "Les données de pollution sont momentanément indisponibles."}
        onRetry={point ? () => void refetch() : undefined}
      />
    );

  return (
    <div className="flex w-full flex-col gap-4 font-inter lg:gap-6">
      <PollutionKpis data={data} />
      <ParcelAnalysisLayout summary={<AirQualityCard air={data.air} />}>
        {sols && (
          <>
            <PollutionList
              title="Sols pollués"
              subtitle="Secteurs d'information sur les sols et sites en cours de suivi"
              aside={`${sols.rayonSitesMetres} m`}
              rows={[...sols.sis, ...sols.instructions, ...sols.servitudes].map(siteRow)}
              emptyText="Aucun site pollué référencé à proximité."
            />
            <PollutionList
              title="Anciens sites industriels"
              subtitle={`Les ${sols.anciensSites.length} plus proches sur ${sols.anciensSitesTotal}`}
              aside={`${sols.rayonSitesMetres} m`}
              rows={sols.anciensSites.map(siteRow)}
              emptyText="Aucune ancienne activité industrielle recensée à proximité."
            />
            <PollutionList
              title="Installations classées"
              subtitle={`Les ${sols.installations.length} plus proches sur ${sols.installationsTotal}`}
              aside={`${sols.rayonInstallationsMetres / 1000} km`}
              rows={sols.installations.map(installationRow)}
              emptyText="Aucune installation classée à proximité."
            />
          </>
        )}
        <SourceNote>
          Sources : Géorisques (SIS, CASIAS, installations classées) et Copernicus via Open-Meteo pour la qualité de l’air.
          Un ancien site industriel signale une activité passée, pas une pollution avérée.
        </SourceNote>
      </ParcelAnalysisLayout>
    </div>
  );
}
