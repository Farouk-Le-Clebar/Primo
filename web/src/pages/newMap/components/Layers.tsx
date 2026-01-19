import MapBounds from "./layers/MapBounds";
import ZoomHandler from "./layers/ZoomHandler";
import { TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useCallback } from "react";
import type { FeatureCollection } from "geojson";
import L from "leaflet";
import {
    MIN_ZOOM_FOR_CITY,
    MIN_ZOOM_FOR_DIVISION,
    MIN_ZOOM_FOR_PARCELLES,
} from "./MapUtils";
import ShapesLayer from "./layers/ShapesLayer";
import PoiLayer from "./layers/PoiLayer";
import PoiWidget from "./layers/PoiWidget";
import { MIN_ZOOM_FOR_POIS, POI_CONFIGS } from "./PoiConfig";

const Layers = () => {
    const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
    const [currentZoom, setCurrentZoom] = useState<number>(6);
    const [lastZoom, _setLastZoom] = useState<number>(6);
    const [firstLayerRequest, setFirstLayerRequest] = useState<boolean>(true);
    const [departementsBoundData, setDepartementsBoundData] =
        useState<FeatureCollection | null>(null);
    const [pacellesBoundData, setPacellesBoundData] =
        useState<FeatureCollection | null>(null);
    const [cityBoundData, setCityBoundData] =
        useState<FeatureCollection | null>(null);
    const [divisionsBoundData, setDivisionsBoundData] =
        useState<FeatureCollection | null>(null);

    const [poisData, setPoisData] = useState<FeatureCollection | null>(null);
    const [enabledPoiTypes, setEnabledPoiTypes] = useState<string[]>(
        Object.entries(POI_CONFIGS)
            .filter(([_, config]) => config.enabled)
            .map(([key]) => key)
    );

    const handleMapBoundsChange = (bounds: L.LatLngBounds) => {
        setMapBounds(bounds);
    };

    const handleZoomChange = (zoom: number) => {
        setCurrentZoom(zoom);
        if (zoom < MIN_ZOOM_FOR_PARCELLES && pacellesBoundData) {
            setFirstLayerRequest(true);
        }
        if (
            (zoom < MIN_ZOOM_FOR_CITY || zoom >= MIN_ZOOM_FOR_DIVISION) &&
            cityBoundData
        ) {
            setFirstLayerRequest(true);
        }
        if (
            (zoom < MIN_ZOOM_FOR_DIVISION || zoom >= MIN_ZOOM_FOR_PARCELLES) &&
            divisionsBoundData
        ) {
            setFirstLayerRequest(true);
        }
        if (zoom >= MIN_ZOOM_FOR_CITY && departementsBoundData) {
            setFirstLayerRequest(true);
        }
    };

    const handleCityBoundChange = (data: any) => {
        setCityBoundData(data);
    };

    const handleDepartementsBoundChange = (data: any) => {
        setDepartementsBoundData(data);
    };

    const handleDivisionsBoundChange = (data: any) => {
        setDivisionsBoundData(data);
    };

    const handlePacellesBoundChange = (data: any) => {
        setPacellesBoundData(data);
    };

    const handleFirstLayerRequestHandled = (data: boolean) => {
        setFirstLayerRequest(data);
    };

    const handlePoisChange = (data: FeatureCollection | null) => {
        setPoisData(data);
    };

    const handleTogglePoi = useCallback((type: string, enabled: boolean) => {
        setEnabledPoiTypes((prev) =>
            enabled ? [...prev, type] : prev.filter((t) => t !== type)
        );
    }, []);

    return (
        <>
            {/* https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png */}
            <TileLayer url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" />
            <MapBounds onChange={handleMapBoundsChange} />
            <ZoomHandler onZoomChange={handleZoomChange} />
            <ZoomControl position="topright" />
            <PoiWidget
                onTogglePoi={handleTogglePoi}
                currentZoom={currentZoom}
                minZoomForPois={MIN_ZOOM_FOR_POIS}
            />
            <ShapesLayer
                onCityBoundChange={handleCityBoundChange}
                onDepartementsBoundChange={handleDepartementsBoundChange}
                onDivisionsBoundChange={handleDivisionsBoundChange}
                onPacellesBoundChange={handlePacellesBoundChange}
                currentZoom={currentZoom}
                mapBounds={mapBounds}
                firstLayerRequest={firstLayerRequest}
                dataShape={{
                    departements: departementsBoundData,
                    parcelles: pacellesBoundData,
                    city: cityBoundData,
                    divisions: divisionsBoundData,
                }}
            />
            <PoiLayer
                onPoisChange={handlePoisChange}
                mapBounds={mapBounds}
                currentZoom={currentZoom}
                enabledPoiTypes={enabledPoiTypes}
                dataPois={{ pois: poisData }}
            />
        </>
    );
};

export default Layers;

