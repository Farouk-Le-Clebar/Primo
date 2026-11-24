import { useSyncExternalStore } from "react";
import { TOURS } from "./tours";
import type { TourId } from "./tourTypes";

const registered = new Map<TourId, number>();
const listeners = new Set<() => void>();
let currentTour: TourId | null = null;
let pendingTour: TourId | null = null;
let finishedCount = 0;

const emit = () => {
  currentTour = [...registered.keys()].sort((a, b) => TOURS[b].priority - TOURS[a].priority)[0] ?? null;
  listeners.forEach((listener) => listener());
};

export function registerTour(id: TourId): () => void {
  registered.set(id, (registered.get(id) ?? 0) + 1);
  emit();
  return () => {
    const count = (registered.get(id) ?? 1) - 1;
    if (count > 0) registered.set(id, count);
    else registered.delete(id);
    emit();
  };
}

export function notifyTourFinished(): void {
  finishedCount += 1;
  emit();
}

export function requestTour(id: TourId): void {
  pendingTour = id;
  emit();
}

export function consumePendingTour(id: TourId): boolean {
  if (pendingTour !== id) return false;
  pendingTour = null;
  return true;
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useCurrentTour = (): TourId | null => useSyncExternalStore(subscribe, () => currentTour);

export const usePendingTour = (): TourId | null => useSyncExternalStore(subscribe, () => pendingTour);

export const useFinishedCount = (): number => useSyncExternalStore(subscribe, () => finishedCount);
