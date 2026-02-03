import React from "react";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import type {
    DashboardHeaderProps,
    ProjectFilters,
} from "../../../../types/project";

const isFilterActive = (filters: ProjectFilters) => {
    return (
        !!filters.parametersMin ||
        !!filters.parametersMax ||
        !!filters.parcelsMin ||
        !!filters.parcelsMax ||
        (!!filters.timeRange && filters.timeRange !== "") ||
        (filters.timeRange === "custom" &&
            (!!filters.customStartDate || !!filters.customEndDate))
    );
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    searchTerm,
    onSearchChange,
    isFilterOpen,
    onToggleFilter,
    onCreateNew,
    filters,
}) => {
    return (
        <div className="mb-4">
            {/* Dashboard Header */}
            <div className="flex items-center min-h-0 w-full">
                {/* Title */}
                <h1 className="text-base font-semibold text-gray-700 px-6 whitespace-nowrap">
                    Projets clients
                </h1>

                {/* Centered area: search + filter */}
                <div className="flex flex-1 justify-center">
                    <div className="flex items-center gap-5 w-full max-w-lg">
                        {/* Search bar */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un projet..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        {/* Filters button */}
                        <button
                            onClick={onToggleFilter}
                            className={`flex cursor-pointer items-center gap-1 px-3 py-1 rounded-md text-sm transition-all ${
                                isFilterOpen
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
                            }`}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            <span className="font-medium">Filtres</span>
                            {isFilterActive(filters) && (
                                <span className="ml-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Create new button */}
                <button
                    onClick={onCreateNew}
                    className="flex mr-10 cursor-pointer items-center gap-3 px-3.5 py-1.5 bg-white text-gray-900 text-[12px] transition-colors border border-transparent relative group"
                    style={{
                        background: "#fff",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <span className="font-normal">Créer</span>
                    <Plus className="w-4 h-4 transition-transform group-hover:rotate-15" />
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-[7px]"
                        style={{
                            padding: 1,
                            zIndex: -1,
                            background:
                                "linear-gradient(60deg, #E1E1E1 0%, #737373 50%, #E1E1E1 100%)",
                            WebkitMask:
                                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            WebkitMaskComposite: "xor",
                            maskComposite: "exclude",
                        }}
                    />
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;
