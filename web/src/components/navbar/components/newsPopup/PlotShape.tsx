import type { Geometry, Position } from "geojson";

type PlotShapeProps = { geometry: Geometry | string | null | undefined };

const WIDTH = 34;
const HEIGHT = 28;
const PADDING = 3;

function outerRing(geometry: Geometry | string | null | undefined): Position[] {
  const parsed: Geometry | null = typeof geometry === "string" ? JSON.parse(geometry) : geometry ?? null;
  if (parsed?.type === "Polygon") return parsed.coordinates[0] ?? [];
  if (parsed?.type === "MultiPolygon") return parsed.coordinates[0]?.[0] ?? [];
  return [];
}

function toPath(ring: Position[]): string | null {
  if (ring.length < 3) return null;
  const xs = ring.map(([x]) => x);
  const ys = ring.map(([, y]) => y);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const scale = Math.min((WIDTH - PADDING * 2) / (maxX - minX || 1), (HEIGHT - PADDING * 2) / (maxY - minY || 1));
  const offsetX = (WIDTH - (maxX - minX) * scale) / 2;
  const offsetY = (HEIGHT - (maxY - minY) * scale) / 2;
  return ring
    .map(([x, y], index) => `${index ? "L" : "M"}${(offsetX + (x - minX) * scale).toFixed(1)} ${(offsetY + (maxY - y) * scale).toFixed(1)}`)
    .join(" ")
    .concat(" Z");
}

export default function PlotShape({ geometry }: PlotShapeProps) {
  let path: string | null = null;
  try {
    path = toPath(outerRing(geometry));
  } catch {
    path = null;
  }

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="shrink-0" aria-hidden="true">
      {path ? (
        <path d={path} className="fill-violet-500/25 stroke-violet-500" strokeWidth={1.25} strokeLinejoin="round" />
      ) : (
        <rect x={7} y={5} width={20} height={18} rx={2} className="fill-violet-500/25 stroke-violet-500" strokeWidth={1.25} />
      )}
    </svg>
  );
}
