import { useState, useEffect, useCallback, useRef } from 'react';
import type { ProjectDetail } from '../types/projectDetail';
import {
  fetchProjectById,
  updateProjectNotes,
  updateProjectFavorite,
} from '../requests/projectRequests';


export const useProjectDetail = (projectId?: string) => {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchProjectById(projectId);
        setProject({
          id: data.id,
          name: data.name,
          isFavorite: data.isFavorite,
          notes: data.notes || '',
          parcels: data.parcels?.map(p => ({
            id: p.id,
            coordinates: p.coordinates,
          })),
          parameters: data.parameters,
          createdAt: data.createdAt,
          modifiedAt: data.modifiedAt,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erreur lors du chargement du projet',
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadProject();
  }, [projectId]);

  return { project, isLoading, error, setProject };
};


export const useNotes = (initialNotes: string = '', projectId?: string) => {
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);
  const initialNotesRef = useRef(initialNotes);

  useEffect(() => {
    setNotes(initialNotes);
    initialNotesRef.current = initialNotes;
  }, [initialNotes]);

  useEffect(() => {
    if (notes === initialNotesRef.current || !projectId) return;

    const timer = setTimeout(async () => {
      try {
        setIsSaving(true);
        await updateProjectNotes(projectId, notes);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des notes:', error);
      } finally {
        setIsSaving(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [notes, projectId]);

  return { notes, setNotes, isSaving };
};


export const useFavorite = (initialValue: boolean, projectId?: string) => {
  const [isFavorite, setIsFavorite] = useState(initialValue);

  useEffect(() => {
    setIsFavorite(initialValue);
  }, [initialValue]);

  const toggleFavorite = useCallback(async () => {
    if (!projectId) return;
    const newValue = !isFavorite;
    setIsFavorite(newValue);
    try {
      await updateProjectFavorite(projectId, newValue);
    } catch (error) {
      setIsFavorite(!newValue);
      console.error('Erreur lors de la mise à jour du favori:', error);
    }
  }, [isFavorite, projectId]);

  return { isFavorite, toggleFavorite };
};
