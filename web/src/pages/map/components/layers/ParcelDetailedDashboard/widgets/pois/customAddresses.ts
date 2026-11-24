import { centroid, distance, point } from "@turf/turf";
import type { Feature, Geometry, Point } from "geojson";
import type { ProjectAddress } from "../../../../../../../types/project/addresses";
import type { FeatureLike, ProximityResult } from "./utils";

export type CustomAddressContext = {
    byCode: ReadonlyMap<string, ProjectAddress>;
    projectName: string;
};

export const CUSTOM_FAMILY = "Personnalisé";

const CUSTOM_CODE_PREFIX = "address:";
const MAX_DISTANCE_METERS = 30_000;
const FULL_SCORE_DISTANCE_METERS = 300;
const PARCEL_GEOMETRY_TYPES = ["Polygon", "MultiPolygon", "Point"];

export const isCustomCode = (code: string): boolean => code.startsWith(CUSTOM_CODE_PREFIX);

export const toCustomCode = (addressId: string): string => `${CUSTOM_CODE_PREFIX}${addressId}`;

export const getCustomLabel = (address: ProjectAddress): string => address.description?.trim() || address.address;

export function getParcelCenter(feature: FeatureLike | undefined): Feature<Point> | null {
    const geometry = feature?.geometry;
    if (!geometry?.type || !PARCEL_GEOMETRY_TYPES.includes(geometry.type)) return null;
    return centroid(geometry as Geometry);
}

export function proximityScore(distanceMeters: number): number {
    if (distanceMeters <= FULL_SCORE_DISTANCE_METERS) return 100;
    const ratio = (MAX_DISTANCE_METERS - distanceMeters) / (MAX_DISTANCE_METERS - FULL_SCORE_DISTANCE_METERS);
    return Math.max(0, Math.min(100, Math.round(100 * ratio)));
}

export function toCustomResult(code: string, address: ProjectAddress, center: Feature<Point>, projectName: string): ProximityResult {
    const distanceMeters = distance(center, point([address.longitude, address.latitude]), { units: "meters" });
    return {
        type_code: code,
        type_label: getCustomLabel(address),
        famille: CUSTOM_FAMILY,
        nom: address.address,
        adresse: projectName ? `Projet ${projectName}` : null,
        distance_m: distanceMeters,
        score: proximityScore(distanceMeters),
    };
}
