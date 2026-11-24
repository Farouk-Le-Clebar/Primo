import { useQuery } from "@tanstack/react-query";

import { getAverageMeteoForParcel } from "../../../../../../../requests/geoserver/worldClim";
import ParcelAnalysisLayout from "../../ParcelAnalysisLayout";
import type { ParcelWidgetProps } from "../../types";
import { parcelDepartment } from "../buildings/useParcelBuildings";
import { SourceNote, WidgetEmpty, WidgetLoading } from "../shared/WidgetStatus";
import MeteoDetails from "./MeteoDetails";
import MeteoKpis from "./MeteoKpis";

export default function MeteoWidget({ feature }: ParcelWidgetProps) {
  const departement = parcelDepartment(feature);
  const geometry = feature?.geometry;
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["meteo", String(feature?.id), departement],
    queryFn: () => getAverageMeteoForParcel(geometry, departement),
    enabled: !!geometry && !!departement,
    staleTime: 300000,
    retry: false,
  });

  if (isLoading) return <WidgetLoading label="Chargement des données climatiques…" />;

  if (isError || !data)
    return (
      <WidgetEmpty
        message={isError ? "Les données climatiques sont momentanément indisponibles." : "Aucune donnée climatique pour ce secteur."}
        onRetry={isError ? () => void refetch() : undefined}
      />
    );

  return (
    <div className="flex w-full flex-col gap-4 font-inter lg:gap-6">
      <MeteoKpis data={data} />
      <ParcelAnalysisLayout summary={<MeteoDetails data={data} kind="temperature" />}>
        <MeteoDetails data={data} kind="precipitation" />
        <SourceNote>
          Source : WorldClim, normales climatiques 1970-2000 moyennées sur les mailles autour de la parcelle.
        </SourceNote>
      </ParcelAnalysisLayout>
    </div>
  );
}
