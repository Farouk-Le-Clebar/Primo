import React from "react";
import "./ParametersCard.css";
import { ChevronRight } from "lucide-react";
import type { ParametersCardProps } from "../../../../types/projectDetail";

const ParametersCard: React.FC<ParametersCardProps> = ({
    data,
    isLoading,
    onViewAll,
}) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 h-full flex flex-col overflow-hidden">
                <div className="p-4 flex-shrink-0">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex-1 bg-gray-200 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 h-full flex flex-col overflow-hidden">
            {/* En-tête avec titre et bouton */}
            <div className="flex items-center justify-between p-4 flex-shrink-0">
                <h3 className="text-sm font-semibold text-gray-900">
                    Paramètres
                </h3>

                <button
                    onClick={onViewAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-gray-900 rounded-lg hover:shadow-md transition-all text-xs font-medium animated-gradient"
                >
                    <span>Voir tout</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Graphique - Prend toute la largeur et hauteur restante */}
            <div className="flex-1 relative bg-gradient-to-t from-cyan-50 to-transparent overflow-hidden">
                {/* Ligne de graphique simulée */}
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 400 160"
                    preserveAspectRatio="none"
                >
                    {/* Courbe jaune/orange */}
                    <path
                        d="M 0 100 Q 50 80, 100 90 T 200 70 T 300 85 T 400 75"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                    />

                    {/* Définition du gradient */}
                    <defs>
                        <linearGradient
                            id="gradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            <stop offset="0%" stopColor="#fdc435" />
                            <stop offset="50%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#fbbf24" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Zone de remplissage sous la courbe */}
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 400 160"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M 0 100 Q 50 80, 100 90 T 200 70 T 300 85 T 400 75 L 400 160 L 0 160 Z"
                        fill="url(#areaGradient)"
                        opacity="0.2"
                    />

                    <defs>
                        <linearGradient
                            id="areaGradient"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                        >
                            <stop offset="0%" stopColor="#fbbf24" />
                            <stop
                                offset="100%"
                                stopColor="#fbbf24"
                                stopOpacity="0"
                            />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
};

export default ParametersCard;
