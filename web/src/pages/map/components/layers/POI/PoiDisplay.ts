import L from "leaflet";
import type { Feature, FeatureCollection, Point } from "geojson";
import {
    getPoiLabelDensity,
    POI_CONFIGS,
    getPoiDisplayRatio,
} from "../../PoiConfig";
import {
    selectPoiLabels,
    filterOverlappingPois,
} from "../../../../../utils/pois";

type PoiFeature = Feature<Point, Record<string, any>> & {
    _displayMode?: "featured" | "dot";
    _showLabel?: boolean;
};

type PoiDisplayResult = {
    featured: PoiFeature[];
    dots: PoiFeature[];
};

const hashString = (value: string): number => {
    let hash = 0;

    for (let i = 0; i < value.length; i++) {
        hash = (hash * 31 + value.charCodeAt(i)) | 0;
    }

    return Math.abs(hash);
};

const getPoiId = (feature: PoiFeature): string => {
    const props = feature.properties ?? {};
    const coords = feature.geometry.coordinates;

    return String(
        props.id ?? props.osm_id ?? `${props.type}:${coords[0]}:${coords[1]}`,
    );
};

const getPoiName = (feature: PoiFeature): string => {
    const props = feature.properties ?? {};
    let tags = props.tags ?? {};

    if (typeof tags === "string") {
        try {
            tags = JSON.parse(tags);
        } catch {
            tags = {};
        }
    }

    return String(props.name || tags.name || "");
};

const getCellKey = (point: L.Point, size: number) =>
    `${Math.floor(point.x / size)}:${Math.floor(point.y / size)}`;

export const buildPoiDisplay = (
    collection: FeatureCollection,
    map: L.Map,
    zoom: number,
): PoiDisplayResult => {
    const displayConfig = getPoiDisplayRatio(zoom);
    const featuredRatio = displayConfig.featuredRatio;
    const featuredCellSize = displayConfig.featuredCellSize;
    const dotCellSize = displayConfig.dotSize;

    const features = collection.features.filter(
        (feature): feature is PoiFeature =>
            feature.geometry?.type === "Point" &&
            !!feature.properties &&
            !!POI_CONFIGS[feature.properties.type],
    );

    const projected = features.map((feature) => ({
        feature,
        point: map.latLngToContainerPoint(
            L.latLng(
                feature.geometry.coordinates[1],
                feature.geometry.coordinates[0],
            ),
        ),
    }));

    const featuredCells = new Map<string, typeof projected>();

    for (const item of projected) {
        const key = getCellKey(item.point, featuredCellSize);
        const cell = featuredCells.get(key) ?? [];

        cell.push(item);
        featuredCells.set(key, cell);
    }

    const featuredSet = new Set<PoiFeature>();

    for (const cell of featuredCells.values()) {
        cell.sort((a, b) => {
            const nameScore =
                Number(!!getPoiName(b.feature)) -
                Number(!!getPoiName(a.feature));

            if (nameScore !== 0) return nameScore;

            return (
                hashString(getPoiId(a.feature)) -
                hashString(getPoiId(b.feature))
            );
        });

        featuredSet.add(cell[0].feature);
    }

    const featuredPadding = Math.max(1, Math.round(3 - featuredRatio * 2));
    const occupiedDots = new Set<string>();
    const dots: PoiFeature[] = [];

    for (const item of projected) {
        if (featuredSet.has(item.feature)) {
            const gx = Math.floor(item.point.x / dotCellSize);
            const gy = Math.floor(item.point.y / dotCellSize);

            for (let dx = -featuredPadding; dx <= featuredPadding; dx++) {
                for (let dy = -featuredPadding; dy <= featuredPadding; dy++) {
                    occupiedDots.add(`${gx + dx}:${gy + dy}`);
                }
            }
        }
    }

    const secondary = projected
        .filter((item) => !featuredSet.has(item.feature))
        .sort(
            (a, b) =>
                hashString(getPoiId(a.feature)) -
                hashString(getPoiId(b.feature)),
        );

    for (const item of secondary) {
        const key = getCellKey(item.point, dotCellSize);

        if (occupiedDots.has(key)) continue;

        occupiedDots.add(key);
        dots.push({
            ...item.feature,
            _displayMode: "dot",
            _showLabel: false,
        });
    }

    const featured = projected
        .filter((item) => featuredSet.has(item.feature))
        .map((item) => item.feature);

    const density = getPoiLabelDensity(zoom);
    const labelCandidates = selectPoiLabels(featured, map, density);

    const acceptedLabels = filterOverlappingPois(
        featured,
        map,
        labelCandidates,
    );

    const labelIds = new Set(
        acceptedLabels
            .filter((feature) => feature._showLabel)
            .map((feature) => getPoiId(feature as PoiFeature)),
    );

    return {
        featured: featured.map((feature) => ({
            ...feature,
            _displayMode: "featured",
            _showLabel: labelIds.has(getPoiId(feature)),
        })),
        dots,
    };
};
