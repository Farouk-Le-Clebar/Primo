import { useContext } from "react";
import { MapStyleContext } from "../context/MapStyleContext";
import type { MapStyleContextType } from "../context/MapStyleContext";

export const useMapStyle = (): MapStyleContextType => {
    const ctx = useContext(MapStyleContext);
    if (!ctx) {
        throw new Error("useMapStyle must be used within a MapStyleProvider");
    }
    return ctx;
};
