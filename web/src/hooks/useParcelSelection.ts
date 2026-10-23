import { useCallback, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Feature, FeatureCollection } from "geojson";
import L from "leaflet";
import { addOkReverseRequest } from "../requests/addok";

export type SelectedParcelle = {
    bounds: L.LatLngBounds;
    feature: Feature;
    layer: L.Path;
    addokData?: FeatureCollection;
};

const enrichWithAddress = (feature: Feature, addokData: FeatureCollection): Feature => {
    const address = addokData.features?.[0]?.properties;
    if (!address) return feature;
    return {
        ...feature,
        properties: { ...feature.properties, ban: address.id, addok_label: address.label, addok_score: address.score },
    };
};

export function useParcelSelection() {
    const queryClient = useQueryClient();
    const selectedIdRef = useRef<string | null>(null);
    const [selectedParcelle, setSelectedParcelle] = useState<SelectedParcelle | null>(null);

    const handleParcelleSelect = useCallback(async (bounds: L.LatLngBounds, feature: Feature | undefined, layer: L.Path) => {
        if (!feature) return;
        const id = feature.id;
        selectedIdRef.current = id == null ? null : String(id);
        setSelectedParcelle({ bounds, feature, layer });

        try {
            const center = bounds.getCenter();
            const addokData = await queryClient.fetchQuery<FeatureCollection>({
                queryKey: ["addok-reverse", center.lng, center.lat],
                queryFn: () => addOkReverseRequest(center.lng, center.lat),
                staleTime: Infinity,
            });
            setSelectedParcelle((prev) =>
                prev && prev.feature.id === id
                    ? { ...prev, feature: enrichWithAddress(prev.feature, addokData), addokData }
                    : prev,
            );
        } catch (error) {
            console.error("Erreur Addok:", error);
        }
    }, [queryClient]);

    return { selectedParcelle, selectedIdRef, handleParcelleSelect };
}
