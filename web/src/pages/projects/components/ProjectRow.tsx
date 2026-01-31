import React from "react";
import { Star, Trash2 } from "lucide-react";
import type { ProjectRowProps } from "../../../types/project";
import { formatDate, formatDateTime } from "../../../utils/project";

/**
 * Composant représentant une ligne de projet dans le tableau
 */
const ProjectRow: React.FC<ProjectRowProps> = ({
    project,
    onProjectClick,
    onToggleFavorite,
    onDeleteClick,
}) => {
    return (
        <tr
            onClick={() => onProjectClick(project)}
            className="hover:bg-gray-50 cursor-pointer transition-colors"
        >
            {/* Colonne Nom */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-gray-600">
                            {project.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <span className="text-sm text-gray-900">
                        {project.name}
                    </span>
                </div>
            </td>

            {/* Colonne Paramètres */}
            <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-600 rounded-md text-sm">
                    <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                    </svg>
                    {project.parameters} parameters
                </span>
            </td>

            {/* Colonne Parcelles */}
            <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-600 rounded-md text-sm">
                    <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                    </svg>
                    {project.parcels} parcels
                </span>
            </td>

            {/* Colonne Date de création */}
            <td className="px-6 py-4">
                <span className="text-sm text-gray-600">
                    {formatDate(project.createdAt)}
                </span>
            </td>

            {/* Colonne Dernière modification */}
            <td className="px-6 py-4">
                <span className="relative inline-block">
                    {/* Surlignage carré gris */}
                    <span
                        className="absolute left-1/2 top-1/2 -translate-x-[-20px] -translate-y-1/2 w-[32%] h-5 bg-gray-200 rounded-[2px] z-0"
                        aria-hidden="true"
                    />
                    <span className="relative text-sm text-gray-600 z-10 px-1">
                        {formatDateTime(project.modifiedAt)}
                    </span>
                </span>
            </td>

            {/* Colonne Actions */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    {/* Bouton Favori */}
                    <button
                        onClick={(e) => onToggleFavorite(project.id, e)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        aria-label={
                            project.isFavorite
                                ? "Retirer des favoris"
                                : "Ajouter aux favoris"
                        }
                    >
                        <Star
                            className={`w-5 h-5 ${
                                project.isFavorite
                                    ? "fill-orange-400 text-orange-400"
                                    : "text-gray-400"
                            }`}
                        />
                    </button>

                    {/* Bouton Supprimer */}
                    <button
                        onClick={(e) => onDeleteClick(project, e)}
                        className="p-1.5 hover:bg-red-50 rounded transition-colors"
                        aria-label="Supprimer le projet"
                    >
                        <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default ProjectRow;
