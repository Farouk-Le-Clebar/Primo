import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { getPoisByBbox } from "../../../../requests/map";
import {
    getMaxFeaturesForZoom,
    MIN_ZOOM_FOR_POIS,
    POI_CONFIGS,
    type PoiType,
} from "../PoiConfig";
import { boundToBbox } from "../MapUtils";
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

                    // Parser les tags si c'est une string JSON
                    let tags: Record<string, any> = {};
                    if (typeof props.tags === "string") {
                        try {
                            tags = JSON.parse(props.tags);
                        } catch (e) {
                            console.warn(
                                "Failed to parse tags for POI:",
                                props.name,
                                e
                            );
                        }
                    } else if (props.tags && typeof props.tags === "object") {
                        tags = props.tags;
                    }

                    // Icône personnalisée
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

                    // Construction de l'adresse complète
                    const buildAddress = () => {
                        const parts = [];
                        if (tags["addr:housenumber"]) parts.push(tags["addr:housenumber"]);
                        if (tags["addr:street"]) parts.push(tags["addr:street"]);
                        
                        const line1 = parts.join(" ");
                        const line2Parts = [];
                        if (tags["addr:postcode"]) line2Parts.push(tags["addr:postcode"]);
                        if (tags["addr:city"]) line2Parts.push(tags["addr:city"]);
                        const line2 = line2Parts.join(" ");
                        
                        if (line1 && line2) return `${line1}, ${line2}`;
                        if (line1) return line1;
                        if (line2) return line2;
                        return null;
                    };

                    const address = buildAddress();
                    const phone = tags.phone || tags["contact:phone"];
                    const website = tags.website || tags["contact:website"];
                    const email = tags.email || tags["contact:email"];

                    return (
                        <Marker
                            key={`poi-${props.osm_id || index}`}
                            position={[coords[1], coords[0]]}
                            icon={customIcon}
                        >
                            <Popup>
                                <div
                                    style={{
                                        fontFamily: "sans-serif",
                                        minWidth: "200px",
                                        maxWidth: "300px",
                                    }}
                                >
                                    {/* En-tête avec icône et nom */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            marginBottom: "12px",
                                            paddingBottom: "8px",
                                            borderBottom: "1px solid #e0e0e0",
                                        }}
                                    >
                                        <span style={{ fontSize: "28px" }}>
                                            {config.icon}
                                        </span>
                                        <div style={{ flex: 1 }}>
                                            <h3
                                                style={{
                                                    margin: 0,
                                                    color: "#2c3e50",
                                                    fontSize: "15px",
                                                    fontWeight: "bold",
                                                    lineHeight: 1.2,
                                                }}
                                            >
                                                {props.name || tags.name || "Sans nom"}
                                            </h3>
                                            <p
                                                style={{
                                                    margin: "2px 0 0 0",
                                                    color: config.color,
                                                    fontSize: "11px",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                {config.label}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Informations de contact */}
                                    <div style={{ marginBottom: "8px" }}>
                                        {address && (
                                            <div
                                                style={{
                                                    margin: "6px 0",
                                                    fontSize: "11px",
                                                    display: "flex",
                                                    gap: "6px",
                                                }}
                                            >
                                                <span>📍</span>
                                                <span style={{ color: "#555" }}>
                                                    {address}
                                                </span>
                                            </div>
                                        )}

                                        {phone && (
                                            <div
                                                style={{
                                                    margin: "6px 0",
                                                    fontSize: "11px",
                                                    display: "flex",
                                                    gap: "6px",
                                                }}
                                            >
                                                <span>📞</span>
                                                <a
                                                    href={`tel:${phone}`}
                                                    style={{
                                                        color: config.color,
                                                        textDecoration: "none",
                                                    }}
                                                >
                                                    {phone}
                                                </a>
                                            </div>
                                        )}

                                        {email && (
                                            <div
                                                style={{
                                                    margin: "6px 0",
                                                    fontSize: "11px",
                                                    display: "flex",
                                                    gap: "6px",
                                                }}
                                            >
                                                <span>✉️</span>
                                                <a
                                                    href={`mailto:${email}`}
                                                    style={{
                                                        color: config.color,
                                                        textDecoration: "none",
                                                        wordBreak: "break-all",
                                                    }}
                                                >
                                                    {email}
                                                </a>
                                            </div>
                                        )}

                                        {website && (
                                            <div
                                                style={{
                                                    margin: "6px 0",
                                                    fontSize: "11px",
                                                    display: "flex",
                                                    gap: "6px",
                                                }}
                                            >
                                                <span>🌐</span>
                                                <a
                                                    href={website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        color: config.color,
                                                        textDecoration: "none",
                                                    }}
                                                >
                                                    Visiter le site
                                                </a>
                                            </div>
                                        )}

                                        {tags.opening_hours && (
                                            <div
                                                style={{
                                                    margin: "6px 0",
                                                    fontSize: "11px",
                                                    display: "flex",
                                                    gap: "6px",
                                                }}
                                            >
                                                <span>🕐</span>
                                                <span style={{ color: "#555", fontSize: "10px" }}>
                                                    {tags.opening_hours}
                                                </span>
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