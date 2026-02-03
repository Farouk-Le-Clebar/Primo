import React from 'react';
import type { ComparatorCardProps } from '../../../../types/projectDetail';

const ComparatorCard: React.FC<ComparatorCardProps> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 h-full flex flex-col">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-3" />
        <div className="flex-1 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 h-full flex flex-col">
      {/* Titre */}
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Comparer</h3>

      {/* Contenu */}
      <div className="flex-1 flex flex-col">
        <p className="text-xs text-gray-600 leading-relaxed mb-3">
          Grâce à cette fonctionnalité avancée, trouvez la parcelle la plus intéressante
          selon vos critères
        </p>

        {/* Placeholder pour future fonctionnalité */}
        <div className="flex-1 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-xs text-gray-400">Fonctionnalité à venir</span>
        </div>
      </div>
    </div>
  );
};

export default ComparatorCard;
