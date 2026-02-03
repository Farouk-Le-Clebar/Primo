// Types pour la page de détails du projet

export interface ProjectDetail {
  id: number;
  name: string;
  isFavorite: boolean;
  parcels?: Parcel[];
  parameters?: any; // À définir plus tard selon vos besoins
  notes?: string;
  createdAt: string;
  modifiedAt: string;
}

export interface Parcel {
  id: string;
  coordinates: [number, number];
  // Autres propriétés à définir selon vos besoins
}

export interface ProjectDetailPageProps {
  projectId?: string;
  onBack?: () => void;
}

export interface ProjectHeaderProps {
  name: string;
  isFavorite: boolean;
  isLoading: boolean;
  onBack: () => void;
  onToggleFavorite: () => void;
}

export interface MapViewProps {
  parcels?: Parcel[];
  isLoading: boolean;
}

export interface ParametersCardProps {
  data?: any;
  isLoading: boolean;
  onViewAll: () => void;
}

export interface ComparatorCardProps {
  isLoading: boolean;
}

export interface NotesCardProps {
  notes: string;
  isLoading: boolean;
  onNotesChange: (notes: string) => void;
}