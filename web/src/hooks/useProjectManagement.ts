import { useState, useEffect, useMemo } from "react";
import type {
    ClientProject,
    SortConfig,
    SortKey,
    ProjectFilters,
    DeleteModalState,
} from "../types/project";
import { processProjects, getDefaultFilters } from "../utils/project";

/**
 * Hook personnalisé pour gérer la recherche avec debounce
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
 * Hook personnalisé pour gérer le tri des colonnes
 */
export const useSort = (initialKey: SortKey | null = null) => {
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: initialKey,
        direction: "asc",
    });

    const handleSort = (key: SortKey) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    return { sortConfig, handleSort };
};

/**
 * Hook personnalisé pour gérer les filtres
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
 * Hook personnalisé pour gérer les projets (CRUD)
 */
export const useProjects = (initialProjects: ClientProject[]) => {
    const [projects, setProjects] = useState<ClientProject[]>(initialProjects);

    /**
     * Bascule le statut favori d'un projet
     */
    const toggleFavorite = (projectId: number) => {
        setProjects((prevProjects) =>
            prevProjects.map((project) =>
                project.id === projectId
                    ? { ...project, isFavorite: !project.isFavorite }
                    : project,
            ),
        );
    };

    /**
     * Supprime un projet
     */
    const deleteProject = (projectId: number) => {
        setProjects((prevProjects) =>
            prevProjects.filter((p) => p.id !== projectId),
        );
    };

    /**
     * Ajoute un nouveau projet
     */
    const addProject = (project: ClientProject) => {
        setProjects((prevProjects) => [...prevProjects, project]);
    };

    /**
     * Met à jour un projet existant
     */
    const updateProject = (
        projectId: number,
        updates: Partial<ClientProject>,
    ) => {
        setProjects((prevProjects) =>
            prevProjects.map((project) =>
                project.id === projectId ? { ...project, ...updates } : project,
            ),
        );
    };

    return {
        projects,
        setProjects,
        toggleFavorite,
        deleteProject,
        addProject,
        updateProject,
    };
};

/**
 * Hook personnalisé pour gérer la modal de suppression
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
 * Hook personnalisé pour traiter et filtrer les projets
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
