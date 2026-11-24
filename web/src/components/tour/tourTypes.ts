export type TourId = "map" | "parcel" | "projects" | "project" | "admin";

export type TourStep = {
  target?: string;
  title: string;
  description: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
};

export type TourDefinition = {
  id: TourId;
  label: string;
  priority: number;
  steps: TourStep[];
};

export const tourTarget = (name: string): string => `[data-tour="${name}"]`;
