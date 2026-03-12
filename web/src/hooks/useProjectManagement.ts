import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
    ClientProject,
    SortConfig,
    SortKey,
    ProjectFilters,
    DeleteModalState,
} from "../types/project/project";
import type { ProjectResponse } from "../types/project/projectCreate";
import {
    type ProjectError,
    ApiError,
    PROJECT_ERROR_CODES,
} from "../types/project/projectError";
import { processProjects, getDefaultFilters } from "../utils/project";
import {
    fetchProjects,
    updateProjectFavorite,
    deleteProject,
} from "../requests/projectRequests";

/**
 * Vérifie si un token est présent dans le localStorage.
 * Permet de court-circuiter les requêtes API quand l'utilisateur n'est
 * clairement pas connecté, évitant ainsi des allers-retours inutiles.
 */
const hasToken = (): boolean => !!localStorage.getItem("token");

/**
 * Convertit une réponse API en ClientProject pour l'affichage dashboard
 */
const toClientProject = (p: ProjectResponse): ClientProject => ({
    id: p.id,
    name: p.name,
    parameters: p.parameters ? Object.keys(p.parameters).length : 0,
    parcels: p.parcels ? p.parcels.length : 0,
    memberCount: p.memberCount ?? 0,
    createdAt: p.createdAt,
    modifiedAt: p.modifiedAt,
    isFavorite: p.isFavorite,
});

/**
 * Extrait un ProjectError structuré depuis l'erreur brute de React Query.
 * Retourne `null` quand il n'y a pas d'erreur.
 */
const toProjectError = (error: Error | null): ProjectError | null => {
    if (!error) return null;

    if (error instanceof ApiError) {
        return error.toProjectError();
    }

    return {
        code: PROJECT_ERROR_CODES.UNKNOWN,
        message: error.message || "Erreur lors du chargement des projets",
    };
};

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

export const useProjects = () => {
    const queryClient = useQueryClient();
    const isAuthenticated = hasToken();

    const {
        data: projects = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["projects"],
        queryFn: fetchProjects,
        select: (data) => data.map(toClientProject),

        // Ne pas lancer la requête si aucun token n'est présent
        enabled: isAuthenticated,
        // Ne pas réessayer sur les erreurs d'authentification (401/403)
        retry: (failureCount, err) => {
            if (
                err instanceof ApiError &&
                (err.code === PROJECT_ERROR_CODES.UNAUTHORIZED ||
                    err.code === PROJECT_ERROR_CODES.FORBIDDEN)
            ) {
                return false;
            }
            return failureCount < 3;
        },
    });

    // Si pas de token, on renvoie immédiatement une erreur UNAUTHORIZED
    // sans attendre de réponse serveur
    const resolvedError: ProjectError | null = !isAuthenticated
        ? {
              code: PROJECT_ERROR_CODES.UNAUTHORIZED,
              message: "Vous n'êtes pas connecté",
              detail: "Connectez-vous ou créez un compte pour accéder à vos projets.",
          }
        : toProjectError(error);

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
        isLoading: isAuthenticated ? isLoading : false,
        error: resolvedError,
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
