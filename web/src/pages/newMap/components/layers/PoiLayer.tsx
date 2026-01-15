import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { getPoisByBbox } from "../../../../requests/map";
import {
    boundToBbox,
    getMaxFeaturesForZoom,
    MIN_ZOOM_FOR_POIS,
    POI_CONFIGS,
    type PoiType,
} from "../MapUtils";
import type { FeatureCollection } from "geojson";

type PoiLayerProps = {
    onPoisChange: (data: FeatureCollection | null) => void;
    mapBounds: L.LatLngBounds | null;
    currentZoom: number;
    enabledPoiTypes: string[];
    dataPois: PoiType;
};

const PoiLayer = ({
    onPoisChange,
    mapBounds,
    currentZoom,
    enabledPoiTypes,
    dataPois,
}: PoiLayerProps) => {
    const map = useMap();

    const { mutate: poisBoundsMutation, isPending } = useMutation({
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

            poisBoundsMutation({
                bbox,
                types: enabledPoiTypes,
                maxFeatures,
            });
        } else {
            onPoisChange(null);
        }
    }, [mapBounds, currentZoom, enabledPoiTypes]);

    if (!dataPois.pois || currentZoom < MIN_ZOOM_FOR_POIS) {
        return null;
    }

    return (
        <>
            {dataPois.pois.features
                .slice(0, getMaxFeaturesForZoom(currentZoom))
                .map((feature: any, index: number) => {
                    const coords = feature.geometry.coordinates;
                    const props = feature.properties;
                    const poiType = props.type;
                    const config = POI_CONFIGS[poiType];

                    if (!config) return null;

                    // a changer ici car pas bo
                    const customIcon = L.divIcon({
                        html: `
                        <div style="
                            background-color: ${config.color};
                            width: 30px;
                            height: 30px;
                            border-radius: 50% 50% 50% 0;
                            transform: rotate(-45deg);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border: 2px solid white;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                        ">
                            <span style="
                                transform: rotate(45deg);
                                font-size: 16px;
                            ">${config.icon}</span>
                        </div>
                    `,
                        className: "custom-poi-icon",
                        iconSize: [30, 30],
                        iconAnchor: [15, 30],
                        popupAnchor: [0, -30],
                    });

                    return (
                        <Marker
                            key={`poi-${props.osm_id || index}`}
                            position={[coords[1], coords[0]]} // [lat, lon]
                            icon={customIcon}
                        >
                            <Popup>
                                <div
                                    style={{
                                        fontFamily: "sans-serif",
                                        minWidth: "180px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        <span style={{ fontSize: "24px" }}>
                                            {config.icon}
                                        </span>
                                        <div>
                                            <h3
                                                style={{
                                                    margin: 0,
                                                    color: "#2c3e50",
                                                    fontSize: "14px",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {props.name || "Sans nom"}
                                            </h3>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    color: "#7f8c8d",
                                                    fontSize: "11px",
                                                }}
                                            >
                                                {config.label}
                                            </p>
                                        </div>
                                    </div>

                                    {props.tags?.phone && (
                                        <p
                                            style={{
                                                margin: "4px 0",
                                                fontSize: "10px",
                                            }}
                                        >
                                            <strong>📞 Téléphone:</strong>{" "}
                                            {props.tags.phone}
                                        </p>
                                    )}

                                    {props.tags?.opening_hours && (
                                        <p
                                            style={{
                                                margin: "4px 0",
                                                fontSize: "10px",
                                            }}
                                        >
                                            <strong>🕐 Horaires:</strong>{" "}
                                            {props.tags.opening_hours}
                                        </p>
                                    )}

                                    {props.tags?.website && (
                                        <p
                                            style={{
                                                margin: "4px 0",
                                                fontSize: "10px",
                                            }}
                                        >
                                            <strong>🌐 Site:</strong>{" "}
                                            <a
                                                href={props.tags.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: config.color }}
                                            >
                                                Visiter
                                            </a>
                                        </p>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
        </>
    );
};

export default PoiLayer;
