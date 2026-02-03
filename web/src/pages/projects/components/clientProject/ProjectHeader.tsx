import React from "react";
import { ChevronLeft, Sparkle, HelpCircle } from "lucide-react";
import type { ProjectHeaderProps } from "../../../../types/projectDetail";
import { FAVORITE_GRADIENT } from "../../../../constants/favorite-gradient";

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
    name,
    isFavorite,
    isLoading,
    onBack,
    onToggleFavorite,
}) => {
    return (
        <div className="relative flex items-center justify-between h-12">
            {/* Bouton retour */}
            <div className="flex items-center gap-4 z-10">
                <button
                    onClick={onBack}
                    className="flex cursor-pointer items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-900" />
                    <span className="text-xs font-medium">Retour</span>
                </button>
            </div>

            {/* Titre centré + étoile */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-max flex items-center gap-5 text-center">
                {isLoading ? (
                    <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
                ) : (
                    <>
                        <h1 className="text-sm font-semibold text-gray-900">
                            {name}
                        </h1>
                        <button
                            onClick={onToggleFavorite}
                            disabled={isLoading}
                            className="p-2 cursor-pointer rounded-lg transition-colors disabled:opacity-50"
                        >
                            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>{isFavorite && FAVORITE_GRADIENT.svg}</defs>
                                <Sparkle
                                    className={`w-5 h-5 ${isFavorite ? 'text-orange-400' : 'text-gray-400'}`}
                                    style={isFavorite ? { fill: 'url(#favorite-gradient)' } : {}}
                                />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Actions : Aide */}
            <div className="flex items-center gap-3 z-10">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <HelpCircle className="w-5 h-5 text-gray-400" />
                </button>
            </div>
        </div>
    );
};

export default ProjectHeader;
