import { useQuery } from "@tanstack/react-query";
import type { Feature, Point } from "geojson";
import { getUserSearchHistory } from "../../../../../requests/UserRequests";
import type { AddressSearchState } from "../../../../../hooks/useAddressSearch";

type AddressProperties = { id?: string; label: string; name?: string; postcode?: string; city?: string };
type HistoryEntry = { id: string | number; label: string; lat: number; lng: number };

export type MapSearchItem = {
  key: string;
  title: string;
  subtitle: string;
  department: string | null;
  coords: [number, number];
  label: string;
};

export type MapSearchStatus = "history" | "short" | "loading" | "error" | "results";

const toAddressItem = ({ properties, geometry }: Feature<Point, AddressProperties>): MapSearchItem => ({
  key: properties.id ?? properties.label,
  title: properties.name ?? properties.label,
  subtitle: [properties.postcode, properties.city].filter(Boolean).join(" "),
  department: properties.postcode?.slice(0, 2) ?? null,
  coords: [geometry.coordinates[1], geometry.coordinates[0]],
  label: properties.label,
});

const toHistoryItem = (entry: HistoryEntry): MapSearchItem => ({
  key: `history-${entry.id}`,
  title: entry.label,
  subtitle: "Recherche récente",
  department: null,
  coords: [entry.lat, entry.lng],
  label: entry.label,
});

export function useMapSearchItems(state: AddressSearchState, isOpen: boolean) {
  const query = state.address.trim();
  const history = useQuery<HistoryEntry[]>({
    queryKey: ["searchHistory"],
    queryFn: getUserSearchHistory,
    enabled: isOpen,
  });
  const features: Feature<Point, AddressProperties>[] = state.search.data?.features ?? [];

  const status: MapSearchStatus = !query
    ? "history"
    : query.length < 3
      ? "short"
      : state.waiting
        ? "loading"
        : state.search.isError
          ? "error"
          : "results";
  const items =
    status === "history"
      ? (history.data ?? []).slice(0, 6).map(toHistoryItem)
      : status === "results"
        ? features.map(toAddressItem)
        : [];

  return { query, status, items, isHistoryLoading: history.isPending };
}
