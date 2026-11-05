import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Feature, Point } from "geojson";
import { addOkRequest } from "../requests/addok";

type AddokProperties = { id?: string; label: string };

export type AddressSuggestion = {
    key: string;
    label: string;
    latitude: number;
    longitude: number;
};

const toSuggestion = ({ properties, geometry }: Feature<Point, AddokProperties>): AddressSuggestion => ({
    key: properties.id ?? properties.label,
    label: properties.label,
    latitude: geometry.coordinates[1],
    longitude: geometry.coordinates[0],
});

export function useAddokSuggestions(query: string) {
    const [debouncedQuery, setDebouncedQuery] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedQuery(query.trim()), 250);
        return () => clearTimeout(timeout);
    }, [query]);

    const search = useQuery({
        queryKey: ["address-search", debouncedQuery],
        queryFn: () => addOkRequest(debouncedQuery),
        enabled: debouncedQuery.length >= 3,
        staleTime: 60000,
        retry: false,
    });

    const features: Feature<Point, AddokProperties>[] = search.data?.features ?? [];
    const isLoading = query.trim() !== debouncedQuery || search.isFetching;

    return { suggestions: features.map(toSuggestion), isLoading };
}
