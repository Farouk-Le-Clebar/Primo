import { memo, useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import type { Feature, Point } from "geojson";
import L from "leaflet";
import { POI_CONFIGS } from "../../PoiConfig";
import { parseTags } from "./PoiMarker";

type PoiDotMarkerProps = {
    feature: Feature<Point>;
    size: number;
};

const createPoiDotIcon = (color: string, size: number): L.DivIcon =>
    L.divIcon({
        className: "poi-dot-marker",
        html: `<span class="poi-dot-marker__core" style="--poi-dot-color: ${color}; --poi-dot-size: ${size}px;"></span>`,
        iconSize: [size + 4, size + 4],
        iconAnchor: [(size + 4) / 2, (size + 4) / 2],
    });

const PoiDotMarker = ({ feature, size }: PoiDotMarkerProps) => {
    const props = feature.properties ?? {};
    const config = POI_CONFIGS[props.type];
    const tags = useMemo(() => parseTags(props.tags), [props.tags]);
    const name: string = props.name || tags.name || "Infrastructure";
    const icon = useMemo(
        () => (config ? createPoiDotIcon(config.color, size) : null),
        [config, size],
    );

    if (!config || !icon) return null;

    return (
        <Marker
            position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
            icon={icon}
            keyboard={false}
            bubblingMouseEvents={false}
        >
            <Popup>
                <strong>{name}</strong>
            </Popup>
        </Marker>
    );
};

export default memo(PoiDotMarker);
