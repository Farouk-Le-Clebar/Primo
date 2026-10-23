import { useCallback, useEffect, useState } from "react";
import type { Theme } from "../context/ThemeProvider";

export type MapType = "basic" | "satellite" | "basic-dark";

const isDarkTheme = (theme: Theme): boolean =>
    theme === "system" ? window.matchMedia("(prefers-color-scheme: dark)").matches : theme === "dark";

const getUserMapPreference = (): MapType => {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.mapPreference === "satellite") return "satellite";
        return document.documentElement.classList.contains("dark") ? "basic-dark" : "basic";
    } catch {
        return "basic";
    }
};

export function useMapType(theme: Theme) {
    const [mapType, setMapType] = useState<MapType>(getUserMapPreference);

    useEffect(() => {
        const updateMapTheme = () =>
            setMapType((current) => (current === "satellite" ? current : isDarkTheme(theme) ? "basic-dark" : "basic"));
        updateMapTheme();
        if (theme !== "system") return;
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        mediaQuery.addEventListener("change", updateMapTheme);
        return () => mediaQuery.removeEventListener("change", updateMapTheme);
    }, [theme]);

    const handleChangeMapType = useCallback((type: MapType) => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const isDarkMode = document.documentElement.classList.contains("dark");
        setMapType(type === "satellite" ? "satellite" : isDarkMode ? "basic-dark" : "basic");
        user.mapPreference = type === "satellite" ? "satellite" : "basic";
        localStorage.setItem("user", JSON.stringify(user));
    }, []);

    return { mapType, handleChangeMapType };
}
