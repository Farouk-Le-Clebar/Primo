import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Building2 } from "lucide-react";

// COMPONENTS
import { WidgetSection } from "../WidgetSection.tsx";
import { BuildingCard } from "./BuildingCard";
import { getBuildingsByGeometry } from "../../../../../../../requests/geoserver/bdTopo";
import { WALL_MATERIALS, ROOF_MATERIALS, getMaterialLabel } from "../../../../../../../utils/building-dictionaries";
import type { ParcelWidgetProps } from "../../types";

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

    console.log("Feature", feature);

    mutate({ 
      geometry: feature.geometry, 
      departement 
    });
  }, [feature, mutate]);

  const buildings = data?.features || [];
  const badgeText = isPending ? "Chargement..." : 
                    buildings.length === 0 ? "Aucune donnée" : 
                    `${buildings.length} détection${buildings.length > 1 ? 's' : ''}`;

  return (
    <WidgetSection 
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
    </WidgetSection>
  );
}
