import { useState } from "react";
import { POI_CONFIGS } from "../../types/poi.types";

interface PoiWidgetProps {
    onTogglePoi: (type: string, enabled: boolean) => void;
    darkMode?: boolean;
}

const PoiWidget = ({ onTogglePoi, darkMode = false }: PoiWidgetProps) => {
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

    const bgColor = darkMode ? "bg-gray-800" : "bg-white";
    const textColor = darkMode ? "text-white" : "text-gray-800";
    const borderColor = darkMode ? "border-gray-700" : "border-gray-200";
    const hoverBg = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50";

    return (
        <div
            className={`absolute top-4 right-4 z-[1000] ${bgColor} rounded-lg shadow-lg border ${borderColor}`}
        >
            {/* Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-2.5 flex items-center justify-between ${textColor} ${hoverBg} rounded-t-lg transition-colors`}
            >
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                        Points d'intérêt
                    </span>
                </div>
                <span
                    className={`text-xs transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                >
                    ▼
                </span>
            </button>

            {/* Content */}
            {isOpen && (
                <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
                    {Object.entries(POI_CONFIGS).map(([key, config]) => (
                        <label
                            key={key}
                            className={`flex items-center gap-3 p-2 rounded cursor-pointer ${hoverBg} transition-colors`}
                        >
                            <input
                                type="checkbox"
                                checked={enabledPois[key]}
                                onChange={() => handleToggle(key)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <span
                                className="text-xl"
                                style={{ minWidth: "24px" }}
                            >
                                {config.icon}
                            </span>
                            <div className="flex-1">
                                <span
                                    className={`text-sm font-medium ${textColor}`}
                                >
                                    {config.label}
                                </span>
                            </div>
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: config.color }}
                            />
                        </label>
                    ))}
                </div>
            )}

            {/* Footer with count */}
            {isOpen && (
                <div
                    className={`px-4 py-2 border-t ${borderColor} text-xs ${textColor} opacity-60`}
                >
                    {Object.values(enabledPois).filter(Boolean).length} type(s)
                    activé(s)
                </div>
            )}
        </div>
    );
};

export default PoiWidget;
