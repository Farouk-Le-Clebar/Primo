import { createContext } from "react";

export interface MapStyleColors {
    color: string;
    fillColor: string;
}

export interface MapStyleContextType {
    colors: MapStyleColors;
    setColors: (colors: MapStyleColors) => void;
    setColor: (color: string) => void;
    setFillColor: (fillColor: string) => void;
}

export const DEFAULT_MAP_COLORS: MapStyleColors = {
    color: "#51b789ff",
    fillColor: "#54bb8dff",
};

export const MapStyleContext = createContext<MapStyleContextType | undefined>(
    undefined,
);
