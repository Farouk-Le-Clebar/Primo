// à changer car pas beau dutout

import { useState } from 'react';
import { POI_CONFIGS } from '../MapUtils';

interface PoiWidgetProps {
    onTogglePoi: (type: string, enabled: boolean) => void;
    currentZoom: number;
    minZoomForPois: number;
}

const PoiWidget = ({ onTogglePoi, currentZoom }: PoiWidgetProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [enabledPois, setEnabledPois] = useState<Record<string, boolean>>(
        Object.fromEntries(
            Object.entries(POI_CONFIGS).map(([key, config]) => [key, config.enabled])
        )
    );

    const handleToggle = (type: string) => {
        const newEnabled = !enabledPois[type];
        setEnabledPois((prev) => ({ ...prev, [type]: newEnabled }));
        onTogglePoi(type, newEnabled);
    };

    const activeCount = Object.values(enabledPois).filter(Boolean).length;

    return (
        <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200">
            {/* Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 flex items-center justify-between text-gray-800 hover:bg-gray-50 rounded-t-lg transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">Points d'intérêt</span>
                </div>
                <span className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>

            

            {/* Content */}
            {isOpen && (
                <div className="p-3 space-y-2 max-h-96 overflow-y-auto border-t border-gray-200">
                    {Object.entries(POI_CONFIGS).map(([key, config]) => (
                        <label
                            key={key}
                            className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50 transition-colors $
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={enabledPois[key]}
                                onChange={() => handleToggle(key)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                            />
                            <span className="text-xl" style={{ minWidth: '24px' }}>
                                {config.icon}
                            </span>
                            <div className="flex-1">
                                <span className="text-sm font-medium text-gray-800">
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

            {/* Footer */}
            {isOpen && (
                <div className="px-4 py-2 border-t border-gray-200 text-xs text-gray-600 flex items-center justify-between">
                    <span>{activeCount} type(s) activé(s)</span>
                    <span className="text-gray-400">Zoom: {currentZoom}</span>
                </div>
            )}
        </div>
    );
};

export default PoiWidget;