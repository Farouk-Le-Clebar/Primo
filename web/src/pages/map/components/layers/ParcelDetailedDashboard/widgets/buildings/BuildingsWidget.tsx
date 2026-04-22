// BuildingsWidget.tsx
import { useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { Grid, Col } from "@tremor/react";

// COMPONENTS
import { BuildingCard } from "./BuildingCard";
import { getBuildingsByGeometry } from "../../../../../../../requests/geoserver/bdTopo";
import type { ParcelWidgetProps } from "../../types";
import { BuildingInPlot } from "./BuildingInPlot";
import { BUILDING_COLORS } from "./config";
import LoadingPrimoLogo from "../../../../../../../components/animations/LoadingPrimoLogo";

// ICONS
import { WALL_MATERIALS, ROOF_MATERIALS, getMaterialLabel } from "../../../../../../../utils/building-dictionaries";

export default function BuildingsWidget({ feature }: ParcelWidgetProps) {
  const { mutate, data, isPending } = useMutation({
    mutationFn: async ({ geometry, departement }: { geometry: any; departement: string }) => 
      await getBuildingsByGeometry(geometry, departement),
  });

  useEffect(() => {
    if (!feature?.geometry) return;
    const departement = String(feature.id).split('_')[1]?.split('.')[0] || "";
    if (!('coordinates' in feature.geometry)) return;

    mutate({ geometry: feature.geometry, departement });
  }, [feature, mutate]);

  const buildings = data?.features || [];

  const sortedBuildings = useMemo(() => {
    return [...buildings].sort((a, b) => {
      const score = (feat: any) => {
        const p = feat.properties;
        let s = 0;
        if (p.mat_murs && p.mat_murs !== '00') s += 1;
        if (p.mat_toits && p.mat_toits !== '00') s += 1;
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
          <LoadingPrimoLogo className="w-1 h-1 text-black-500" />
          <span className="text-[11px] font-medium text-[#878D96]">Récupération des données BD Topo...</span>
        </div>
      )}

      {!isPending && sortedBuildings.length === 0 && (
        <div className="py-8 text-sm text-[#878D96] text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          Aucun bâtiment détecté sur cette parcelle par l'IGN.
        </div>
      )}

      {!isPending && sortedBuildings.length > 0 && (
        <Grid numItems={1} numItemsMd={3} className="gap-6 w-full relative">
          
          <Col numColSpan={1}>
            <div className="sticky top-0 h-182 flex flex-col">
              <BuildingInPlot
                parcelFeature={feature} 
                buildings={sortedBuildings} 
                onBuildingClick={handleBuildingClick}
              />
            </div>
          </Col>

          <Col numColSpan={1} numColSpanMd={2} className="pb-10">
            <Grid numItems={1} numItemsSm={2} className="gap-4">
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
                    constructionYear={p.date_app ? new Date(p.date_app).getFullYear() : 'N/A'}
                    matMur={getMaterialLabel(p.mat_murs, WALL_MATERIALS)}
                    matToit={getMaterialLabel(p.mat_toits, ROOF_MATERIALS)}
                  />
                );
              })}
            </Grid>
          </Col>
        </Grid>
      )}
    </div>
  );
}