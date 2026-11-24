import { METEO_UNITS, type MeteoData } from "../../../../../../../requests/geoserver/worldClim";

export const meteoValue = (data: MeteoData, key: keyof MeteoData): string => {
  const value = data[key];
  if (!Number.isFinite(value)) return "—";
  const digits = METEO_UNITS[key] === "mm" ? 0 : 1;
  return `${value.toFixed(digits)} ${METEO_UNITS[key]}`;
};
