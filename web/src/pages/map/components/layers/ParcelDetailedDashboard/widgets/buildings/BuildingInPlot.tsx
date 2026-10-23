import { useMemo } from "react";
import { Card } from "@tremor/react";
import type { Feature } from "geojson";

import { buildingColor } from "./config";
import { toSvgPaths } from "./geometry";
import type { BuildingFeature } from "./types";

type BuildingInPlotProps = {
  parcelFeature: Feature;
  buildings: BuildingFeature[];
  activeIndex: number | null;
  onHover: (index: number | null) => void;
  onSelect: (index: number) => void;
};

const FRAME = { width: 320, height: 220, padding: 24 };

export function BuildingInPlot({
  parcelFeature,
  buildings,
  activeIndex,
  onHover,
  onSelect,
}: BuildingInPlotProps) {
  const paths = useMemo(
    () =>
      toSvgPaths(
        [parcelFeature.geometry, ...buildings.map((b) => b.geometry)],
        FRAME,
      ),
    [parcelFeature, buildings],
  );

  if (!paths) return null;
  const [parcelPath, ...buildingPaths] = paths;

  return (
    <Card className="overflow-hidden rounded-xl border-gray-200 p-0 shadow-sm ring-0 dark:border-white/10 dark:bg-[#171717]">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-white/5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Implantation
        </h3>
        <span className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
          Plan cadastral
        </span>
      </div>
      <div className="bg-[radial-gradient(circle,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:14px_14px] p-2 dark:bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)]">
        <svg
          viewBox={`0 0 ${FRAME.width} ${FRAME.height}`}
          className="h-56 w-full"
          role="img"
          aria-label="Bâtiments sur le plan de la parcelle"
        >
          <path
            d={parcelPath}
            className="fill-emerald-500/5 stroke-emerald-600/60 dark:stroke-emerald-400/50"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            fillRule="evenodd"
          />
          {buildingPaths.map((path, index) => (
            <path
              key={index}
              d={path}
              tabIndex={0}
              aria-label={`Bâtiment ${index + 1}`}
              onMouseEnter={() => onHover(index)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(index)}
              onBlur={() => onHover(null)}
              onClick={() => onSelect(index)}
              className={`${buildingColor(index).fill} ${buildingColor(index).stroke} cursor-pointer outline-none transition-opacity duration-200 ${activeIndex !== null && activeIndex !== index ? "opacity-30" : "opacity-90"}`}
              strokeWidth="1.5"
              strokeLinejoin="round"
              fillRule="evenodd"
            />
          ))}
        </svg>
      </div>
      <p className="border-t border-gray-100 px-4 py-2.5 text-[11px] leading-relaxed text-gray-500 dark:border-white/5 dark:text-gray-400">
        Survolez un bâtiment pour le retrouver dans la liste. Les bâtiments
        débordant de la parcelle sont représentés en entier.
      </p>
    </Card>
  );
}
