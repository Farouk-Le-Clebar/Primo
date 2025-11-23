import { Marker, Popup } from "react-leaflet";
import { useMemo } from "react";
import L from "leaflet";
import type { Poi } from "../../types/poi.types";
import { POI_CONFIGS } from "../../types/poi.types";

interface PoiMarkersProps {
    pois: Poi[];
}

const PoiMarkers = ({ pois }: PoiMarkersProps) => {
    const createPoiIcon = (type: string) => {
        const config = POI_CONFIGS[type];
        if (!config) return null;

        const html = `
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
    `;

        return L.divIcon({
            html,
            className: "custom-poi-icon",
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30],
        });
    };

    const iconCache = useMemo(() => {
        const cache: Record<string, L.DivIcon | null> = {};
        Object.keys(POI_CONFIGS).forEach((type) => {
            cache[type] = createPoiIcon(type);
        });
        return cache;
    }, []);

    return (
        <>
            {pois.map((poi) => {
                const icon = iconCache[poi.type];
                if (!icon) return null;

                const config = POI_CONFIGS[poi.type];
                if (!config) return null;

                return (
                    <Marker
                        key={poi.id}
                        position={[poi.lat, poi.lon]}
                        icon={icon}
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
                                            {poi.name}
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

                                {poi.tags?.phone && (
                                    <p
                                        style={{
                                            margin: "4px 0",
                                            fontSize: "10px",
                                        }}
                                    >
                                        <strong>📞 Téléphone:</strong>{" "}
                                        {poi.tags.phone}
                                    </p>
                                )}

                                {poi.tags?.opening_hours && (
                                    <p
                                        style={{
                                            margin: "4px 0",
                                            fontSize: "10px",
                                        }}
                                    >
                                        <strong>🕐 Horaires:</strong>{" "}
                                        {poi.tags.opening_hours}
                                    </p>
                                )}

                                {poi.tags?.website && (
                                    <p
                                        style={{
                                            margin: "4px 0",
                                            fontSize: "10px",
                                        }}
                                    >
                                        <strong>🌐 Site:</strong>{" "}
                                        <a
                                            href={poi.tags.website}
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

export default PoiMarkers;
