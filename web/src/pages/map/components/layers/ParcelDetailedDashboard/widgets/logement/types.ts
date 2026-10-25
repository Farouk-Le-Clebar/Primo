export type HousingType = "appartement" | "maison";

export type LogementTarget = {
  type: HousingType;
  surface: string;
  etage: string;
  porte: string;
};

export type MatchLevel = "forte" | "probable" | "possible";

export type Match<T> = { item: T; level: MatchLevel; reasons: string[] };

export const EMPTY_TARGET: LogementTarget = { type: "appartement", surface: "", etage: "", porte: "" };

export const hasCriteria = (target: LogementTarget | null): target is LogementTarget =>
  !!target && !!(target.surface.trim() || target.etage.trim() || target.porte.trim());

export type TargetingProps = {
  target?: LogementTarget;
  onOpenTarget?: (target: LogementTarget) => void;
  onShowTarget?: () => void;
};
