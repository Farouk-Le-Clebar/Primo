import React from "react";
import { ChevronLeft, Star, HelpCircle } from "lucide-react";
import type { ProjectHeaderProps } from "../../../../types/projectDetail";

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
    name,
    isFavorite,
    isLoading,
    onBack,
    onToggleFavorite,
}) => {
    return (
        <div className="relative flex items-center justify-between mb-4 h-12">
            <div className="flex items-center gap-4 z-10">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-900" />
                    <span className="text-xs font-medium">Retour</span>
                </button>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-max text-center">
                {isLoading ? (
                    <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
                ) : (
                    <h1 className="text-sm font-semibold text-gray-900">
                        {name}
                    </h1>
                )}
            </div>

            <div className="flex items-center gap-3 z-10">
                <button
                    onClick={onToggleFavorite}
                    disabled={isLoading}
                    className="p-2 rounded-lg transition-colors disabled:opacity-50"
                >
                    <Star
                        className={`w-5 h-5 ${
                            isFavorite
                                ? "fill-orange-400 text-orange-400"
                                : "text-gray-400"
                        }`}
                    />
                </button>

                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <HelpCircle className="w-5 h-5 text-gray-400" />
                </button>
            </div>
        </div>
    );
};

export default ProjectHeader;
