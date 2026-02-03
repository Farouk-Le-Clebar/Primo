import React from "react";
import type { ProjectDetailPageProps } from "../../../../types/projectDetail";
import {
    useProjectDetail,
    useNotes,
    useFavorite,
} from "../../../../hooks/useProjectDetail";

import ProjectHeader from "./ProjectHeader";
import MapView from "./MapView";
import ParametersCard from "./ParametersCard";
import ComparatorCard from "./ComparatorCard";
import NotesCard from "./NotesCard";

export const ClientProjectPage: React.FC<ProjectDetailPageProps> = ({
  projectId,
  onBack
}) => {
  const { project, isLoading, error } = useProjectDetail(projectId);

  const { isFavorite, toggleFavorite } = useFavorite(
    project?.isFavorite || false,
    projectId
  );

  const { notes, setNotes } = useNotes(project?.notes || '', projectId);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const handleViewAllParameters = () => {
    console.log('Ouvrir la vue complète des paramètres');
    // TODO: Naviguer vers la page des paramètres
  };

  if (error) {
    return (
      <div className="w-full h-full bg-gray-50 p-5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-50 p-5 flex flex-col overflow-hidden">
      {/* Header*/}
      <div className="flex-shrink-0">
        <ProjectHeader
          name={project?.name || ''}
          isFavorite={isFavorite}
          isLoading={isLoading}
          onBack={handleBack}
          onToggleFavorite={toggleFavorite}
        />
      </div>

      {/*MapView*/}
      <div className="flex-shrink-0 mb-6 h-96">
        <MapView parcels={project?.parcels} isLoading={isLoading} />
      </div>

      <div className="flex-1 grid grid-cols-2 lg:grid-cols-2 gap-6 min-h-0">
        <div className="lg:col-span-1 flex flex-col gap-6 min-h-0">

          <div className="flex-1 min-h-0">
            <ParametersCard
              data={project?.parameters}
              isLoading={isLoading}
              onViewAll={handleViewAllParameters}
            />
          </div>
          
          <div className="flex-1 min-h-0">
            <ComparatorCard isLoading={isLoading} />
          </div>
        </div>

        <div className="lg:col-span-1 min-h-0">
          <NotesCard
            notes={notes}
            isLoading={isLoading}
            onNotesChange={setNotes}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientProjectPage;