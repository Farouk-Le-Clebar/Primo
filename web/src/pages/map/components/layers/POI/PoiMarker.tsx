import { memo, useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import type { Feature, Point } from "geojson";
import L from "leaflet";
import { POI_CONFIGS, POI_ICON_SIZE, type PoiConfig } from "../../PoiConfig";
import PoiPopup from "./PoiPopup";

type PoiMarkerProps = {
    feature: Feature<Point>;
    showLabel: boolean;
};

const parseTags = (tags: unknown): Record<string, string> => {
    if (typeof tags === "string") {
        try {
            return JSON.parse(tags);
        } catch {
            return {};
        }
    }
    if (tags && typeof tags === "object") return tags as Record<string, string>;
    return {};
};

const createPoiIcon = (config: PoiConfig, displayName: string, showLabel: boolean): L.DivIcon => {
    const labelHtml =
        showLabel && displayName
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

    return L.divIcon({
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
                    border: 1.5px solid white;
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
};

const PoiMarker = ({ feature, showLabel }: PoiMarkerProps) => {
    const props = feature.properties ?? {};
    const config = POI_CONFIGS[props.type];
    const tags = useMemo(() => parseTags(props.tags), [props.tags]);
    const name: string = props.name || tags.name || "";
    const displayName = name.length > 22 ? name.slice(0, 20) + "…" : name;
    const icon = useMemo(
        () => (config ? createPoiIcon(config, displayName, showLabel) : null),
        [config, displayName, showLabel],
    );

    if (!config || !icon) return null;

    return (
        <Marker position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]} icon={icon}>
            <Popup>
                <PoiPopup props={props} tags={tags} config={config} />
            </Popup>
        </Marker>
    );
};

export default memo(PoiMarker);
