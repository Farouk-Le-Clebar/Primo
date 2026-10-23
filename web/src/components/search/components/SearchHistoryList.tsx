import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ClockIcon } from "@heroicons/react/24/outline";
import SearchResultRow, { SearchSectionTitle } from "./SearchResultRow";

// COMPONENETS
import { getUserSearchHistory } from "../../../requests/UserRequests";

type SearchHistoryItem = {
  id: string | number;
  label: string;
  lat: number;
  lng: number;
};

type SearchHistoryListProps = {
  onSelect: (coords: [number, number], label: string) => void;
};

export default function SearchHistoryList({ onSelect }: SearchHistoryListProps) {
  const { data: recentSearches = [], isLoading } = useQuery<SearchHistoryItem[]>({
    queryKey: ["searchHistory"],
    queryFn: getUserSearchHistory,
  });

  return (
    <div className="mb-2">
      <SearchSectionTitle>Recherches récentes</SearchSectionTitle>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
        </div>
      ) : recentSearches.length > 0 ? (
        recentSearches.map((item) => (
          <SearchResultRow
            key={item.id}
            icon={ClockIcon}
            label={item.label}
            onClick={() => onSelect([item.lat, item.lng], item.label)}
          />
        ))
      ) : (
        <div className="px-3 py-4 text-center text-sm text-gray-400 italic">
          Aucun historique de recherche.
        </div>
      )}
    </div>
  );
}