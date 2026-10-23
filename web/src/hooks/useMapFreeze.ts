import { useEffect } from "react";
import L from "leaflet";

const INTERACTION_HANDLERS = ["dragging", "scrollWheelZoom", "doubleClickZoom", "boxZoom", "keyboard", "touchZoom"] as const;

export function useMapFreeze(map: L.Map, isFrozen: boolean) {
    useEffect(() => {
        map.getContainer().classList.toggle("selection-locked", isFrozen);
        INTERACTION_HANDLERS.forEach((name) => {
            const handler = map[name];
            if (isFrozen) handler?.disable();
            else handler?.enable();
        });
    }, [map, isFrozen]);
}
