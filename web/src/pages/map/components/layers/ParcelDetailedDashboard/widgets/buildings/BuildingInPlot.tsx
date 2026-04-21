import { useMemo } from "react";
import { BUILDING_COLORS } from "./config";

interface BuildingInPlotProps {
  parcelFeature: any;
  buildings: any[];
  onBuildingClick?: (index: number) => void;
}

export function BuildingInPlot({ parcelFeature, buildings, onBuildingClick }: BuildingInPlotProps) {
  const geoData = useMemo(() => {
    if (!parcelFeature?.geometry) return null;

    const parcelGeom = parcelFeature.geometry;
    const parcelCoords = parcelGeom.type === "MultiPolygon" 
      ? parcelGeom.coordinates.flat(2) 
      : parcelGeom.coordinates.flat(1);

    let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;

    parcelCoords.forEach(([lng, lat]: [number, number]) => {
      if (lng < minLng) minLng = lng;
      if (lat < minLat) minLat = lat;
      if (lng > maxLng) maxLng = lng;
      if (lat > maxLat) maxLat = lat;
    });

    const diffLng = maxLng - minLng;
    const diffLat = maxLat - minLat;
    const maxDiff = Math.max(diffLng, diffLat);

    if (maxDiff === 0) return null;

    const size = 200; 
    const padding = 15;
    const innerSize = size - padding * 2;

    const project = (lng: number, lat: number) => {
      const x = padding + ((lng - minLng) / maxDiff) * innerSize + (innerSize - (diffLng / maxDiff) * innerSize) / 2;
      const y = (size - padding) - ((lat - minLat) / maxDiff) * innerSize - (innerSize - (diffLat / maxDiff) * innerSize) / 2;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    };

    const generatePath = (geom: any) => {
      const polygons = geom.type === "MultiPolygon" ? geom.coordinates : [geom.coordinates];
      return polygons.map((polygon: any) => {
        return polygon.map((ring: any[]) => {
          const points = ring.map(([lng, lat]) => project(lng, lat));
          return `M ${points.join(" L ")} Z`;
        }).join(" ");
      }).join(" ");
    };

    const parcelPath = generatePath(parcelGeom);
    const buildingsPaths = buildings.map(b => generatePath(b.geometry));

    return { parcelPath, buildingsPaths };
  }, [parcelFeature, buildings]);

  if (!geoData) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 w-full">
      <div className="w-full h-60 flex items-center justify-center relative">
        <svg 
          viewBox="0 0 200 200" 
          className="h-full w-auto drop-shadow-sm"
          preserveAspectRatio="xMidYMid meet"
        >
          <path 
            d={geoData.parcelPath} 
            className="fill-gray-50/50 stroke-gray-300"
            strokeWidth="1"
            strokeDasharray="3 2"
            fillRule="evenodd"
          />
          
          {geoData.buildingsPaths.map((path, idx) => {
            const color = BUILDING_COLORS[idx % BUILDING_COLORS.length];
            return (
              <path 
                key={idx}
                d={path} 
                onClick={() => onBuildingClick?.(idx)}
                className={`${color.fill} ${color.stroke} cursor-pointer hover:opacity-60 transition-opacity`}
                strokeWidth="2"
                strokeLinejoin="round"
                fillRule="evenodd"
              />
            );
          })}
        </svg>

        <div className="absolute bottom-0 right-0">
           <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
             Emprise Sol
           </span>
        </div>
      </div>
    </div>
  );
}