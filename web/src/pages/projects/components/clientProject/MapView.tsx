import React, { useState } from "react";
import type { MapViewProps } from "../../../../types/projectDetail";
import { LocateFixed } from "lucide-react";


const MapView: React.FC<MapViewProps> = ({ parcels, isLoading }) => {
    const [activeView, setActiveView] = useState<"parcels" | "map">("parcels");

    if (isLoading) {
        return (
            <div className="w-full h-96 bg-gray-200 rounded-xl animate-pulse" />
        );
    }

    return (
        <div className="relative w-full h-96 bg-gradient-to-br from-blue-100 via-green-100 to-blue-50 rounded-xl overflow-hidden">
            {/* Boutons de contrôle en haut à gauche */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <button
                        onClick={() => setActiveView("parcels")}
                        className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                            activeView === "parcels"
                                ? "bg-white text-gray-900"
                                : "bg-white/80 text-gray-900 hover:bg-white"
                        }`}
                    >
                        Parcels
                    </button>
            </div>

            {/* Bouton Map en haut à droite */}
            <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={() => setActiveView("map")}
                        className={`px-2 py-1 cursor-pointer rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                            activeView === "map"
                                ? "bg-white text-gray-900"
                                : "bg-white/80 text-gray-900 hover:bg-white"
                        }`}
                    >
                        <span>Map</span>
                        <svg
                            className="w-3 h-3"
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
            </div>

            {/* Zone de la carte - placeholder */}
            <div className="w-full h-full flex items-center justify-center"></div>

            {/* Bouton de recentrage en bas à droite */}
            <div className="absolute bottom-4 right-4 z-10">
                <button className="w-7 h-7 bg-white cursor-pointer rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <LocateFixed className="w-4 h-4 text-gray-900" />
                </button>
            </div>

            {/* Note : Ici sera intégrée votre vraie carte plus tard */}
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
    );
};

export default MapView;
