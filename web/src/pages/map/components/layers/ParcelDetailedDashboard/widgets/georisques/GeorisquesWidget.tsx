import { useQuery } from "@tanstack/react-query";

import { getGeorisquesByInsee } from "../../../../../../../requests/georisques/information";
import ParcelAnalysisLayout from "../../ParcelAnalysisLayout";
import type { ParcelWidgetProps } from "../../types";
import { parcelDepartment } from "../buildings/useParcelBuildings";
import { SourceNote, WidgetEmpty, WidgetLoading } from "../shared/WidgetStatus";
import { prepareGeorisques } from "./data";
import GeorisquesCatnat from "./GeorisquesCatnat";
import GeorisquesKpis from "./GeorisquesKpis";
import GeorisquesRisks from "./GeorisquesRisks";
import GeorisquesSummary from "./GeorisquesSummary";

export default function GeorisquesWidget({ feature }: ParcelWidgetProps) {
  const insee = String(feature?.properties?.commune || "");
  const validInsee = /^[0-9AB]{5}$/.test(insee);
  const departement = parcelDepartment(feature);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["georisques-summary", insee, departement],
    queryFn: () => getGeorisquesByInsee(insee, departement),
    enabled: validInsee && !!departement,
    staleTime: 300000,
    retry: false,
  });
  const properties = data?.features?.[0]?.properties;
  const prepared = properties ? prepareGeorisques(properties) : null;

  if (isLoading) return <WidgetLoading label="Récupération des données Géorisques…" />;

  if (!validInsee || isError || !prepared)
    return (
      <WidgetEmpty
        message={
          !validInsee
            ? "Le code commune de cette parcelle est indisponible."
            : isError
              ? "Les données Géorisques sont momentanément indisponibles."
              : "Aucune donnée Géorisques disponible pour cette commune."
        }
        onRetry={isError ? () => void refetch() : undefined}
      />
    );

  return (
    <div className="flex w-full flex-col gap-4 font-inter lg:gap-6">
      <GeorisquesKpis data={prepared} />
      <ParcelAnalysisLayout
        summary={
          <div className="primo-stagger flex flex-col gap-4">
            <GeorisquesSummary data={prepared} />
          </div>
        }
      >
        <GeorisquesRisks data={prepared} />
        <GeorisquesCatnat key={insee} events={prepared.catnat} />
        <SourceNote>
          Sources : Géorisques · base GASPAR et arrêtés CatNat. Données communales, sans analyse de
          l’exposition propre à la parcelle.
        </SourceNote>
      </ParcelAnalysisLayout>
    </div>
  );
}
