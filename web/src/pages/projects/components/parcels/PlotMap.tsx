import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import { defaultStyle } from "../../../map/components/layers/ShapesLayer";

type PlotProps = {
    plot: any;
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
    const geometry = useMemo(() => {
        if (!plot.geometry) return null;

        return typeof plot.geometry === "string"
            ? JSON.parse(plot.geometry)
            : plot.geometry;
    }, [plot.geometry]);

    return (
        <MapContainer
            zoom={18}
            className="w-full h-full"
            style={{ pointerEvents: "none" }}
            attributionControl={false}
            preferCanvas
            zoomControl={false}
            dragging={false}
            touchZoom={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            boxZoom={false}
            keyboard={false}
        >
            <TileLayer url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" />

            {geometry && (
                <>
                    <FitGeoJSON data={geometry} />
                    <GeoJSON data={geometry} style={defaultStyle} />
                </>
            )}
        </MapContainer>
    );
};

export default PlotMap;