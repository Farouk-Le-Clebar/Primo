import { POI_CONFIGS } from "../../PoiConfig";
import { MapPin } from "lucide-react";

interface PoiWidgetProps {
    enabledPoiTypes: string[];
    onTogglePoi: (type: string, enabled: boolean) => void;
    currentZoom: number;
    minZoomForPois: number;
}

const PoiWidget = ({ enabledPoiTypes, onTogglePoi, currentZoom, minZoomForPois }: PoiWidgetProps) => {

    const handleToggle = (type: string) => {
        const isCurrentlyEnabled = enabledPoiTypes.includes(type);
        onTogglePoi(type, !isCurrentlyEnabled);
    };

    return (
        <div className="bg-white font-inter rounded-xl shadow-lg border border-gray-100 overflow-hidden w-64">
            
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <span className="font-semibold text-gray-800 text-sm">
                    Points d'intérêts
                </span>
                {currentZoom < minZoomForPois && (
                    <p className="text-[10px] text-gray-500 mt-1">Zommez pour afficher les résultats</p>
                )}
            </div>

            <div className="py-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {Object.entries(POI_CONFIGS).map(([key, config]) => {
                    const IconComponent = config.ticon;
                    const isActive = enabledPoiTypes.includes(key);
                    return (
                        <button
                            key={key}
                            onClick={() => handleToggle(key)}
                            className="w-full px-4 py-2.5 flex items-center gap-3 transition-all relative hover:bg-gray-50 group cursor-pointer"
                        >
                            {isActive && (
                                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-full" />
                            )}
                            
                            <div className={`flex-shrink-0 transition-all ${isActive ? "ml-2" : ""}`}>
                                <IconComponent
                                    size={18}
                                    className={`transition-colors ${
                                        isActive ? "text-orange-500" : "text-gray-500"
                                    }`}
                                    strokeWidth={2}
                                />
                            </div>
                            
                            <span
                                className={`text-sm flex-1 text-left transition-all ${
                                    isActive ? "text-orange-600 font-medium" : "text-gray-700"
                                }`}
                            >
                                {config.label}
                            </span>
                        </button>
                    );
                })}
            </div>
            
            <div className="border-t border-gray-100 bg-gray-50">
                <button className="w-full px-4 py-3 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors cursor-pointer">
                    <MapPin size={14} className="text-gray-500" strokeWidth={2} />
                    <span className="text-xs font-medium text-gray-600">
                        Ajouter une adresse personnalisée
                    </span>
                </button>
            </div>
        </div>
    );
};

export default PoiWidget;