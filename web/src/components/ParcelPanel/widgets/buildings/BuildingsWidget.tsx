import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Building2 } from "lucide-react";

// COMPONENTS
import { Widget } from "../Widget";
import { BuildingCard } from "./BuildingCard";
import { getBuildingsByBbox } from "../../../../requests/parcel-info";
import { WALL_MATERIALS, ROOF_MATERIALS, getMaterialLabel } from "../../../../utils/building-dictionaries";
import type { ParcelWidgetProps } from "../../types";

export default function BuildingsWidget({ feature }: ParcelWidgetProps) {
  const { mutate, data, isPending } = useMutation({
    mutationFn: async ({ bbox, departement }: { bbox: string; departement: string }) => 
      await getBuildingsByBbox(bbox, departement),
  });

  useEffect(() => {
    if (!feature?.geometry) return;


    const departement = String(feature.id).split('_')[1]?.split('.')[0] || "";

    console.log("departement : ", departement);
    
    if (!('coordinates' in feature.geometry)) {
      console.warn("La géométrie n'a pas de coordonnées (GeometryCollection)");
      return;
    }

    // 2. Maintenant TypeScript sait que 'coordinates' existe !
    // On force le type car 'flat' sur des tableaux multi-dimensionnels GeoJSON peut être complexe
    const allCoords = (feature.geometry.coordinates as any).flat(2);

    let minLng = Infinity;
    let minLat = Infinity;
    let maxLng = -Infinity;
    let maxLat = -Infinity;

    allCoords.forEach(([lng, lat]: [number, number]) => {
      if (lng < minLng) minLng = lng;
      if (lat < minLat) minLat = lat;
      if (lng > maxLng) maxLng = lng;
      if (lat > maxLat) maxLat = lat;
    });

    const bbox = `${minLng},${minLat},${maxLng},${maxLat}`;

    if (minLng !== Infinity) {
      mutate({ bbox, departement });
    }
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