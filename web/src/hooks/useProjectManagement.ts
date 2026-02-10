import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    deleteProject,
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
 * Hook projets (CRUD) avec useQuery + useMutation (TanStack)
 *
 */
export const useProjects = () => {
    const queryClient = useQueryClient();

    const {
        data: projects = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["projects"],
        queryFn: fetchProjects,
        select: (data) => data.map(toClientProject),
    });

    const { mutate: toggleFavorite } = useMutation({
        mutationFn: ({
            projectId,
            newValue,
        }: {
            projectId: string;
            newValue: boolean;
        }) => updateProjectFavorite(projectId, newValue),
        onMutate: async ({ projectId, newValue }) => {
            await queryClient.cancelQueries({ queryKey: ["projects"] });
            const previous = queryClient.getQueryData<ProjectResponse[]>([
                "projects",
            ]);
            queryClient.setQueryData<ProjectResponse[]>(["projects"], (old) =>
                old?.map((p) =>
                    p.id === projectId ? { ...p, isFavorite: newValue } : p,
                ),
            );
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(["projects"], context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });

    const { mutate: removeProject } = useMutation({
        mutationFn: (projectId: string) => deleteProject(projectId),
        onMutate: async (projectId) => {
            await queryClient.cancelQueries({ queryKey: ["projects"] });
            const previous = queryClient.getQueryData<ProjectResponse[]>([
                "projects",
            ]);
            queryClient.setQueryData<ProjectResponse[]>(["projects"], (old) =>
                old?.filter((p) => p.id !== projectId),
            );
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(["projects"], context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });

    return {
        projects,
        isLoading,
        error: error
            ? error instanceof Error
                ? error.message
                : "Erreur lors du chargement des projets"
            : null,
        toggleFavorite: (projectId: string) => {
            const project = projects.find((p) => p.id === projectId);
            if (project)
                toggleFavorite({ projectId, newValue: !project.isFavorite });
        },
        deleteProject: (projectId: string) => removeProject(projectId),
        refreshProjects: () =>
            queryClient.invalidateQueries({ queryKey: ["projects"] }),
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
