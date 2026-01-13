import { useMemo } from "react";

const projectMercator = ([lon, lat]: number[]) => {
  const latRad = (lat * Math.PI) / 180;
  
  const y = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  
  const x = (lon * Math.PI) / 180;

  return [x, y];
};

const generateOptimizedGeometry = (feature: any) => {
  if (!feature?.geometry) return null;

  const geometry = feature.geometry;
  const polygons = geometry.type === "MultiPolygon" ? geometry.coordinates : [geometry.coordinates];

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  let pathCommands: string[] = [];

  polygons.forEach((polygon: any[][]) => {
    polygon.forEach((ring: number[][]) => {
      const projectedPoints = ring.map((coord) => {
        const [x, y] = projectMercator(coord);

        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;

        return [x, y];
      });

      const d = projectedPoints.map(([x, y], i) => 
        `${i === 0 ? "M" : "L"} ${x},${y}` 
      ).join(" ") + " Z";

      pathCommands.push(d);
    });
  });

  const width = maxX - minX;
  const height = maxY - minY;

  if (width === 0 || height === 0) return null;

  const paddingX = width * 0.1;
  const paddingY = height * 0.1;
  
  return {
    d: pathCommands.join(" "),
    viewBox: `${minX - paddingX} ${minY - paddingY} ${width + paddingX * 2} ${height + paddingY * 2}`,
    isValid: true
  };
};

export function BuildingThumbnail({ feature }: { feature: any }) {
  const geoData = useMemo(() => generateOptimizedGeometry(feature), [feature]);

  if (!geoData?.isValid) {
    return (
      <div className="w-full h-full bg-gray-50 flex items-center justify-center rounded-lg border border-gray-100">
         <span className="text-[10px] text-gray-300">N/A</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#f8f9fa] relative flex items-center justify-center overflow-hidden isolate">
       <div 
        className="absolute inset-0 opacity-[0.07]" 
        style={{ 
            backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', 
            backgroundSize: '8px 8px' 
        }} 
      />

      <svg 
        viewBox={geoData.viewBox} 
        className="w-full h-full"
        transform="scale(1, -1)" 
        preserveAspectRatio="xMidYMid meet"
      >
        <path 
          d={geoData.d} 
          className="fill-blue-500 stroke-blue-600"
          strokeWidth="0"
          fillRule="evenodd"
          vectorEffect="non-scaling-stroke"
        />
        <path 
           d={geoData.d}
           className="fill-none stroke-blue-700/80"
           strokeWidth="1.5%"
           vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}