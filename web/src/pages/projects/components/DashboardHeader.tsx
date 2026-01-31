import React from 'react';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import type { DashboardHeaderProps } from '../../../types/project';

/**
 * Composant d'en-tête du dashboard avec recherche, filtres et bouton de création
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  searchTerm,
  onSearchChange,
  isFilterOpen,
  onToggleFilter,
  onCreateNew
}) => {
  return (
    <div className="mb-6">
      {/* Titre */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Clients projects
      </h1>

      {/* Barre de recherche et boutons */}
      <div className="flex items-center gap-4">
        {/* Barre de recherche */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Type here..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Bouton Filters */}
        <button
          onClick={onToggleFilter}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${
            isFilterOpen
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="font-medium">Filters</span>
        </button>

        {/* Bouton Create new */}
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <span className="font-medium">Create new</span>
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;