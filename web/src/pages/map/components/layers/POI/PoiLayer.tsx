import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { getPoisByBbox } from "../../../../../requests/map";
import {
    getMaxFeaturesForZoom,
    MIN_ZOOM_FOR_POIS,
    POI_CONFIGS,
    POI_ICON_SIZE,
    type PoiType,
} from "../../PoiConfig";
import { boundToBbox } from "../../../../../utils/map";
import type { FeatureCollection } from "geojson";
import {
    filterOverlappingPois,
    buildAddress,
    formatOpeningHours,
} from "../../../../../utils/pois";


type PoiLayerProps = {
    onPoisChange: (data: FeatureCollection | null) => void;
    mapBounds: L.LatLngBounds | null;
    currentZoom: number;
    enabledPoiTypes: string[];
    dataPois: PoiType;
};


/** Parse OSM tags from a feature's properties */
const parseTags = (props: Record<string, any>): Record<string, any> => {
    if (typeof props.tags === "string") {
        try {
            return JSON.parse(props.tags);
        } catch {
            return {};
        }
    }
    if (props.tags && typeof props.tags === "object") return props.tags;
    return {};
};

const PoiLayer = ({
    onPoisChange,
    mapBounds,
    currentZoom,
    enabledPoiTypes,
    dataPois,
}: PoiLayerProps) => {
    const map = useMap();

    const { mutate: poisBoundsMutation } = useMutation({
        mutationFn: ({
            bbox,
            types,
            maxFeatures,
        }: {
            bbox: string;
            types: string[];
            maxFeatures: number;
        }) => getPoisByBbox(bbox, types, maxFeatures),
        onSuccess: (data) => {
            if (data && data.type === "FeatureCollection") {
                onPoisChange(data);
            }
        },
        onError: (error) => {
            console.error("Error fetching POI data:", error);
            onPoisChange(null);
        },
    });

    useEffect(() => {
        if (
            mapBounds &&
            currentZoom >= MIN_ZOOM_FOR_POIS &&
            enabledPoiTypes.length > 0
        ) {
            const bbox = boundToBbox(mapBounds);
            const maxFeatures = getMaxFeaturesForZoom(currentZoom);
            poisBoundsMutation({ bbox, types: enabledPoiTypes, maxFeatures });
        } else {
            onPoisChange(null);
        }
    }, [mapBounds, currentZoom, enabledPoiTypes]);

    const visibleFeatures = useMemo(() => {
        if (!dataPois.pois || currentZoom < MIN_ZOOM_FOR_POIS) return [];

        const capped = dataPois.pois.features.slice(
            0,
            getMaxFeaturesForZoom(currentZoom),
        );
        return filterOverlappingPois(capped, map);
    }, [dataPois.pois, currentZoom, map, mapBounds]);

    if (visibleFeatures.length === 0) return null;

    return (
        <>
            {visibleFeatures.map((feature: any, index: number) => {
                const coords = feature.geometry.coordinates;
                const props = feature.properties;
                const config = POI_CONFIGS[props.type];
                if (!config) return null;

                const tags = parseTags(props);
                const name = props.name || tags.name || "";
                const displayName =
                    name.length > 22 ? name.slice(0, 20) + "…" : name;

                const labelHtml = displayName
                    ? `<span style="
                        margin-left: 6px;
                        font-size: 12px;
                        font-weight: 600;
                        font-family: 'Inter', 'Fira Sans', sans-serif;
                        color: ${config.color};
                        white-space: nowrap;
                        text-shadow:
                            -1px -1px 0 #fff,
                             1px -1px 0 #fff,
                            -1px  1px 0 #fff,
                             1px  1px 0 #fff,
                             0   -1px 0 #fff,
                             0    1px 0 #fff,
                            -1px  0   0 #fff,
                             1px  0   0 #fff;
                        line-height: ${POI_ICON_SIZE}px;
                        vertical-align: middle;
                    ">${displayName}</span>`
                    : "";

                const customIcon = L.divIcon({
                    html: `
                        <div style="
                            display: flex;
                            align-items: center;
                            pointer-events: auto;
                        ">
                            <div class="poi-icon-circle" style="
                                width: ${POI_ICON_SIZE}px;
                                height: ${POI_ICON_SIZE}px;
                                min-width: ${POI_ICON_SIZE}px;
                                border-radius: 50%;
                                background-color: ${config.color};
                                border: 2.5px solid white;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                box-shadow:
                                    0 2px 6px rgba(0,0,0,0.25),
                                    inset 0 3px 5px rgba(255, 255, 255, 0.45),
                                    inset 0 -3px 5px rgba(0,0,0,0.25);
                            ">
                                ${config.svgIcon}
                            </div>
                            ${labelHtml}
                        </div>
                    `,
                    className: "poi-marker",
                    iconSize: [200, POI_ICON_SIZE],
                    iconAnchor: [POI_ICON_SIZE / 2, POI_ICON_SIZE / 2],
                    popupAnchor: [0, -(POI_ICON_SIZE / 2 + 4)],
                });

                const address = buildAddress(tags);
                const phone = tags.phone || tags["contact:phone"];
                const website = tags.website || tags["contact:website"];
                const email = tags.email || tags["contact:email"];
                const openingHours = tags.opening_hours;
                const hours = openingHours
                    ? formatOpeningHours(openingHours)
                    : null;

                return (
                    <Marker
                        key={`poi-${props.osm_id || index}`}
                        position={[coords[1], coords[0]]}
                        icon={customIcon}
                    >
                        <Popup>
                            <div className="font-sans min-w-[220px] max-w-[280px]">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                                    {/* <div
                                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                                        style={{
                                            backgroundColor: config.color,
                                            boxShadow:
                                                "inset 0 3px 4px rgba(255,255,255,0.35), inset 0 -3px 4px rgba(0,0,0,0.2)",
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: config.svgIcon,
                                        }}
                                    /> */}
                                    <div className="flex-1">
                                        <h3 className="text-[15px] font-semibold text-gray-900 leading-tight m-0">
                                            {props.name ||
                                                tags.name ||
                                                "Sans nom"}
                                        </h3>
                                        <p className="text-[11px] font-medium text-gray-500 m-0">
                                            {config.label}
                                        </p>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="space-y-3">
                                    {address && (
                                        <div>
                                            <h4 className="text-[10px] font-semibold tracking-wide text-gray-400 mb-[-10px]">
                                                Adresse
                                            </h4>
                                            <p className="text-[12px] text-gray-700 leading-relaxed">
                                                {address}
                                            </p>
                                        </div>
                                    )}

                                    {phone && (
                                        <div>
                                            <h4 className="text-[10px] font-semibold tracking-wide text-gray-400 mb-1">
                                                Téléphone
                                            </h4>
                                            <a
                                                href={`tel:${phone}`}
                                                className="text-[12px] no-underline hover:underline transition-colors duration-150"
                                                style={{ color: config.color }}
                                            >
                                                {phone}
                                            </a>
                                        </div>
                                    )}

                                    {email && (
                                        <div>
                                            <h4 className="text-[10px] font-semibold tracking-wide text-gray-400 mb-1">
                                                Email
                                            </h4>
                                            <a
                                                href={`mailto:${email}`}
                                                className="text-[12px] no-underline hover:underline transition-colors duration-150 break-all"
                                                style={{ color: config.color }}
                                            >
                                                {email}
                                            </a>
                                        </div>
                                    )}

                                    {website && (
                                        <div>
                                            <h4 className="text-[10px] font-semibold tracking-wide text-gray-400 mb-1">
                                                Site web
                                            </h4>
                                            <a
                                                href={website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[12px] no-underline hover:underline transition-colors duration-150"
                                                style={{ color: config.color }}
                                            >
                                                {website.replace(
                                                    /^https?:\/\//,
                                                    "",
                                                )}
                                            </a>
                                        </div>
                                    )}

                                    {hours && hours.length > 0 && (
                                        <div>
                                            <h4 className="text-[10px] font-semibold tracking-wide text-gray-400 mb-1">
                                                Horaires
                                            </h4>
                                            <div className="text-[11px] text-gray-700 leading-relaxed space-y-0.5">
                                                {hours.map((h, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex justify-between items-center"
                                                    >
                                                        <span className="font-medium text-gray-600">
                                                            {h.days}
                                                        </span>
                                                        {h.hours && (
                                                            <span className="font-semibold text-gray-800">
                                                                {h.hours}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
};

export default PoiLayer;
