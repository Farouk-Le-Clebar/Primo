import MapBounds from "./layers/MapBounds";
import ZoomHandler from "./layers/ZoomHandler";
import { TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useCallback, useRef } from "react";
import type { FeatureCollection } from "geojson";
import L from "leaflet";
import ShapesLayer from "./layers/ShapesLayer";
import PoiLayer from "./layers/POI/PoiLayer";
import PoiWidget from "./layers/POI/PoiWidget";
import { MIN_ZOOM_FOR_POIS, POI_CONFIGS } from "./PoiConfig";
import ParcelInfoPanel from "./layers/ParcelPanel/ParcelInfoPanel";
import Navbar from "./layers/Navbar/Navbar";
import MapPreference from "./layers/preference/MapPreference";
import { mapPreference } from "../../../utils/map";
import NoScrollZone from "../wrapper/NoScrollZone";
import AiLayer from "./layers/AI/AiLayer";

const Layers = () => {
    const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
    const [currentZoom, setCurrentZoom] = useState<number>(6);
    const [departementsBoundData, setDepartementsBoundData] =
        useState<FeatureCollection | null>(null);
    const [pacellesBoundData, setPacellesBoundData] =
        useState<FeatureCollection | null>(null);
    const [cityBoundData, setCityBoundData] =
        useState<FeatureCollection | null>(null);
    const [divisionsBoundData, setDivisionsBoundData] =
        useState<FeatureCollection | null>(null);
    const [selectedParcelle, setSelectedParcelle] = useState<{
        bounds: L.LatLngBounds;
        feature: any;
        layer: L.Path;
    } | null>(null);
    const selectedIdRef = useRef<string | null>(null);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [mapType, setMapType] = useState<"basic" | "satellite">(user.mapPreference);

    const [poisData, setPoisData] = useState<FeatureCollection | null>(null);
    const [enabledPoiTypes, setEnabledPoiTypes] = useState<string[]>(
        Object.entries(POI_CONFIGS)
            .filter(([_, config]) => config.enabled)
            .map(([key]) => key),
    );

    const handleMapBoundsChange = (bounds: L.LatLngBounds) => {
        setMapBounds(bounds);
    };

    const handleZoomChange = (zoom: number) => {
        setCurrentZoom(zoom);
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

    const handlePoisChange = (data: FeatureCollection | null) => {
        setPoisData(data);
    };

    const handleTogglePoi = useCallback((type: string, enabled: boolean) => {
        setEnabledPoiTypes((prev) =>
            enabled ? [...prev, type] : prev.filter((t) => t !== type),
        );
    }, []);

    const handleParcelleSelect = (bounds: L.LatLngBounds, feature: any, layer: L.Path) => {
        const id = feature.id;
        selectedIdRef.current = id;
        setSelectedParcelle({ bounds, feature, layer });
    };

    const handleChangeMapType = (type: "basic" | "satellite") => {
        setMapType(type);
        user.mapPreference = type;
        localStorage.setItem("user", JSON.stringify(user));
    }

    return (
        <>
            <TileLayer url={mapPreference[mapType]} />
            <MapBounds onChange={handleMapBoundsChange} />
            <ZoomHandler onZoomChange={handleZoomChange} />
            <NoScrollZone>
                <MapPreference
                    onChangeMapType={handleChangeMapType}
                    currentMapType={mapType}
                />
                <Navbar
                    parcelleBounds={pacellesBoundData}
                    onParcelleSelect={handleParcelleSelect}
                />
                <AiLayer />
                <ParcelInfoPanel selectedParcelle={selectedParcelle} />
            </NoScrollZone>

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
                dataShape={{
                    departements: departementsBoundData,
                    parcelles: pacellesBoundData,
                    city: cityBoundData,
                    divisions: divisionsBoundData,
                }}
                onParcelleSelect={handleParcelleSelect}
                selectedIdRef={selectedIdRef}
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

