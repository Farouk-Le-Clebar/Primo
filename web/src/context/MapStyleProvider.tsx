import { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { MapStyleContext, DEFAULT_MAP_COLORS } from "./MapStyleContext";
import type { MapStyleColors } from "./MapStyleContext";

const STORAGE_KEY = "mapStyleColors";

function loadColors(): MapStyleColors {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                color: parsed.color || DEFAULT_MAP_COLORS.color,
                fillColor: parsed.fillColor || DEFAULT_MAP_COLORS.fillColor,
            };
        }
    } catch {
        // ignore
    }
    return { ...DEFAULT_MAP_COLORS };
}

function saveColors(colors: MapStyleColors) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
}

export const MapStyleProvider = ({ children }: { children: ReactNode }) => {
    const [colors, setColorsState] = useState<MapStyleColors>(loadColors);

    const setColors = useCallback((newColors: MapStyleColors) => {
        setColorsState(newColors);
        saveColors(newColors);
    }, []);

    const setColor = useCallback((color: string) => {
        setColorsState((prev) => {
            const next = { ...prev, color };
            saveColors(next);
            return next;
        });
    }, []);

    const setFillColor = useCallback((fillColor: string) => {
        setColorsState((prev) => {
            const next = { ...prev, fillColor };
            saveColors(next);
            return next;
        });
    }, []);

    return (
        <MapStyleContext.Provider
            value={{ colors, setColors, setColor, setFillColor }}
        >
            {children}
        </MapStyleContext.Provider>
    );
};
