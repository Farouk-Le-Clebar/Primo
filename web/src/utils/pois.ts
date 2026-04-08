import L from "leaflet";
import {
    POI_ICON_SIZE,
    POI_LABEL_CHAR_WIDTH,
    POI_LABEL_HEIGHT,
    POI_COLLISION_PADDING,
    POI_CONFIGS,
} from "../pages/map/components/PoiConfig";

type BBox = {
    x: number;
    y: number;
    w: number;
    h: number;
};

/** Check if two bounding boxes (with padding) overlap */
export const bboxOverlaps = (a: BBox, b: BBox, pad: number): boolean => {
    return !(
        a.x + a.w + pad < b.x - pad ||
        b.x + b.w + pad < a.x - pad ||
        a.y + a.h + pad < b.y - pad ||
        b.y + b.h + pad < a.y - pad
    );
};

/**
 * Compute the pixel bounding box for a POI marker + label.
 * The icon circle is centred on the pixel point; the label sits to the right.
 */
export const computePoiBBox = (px: L.Point, labelLength: number): BBox => {
    const iconR = POI_ICON_SIZE / 2;
    // totalW = icon diam + gap(6) + label text width
    const labelW = labelLength * POI_LABEL_CHAR_WIDTH;
    const totalW = POI_ICON_SIZE + 6 + labelW;
    return {
        x: px.x - iconR,
        y: px.y - Math.max(iconR, POI_LABEL_HEIGHT / 2),
        w: totalW,
        h: Math.max(POI_ICON_SIZE, POI_LABEL_HEIGHT),
    };
};

/**
 * Given a list of features, return only those whose marker+label
 * does not overlap (greedy)
 */
export const filterOverlappingPois = (features: any[], map: L.Map): any[] => {
    const accepted: BBox[] = [];
    const result: any[] = [];

    for (const feature of features) {
        const coords = feature.geometry.coordinates;
        const props = feature.properties;
        const config = POI_CONFIGS[props.type];
        if (!config) continue;

        const name: string = props.name || props.tags?.name || "";
        const displayName = name.length > 22 ? name.slice(0, 20) + "…" : name;

        const latlng = L.latLng(coords[1], coords[0]);
        const px = map.latLngToContainerPoint(latlng);
        const bbox = computePoiBBox(px, displayName.length || 5);

        const overlaps = accepted.some((existing) =>
            bboxOverlaps(existing, bbox, POI_COLLISION_PADDING),
        );

        if (!overlaps) {
            accepted.push(bbox);
            result.push(feature);
        }
    }

    return result;
};

/**
 * Build a formatted address string from OSM addr:* tags.
 * Returns null if no address information is available.
 */
export const buildAddress = (tags: Record<string, any>): string | null => {
    const parts: string[] = [];
    if (tags["addr:housenumber"]) parts.push(tags["addr:housenumber"]);
    if (tags["addr:street"]) parts.push(tags["addr:street"]);

    const line1 = parts.join(" ");
    const line2Parts: string[] = [];
    if (tags["addr:postcode"]) line2Parts.push(tags["addr:postcode"]);
    if (tags["addr:city"]) line2Parts.push(tags["addr:city"]);
    const line2 = line2Parts.join(" ");

    if (line1 && line2) return `${line1}, ${line2}`;
    if (line1) return line1;
    if (line2) return line2;
    return null;
};

const OSM_DAY_MAP: Record<string, string> = {
    Mo: "Lun",
    Tu: "Mar",
    We: "Mer",
    Th: "Jeu",
    Fr: "Ven",
    Sa: "Sam",
    Su: "Dim",
};

/**
 * Format an OSM opening_hours string into a human-readable
 * array of { days, hours } objects for display.
 */
export const formatOpeningHours = (
    hoursString: string,
): { days: string; hours: string }[] => {
    return hoursString
        .split(";")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const [daysPart, hoursPart] = line.split(/\s+/);

            if (!hoursPart) return { days: line, hours: "" };

            let formattedDays = daysPart;
            for (const [osm, fr] of Object.entries(OSM_DAY_MAP)) {
                formattedDays = formattedDays.replace(osm, fr);
            }

            return {
                days: formattedDays,
                hours: hoursPart.replace("-", " - "),
            };
        });
};
