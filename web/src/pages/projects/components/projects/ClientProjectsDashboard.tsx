import React from "react";
import type { ClientProject } from "../../../../types/project";
import {
    useSearch,
    useSort,
    useFilters,
    useProjects,
    useProcessedProjects,
} from "../../../../hooks/useProjectManagement";
import DashboardHeader from "./DashboardHeader";
import FilterPanel from "./FilterPanel";
import ProjectTable from "./ProjectTable";


type ClientProjectsDashboardProps = {
    onProjectClick: (project: ClientProject) => void;
    onCreateNew: () => void;
};

const SkeletonRow = () => (
    <tr>
        <td className="px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
            </div>
        </td>
        <td className="px-6 py-4">
            <div className="h-6 w-28 bg-gray-200 rounded-md animate-pulse" />
        </td>
        <td className="px-6 py-4">
            <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse" />
        </td>
        <td className="px-6 py-4">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </td>
        <td className="px-6 py-4">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </td>
        <td className="px-6 py-4">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gray-200 rounded animate-pulse" />
                <div className="w-7 h-7 bg-gray-200 rounded animate-pulse" />
            </div>
        </td>
    </tr>
);

export const ClientProjectsDashboard: React.FC<
    ClientProjectsDashboardProps
> = ({ onProjectClick, onCreateNew }) => {
    const { searchTerm, setSearchTerm, debouncedSearchTerm } = useSearch();
    const { sortConfig, handleSort } = useSort();
    const {
        filters,
        setFilters,
        isFilterOpen,
        toggleFilterPanel,
        closeFilterPanel,
    } = useFilters();

    const { projects, isLoading, error, toggleFavorite, deleteProject } =
        useProjects();

    const processedProjects = useProcessedProjects(
        projects,
        debouncedSearchTerm,
        filters,
        sortConfig,
    );

    const handleToggleFavorite = (projectId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(projectId);
    };

    const handleDeleteProject = (projectId: string) => {
        deleteProject(projectId);
    };

    return (
        <div className="w-full font-UberMove h-full bg-gray-50 p-8">
            <DashboardHeader
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                isFilterOpen={isFilterOpen}
                onToggleFilter={toggleFilterPanel}
                onCreateNew={onCreateNew}
                filters={filters}
            />

            <div className="relative mb-6">
                <FilterPanel
                    isOpen={isFilterOpen}
                    onClose={closeFilterPanel}
                    filters={filters}
                    onFiltersChange={setFilters}
                />
            </div>

            {isLoading ? (
                <div className="rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {[
                                    "Noms",
                                    "Paramètres",
                                    "Parcelles",
                                    "Date de création",
                                    "Dernière modification",
                                    "Actions",
                                ].map((col) => (
                                    <th
                                        key={col}
                                        className="px-6 py-3 text-left"
                                    >
                                        <span className="text-sm font-medium text-gray-700">
                                            {col}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonRow key={i} />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : error ? (
                <div className="py-12 text-center text-red-500">{error}</div>
            ) : (
                <ProjectTable
                    projects={processedProjects}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    onProjectClick={onProjectClick}
                    onToggleFavorite={handleToggleFavorite}
                    onDeleteProject={handleDeleteProject}
                />
            )}
        </div>
    );
};
