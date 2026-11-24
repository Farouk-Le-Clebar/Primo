import L from "leaflet";
import { getShapeStyles } from "../../../../utils/map";

export let selectedLayer: L.Path | null = null;

export const onEachFeature = (
    feature: GeoJSON.Feature,
    layer: L.Layer,
    map: L.Map,
    onParcelleSelect?: (bounds: L.LatLngBounds, feature: GeoJSON.Feature, layer: L.Path) => void,
    selectedIdRef?: React.RefObject<string | null>
) => {
    layer.on({
        click: (e: L.LeafletMouseEvent) => {
            if (selectedLayer === layer) {
                return;
            }

            if (selectedLayer) {
                selectedLayer.setStyle(getShapeStyles().default);
                selectedLayer.closePopup();
            }

            if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
                const target = e.target as L.Path;
                const bounds = layer.getBounds();
                const center = bounds.getCenter();
                const mapCenter = map.getCenter();
                const actualZoom = map.getZoom();

                const centerPoint = map.latLngToContainerPoint(center);
                const mapCenterPoint = map.latLngToContainerPoint(mapCenter);
                const distance = Math.sqrt(
                    Math.pow(centerPoint.x - mapCenterPoint.x, 2) +
                    Math.pow(centerPoint.y - mapCenterPoint.y, 2)
                );

                if (distance < 50 && actualZoom >= 18) {
                    target.setStyle(getShapeStyles().selected);
                    selectedLayer = target;

                    if (onParcelleSelect) {
                        onParcelleSelect(bounds, feature, selectedLayer);
                    }

                    return;
                }

                if (actualZoom < 11) {
                    map.flyTo(center, 11, {
                        duration: 0.5
                    });
                } else if (actualZoom >= 11 && actualZoom < 15) {
                    map.flyTo(center, 15, {
                        duration: 0.5
                    });
                } else if (actualZoom >= 15 && actualZoom < 18) {
                    map.flyTo(center, 18, {
                        duration: 0.5
                    });
                } else if (actualZoom >= 18) {
                    map.flyTo(center, actualZoom, {
                        duration: 0.5
                    });
                    map.once('moveend', () => {
                        if (selectedLayer) {
                            selectedLayer.setStyle(getShapeStyles().default);
                        }
                        target.setStyle(getShapeStyles().selected);
                        selectedLayer = target;

                        if (onParcelleSelect) {
                            onParcelleSelect(bounds, feature, target);
                        }
                    });
                }
            }
        },
        mouseover: (e: L.LeafletMouseEvent) => {
            const target = e.target as L.Path;
            if (target !== selectedLayer) {
                target.setStyle(getShapeStyles().hover);
            }
        },
        mouseout: (e: L.LeafletMouseEvent) => {
            const target = e.target as L.Path & { feature?: GeoJSON.Feature };
            const currentId = selectedIdRef?.current;
            if (target === selectedLayer || target.feature?.id === currentId) {
                target.setStyle(getShapeStyles().selected);
            } else {
                target.setStyle(getShapeStyles().default);
            }
        }
    });
};

export const resetSelection = () => {
    if (selectedLayer) {
        selectedLayer.setStyle(getShapeStyles().default);
        selectedLayer.closePopup();
        selectedLayer = null;
    }
};