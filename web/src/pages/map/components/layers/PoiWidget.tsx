import { useState } from "react";
import { POI_CONFIGS } from "../PoiConfig";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";

interface PoiWidgetProps {
    onTogglePoi: (type: string, enabled: boolean) => void;
    currentZoom: number;
    minZoomForPois: number;
}

const PoiWidget = ({ onTogglePoi }: PoiWidgetProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [enabledPois, setEnabledPois] = useState<Record<string, boolean>>(
        Object.fromEntries(
            Object.entries(POI_CONFIGS).map(([key, config]) => [
                key,
                config.enabled,
            ])
        )
    );

    const handleToggle = (type: string) => {
        const newEnabled = !enabledPois[type];
        setEnabledPois((prev) => ({ ...prev, [type]: newEnabled }));
        onTogglePoi(type, newEnabled);
    };

    const closedWidth = "w-40";
    const closedHeight = "h-10";
    const openWidth = "w-80";
    const openHeight = "h-auto";

    return (
        <div
            className={`absolute top-4 right-22 z-[1000] transition-all duration-300 ${
                isOpen ? openWidth : closedWidth
            } ${isOpen ? openHeight : closedHeight}`}
            style={{ minHeight: isOpen ? 200 : undefined }}
            // style={{ minHeight: isOpen ? 200 : undefined, right: isOpen ? 50 : 150 }}
        >
            <div className="bg-white rounded-xl shadow-xl overflow-hidden h-full">
                {/* Header */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center w-full transition-colors duration-200 cursor-pointer ${
                        isOpen
                            ? "px-6 py-4 justify-between hover:bg-gray-50"
                            : "px-2 py-5 justify-center h-full"
                    }`}
                    style={{
                        minHeight: isOpen ? 56 : 32,
                        height: isOpen ? undefined : 32,
                    }}
                >
                    <div
                        className={`flex items-center ${
                            isOpen ? "gap-4" : "gap-2 justify-center w-full"
                        }`}
                        style={{ width: "100%" }}
                    >
                        <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                                isOpen ? "bg-orange-100" : "bg-orange-50"
                            }`}
                        >
                            {isOpen ? (
                                <ChevronUp
                                    size={18}
                                    className="text-orange-500"
                                    strokeWidth={2}
                                />
                            ) : (
                                <ChevronDown
                                    size={18}
                                    className="text-orange-500"
                                    strokeWidth={2}
                                />
                            )}
                        </div>
                        <span
                            className={`transition-all duration-300 flex-1 text-center ${
                                isOpen
                                    ? "font-medium text-gray-900 text-base opacity-100 scale-100"
                                    : "text-sm text-gray-800 opacity-80 scale-90"
                            }`}
                            style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                transition: "all 0.3s",
                                maxWidth: isOpen ? 200 : "100%",
                                marginLeft: -5,
                            }}
                        >
                            Centres d'intérêt
                        </span>
                    </div>
                </button>

                {/* Content */}
                <div
                    className={`transition-all duration-300 overflow-hidden ${
                        isOpen
                            ? "max-h-[600px] opacity-100"
                            : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                >
                    {isOpen && (
                        <>
                            <div className="border-t border-gray-100 py-2">
                                {Object.entries(POI_CONFIGS).map(
                                    ([key, config]) => {
                                        const IconComponent = config.ticon;
                                        const isActive = enabledPois[key];
                                        return (
                                            <button
                                                key={key}
                                                onClick={() =>
                                                    handleToggle(key)
                                                }
                                                className="w-full px-6 py-3 flex items-center gap-4 transition-all relative hover:bg-gray-50 group"
                                            >
                                                {isActive && (
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-full" />
                                                )}
                                                {/* Icône */}
                                                <div
                                                    className={`flex-shrink-0 transition-all ${
                                                        isActive ? "ml-3" : ""
                                                    }`}
                                                >
                                                    <IconComponent
                                                        size={22}
                                                        className={`transition-colors ${
                                                            isActive
                                                                ? "text-orange-500"
                                                                : "text-gray-600"
                                                        }`}
                                                        strokeWidth={1.5}
                                                    />
                                                </div>
                                                {/* Label */}
                                                <span
                                                    className={`text-base flex-1 text-left transition-all ${
                                                        isActive
                                                            ? "text-orange-500 font-medium"
                                                            : "text-gray-700"
                                                    }`}
                                                >
                                                    {config.label}
                                                </span>
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                            {/* Footer */}
                            <div className="border-t border-gray-100">
                                <button className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                                    <div className="w-6 h-6 rounded border-2 border-gray-300 flex items-center justify-center">
                                        <MapPin
                                            size={16}
                                            className="text-gray-600"
                                            strokeWidth={2}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-700">
                                        Ajouter une adresse personnalisé
                                    </span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PoiWidget;
