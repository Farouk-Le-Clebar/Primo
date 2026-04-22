import { useState, useCallback, useRef } from "react";
import { TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { FeatureCollection } from "geojson";

// COMPONENTS
import MapBounds from "./layers/MapBounds";
import ZoomHandler from "./layers/ZoomHandler";
import ShapesLayer from "./layers/ShapesLayer";
import PoiLayer from "./layers/POI/PoiLayer";
import { MIN_ZOOM_FOR_POIS, POI_CONFIGS } from "./PoiConfig";
import LocationHandler from "./layers/LocationHandler";
import NoScrollZone from "../wrapper/NoScrollZone";
import MapControls from "./layers/MapControls/MapControls";
import ParcelInfoPanel from "./layers/ParcelPanel/ParcelInfoPanel";
import ParcelDetailedDashboard from "./layers/ParcelDetailedDashboard/ParcelDetailedDashboard";
import Navbar from "./layers/Navbar/Navbar";
import { mapPreference } from "../../../utils/map";
import { addOkReverseRequest } from "../../../requests/addok";

const getUserMapPreference = (): "basic" | "satellite" => {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return user.mapPreference === "satellite" ? "satellite" : "basic";
    } catch (e) {
        console.warn("Impossible de lire les préférences utilisateur, utilisation de 'basic' par défaut.");
        return "basic";
    }
};

const Layers = () => {
    const map = useMap();
    const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
    const [currentZoom, setCurrentZoom] = useState<number>(6);
    
    const [selectedParcelle, setSelectedParcelle] = useState<{
        bounds: L.LatLngBounds; 
        feature: any; 
        layer: L.Path;
        addokData?: any;
    } | null>(null);
    
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const selectedIdRef = useRef<string | null>(null);

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
    
    const handleCityBoundChange = useCallback((data: any) => setCityBoundData(data), []);
    const handleDepartementsBoundChange = useCallback((data: any) => setDepartementsBoundData(data), []);
    const handleDivisionsBoundChange = useCallback((data: any) => setDivisionsBoundData(data), []);
    const handlePacellesBoundChange = useCallback((data: any) => setPacellesBoundData(data), []);
    const handlePoisChange = useCallback((data: FeatureCollection | null) => setPoisData(data), []);

    const handleParcelleSelect = useCallback(async (bounds: L.LatLngBounds, feature: any, layer: L.Path) => {
        const id = feature.id;
        selectedIdRef.current = id;
        
        setSelectedParcelle({ bounds, feature, layer });
        setIsDashboardOpen(false);

        try {
            const center = bounds.getCenter();
            const addokResponse = await addOkReverseRequest(center.lng, center.lat);
            
            if (addokResponse && addokResponse.features && addokResponse.features.length > 0) {
                const adresseData = addokResponse.features[0];
                const banId = adresseData.properties.id;
                const enrichedFeature = {
                    ...feature,
                    properties: {
                        ...feature.properties,
                        ban: banId,
                        addok_label: adresseData.properties.label,
                        addok_score: adresseData.properties.score
                    }
                };

                setSelectedParcelle(prev => {
                    if (prev && prev.feature.id !== id) return prev;
                    
                    return {
                        ...prev!,
                        feature: enrichedFeature,
                        addokData: addokResponse
                    };
                });
            }
        } catch (error) {
            console.error("Erreur lors du reverse geocoding avec Addok:", error);
        }
    }, []);

    const handleChangeMapType = useCallback((type: "basic" | "satellite") => {
        setMapType(type);
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            user.mapPreference = type;
            localStorage.setItem("user", JSON.stringify(user));
        } catch (e) {
            console.error("Erreur lors de la sauvegarde des préférences.");
        }
    }, []);

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
                    divisions: divisionsBoundData 
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

            <div className="flex fixed inset-0 z-[1001] flex-col pointer-events-none">
                <header className="flex w-full h-15 items-center shrink-0 pointer-events-auto">
                    <NoScrollZone>
                        <Navbar 
                            parcelleBounds={pacellesBoundData}
                            onParcelleSelect={handleParcelleSelect}
                        />
                    </NoScrollZone>
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
                                <NoScrollZone>
                                    <MapControls 
                                        onZoomIn={() => map.zoomIn()} 
                                        onZoomOut={() => map.zoomOut()}
                                        onLocateUser={() => map.locate({ setView: true, maxZoom: 16 })}
                                        currentMapType={mapType}
                                        onChangeMapType={handleChangeMapType}
                                        enabledPoiTypes={enabledPoiTypes}
                                        onTogglePoi={handleTogglePoi}
                                        currentZoom={currentZoom}
                                        minZoomForPois={MIN_ZOOM_FOR_POIS}
                                    />
                                </NoScrollZone>
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