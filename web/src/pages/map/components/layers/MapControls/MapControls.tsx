import { useState, useRef, useEffect } from "react";

import MapPreference from "../preference/MapPreference";
import PoiWidget from "../POI/PoiWidget";

import PlusIcon from "../../../../../assets/icons/map/PlusIcon.svg?react";
import MinusIcon from "../../../../../assets/icons/map/MinusIcon.svg?react";
import LayersIcon from "../../../../../assets/icons/map/LayerIcon.svg?react";
import LocateIcon from "../../../../../assets/icons/map/ArrowIcon.svg?react";
import IaIcon from "../../../../../assets/icons/map/IaIcon.svg?react";
import PoiIcon from "../../../../../assets/icons/map/PoiIcon.svg?react";
import AiLayer from "../AI/AiLayer";

interface MapControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onToggleLayers?: () => void;
    onLocateUser?: () => void;
    currentMapType: "basic" | "satellite" | "basic-dark";
    onChangeMapType: (type: "basic" | "satellite" | "basic-dark") => void;
    enabledPoiTypes: string[];
    onTogglePoi: (type: string, enabled: boolean) => void;
    currentZoom: number;
    minZoomForPois: number;
}

export default function MapControls({
    onZoomIn,
    onZoomOut,
    onLocateUser,
    currentMapType,
    onChangeMapType,
    enabledPoiTypes,
    onTogglePoi,
    currentZoom,
    minZoomForPois
}: MapControlsProps) {
    const [isPreferenceOpen, setIsPreferenceOpen] = useState(false);
    const [isPoiOpen, setIsPoiOpen] = useState(false);
    const [isAiOpen, setIsAiOpen] = useState(false);

    const preferenceRef = useRef<HTMLDivElement>(null);
    const poiRef = useRef<HTMLDivElement>(null);
    const aiRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (preferenceRef.current && !preferenceRef.current.contains(target)) {
                setIsPreferenceOpen(false);
            }
            if (poiRef.current && !poiRef.current.contains(target)) {
                setIsPoiOpen(false);
            }
            if (aiRef.current && !aiRef.current.contains(target)) {
                setIsAiOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMenu = (menuToToggle: "preference" | "poi" | "ai") => {
        setIsPreferenceOpen(menuToToggle === "preference" ? !isPreferenceOpen : false);
        setIsPoiOpen(menuToToggle === "poi" ? !isPoiOpen : false);
        setIsAiOpen(menuToToggle === "ai" ? !isAiOpen : false);
    };

    return (
        <div className="absolute top-6 right-6 pointer-events-auto flex flex-col gap-2 items-end z-[1002]">

            <div className="flex flex-col rounded-xl shadow-md bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-[#262626] overflow-hidden text-gray-700 dark:text-white">
                <button
                    type="button"
                    onClick={onZoomIn}
                    className="h-10 w-10 text-xl font-medium flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
                >
                    <PlusIcon className="w-4.5 h-4.5 stroke-current" />
                </button>
                <div className="w-full h-px bg-gray-100 dark:bg-[#262626]" />
                <button
                    type="button"
                    onClick={onZoomOut}
                    className="h-10 w-10 text-xl font-medium flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
                >
                    <MinusIcon className="w-4.5 h-4.5 stroke-current" />
                </button>
            </div>

            <div ref={preferenceRef} className="relative flex items-center">
                <div className="absolute right-full mr-3 top-0">
                    <MapPreference
                        isOpen={isPreferenceOpen}
                        currentMapType={currentMapType}
                        onChangeMapType={onChangeMapType}
                    />
                </div>

                <div className="flex flex-col rounded-xl shadow-md bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-[#262626] overflow-hidden text-gray-700 dark:text-white">
                    <button
                        type="button"
                        onClick={() => toggleMenu("preference")}
                        className={`h-10 w-10 flex items-center justify-center transition-colors ${isPreferenceOpen ? "bg-gray-50 dark:bg-[#1a1a1a] text-green-600" : "hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
                            }`}
                    >
                        <LayersIcon className="w-4.5 h-4.5 stroke-current" />
                    </button>

                    <div className="w-full h-px bg-gray-100 dark:bg-[#262626]" />

                    <button
                        type="button"
                        onClick={onLocateUser}
                        className="h-10 w-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
                    >
                        <LocateIcon className="w-4.5 h-4.5 stroke-current" />
                    </button>
                </div>
            </div>

            <div ref={aiRef} className="relative flex items-center">
                <div className="absolute right-full mr-3 top-0">
                    <div className={`transition-all duration-300 origin-right ${isAiOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                        }`}>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => toggleMenu("ai")}
                    className={`h-10 w-10 rounded-xl shadow-md border border-gray-100 dark:border-[#262626] flex items-center justify-center transition-colors text-gray-700 dark:text-white ${isAiOpen
                        ? "bg-gray-50 dark:bg-[#1a1a1a] text-green-600"
                        : "bg-white dark:bg-[#0A0A0A] hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
                        }`}
                >
                    <IaIcon className="w-4.5 h-4.5 stroke-current" />
                </button>

                {isAiOpen && (
                    <div className="absolute top-12 right-0 z-50">
                        <AiLayer />
                    </div>
                )}
            </div>

            <div ref={poiRef} className="relative flex items-center">
                <div className="absolute right-full mr-3 top-0">
                    <div className={`transition-all duration-300 origin-right ${isPoiOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                        }`}>
                        {isPoiOpen && (
                            <PoiWidget
                                enabledPoiTypes={enabledPoiTypes}
                                onTogglePoi={onTogglePoi}
                                currentZoom={currentZoom}
                                minZoomForPois={minZoomForPois}
                            />
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => toggleMenu("poi")}
                    className={`h-10 w-10 rounded-xl shadow-md border border-gray-100 dark:border-[#262626] flex items-center justify-center transition-colors text-gray-700 dark:text-white ${isPoiOpen ? "bg-gray-50 dark:bg-[#1a1a1a] text-green-600" : "bg-white dark:bg-[#0A0A0A] hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
                        }`}
                >
                    <PoiIcon className="w-4.5 h-4.5 stroke-current" />
                </button>
            </div>

        </div>
    );
}