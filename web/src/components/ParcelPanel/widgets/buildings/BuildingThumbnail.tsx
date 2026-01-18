import { useMemo } from "react";

export function BuildingThumbnail({ feature }: { feature: any }) {
  const geoData = useMemo(() => {
    if (!feature?.geometry) return null;

    const { type, coordinates } = feature.geometry;
    const polygons = type === "MultiPolygon" ? coordinates : [coordinates];
    
    const allPoints = coordinates.flat(type === "MultiPolygon" ? 2 : 1);
    let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;

    allPoints.forEach(([lng, lat]: [number, number]) => {
      if (lng < minLng) minLng = lng;
      if (lat < minLat) minLat = lat;
      if (lng > maxLng) maxLng = lng;
      if (lat > maxLat) maxLat = lat;
    });

    const diffLng = maxLng - minLng;
    const diffLat = maxLat - minLat;
    const maxDiff = Math.max(diffLng, diffLat);

    if (maxDiff === 0) return null;

    const size = 100;
    const padding = 15;
    const innerSize = size - padding * 2;

    const pathCommands = polygons.map((polygon: any) => {
      return polygon.map((ring: any[]) => {
        const points = ring.map(([lng, lat]) => {
          const x = padding + ((lng - minLng) / maxDiff) * innerSize + (innerSize - (diffLng / maxDiff) * innerSize) / 2;
          const y = (size - padding) - ((lat - minLat) / maxDiff) * innerSize - (innerSize - (diffLat / maxDiff) * innerSize) / 2;
          return `${x.toFixed(2)},${y.toFixed(2)}`;
        });
        return `M ${points.join(" L ")} Z`;
      }).join(" ");
    }).join(" ");

    return { d: pathCommands };
  }, [feature]);

  if (!geoData) {
    return (
      <div className="w-full h-full bg-gray-50 flex items-center justify-center rounded-lg border border-gray-100">
        <span className="text-[10px] text-gray-300 font-medium">N/A</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#fcfdfd] relative flex items-center justify-center overflow-hidden rounded-lg border border-gray-100 shadow-inner group transition-colors hover:bg-white">
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', 
          backgroundSize: '10px 10px' 
        }} 
      />

      <svg 
        viewBox="0 0 100 100" 
        className="w-[85%] h-[85%] drop-shadow-sm transition-transform group-hover:scale-110 duration-500"
        preserveAspectRatio="xMidYMid meet"
      >
        <path 
          d={geoData.d} 
          className="fill-black/5 translate-y-[1.5] translate-x-[0.5]"
        />
        <path 
          d={geoData.d} 
          className="fill-green-500/10 stroke-green-600"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
}