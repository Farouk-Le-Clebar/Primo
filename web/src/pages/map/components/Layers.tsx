import { useState, useCallback } from "react";
import { TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { FeatureCollection } from "geojson";

// LAYERS & MAP LOGIC
import MapBounds from "./layers/MapBounds";
import ZoomHandler from "./layers/ZoomHandler";
import ShapesLayer from "./layers/ShapesLayer";
import PoiLayer from "./layers/POI/PoiLayer";
import { POI_CONFIGS } from "./PoiConfig";
import LocationHandler from "./layers/LocationHandler";
import NoScrollZone from "../wrapper/NoScrollZone";
import MapControls from "./layers/MapControls/MapControls";

// PANNEAUX DE DONNÉES (Séparés proprement)
import ParcelInfoPanel from "./layers/ParcelPanel/ParcelInfoPanel";
import ParcelDetailedDashboard from "./layers/ParcelDetailedDashboard/ParcelDetailedDashboard";

import Navbar from "./layers/Navbar/Navbar";
import { mapPreference } from "../../../utils/map";

const getUserMapPreference = (): "basic" | "satellite" => {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return user.mapPreference === "satellite" ? "satellite" : "basic";
    } catch (e) {
        return "basic";
    }
};

const Layers = () => {
    const map = useMap();
    const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
    const [currentZoom, setCurrentZoom] = useState<number>(6);
    
    const [selectedParcelle, setSelectedParcelle] = useState<{bounds: L.LatLngBounds; feature: any; layer: L.Path;} | null>(null);
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);

    const [departementsBoundData, setDepartementsBoundData] = useState<FeatureCollection | null>(null);
    const [pacellesBoundData, setPacellesBoundData] = useState<FeatureCollection | null>(null);
    const [cityBoundData, setCityBoundData] = useState<FeatureCollection | null>(null);
    const [divisionsBoundData, setDivisionsBoundData] = useState<FeatureCollection | null>(null);
    
    const [mapType, setMapType] = useState<"basic" | "satellite">(getUserMapPreference());
    const [poisData, setPoisData] = useState<FeatureCollection | null>(null);
    const [enabledPoiTypes, setEnabledPoiTypes] = useState<string[]>(
        Object.entries(POI_CONFIGS).filter(([_, config]) => config.enabled).map(([key]) => key)
    );

    const handleMapBoundsChange = useCallback((bounds: L.LatLngBounds) => setMapBounds(bounds), []);
    const handleZoomChange = useCallback((zoom: number) => setCurrentZoom(zoom), []);
    
    const handleParcelleSelect = useCallback((bounds: L.LatLngBounds, feature: any, layer: L.Path) => {
        setSelectedParcelle({ bounds, feature, layer });
        setIsDashboardOpen(false);
    }, []);

    const handleChangeMapType = (type: "basic" | "satellite") => {
        setMapType(type);
    };

    const handleTogglePoi = useCallback((type: string, enabled: boolean) => {
        setEnabledPoiTypes(prev => enabled ? [...prev, type] : prev.filter(t => t !== type));
    }, []);

    return (
        <>
            <TileLayer url={mapPreference[mapType]} />
            <LocationHandler />
            <MapBounds onChange={handleMapBoundsChange} />
            <ZoomHandler onZoomChange={handleZoomChange} />
            
            <ShapesLayer
                onCityBoundChange={setCityBoundData}
                onDepartementsBoundChange={setDepartementsBoundData}
                onDivisionsBoundChange={setDivisionsBoundData}
                onPacellesBoundChange={setPacellesBoundData}
                currentZoom={currentZoom}
                mapBounds={mapBounds}
                dataShape={{ departements: departementsBoundData, parcelles: pacellesBoundData, city: cityBoundData, divisions: divisionsBoundData }}
                onParcelleSelect={handleParcelleSelect}
            />
            
            <PoiLayer onPoisChange={setPoisData} mapBounds={mapBounds} currentZoom={currentZoom} enabledPoiTypes={enabledPoiTypes} dataPois={{ pois: poisData }} />

            <div className="flex fixed inset-0 z-[1001] flex-col pointer-events-none">
                
                <header className="flex w-full h-15 items-center shrink-0 pointer-events-auto">
                    <NoScrollZone><Navbar /></NoScrollZone>
                </header>

                <div className="flex-1 flex w-full overflow-hidden relative">
                    
                    <aside 
                        className={`h-full pointer-events-auto bg-transparent flex-shrink-0 z-30 transition-all duration-500 ease-in-out ${
                            !selectedParcelle ? "w-0 -translate-x-full opacity-0" :
                            isDashboardOpen ? "w-full translate-x-0 opacity-100" : 
                            "w-[450px] translate-x-0 opacity-100"
                        }`}
                    >
                        <div className="w-full h-full bg-white shadow-[20px_0_25px_-5px_rgba(0,0,0,0.1)] overflow-hidden relative">
                            <NoScrollZone>
                                {isDashboardOpen ? (
                                    <ParcelDetailedDashboard 
                                        selectedParcelle={selectedParcelle}
                                        onClose={() => setIsDashboardOpen(false)}
                                    />
                                ) : (
                                    <ParcelInfoPanel 
                                        selectedParcelle={selectedParcelle}
                                        onOpenDashboard={() => setIsDashboardOpen(true)}
                                    />
                                )}
                            </NoScrollZone>
                        </div>
                    </aside>

                    {!isDashboardOpen && (
                        <main className="flex-1 relative w-full h-full pointer-events-none animate-in fade-in duration-300">
                            <div className="absolute top-1 right-1 pointer-events-auto flex flex-col gap-2 items-end z-[1002]">
                                <MapControls 
                                    onZoomIn={() => map.zoomIn()} 
                                    onZoomOut={() => map.zoomOut()}
                                    onLocateUser={() => map.locate({ setView: true, maxZoom: 16 })}
                                    currentMapType={mapType}
                                    onChangeMapType={handleChangeMapType}
                                    enabledPoiTypes={enabledPoiTypes}
                                    onTogglePoi={handleTogglePoi}
                                />
                            </div>

                            <div className="absolute bottom-6 right-6 pointer-events-auto flex flex-col items-end gap-3 z-[1002]">
                                <div className="flex px-4 py-2 bg-white backdrop-blur-sm rounded-lg shadow-lg border border-[#EAEAEA] text-xs text-gray-700 font-inter font-medium items-center gap-4">
                                    <span>10 m</span>
                                    <span className="text-gray-300">|</span>
                                    <span>48.8566° N, 2.3522° E</span>
                                </div>
                            </div>
                        </main>
                    )}
                </div>
            </div>
        </>
    );
};

export default Layers;