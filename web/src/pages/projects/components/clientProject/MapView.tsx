import React, { useState, useRef, useEffect } from "react";
import type { Parcel } from "../../../../types/projectDetail";
import { LocateFixed, Map, List } from "lucide-react";
import ListView from "./ListView";

type MapViewProps = {
    parcels?: Parcel[];
    isLoading: boolean;
};

const MapView: React.FC<MapViewProps> = ({ parcels, isLoading }) => {
    const [activeView, setActiveView] = useState<"map" | "list">("map");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleViewChange = (view: "map" | "list") => {
        if (view !== activeView) {
            setActiveView(view);
        }
        setIsDropdownOpen(false);
    };

    if (isLoading) {
        return (
            <div className="w-full h-96 bg-gray-200 rounded-xl animate-pulse" />
        );
    }

    return (
        <div className={`relative w-full h-96 rounded-xl overflow-hidden transition-colors duration-300 ${
            activeView === "list"
                ? "bg-white"
                : "bg-gradient-to-br from-blue-100 via-green-100 to-blue-50"
        }`}>
            {/* Title */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                <div className="text-xs font-medium text-gray-900 px-2 py-1 bg-white rounded-md shadow-sm">
                    Parcelles
                </div>
            </div>

            {/* View selector button/dropdown */}
            <div className="absolute top-4 right-4 z-20" ref={dropdownRef}>
                {!isDropdownOpen ? (
                    // Bouton fermé
                    <button
                        onClick={() => setIsDropdownOpen(true)}
                        className="px-2 py-1 cursor-pointer rounded-md text-xs font-medium transition-all flex items-center gap-1 bg-white text-gray-900 hover:bg-gray-50 shadow-sm"
                    >
                        <span>{activeView === "map" ? "Carte" : "Liste"}</span>
                        <svg
                            className="w-3 h-3 transition-transform duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.4}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                ) : (
                    // Modal ouverte (le bouton transformé)
                    <div className="bg-white rounded-lg shadow overflow-hidden animate-scale-in">
                        <button
                            onClick={() => handleViewChange("map")}
                            className={`w-full px-3 py-2 flex items-center gap-4 text-xs font-medium transition-colors ${
                                activeView === "map"
                                    ? "bg-green-50 text-green-600"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <span>Carte</span>
                            <Map className="w-4 h-4" />
                        </button>

                        <div className="border-t border-gray-200" />

                        <button
                            onClick={() => handleViewChange("list")}
                            className={`w-full px-3 py-2 flex items-center gap-4 text-xs font-medium transition-colors ${
                                activeView === "list"
                                    ? "bg-green-50 text-green-600"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <span>Liste</span>
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Content area */}
            <div className={`w-full h-full ${activeView === "list" ? "pt-16" : ""}`}>
                {activeView === "map" ? (
                    <>
                        {/* Map placeholder */}
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                <svg
                                    className="w-24 h-24 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Recenter button (only visible in map view) */}
                        <div className="absolute bottom-4 right-4 z-10">
                            <button className="w-7 h-7 bg-white cursor-pointer rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
                                <LocateFixed className="w-4 h-4 text-gray-900" />
                            </button>
                        </div>
                    </>
                ) : (
                    <ListView itemCount={parcels?.length || 8} />
                )}
            </div>

            <style>{`
                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-scale-in {
                    animation: scale-in 0.15s ease-out;
                }
            `}</style>
        </div>
    );
};

export default MapView;
