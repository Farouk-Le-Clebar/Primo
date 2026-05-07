import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import type { ProjectPlotResponse } from "../../../../../types/project/plots";
import L from "leaflet";
import { useEffect } from "react";
import { defaultStyle } from "../../../../map/components/layers/ShapesLayer";

type PlotProps = {
    plot: ProjectPlotResponse;
};

const FitGeoJSON = ({ data }: { data: any }) => {
    const map = useMap();
    useEffect(() => {
        if (data) {
            const geoJsonLayer = L.geoJSON(data);
            map.fitBounds(geoJsonLayer.getBounds(), { padding: [10, 10] });
        }
    }, [map, data]);
    return null;
};

const PlotMap = ({ plot }: PlotProps) => {
    return (
        <MapContainer
            zoom={18}
            className="w-full h-full"
            style={{ pointerEvents: "none" }}
            attributionControl={false}
            preferCanvas={true}
            zoomControl={false}
            dragging={false}
            touchZoom={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            boxZoom={false}
            keyboard={false}
        >
            <TileLayer url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" />

            {plot.geometry && (
                <>
                    <FitGeoJSON data={plot.geometry} />
                    <GeoJSON
                        data={plot.geometry as any}
                        style={defaultStyle}
                    />
                </>
            )}
        </MapContainer>
    )
}

export default PlotMap;