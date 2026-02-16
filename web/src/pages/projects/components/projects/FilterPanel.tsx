import React, { useEffect, useRef } from "react";
import type { ProjectFilters } from "../../../../types/project";

import { TIME_RANGES } from "../../../../constants/project.constants";


type FilterPanelProps = {
    isOpen: boolean;
    onClose: () => void;
    filters: ProjectFilters;
    onFiltersChange: (filters: ProjectFilters) => void;
}


const FilterPanel: React.FC<FilterPanelProps> = ({
    isOpen,
    onClose,
    filters,
    onFiltersChange,
}) => {
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleReset = () => {
        onFiltersChange({
            parametersMin: "",
            parametersMax: "",
            parcelsMin: "",
            parcelsMax: "",
            timeRange: "",
            customStartDate: "",
            customEndDate: "",
        });
    };

    return (
        <div
            ref={panelRef}
            className="absolute right-10 top-12 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80 z-100"
        >
            <div className="space-y-4">
                {/* Parameter filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de paramètres
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.parametersMin}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    parametersMin: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.parametersMax}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    parametersMax: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                        />
                    </div>
                </div>

                {/* Parcels filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de parcelles
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.parcelsMin}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    parcelsMin: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.parcelsMax}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    parcelsMax: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                        />
                    </div>
                </div>

                {/* Time range filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Période de modification
                    </label>
                    <select
                        value={filters.timeRange}
                        onChange={(e) =>
                            onFiltersChange({
                                ...filters,
                                timeRange: e.target.value,
                            })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Toutes les dates</option>
                        {TIME_RANGES.map((range) => (
                            <option key={range.value} value={range.value}>
                                {range.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Custom dates */}
                {filters.timeRange === "custom" && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Date de début
                        </label>
                        <input
                            type="date"
                            value={filters.customStartDate}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    customStartDate: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <label className="block text-sm font-medium text-gray-700 mt-2">
                            Date de fin
                        </label>
                        <input
                            type="date"
                            value={filters.customEndDate}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    customEndDate: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 pt-2 border-t border-gray-200">
                    <button
                        onClick={handleReset}
                        className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        Réinitialiser
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
                    >
                        Appliquer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;
