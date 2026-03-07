import React from "react";
import { ChevronLeft, Sparkle, HelpCircle } from "lucide-react";
import { FAVORITE_GRADIENT } from "../../../../constants/favorite-gradient";
import ProjectTabs from "./ProjectTabs";
import type { TabKey } from "../../../../types/projectTab";

type ProjectHeaderProps = {
    name: string;
    isFavorite: boolean;
    isLoading: boolean;
    activeTab: TabKey;
    onBack: () => void;
    onToggleFavorite: () => void;
    onTabChange: (tab: TabKey) => void;
};

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
    name,
    isFavorite,
    isLoading,
    activeTab,
    onBack,
    onToggleFavorite,
    onTabChange,
}) => {
    return (
        <div className="flex items-center justify-between h-15">
            {/* Left: back button + tabs */}
            <div className="flex items-center gap-5">
                <button
                    onClick={onBack}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 text-gray-900" />
                </button>

                <ProjectTabs activeTab={activeTab} onTabChange={onTabChange} />
            </div>

            {/* Right: help → favorite → project name */}
            <div className="flex items-center gap-4">
                {isLoading ? (
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                ) : (
                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                        {name}
                    </span>
                )}

                <button
                    onClick={onToggleFavorite}
                    disabled={isLoading}
                    className="p-1 cursor-pointer rounded-lg transition-colors disabled:opacity-50"
                >
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>{isFavorite && FAVORITE_GRADIENT.svg}</defs>
                        <Sparkle
                            className={`w-5 h-5 ${isFavorite ? "text-transparent" : "text-gray-400"}`}
                            style={
                                isFavorite
                                    ? { fill: "url(#favorite-gradient)" }
                                    : {}
                            }
                        />
                    </svg>
                </button>

                <button className="ml-[-15px] p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    <HelpCircle className="w-5 h-5 text-gray-400" />
                </button>
            </div>
        </div>
    );
};

export default ProjectHeader;
