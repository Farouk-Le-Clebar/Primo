import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

// COMPONENTS
import { BuildingCard } from "./BuildingCard";
import { getBuildingsByGeometry } from "../../../../../../../requests/geoserver/bdTopo";
import type { ParcelWidgetProps } from "../../types";

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

    if (!('coordinates' in feature.geometry)) {
      return;
    }

    mutate({ 
      geometry: feature.geometry, 
      departement 
    });
  }, [feature, mutate]);

  const buildings = data?.features || [];
  const sortedBuildings = [...buildings].sort((a, b) => {
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

  return (
    <div className="font-inter">
      {isPending && (
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-[11px] font-medium text-[#878D96]">Récupération des données BD Topo...</span>
        </div>
      )}

      <div className="w-full">
        {!isPending && buildings.length === 0 && (
          <div className="py-8 text-sm text-[#878D96] text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
             Aucun bâtiment détecté sur cette parcelle par l'IGN.
          </div>
        )}

        <div className="flex flex-col gap-12">
          {sortedBuildings.map((building: any, i: number) => {
            const p = building.properties;
            return (
              <BuildingCard 
                key={p.id || i}
                building={building}
                p={p}
                constructionYear={p.date_app ? new Date(p.date_app).getFullYear() : 'N/A'}
                matMur={getMaterialLabel(p.mat_murs, WALL_MATERIALS)}
                matToit={getMaterialLabel(p.mat_toits, ROOF_MATERIALS)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}