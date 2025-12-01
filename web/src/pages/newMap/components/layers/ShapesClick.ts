import L from "leaflet";

let selectedLayer: L.Path | null = null;

const defaultStyle = {
    fillOpacity: 0.2,
    weight: 2
};

const selectedStyle = {
    fillOpacity: 0.7,
    weight: 3,
};

const hoverStyle = {
    fillOpacity: 0.7,
    weight: 3
};

export const onEachFeature = (feature: any, layer: L.Layer, map: L.Map) => {
    layer.on({
        click: (e: L.LeafletMouseEvent) => {
            if (selectedLayer === layer) {
                return;
            }

            if (selectedLayer) {
                selectedLayer.setStyle(defaultStyle);
                selectedLayer.closePopup();
            }

            if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
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
                    e.target.setStyle(selectedStyle);
                    e.target.bindPopup(`Parcelle`).openPopup();
                    selectedLayer = e.target as L.Path;
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
                } else if (actualZoom >= 15) {
                    map.flyTo(center, 18, {
                        duration: 0.5
                    });
                }
            }
        },
        mouseover: (e: L.LeafletMouseEvent) => {
            const target = e.target as L.Path;
            if (target !== selectedLayer) {
                target.setStyle(hoverStyle);
            }
        },
        mouseout: (e: L.LeafletMouseEvent) => {
            const target = e.target as L.Path;
            if (target !== selectedLayer) {
                target.setStyle(defaultStyle);
            }
        }
    });
};

export const resetSelection = () => {
    if (selectedLayer) {
        selectedLayer.setStyle(defaultStyle);
        selectedLayer.closePopup();
        selectedLayer = null;
    }
};