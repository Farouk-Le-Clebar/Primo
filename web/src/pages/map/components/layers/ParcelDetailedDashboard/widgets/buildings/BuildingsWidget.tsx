import ParcelAnalysisLayout from "../../ParcelAnalysisLayout";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Grid } from "@tremor/react";

// COMPONENTS
import { BuildingCard } from "./BuildingCard";
import { getBuildingsByGeometry } from "../../../../../../../requests/geoserver/bdTopo";
import type { ParcelWidgetProps } from "../../types";
import { BuildingInPlot } from "./BuildingInPlot";
import { BUILDING_COLORS } from "./config";
import LoadingPrimoLogo from "../../../../../../../components/animations/LoadingPrimoLogo";

// ICONS
import {
  WALL_MATERIALS,
  ROOF_MATERIALS,
  getMaterialLabel,
} from "../../../../../../../utils/building-dictionaries";

export default function BuildingsWidget({ feature }: ParcelWidgetProps) {
  const insee = String(feature?.properties?.commune || "");
  const departement = insee
    ? insee.slice(0, insee.startsWith("97") ? 3 : 2)
    : String(feature?.id).split("_")[1]?.split(".")[0] || "";
  const {
    data,
    isLoading: isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["buildings-summary", feature?.properties?.id],
    queryFn: () => getBuildingsByGeometry(feature?.geometry, departement),
    enabled: !!feature?.geometry && !!departement,
    staleTime: 300000,
    retry: false,
  });

  const buildings = data?.features || [];

  const sortedBuildings = useMemo(() => {
    return [...buildings].sort((a, b) => {
      const score = (feat: any) => {
        const p = feat.properties;
        let s = 0;
        if (p.mat_murs && p.mat_murs !== "00") s += 1;
        if (p.mat_toits && p.mat_toits !== "00") s += 1;
        if (p.date_app) s += 2;
        if (p.usage1) s += 1;
        if (p.hauteur) s += 1;
        if (p.nb_etages) s += 1;
        return s;
      };
      return score(b) - score(a);
    });
  }, [buildings]);

  const handleBuildingClick = (index: number) => {
    const element = document.getElementById(`building-card-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="font-inter w-full">
      {isPending && (
        <div className="flex items-center gap-2 mb-4">
          <LoadingPrimoLogo className="w-6 h-6 text-black-500" />
          <span className="text-[11px] font-medium text-[#878D96] dark:text-gray-400">
            Récupération des données BD Topo...
          </span>
        </div>
      )}

      {!isPending && sortedBuildings.length === 0 && (
        <div className="py-8 text-sm text-[#878D96] dark:text-gray-400 text-center bg-gray-50 dark:bg-[#171717] rounded-xl border border-dashed border-gray-200 dark:border-[#232323]">
          {isError
            ? "Les données bâtiments sont momentanément indisponibles."
            : "Aucun bâtiment référencé sur cette parcelle par l’IGN."}
          {isError && (
            <button
              onClick={() => void refetch()}
              className="mt-3 block w-full font-medium text-emerald-700 underline dark:text-emerald-400"
            >
              Réessayer
            </button>
          )}
        </div>
      )}

      {!isPending && sortedBuildings.length > 0 && (
        <ParcelAnalysisLayout
          summary={
            <BuildingInPlot
              parcelFeature={feature}
              buildings={sortedBuildings}
              onBuildingClick={handleBuildingClick}
            />
          }
        >
          <Grid numItems={1} numItemsSm={2} className="gap-4 items-start">
            {sortedBuildings.map((building: any, i: number) => {
              const p = building.properties;
              const colorClasses = BUILDING_COLORS[i % BUILDING_COLORS.length];
              return (
                <BuildingCard
                  key={p.id || i}
                  id={`building-card-${i}`}
                  building={building}
                  colorClasses={colorClasses}
                  p={p}
                  constructionYear={
                    p.date_app ? new Date(p.date_app).getFullYear() : "N/A"
                  }
                  matMur={getMaterialLabel(p.mat_murs, WALL_MATERIALS)}
                  matToit={getMaterialLabel(p.mat_toits, ROOF_MATERIALS)}
                />
              );
            })}
          </Grid>
        </ParcelAnalysisLayout>
      )}
    </div>
  );
}
