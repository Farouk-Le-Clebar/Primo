import axios, { type AxiosError } from "axios";
import type {
    CreateProjectPayload,
    ProjectResponse,
    UpdateProjectPayload,
} from "../types/projectCreate";
import { ApiError, PROJECT_ERROR_CODES } from "../types/projectError";
import { getAuthHeaders } from "../utils/auth";

const apiUrl = window?._env_?.API_URL;

// Error mapper pour mes cards d'error handling
function handleApiError(error: unknown, fallbackMessage: string): never {
    if (!axios.isAxiosError(error)) {
        throw new ApiError({
            code: PROJECT_ERROR_CODES.UNKNOWN,
            message: fallbackMessage,
            detail: error instanceof Error ? error.message : undefined,
        });
    }

    const axiosErr = error as AxiosError<{ message?: string }>;
    const status = axiosErr.response?.status;
    const serverMessage = axiosErr.response?.data?.message;

    // No response at all: network / timeout
    if (!axiosErr.response) {
        const isTimeout =
            axiosErr.code === "ECONNABORTED" || axiosErr.code === "ETIMEDOUT";

        throw new ApiError({
            code: isTimeout
                ? PROJECT_ERROR_CODES.TIMEOUT
                : PROJECT_ERROR_CODES.NETWORK_ERROR,
            message: isTimeout
                ? "La requête a expiré"
                : "Impossible de se connecter au serveur",
            detail: isTimeout
                ? "Le serveur met trop de temps à répondre. Veuillez réessayer."
                : "Vérifiez votre connexion internet ou réessayez plus tard.",
            httpStatus: undefined,
        });
    }

    // 401 – Unauthorized
    if (status === 401) {
        throw new ApiError({
            code: PROJECT_ERROR_CODES.UNAUTHORIZED,
            message: "Vous n'êtes pas connecté",
            detail: "Connectez-vous ou créez un compte pour accéder à vos projets.",
            httpStatus: 401,
        });
    }

    // 403 – Forbidden
    if (status === 403) {
        throw new ApiError({
            code: PROJECT_ERROR_CODES.FORBIDDEN,
            message: "Accès refusé",
            detail: "Vous n'avez pas les droits nécessaires pour effectuer cette action.",
            httpStatus: 403,
        });
    }

    // 404 – Not found
    if (status === 404) {
        throw new ApiError({
            code: PROJECT_ERROR_CODES.NOT_FOUND,
            message: "Ressource introuvable",
            detail:
                serverMessage ??
                "L'élément demandé n'existe pas ou a été supprimé.",
            httpStatus: 404,
        });
    }

    // 5xx – Server errors
    if (status && status >= 500) {
        throw new ApiError({
            code: PROJECT_ERROR_CODES.SERVER_ERROR,
            message: "Erreur du serveur",
            detail: "Un problème est survenu de notre côté. Veuillez réessayer dans quelques instants.",
            httpStatus: status,
        });
    }

    // Anything else
    throw new ApiError({
        code: PROJECT_ERROR_CODES.UNKNOWN,
        message: serverMessage ?? fallbackMessage,
        detail: `Le serveur a répondu avec le code ${status}.`,
        httpStatus: status,
    });
}


export const fetchProjects = (): Promise<ProjectResponse[]> =>
    axios
        .get(`${apiUrl}/projects`, { headers: getAuthHeaders() })
        .then((r) => r.data)
        .catch((err) =>
            handleApiError(err, "Impossible de charger les projets"),
        );


export const fetchProjectById = (id: string): Promise<ProjectResponse> =>
    axios
        .get(`${apiUrl}/projects/${id}`, { headers: getAuthHeaders() })
        .then((r) => r.data)
        .catch((err) => handleApiError(err, "Impossible de charger le projet"));


export const createProject = (
    data: CreateProjectPayload,
): Promise<ProjectResponse> =>
    axios
        .post(`${apiUrl}/projects`, data, { headers: getAuthHeaders() })
        .then((r) => r.data)
        .catch((err) => handleApiError(err, "Impossible de créer le projet"));


export const updateProject = (
    id: string,
    data: UpdateProjectPayload,
): Promise<ProjectResponse> =>
    axios
        .patch(`${apiUrl}/projects/${id}`, data, { headers: getAuthHeaders() })
        .then((r) => r.data)
        .catch((err) =>
            handleApiError(err, "Impossible de mettre à jour le projet"),
        );


export const updateProjectNotes = (
    id: string,
    notes: string,
): Promise<ProjectResponse> =>
    axios
        .patch(
            `${apiUrl}/projects/${id}/notes`,
            { notes },
            { headers: getAuthHeaders() },
        )
        .then((r) => r.data)
        .catch((err) =>
            handleApiError(err, "Impossible de sauvegarder les notes"),
        );


export const updateProjectFavorite = (
    id: string,
    isFavorite: boolean,
): Promise<ProjectResponse> =>
    axios
        .patch(
            `${apiUrl}/projects/${id}/favorite`,
            { isFavorite },
            { headers: getAuthHeaders() },
        )
        .then((r) => r.data)
        .catch((err) =>
            handleApiError(err, "Impossible de mettre à jour le favori"),
        );


export const deleteProject = (id: string): Promise<void> =>
    axios
        .delete(`${apiUrl}/projects/${id}`, { headers: getAuthHeaders() })
        .then(() => undefined)
        .catch((err) =>
            handleApiError(err, "Impossible de supprimer le projet"),
        );


export const searchProjects = (search: string): Promise<ProjectResponse[]> =>
    axios
        .get(`${apiUrl}/projects`, {
            headers: getAuthHeaders(),
            params: { search },
        })
        .then((r) => r.data)
        .catch((err) =>
            handleApiError(err, "Impossible de rechercher les projets"),
        );

        
export const fetchFavoriteProjects = (): Promise<ProjectResponse[]> =>
    axios
        .get(`${apiUrl}/projects`, {
            headers: getAuthHeaders(),
            params: { favorites: "true" },
        })
        .then((r) => r.data)
        .catch((err) =>
            handleApiError(err, "Impossible de charger les favoris"),
        );
