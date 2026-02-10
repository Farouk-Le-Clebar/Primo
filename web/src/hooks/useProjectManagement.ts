import { useState, useEffect, useMemo, useCallback } from "react";
import type {
    ClientProject,
    SortConfig,
    SortKey,
    ProjectFilters,
    DeleteModalState,
} from "../types/project";
import type { ProjectResponse } from "../types/projectCreate";
import { processProjects, getDefaultFilters } from "../utils/project";
import {
    fetchProjects,
    updateProjectFavorite,
    deleteProject as deleteProjectApi,
} from "../requests/projectRequests";

/**
 * Convertit une réponse API en ClientProject pour l'affichage dashboard
 */
const toClientProject = (p: ProjectResponse): ClientProject => ({
    id: p.id,
    name: p.name,
    parameters: p.parameters ? Object.keys(p.parameters).length : 0,
    parcels: p.parcels ? p.parcels.length : 0,
    createdAt: p.createdAt,
    modifiedAt: p.modifiedAt,
    isFavorite: p.isFavorite,
});

/**
 * Hook pour recherche debounce
 */
export const useSearch = (initialValue = "", delay = 500) => {
    const [searchTerm, setSearchTerm] = useState(initialValue);
    const [debouncedSearchTerm, setDebouncedSearchTerm] =
        useState(initialValue);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, delay);

        return () => clearTimeout(timer);
    }, [searchTerm, delay]);

    return { searchTerm, setSearchTerm, debouncedSearchTerm };
};

/**
 * Hook tri des colonnes
 */
export const useSort = (initialKey: SortKey | null = null) => {
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: initialKey,
        direction: "asc",
    });

    const handleSort = (key: SortKey) => {
        if (sortConfig.key !== key) {
            // Premier clic : tri ascendant sur une nouvelle colonne
            setSortConfig({ key, direction: "asc" });
        } else if (sortConfig.direction === "asc") {
            // Deuxième clic : tri descendant
            setSortConfig({ key, direction: "desc" });
        } else if (sortConfig.direction === "desc") {
            // Troisième clic : réinitialisation
            setSortConfig({ key: null, direction: "asc" });
        }
    };

    return { sortConfig, handleSort };
};

/**
 * Hook filtres
 */
export const useFilters = () => {
    const [filters, setFilters] = useState<ProjectFilters>(getDefaultFilters());
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const toggleFilterPanel = () => setIsFilterOpen(!isFilterOpen);
    const closeFilterPanel = () => setIsFilterOpen(false);

    return {
        filters,
        setFilters,
        isFilterOpen,
        toggleFilterPanel,
        closeFilterPanel,
    };
};

/**
 * Hook projets (CRUD) avec appels API
 */
export const useProjects = () => {
    const [projects, setProjects] = useState<ClientProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProjects = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await fetchProjects();
            setProjects(data.map(toClientProject));
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Erreur lors du chargement des projets",
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    const toggleFavorite = useCallback(
        async (projectId: string) => {
            const project = projects.find((p) => p.id === projectId);
            if (!project) return;

            const newValue = !project.isFavorite;
            setProjects((prev) =>
                prev.map((p) =>
                    p.id === projectId ? { ...p, isFavorite: newValue } : p,
                ),
            );

            try {
                await updateProjectFavorite(projectId, newValue);
            } catch {
                setProjects((prev) =>
                    prev.map((p) =>
                        p.id === projectId
                            ? { ...p, isFavorite: !newValue }
                            : p,
                    ),
                );
            }
        },
        [projects],
    );

    const removeProject = useCallback(
        async (projectId: string) => {
            const backup = projects;
            setProjects((prev) => prev.filter((p) => p.id !== projectId));

            try {
                await deleteProjectApi(projectId);
            } catch {
                setProjects(backup);
            }
        },
        [projects],
    );

    return {
        projects,
        isLoading,
        error,
        setProjects,
        toggleFavorite,
        deleteProject: removeProject,
        refreshProjects: loadProjects,
    };
};

/**
 * Hook modal de suppression
 */
export const useDeleteModal = () => {
    const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
        isOpen: false,
        project: null,
    });

    const openDeleteModal = (project: ClientProject) => {
        setDeleteModal({ isOpen: true, project });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, project: null });
    };

    return {
        deleteModal,
        openDeleteModal,
        closeDeleteModal,
    };
};

/**
 * Hook traitement et filtrage des projets
 */
export const useProcessedProjects = (
    projects: ClientProject[],
    searchTerm: string,
    filters: ProjectFilters,
    sortConfig: SortConfig,
) => {
    return useMemo(
        () => processProjects(projects, searchTerm, filters, sortConfig),
        [projects, searchTerm, filters, sortConfig],
    );
};
