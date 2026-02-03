import { useState, useEffect } from 'react';
import type { ProjectDetail } from '../types/projectDetail';

/**
 * Hook pour gérer les données du projet
 * Simule le chargement et la gestion d'état
 */
export const useProjectDetail = (projectId?: string) => {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true);
        
        // Simuler un appel API avec un délai
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Données mock pour le développement
        const mockProject: ProjectDetail = {
          id: parseInt(projectId || '1'),
          name: 'Alain Fréberger',
          isFavorite: true,
          notes: '',
          createdAt: '2023-05-14',
          modifiedAt: '2023-05-14T17:37:00'
        };

        setProject(mockProject);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  return { project, isLoading, error, setProject };
};

/**
 * Hook pour gérer les notes avec sauvegarde automatique
 */
export const useNotes = (initialNotes: string = '', projectId?: string) => {
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  useEffect(() => {
    // Sauvegarder automatiquement après 1 seconde d'inactivité
    const timer = setTimeout(() => {
      if (notes !== initialNotes && projectId) {
        saveNotes(notes);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [notes, initialNotes, projectId]);

  const saveNotes = async (content: string) => {
    try {
      setIsSaving(true);
      // TODO: Remplacer par un vrai appel API
      // await api.updateProjectNotes(projectId, content);
      console.log('Notes sauvegardées:', content);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des notes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return { notes, setNotes, isSaving };
};

/**
 * Hook pour gérer le statut favori
 */
export const useFavorite = (initialValue: boolean, _projectId?: string) => {
  const [isFavorite, setIsFavorite] = useState(initialValue);

  const toggleFavorite = async () => {
    const newValue = !isFavorite;
    setIsFavorite(newValue);

    try {
      // TODO: Remplacer par un vrai appel API
      // await api.updateProjectFavorite(projectId, newValue);
      console.log('Favori mis à jour:', newValue);
    } catch (error) {
      // En cas d'erreur, revenir à l'état précédent
      setIsFavorite(!newValue);
      console.error('Erreur lors de la mise à jour du favori:', error);
    }
  };

  return { isFavorite, toggleFavorite };
};