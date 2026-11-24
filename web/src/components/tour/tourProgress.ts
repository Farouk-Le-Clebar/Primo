import type { TourId } from "./tourTypes";

const storageKey = (): string => {
  const user: { id?: string; email?: string } | null = JSON.parse(localStorage.getItem("user") || "null");
  return `primo:tours-seen:${user?.id ?? user?.email ?? "anonymous"}`;
};

const readSeen = (): TourId[] => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey()) || "[]");
    return Array.isArray(value) ? (value as TourId[]) : [];
  } catch {
    return [];
  }
};

export const hasSeenTour = (id: TourId): boolean => readSeen().includes(id);

export const markTourSeen = (id: TourId): void => {
  const seen = readSeen();
  if (!seen.includes(id)) localStorage.setItem(storageKey(), JSON.stringify([...seen, id]));
};
