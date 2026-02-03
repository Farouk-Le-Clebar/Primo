import React from "react";
<ChevronsUpDown />;
import type { ProjectTableProps, SortKey } from "../../../../types/project";
import ProjectRow from "./ProjectRow";
import { ChevronsUpDown } from "lucide-react";

const SortIcon: React.FC<{
    columnKey: SortKey;
    currentKey: SortKey | null;
    direction: "asc" | "desc";
}> = ({ columnKey, currentKey, direction }) => {
    if (currentKey !== columnKey) {
        return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }
    return direction === "asc" ? (
        <ChevronsUpDown className="w-4 h-4 text-gray-700" />
    ) : (
        <ChevronsUpDown className="w-4 h-4 text-gray-700" />
    );
};

const ProjectTable: React.FC<ProjectTableProps> = ({
    projects,
    sortConfig,
    onSort,
    onProjectClick,
    onToggleFavorite,
    onDeleteClick,
}) => {
    const columns: Array<{ key: SortKey; label: string }> = [
        { key: "name", label: "Noms" },
        { key: "parameters", label: "Paramètres" },
        { key: "parcels", label: "Parcelles" },
        { key: "createdAt", label: "Date de création" },
        { key: "modifiedAt", label: "Dernière modification" },
    ];

    return (
        <div className="rounded-lg overflow-hidden">
            <table className="w-full">
                {/* header */}
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className="px-6 py-3 text-left"
                            >
                                <button
                                    onClick={() => onSort(column.key)}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                                >
                                    {column.label}
                                    <SortIcon
                                        columnKey={column.key}
                                        currentKey={sortConfig.key}
                                        direction={sortConfig.direction}
                                    />
                                </button>
                            </th>
                        ))}
                        <th className="px-6 py-3 text-left">
                            <span className="text-sm font-medium text-gray-700">
                                Actions
                            </span>
                        </th>
                    </tr>
                </thead>

                {/* body */}
                <tbody className="divide-y divide-gray-200">
                    {projects.map((project) => (
                        <ProjectRow
                            key={project.id}
                            project={project}
                            onProjectClick={onProjectClick}
                            onToggleFavorite={onToggleFavorite}
                            onDeleteClick={onDeleteClick}
                        />
                    ))}
                </tbody>
            </table>

            {/* No results message */}
            {projects.length === 0 && (
                <div className="font-normal py-12 text-center text-gray-500">
                    Aucun projet trouvé avec les critères de recherche actuels
                </div>
            )}
        </div>
    );
};

export default ProjectTable;
