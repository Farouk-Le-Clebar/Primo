import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Building2 } from "lucide-react";
import { Widget } from "../Widget";
import { BuildingCard } from "./BuildingCard";
import { getBuildingsByBbox } from "../../../../requests/parcel-info";
import { WALL_MATERIALS, ROOF_MATERIALS, getMaterialLabel } from "../../../../utils/building-dictionaries";
import type { ParcelWidgetProps } from "../../types";

export default function BuildingsWidget({ feature }: ParcelWidgetProps) {
  const { mutate, data, isPending, error } = useMutation({
    mutationFn: async ({ bbox, departement }: { bbox: string; departement: string }) => 
      await getBuildingsByBbox(bbox, departement),
  });

  useEffect(() => {
    if (!feature?.geometry) return;
    const departement = feature.properties?.code_dep || '75';
    const bbox = Array.isArray(feature.bbox) ? feature.bbox.join(',') : feature.bbox || '';
    mutate({ bbox, departement });
  }, [feature, mutate]);

  const buildings = data?.features || [];
  const badgeText = isPending ? "Chargement..." : 
                    buildings.length === 0 ? "Aucune donnée" : 
                    `${buildings.length} détection${buildings.length > 1 ? 's' : ''}`;

  return (
    <Widget 
      title="Bâtiments" 
      icon={Building2} 
      loading={isPending} 
      badge={badgeText}
    >
      {buildings.map((building: any, i: number) => {
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
    </Widget>
  );
}