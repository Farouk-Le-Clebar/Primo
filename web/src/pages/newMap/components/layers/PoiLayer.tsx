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
                                e,
                            );
                        }
                    } else if (props.tags && typeof props.tags === "object") {
                        tags = props.tags;
                    }

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
                            <span style="transform: rotate(45deg); font-size: 16px;">${config.icon}</span>
                        </div>
                    `,
                        className: "custom-poi-icon",
                        iconSize: [30, 30],
                        iconAnchor: [15, 30],
                        popupAnchor: [0, -30],
                    });

                    const buildAddress = () => {
                        const parts = [];
                        if (tags["addr:housenumber"])
                            parts.push(tags["addr:housenumber"]);
                        if (tags["addr:street"])
                            parts.push(tags["addr:street"]);

                        const line1 = parts.join(" ");
                        const line2Parts = [];
                        if (tags["addr:postcode"])
                            line2Parts.push(tags["addr:postcode"]);
                        if (tags["addr:city"])
                            line2Parts.push(tags["addr:city"]);
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
                    const openingHours = tags.opening_hours;

                    return (
                        <Marker
                            key={`poi-${props.osm_id || index}`}
                            position={[coords[1], coords[0]]}
                            icon={customIcon}
                        >
                            <Popup>
                                <div className="font-sans min-w-[220px] max-w-[280px]">
                                    {/* En-tête */}
                                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                                        <span
                                            className="text-2xl"
                                            style={{ color: config.color }}
                                        >
                                            {config.icon}
                                        </span>
                                        <div className="flex-1">
                                            <h3 className="text-[15px] font-semibold text-gray-900 leading-tight m-0">
                                                {props.name ||
                                                    tags.name ||
                                                    "Sans nom"}
                                            </h3>
                                            <p className="text-[11px] font-medium text-gray-500 mt-0.5 m-0">
                                                {config.label}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Informations de contact */}
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
                                                    style={{
                                                        color: config.color,
                                                    }}
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
                                                    style={{
                                                        color: config.color,
                                                    }}
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
                                                    style={{
                                                        color: config.color,
                                                    }}
                                                >
                                                    {website.replace(
                                                        /^https?:\/\//,
                                                        "",
                                                    )}
                                                </a>
                                            </div>
                                        )}

                                        {openingHours && (
                                            <div>
                                                <h4 className="text-[10px] font-semibold tracking-wide text-gray-400 mb-1">
                                                    Horaires
                                                </h4>
                                                <div className="text-[11px] text-gray-700 leading-relaxed space-y-0.5">
                                                    {formatOpeningHours(
                                                        openingHours,
                                                    )}
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

const formatOpeningHours = (hoursString: string) => {
    const lines = hoursString.split(";").map((line) => line.trim());

    return lines.map((line, index) => {
        const [daysPart, hoursPart] = line.split(/\s+/);

        if (!hoursPart) {
            return (
                <div key={index} className="flex justify-between">
                    <span className="font-medium">{line}</span>
                </div>
            );
        }

        let formattedDays = daysPart;
        const dayMap: Record<string, string> = {
            Mo: "Lun",
            Tu: "Mar",
            We: "Mer",
            Th: "Jeu",
            Fr: "Ven",
            Sa: "Sam",
            Su: "Dim",
        };

        Object.entries(dayMap).forEach(([osm, fr]) => {
            formattedDays = formattedDays.replace(osm, fr);
        });

        const formattedHours = hoursPart.replace("-", " - "); // peut-etre à supprimer car ça peut créer petite différences

        return (
            <div key={index} className="flex justify-between items-center">
                <span className="font-medium text-gray-600">
                    {formattedDays}
                </span>
                <span className="font-semibold text-gray-800">
                    {formattedHours}
                </span>
            </div>
        );
    });
};

export default PoiLayer;
