import { useMemo } from "react";
import { Card, Text, Metric, Flex, CategoryBar, Divider } from "@tremor/react";
import { BUILDING_COLORS } from "./config";

interface BuildingInPlotProps {
  parcelFeature: any;
  buildings: any[];
  onBuildingClick?: (index: number) => void;
}

function getBuildingArea(geometry: any): number {
  if (!geometry || !geometry.coordinates) return 0;

  let ring;
  if (geometry.type === 'Polygon') {
    ring = geometry.coordinates[0];
  } else if (geometry.type === 'MultiPolygon') {
    ring = geometry.coordinates[0][0];
  }
  if (!ring || ring.length < 3) return 0;

  const R = 6378137;
  const rad = Math.PI / 180;
  const lat0 = ring[0][1] * rad;
  const cosLat0 = Math.cos(lat0);

  let area = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const x1 = ring[i][0] * rad * R * cosLat0;
    const y1 = ring[i][1] * rad * R;
    const x2 = ring[i + 1][0] * rad * R * cosLat0;
    const y2 = ring[i + 1][1] * rad * R;
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area / 2);
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


  const stats = useMemo(() => {
    const totalBuildings = buildings.length;
    let totalArea = 0;
    let totalSHON = 0;
    const usageCounts: Record<string, number> = {};

    buildings.forEach(b => {
      const area = getBuildingArea(b.geometry);
      totalArea += area;
      const floors = b.properties.nb_etages || 1;
      totalSHON += area * floors;
      const usage = b.properties.usage1 || "Indéfini";
      usageCounts[usage] = (usageCounts[usage] || 0) + 1;
    });
    const empriseTotale = totalArea > 0 ? `${Math.round(totalArea).toLocaleString('fr-FR')} m²` : "0 m²";
    const shonTotale = totalSHON > 0 ? `${Math.round(totalSHON).toLocaleString('fr-FR')} m²` : "0 m²";
    const categories = Object.entries(usageCounts).map(([name, count]) => {
      return {
        name,
        percentage: Math.round((count / totalBuildings) * 100),
        count
      };
    }).sort((a, b) => b.percentage - a.percentage);

    return { totalBuildings, empriseTotale, shonTotale, categories };
  }, [buildings]);

  if (!geoData) return null;

  return (
    <Card className="h-full flex flex-col p-4 shadow-sm border-gray-100 ring-0">
      <div className="w-full flex-grow flex items-center justify-center relative min-h-[250px]">
        <svg 
          viewBox="0 0 200 200" 
          className="h-full w-auto drop-shadow-sm max-h-full"
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

        <div className="absolute top-0 right-0">
           <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-white/80 px-2 py-1 rounded">
             Plan Cadastral
           </span>
        </div>
      </div>

      <Divider className="my-4" />

      <div className="flex flex-col gap-4 pb-2">
        {stats.categories.length > 0 && (
          <div>
            <Flex className="mb-2">
              <Text className="text-[11px] font-medium text-slate-700">Répartition des types</Text>
            </Flex>
            <CategoryBar
              values={stats.categories.map(c => c.percentage)}
              colors={["emerald", "blue", "amber", "rose", "indigo"].slice(0, stats.categories.length) as any[]}
              className="mt-2 h-2"
              showLabels={false}
            />
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {stats.categories.map((cat, idx) => {
                const colorCode = ["emerald", "blue", "amber", "rose", "indigo"][idx % 5];
                return (
                  <div key={cat.name} className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full bg-${colorCode}-500`} />
                    <span className="text-[10px] font-medium text-slate-600 truncate max-w-[100px]">
                      {cat.name} ({cat.percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <div>
            <Text className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Bâtiments</Text>
            <Metric className="text-xl text-slate-800">{stats.totalBuildings}</Metric>
          </div>
          <div>
            <Text className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Emprise au Sol</Text>
            <Metric className="text-xl text-slate-800">{stats.empriseTotale}</Metric>
          </div>
        </div>
      </div>
    </Card>
  );
}