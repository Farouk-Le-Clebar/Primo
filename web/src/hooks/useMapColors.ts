import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DEFAULT_MAP_COLORS } from "../constants/mapColorPresets";
import { getMapColors } from "../requests/mapColors";
import { toShapeStyles } from "../utils/mapColors";
import type { ShapeStyles } from "../utils/mapColors";
import { useResolvedTheme } from "./useResolvedTheme";

export const MAP_COLORS_QUERY_KEY = ["map-colors"];

export function useMapColors() {
  const query = useQuery({
    queryKey: MAP_COLORS_QUERY_KEY,
    queryFn: getMapColors,
    enabled: !!localStorage.getItem("token"),
  });

  return {
    colors: query.data ?? DEFAULT_MAP_COLORS,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useMapShapeStyles(): ShapeStyles {
  const { colors } = useMapColors();
  const mode = useResolvedTheme();
  return useMemo(() => toShapeStyles(colors[mode]), [colors, mode]);
}
