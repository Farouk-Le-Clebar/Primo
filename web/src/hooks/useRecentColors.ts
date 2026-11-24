import { useCallback, useState } from "react";

const STORAGE_KEY = "primo-recent-map-colors";
const MAX_RECENT_COLORS = 8;

const readRecentColors = (): string[] => {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(stored) ? stored.filter((color): color is string => typeof color === "string") : [];
  } catch {
    return [];
  }
};

const writeRecentColors = (colors: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
  } catch {
    return;
  }
};

export function useRecentColors() {
  const [recentColors, setRecentColors] = useState<string[]>(readRecentColors);

  const addRecentColor = useCallback((color: string) => {
    setRecentColors((current) => {
      const next = [color, ...current.filter((recent) => recent !== color)].slice(0, MAX_RECENT_COLORS);
      writeRecentColors(next);
      return next;
    });
  }, []);

  return { recentColors, addRecentColor };
}
