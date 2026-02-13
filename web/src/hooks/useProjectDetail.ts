import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProjectDetail } from "../types/projectDetail";
import type { ProjectResponse } from "../types/projectCreate";
import {
    fetchProjectById,
    updateProjectNotes,
    updateProjectFavorite,
} from "../requests/projectRequests";

/**
 * Convertit une ProjectResponse API en ProjectDetail pour l'affichage.
 */
const toProjectDetail = (data: ProjectResponse): ProjectDetail => ({
    id: data.id,
    name: data.name,
    isFavorite: data.isFavorite,
    notes: data.notes || "",
    parcels: data.parcels?.map((p) => ({
        id: p.id,
        coordinates: p.coordinates,
    })),
    parameters: data.parameters,
    createdAt: data.createdAt,
    modifiedAt: data.modifiedAt,
});


export const useProjectDetail = (projectId?: string) => {
    const {
        data: project = null,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["project", projectId],
        queryFn: () => fetchProjectById(projectId!),
        enabled: !!projectId,
        select: toProjectDetail,
    });

    return {
        project,
        isLoading,
        error: error
            ? error instanceof Error
                ? error.message
                : "Erreur lors du chargement du projet"
            : null,
    };
};


export const useNotes = (initialNotes: string = "", projectId?: string) => {
    const [notes, setNotes] = useState(initialNotes);
    const initialNotesRef = useRef(initialNotes);
    const queryClient = useQueryClient();

    useEffect(() => {
        setNotes(initialNotes);
        initialNotesRef.current = initialNotes;
    }, [initialNotes]);

    const { mutate: saveNotes, isPending: isSaving } = useMutation({
        mutationFn: (newNotes: string) =>
            updateProjectNotes(projectId!, newNotes),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
        },
        onError: (error) => {
            console.error("Erreur lors de la sauvegarde des notes:", error);
        },
    });

    useEffect(() => {
        if (notes === initialNotesRef.current || !projectId) return;

        const timer = setTimeout(() => {
            saveNotes(notes);
        }, 1000);

        return () => clearTimeout(timer);
    }, [notes, projectId, saveNotes]);

    return { notes, setNotes, isSaving };
};


export const useFavorite = (initialValue: boolean, projectId?: string) => {
    const [isFavorite, setIsFavorite] = useState(initialValue);
    const queryClient = useQueryClient();

    useEffect(() => {
        setIsFavorite(initialValue);
    }, [initialValue]);

    const { mutate: toggleMutation } = useMutation({
        mutationFn: (newValue: boolean) =>
            updateProjectFavorite(projectId!, newValue),
        onMutate: async (newValue) => {
            const previous = isFavorite;
            setIsFavorite(newValue);
            return { previous };
        },
        onError: (_err, _newValue, context) => {
            if (context) setIsFavorite(context.previous);
            console.error("Erreur lors de la mise à jour du favori");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });

    const toggleFavorite = () => {
        if (!projectId) return;
        toggleMutation(!isFavorite);
    };

    return { isFavorite, toggleFavorite };
};
