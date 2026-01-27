import { AxiosError } from 'axios';

export interface ApiErrorResponse {
    message?: string;
    error?: string;
}

type ApiError = AxiosError<ApiErrorResponse>;

const STATUS_MESSAGES: Record<number, string> = {
    400: 'Requête invalide',
    401: 'Non autorisé',
    403: 'Accès refusé',
    404: 'Ressource introuvable',
    409: 'Ces données existent déjà',
    422: 'Données invalides',
    500: 'Erreur serveur',
    502: 'Service indisponible',
    503: 'Service temporairement indisponible',
};

export const parseApiError = (error: ApiError): string => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (data?.message) return data.message;
    if (data?.error) return data.error;

    if (status && STATUS_MESSAGES[status]) {
        return STATUS_MESSAGES[status];
    }

    if (error.code === 'ECONNABORTED') {
        return 'La requête a expiré';
    }

    if (!error.response) {
        return 'Erreur de connexion';
    }

    return 'Une erreur est survenue';
};
