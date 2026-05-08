import { useQuery } from "@tanstack/react-query";
import { Clock, Loader2 } from "lucide-react";

// COMPONENETS
import { getUserSearchHistory } from "../../../requests/UserRequests";

type SearchHistoryListProps = {
  onSelect: (coords: [number, number], label: string) => void;
};

export default function SearchHistoryList({ onSelect }: SearchHistoryListProps) {
  const { data: recentSearches = [], isLoading } = useQuery({
    queryKey: ["searchHistory"],
    queryFn: getUserSearchHistory,
  });

  return (
    <div className="mb-2">
      <div className="px-3 py-2 text-[0.70rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider select-none">
        Recherches récentes
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
        </div>
      ) : recentSearches.length > 0 ? (
        recentSearches.map((item: any) => (
          <button 
            key={item.id} 
            onClick={() => onSelect([item.lat, item.lng], item.label)}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-[#262626] text-gray-700 dark:text-gray-300 transition-colors cursor-pointer text-left"
          >
            <Clock className="text-gray-300 shrink-0" size={16} />
            <span className="text-sm font-medium truncate">{item.label}</span>
          </button>
        ))
      ) : (
        <div className="px-3 py-4 text-center text-sm text-gray-400 italic">
          Aucun historique de recherche.
        </div>
      )}
    </div>
  );
}