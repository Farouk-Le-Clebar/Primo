import { useQuery } from "@tanstack/react-query";
import type { Feature } from "geojson";

import { getBuildingsByGeometry } from "../../../../../../../requests/geoserver/bdTopo";
import type { BuildingFeature } from "./types";

type BuildingCollection = { features?: BuildingFeature[] };

type ParcelBuildings = {
  buildings: BuildingFeature[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};

const EMPTY: BuildingFeature[] = [];

export const parcelDepartment = (feature: Feature | undefined): string => {
  const insee = String(feature?.properties?.commune || "");
  return insee
    ? insee.slice(0, insee.startsWith("97") ? 3 : 2)
    : String(feature?.id).split("_")[1]?.split(".")[0] || "";
};

export function useParcelBuildings(feature: Feature | undefined): ParcelBuildings {
  const department = parcelDepartment(feature);
  const query = useQuery<BuildingCollection>({
    queryKey: ["buildings-summary", feature?.properties?.id],
    queryFn: () => getBuildingsByGeometry(feature?.geometry, department),
    enabled: !!feature?.geometry && !!department,
    staleTime: 300000,
    retry: false,
  });

  return {
    buildings: query.data?.features ?? EMPTY,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: () => void query.refetch(),
  };
}
