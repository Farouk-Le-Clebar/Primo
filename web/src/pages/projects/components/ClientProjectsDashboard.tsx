import React from 'react';
import type { ClientProjectsDashboardProps, ClientProject } from '../../../types/project';
import { mockProjects } from './mockProjects';
import {
  useSearch,
  useSort,
  useFilters,
  useProjects,
  useDeleteModal,
  useProcessedProjects
} from '../../../hooks/useProjectManagement';
import DashboardHeader from './DashboardHeader';
import FilterPanel from './FilterPanel';
import ProjectTable from './ProjectTable';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export const ClientProjectsDashboard: React.FC<ClientProjectsDashboardProps> = ({
  onProjectClick,
  onCreateNew,
  initialProjects = mockProjects
}) => {
  // Gestion de la recherche avec debounce
  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useSearch();

  // Gestion du tri
  const { sortConfig, handleSort } = useSort();

  // Gestion des filtres
  const { filters, setFilters, isFilterOpen, toggleFilterPanel, closeFilterPanel } = useFilters();

  // Gestion des projets (CRUD)
  const { projects, toggleFavorite, deleteProject } = useProjects(initialProjects);

  // Gestion de la modal de suppression
  const { deleteModal, openDeleteModal, closeDeleteModal } = useDeleteModal();

  // Traitement des projets (filtrage + tri)
  const processedProjects = useProcessedProjects(
    projects,
    debouncedSearchTerm,
    filters,
    sortConfig
  );

  /**
   * Gère le basculement du statut favori
   */
  const handleToggleFavorite = (projectId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(projectId);
  };

  /**
   * Gère l'ouverture de la modal de suppression
   */
  const handleDeleteClick = (project: ClientProject, e: React.MouseEvent) => {
    e.stopPropagation();
    openDeleteModal(project);
  };

  /**
   * Confirme et exécute la suppression du projet
   */
  const handleConfirmDelete = () => {
    if (deleteModal.project) {
      deleteProject(deleteModal.project.id);
      closeDeleteModal();
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 p-8">
      {/* En-tête avec recherche et boutons */}
      <DashboardHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isFilterOpen={isFilterOpen}
        onToggleFilter={toggleFilterPanel}
        onCreateNew={onCreateNew}
      />

      {/* Panneau de filtres */}
      <div className="relative mb-6">
        <FilterPanel
          isOpen={isFilterOpen}
          onClose={closeFilterPanel}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      {/* Tableau des projets */}
      <ProjectTable
        projects={processedProjects}
        sortConfig={sortConfig}
        onSort={handleSort}
        onProjectClick={onProjectClick}
        onToggleFavorite={handleToggleFavorite}
        onDeleteClick={handleDeleteClick}
      />

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        projectName={deleteModal.project?.name}
      />
    </div>
  );
};