import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeProvider";
import type { ColorMode } from "../types/mapColors";

const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

export function useResolvedTheme(): ColorMode {
  const { theme } = useTheme();
  const [isSystemDark, setIsSystemDark] = useState(() => window.matchMedia(DARK_SCHEME_QUERY).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DARK_SCHEME_QUERY);
    const handleChange = (event: MediaQueryListEvent) => setIsSystemDark(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (theme === "system") return isSystemDark ? "dark" : "light";
  return theme;
}
