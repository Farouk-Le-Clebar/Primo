import type { ClientProject, ProjectFilters, SortConfig } from '../types/project';

/**
 * Formate une date au format français DD/MM/YYYY
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Formate une date avec l'heure au format français DD/MM/YYYY HH:MM
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const formattedTime = date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${formattedDate} ${formattedTime}`;
};

/**
 * Filtre les projets selon le terme de recherche
 */
export const filterBySearch = (
  projects: ClientProject[],
  searchTerm: string
): ClientProject[] => {
  if (!searchTerm) return projects;
  
  const lowerSearch = searchTerm.toLowerCase();
  return projects.filter(project =>
    project.name.toLowerCase().includes(lowerSearch)
  );
};

/**
 * Filtre les projets selon les critères de filtrage
 */
export const filterByFilters = (
  projects: ClientProject[],
  filters: ProjectFilters
): ClientProject[] => {
  let filtered = [...projects];

  // Filtre de paramètres
  if (filters.parametersMin) {
    filtered = filtered.filter(p => p.parameters >= parseInt(filters.parametersMin));
  }
  if (filters.parametersMax) {
    filtered = filtered.filter(p => p.parameters <= parseInt(filters.parametersMax));
  }

  // Filtre de parcelles
  if (filters.parcelsMin) {
    filtered = filtered.filter(p => p.parcels >= parseInt(filters.parcelsMin));
  }
  if (filters.parcelsMax) {
    filtered = filtered.filter(p => p.parcels <= parseInt(filters.parcelsMax));
  }

  // Filtre de date
  if (filters.timeRange && filters.timeRange !== 'custom') {
    const days = parseInt(filters.timeRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    filtered = filtered.filter(p => new Date(p.modifiedAt) >= cutoffDate);
  } else if (filters.timeRange === 'custom' && filters.customStartDate && filters.customEndDate) {
    filtered = filtered.filter(p => {
      const modDate = new Date(p.modifiedAt);
      return modDate >= new Date(filters.customStartDate) &&
             modDate <= new Date(filters.customEndDate);
    });
  }

  return filtered;
};

/**
 * Trie les projets selon la configuration de tri
 */
export const sortProjects = (
  projects: ClientProject[],
  sortConfig: SortConfig
): ClientProject[] => {
  if (!sortConfig.key) return projects;

  return [...projects].sort((a, b) => {
    let aValue: any = a[sortConfig.key!];
    let bValue: any = b[sortConfig.key!];

    // Gestion spéciale pour les dates
    if (sortConfig.key === 'createdAt' || sortConfig.key === 'modifiedAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

/**
 * Applique tous les filtres et le tri aux projets
 */
export const processProjects = (
  projects: ClientProject[],
  searchTerm: string,
  filters: ProjectFilters,
  sortConfig: SortConfig
): ClientProject[] => {
  let processed = filterBySearch(projects, searchTerm);
  processed = filterByFilters(processed, filters);
  processed = sortProjects(processed, sortConfig);
  return processed;
};

/**
 * Retourne les filtres par défaut
 */
export const getDefaultFilters = (): ProjectFilters => ({
  parametersMin: '',
  parametersMax: '',
  parcelsMin: '',
  parcelsMax: '',
  timeRange: '',
  customStartDate: '',
  customEndDate: ''
});