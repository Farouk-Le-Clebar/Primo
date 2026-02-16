import MapBounds from "./layers/MapBounds";
import ZoomHandler from "./layers/ZoomHandler";
import { TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useCallback } from "react";
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
        setSelectedParcelle({ bounds, feature, layer });
        console.log(selectedParcelle);
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
            <MapPreference
                onChangeMapType={handleChangeMapType}
                currentMapType={mapType}
            />

            <NoScrollZone>
                <Navbar />
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
            />
            <PoiLayer
                onPoisChange={handlePoisChange}
                mapBounds={mapBounds}
                currentZoom={currentZoom}
                enabledPoiTypes={enabledPoiTypes}
                dataPois={{ pois: poisData }}
            />
            <NoScrollZone>
                <ParcelInfoPanel selectedParcelle={selectedParcelle} />
            </NoScrollZone>
        </>
    );
};

export default Layers;

