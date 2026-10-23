import type { MapSearchItem, MapSearchStatus } from "./useMapSearchItems";
import MapSearchRow from "./MapSearchRow";

type MapSearchResultsProps = {
  status: MapSearchStatus;
  items: MapSearchItem[];
  query: string;
  activeIndex: number;
  isHistoryLoading: boolean;
  onHover: (index: number) => void;
  onSelect: (item: MapSearchItem) => void;
  onRetry: () => void;
};

const EYEBROW = "px-2 pb-2 text-[11px] font-medium tracking-[0.12em] text-gray-400 uppercase";
const MESSAGE = "px-2 py-6 text-sm text-gray-500 dark:text-gray-400";
const SKELETON = [1, 2, 3];

export default function MapSearchResults({ status, items, query, activeIndex, isHistoryLoading, onHover, onSelect, onRetry }: MapSearchResultsProps) {
  const isLoading = status === "loading" || (status === "history" && isHistoryLoading);
  const eyebrow = status === "history" ? "Recherches récentes" : `Adresses · ${items.length} résultat${items.length > 1 ? "s" : ""}`;

  if (status === "short") return <p className={MESSAGE}>Encore quelques lettres pour lancer la recherche.</p>;
  if (status === "error")
    return (
      <p className={MESSAGE}>
        Recherche momentanément indisponible.{" "}
        <button onClick={onRetry} className="font-medium text-gray-900 underline cursor-pointer dark:text-white">
          Réessayer
        </button>
      </p>
    );
  if (isLoading)
    return (
      <div className="space-y-1">
        {SKELETON.map((i) => (
          <div key={i} className="h-[52px] animate-pulse rounded-xl bg-black/[0.04] motion-reduce:animate-none dark:bg-white/[0.06]" />
        ))}
      </div>
    );
  if (!items.length)
    return (
      <p className={MESSAGE}>
        {status === "history" ? "Vos recherches apparaîtront ici." : `Aucune adresse trouvée pour « ${query} ».`}
      </p>
    );

  return (
    <>
      <p className={EYEBROW}>{eyebrow}</p>
      <div role="listbox" aria-label={eyebrow} className="space-y-0.5">
        {items.map((item, index) => (
          <MapSearchRow
            key={item.key}
            item={item}
            query={status === "results" ? query : ""}
            isActive={index === activeIndex}
            onHover={() => onHover(index)}
            onSelect={() => onSelect(item)}
          />
        ))}
      </div>
    </>
  );
}
