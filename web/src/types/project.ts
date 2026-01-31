export interface ClientProject {
  id: number;
  name: string;
  parameters: number;
  parcels: number;
  createdAt: string;
  modifiedAt: string;
  isFavorite: boolean;
}

export type SortKey = 'name' | 'parameters' | 'parcels' | 'createdAt' | 'modifiedAt';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: SortKey | null;
  direction: SortDirection;
}

export interface ProjectFilters {
  parametersMin: string;
  parametersMax: string;
  parcelsMin: string;
  parcelsMax: string;
  timeRange: string;
  customStartDate: string;
  customEndDate: string;
}

export interface DeleteModalState {
  isOpen: boolean;
  project: ClientProject | null;
}

export interface ClientProjectsDashboardProps {
  onProjectClick: (project: ClientProject) => void;
  onCreateNew: () => void;
  initialProjects?: ClientProject[];
}

export interface ProjectTableProps {
  projects: ClientProject[];
  sortConfig: SortConfig;
  onSort: (key: SortKey) => void;
  onProjectClick: (project: ClientProject) => void;
  onToggleFavorite: (projectId: number, e: React.MouseEvent) => void;
  onDeleteClick: (project: ClientProject, e: React.MouseEvent) => void;
}

export interface ProjectRowProps {
  project: ClientProject;
  onProjectClick: (project: ClientProject) => void;
  onToggleFavorite: (projectId: number, e: React.MouseEvent) => void;
  onDeleteClick: (project: ClientProject, e: React.MouseEvent) => void;
}

export interface DashboardHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isFilterOpen: boolean;
  onToggleFilter: () => void;
  onCreateNew: () => void;
}

export interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
}

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName?: string;
}