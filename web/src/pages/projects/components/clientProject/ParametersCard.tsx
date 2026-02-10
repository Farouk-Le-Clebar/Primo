import React from "react";
import { ChevronRight } from "lucide-react";


type ParametersCardProps = {
    data?: any;
    isLoading: boolean;
    onViewAll: () => void;
};


const ParametersCard: React.FC<ParametersCardProps> = ({
    // data,
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
            {/* Header with title and button */}
            <div className="flex items-center justify-between p-4 flex-shrink-0">
                <h3 className="text-sm font-semibold text-gray-900">
                    Paramètres
                </h3>

                <button
                    onClick={onViewAll}
                    className="flex cursor-pointer items-center bg-gray-100 gap-1.5 px-3 py-1.5 text-gray-900 rounded-lg transition-all text-xs font-medium group"
                >
                    <span>Voir tout</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-[2px]" />
                </button>
            </div>

            <div className="flex-1 relative overflow-hidden">
                <img
                    src="/parametercard.svg"
                    alt="Graphique"
                    className="absolute inset-0 w-full h-full object-contain"
                />
            </div>
        </div>
    );
};

export default ParametersCard;
