import { useMemo } from "react";

import { toSvgPaths } from "./geometry";
import type { BuildingColor, BuildingFeature } from "./types";

type BuildingThumbnailProps = {
  feature: BuildingFeature;
  color: BuildingColor;
};

const FRAME = { width: 100, height: 100, padding: 18 };

export function BuildingThumbnail({ feature, color }: BuildingThumbnailProps) {
  const path = useMemo(
    () => toSvgPaths([feature.geometry], FRAME)?.[0] ?? null,
    [feature],
  );

  if (!path)
    return (
      <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
        —
      </div>
    );

  return (
    <div className={`flex h-full w-full items-center justify-center ${color.bg}`}>
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
        <path
          d={path}
          className={`${color.fill} ${color.stroke}`}
          strokeWidth="2.5"
          strokeLinejoin="round"
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
}
