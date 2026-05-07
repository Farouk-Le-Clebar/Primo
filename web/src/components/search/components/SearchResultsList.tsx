import { MapPin } from "lucide-react";

type SearchResultsListProps = {
  adressList: any[];
  addressQuery: string;
  isPending: boolean;
  onSelect: (coords: [number, number], label: string) => void;
};

export default function SearchResultsList({ adressList, addressQuery, isPending, onSelect }: SearchResultsListProps) {
  if (adressList.length > 0) {
    return (
      <div className="mb-2">
        <div className="px-3 py-2 text-[0.70rem] font-bold text-gray-400 uppercase tracking-wider select-none">
          Résultats d'adresses
        </div>
        {adressList.map((feature: any) => (
          <button
            key={feature.properties.id || feature.properties.label}
            onClick={() => onSelect([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], feature.properties.label)}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer text-left"
          >
            <MapPin className="text-gray-300 shrink-0" size={16} />
            <span className="text-xs font-medium truncate">{feature.properties.label}</span>
          </button>
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