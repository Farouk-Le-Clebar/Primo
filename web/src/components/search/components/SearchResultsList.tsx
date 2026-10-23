import type { Feature, Point } from "geojson";
import { MapPin } from "lucide-react";
import { MapPinIcon } from "@heroicons/react/24/outline";
import SearchResultRow, { SearchSectionTitle } from "./SearchResultRow";

type AddressFeature = Feature<Point, { id?: string; label: string }>;

type SearchResultsListProps = {
  adressList: AddressFeature[];
  addressQuery: string;
  isPending: boolean;
  onSelect: (coords: [number, number], label: string) => void;
};

export default function SearchResultsList({ adressList, addressQuery, isPending, onSelect }: SearchResultsListProps) {
  if (adressList.length > 0) {
    return (
      <div className="mb-2">
        <SearchSectionTitle>Résultats d'adresses</SearchSectionTitle>
        {adressList.map((feature) => (
          <SearchResultRow
            key={feature.properties.id || feature.properties.label}
            icon={MapPinIcon}
            label={feature.properties.label}
            onClick={() => onSelect([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], feature.properties.label)}
          />
        ))}
      </div>
    );
  }

  if (!isPending) {
    return (
      <div className="px-4 py-10 text-center flex flex-col items-center justify-center text-gray-400">
        <MapPin className="mb-2 opacity-20" size={32} />
        <span className="text-[13px] italic">Aucune adresse trouvée pour "{addressQuery}"</span>
      </div>
    );
  }

  return null;
}