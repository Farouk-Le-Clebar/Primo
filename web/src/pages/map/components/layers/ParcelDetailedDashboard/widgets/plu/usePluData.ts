import { useQuery } from "@tanstack/react-query";
import type { Feature } from "geojson";

import { getInformationsLin, getInformationsPct, getInformationsSurf } from "../../../../../../../requests/geoserver/information";
import { getPrescriptionsLin, getPrescriptionsPct, getPrescriptionsSurf } from "../../../../../../../requests/geoserver/prescription";
import { getZonesUrbaByGeometry } from "../../../../../../../requests/geoserver/urbanAreas";
import { parcelDepartment } from "../buildings/useParcelBuildings";
import type { GpuFeature, GpuKind, PluRule, RuleStyle } from "./types";
import { getInformationDescription, getInformationStyle } from "./utilsInformations";
import { getPrescriptionDescription, getPrescriptionStyle } from "./utilsPrescriptions";

type Fetcher = (geometry: Feature["geometry"], department: string) => Promise<GpuFeature[]>;
type RuleSource = { fetchers: [Fetcher, Fetcher, Fetcher]; typeField: string; fallback: string };
type RuleDescriber = { describe: (type?: string, libelle?: string) => string; style: (type?: string, libelle?: string) => RuleStyle };

const KINDS: GpuKind[] = ["surface", "lineaire", "ponctuel"];

const PRESCRIPTIONS: RuleSource & RuleDescriber = {
  fetchers: [getPrescriptionsSurf, getPrescriptionsLin, getPrescriptionsPct],
  typeField: "typepsc",
  fallback: "PSC",
  describe: getPrescriptionDescription,
  style: getPrescriptionStyle,
};

const INFORMATIONS: RuleSource & RuleDescriber = {
  fetchers: [getInformationsSurf, getInformationsLin, getInformationsPct],
  typeField: "typeinf",
  fallback: "INF",
  describe: getInformationDescription,
  style: getInformationStyle,
};

async function fetchRules(source: RuleSource & RuleDescriber, feature: Feature, department: string): Promise<PluRule[]> {
  const results = await Promise.all(source.fetchers.map((fetch) => fetch(feature.geometry, department)));
  const rules = new Map<string, PluRule>();
  results.forEach((features, index) =>
    (features ?? []).forEach(({ properties: p }) => {
      const type = p[source.typeField];
      const key = `${type}-${p.libelle}`;
      if (rules.has(key)) return;
      rules.set(key, {
        key,
        code: type?.split("_")[0] || source.fallback,
        label: p.libelle || "Libellé non renseigné",
        description: source.describe(type, p.libelle),
        kind: KINDS[index],
        ...source.style(type, p.libelle),
      });
    }),
  );
  return [...rules.values()];
}

const uniqueZones = (zones: GpuFeature[]): GpuFeature[] =>
  zones.filter((zone, i) => zones.findIndex((z) => z.properties.libelle === zone.properties.libelle) === i);

export function usePluData(feature: Feature) {
  const parcelId = String(feature?.properties?.id || "");
  const department = parcelDepartment(feature);
  const enabled = !!feature?.geometry && !!department;
  const zones = useQuery({
    queryKey: ["urban-summary", parcelId],
    queryFn: () => getZonesUrbaByGeometry(feature.geometry, department),
    enabled,
    retry: false,
    select: (response: { features?: GpuFeature[] } | null) => uniqueZones(response?.features ?? []),
  });
  const prescriptions = useQuery({
    queryKey: ["prescriptions-rules", parcelId],
    queryFn: () => fetchRules(PRESCRIPTIONS, feature, department),
    enabled,
    retry: false,
  });
  const informations = useQuery({
    queryKey: ["informations-rules", parcelId],
    queryFn: () => fetchRules(INFORMATIONS, feature, department),
    enabled,
    retry: false,
  });

  return { zones, prescriptions, informations };
}

export type PluData = ReturnType<typeof usePluData>;
