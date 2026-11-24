import { useEffect } from "react";
import { isTourReady, isTourRunning, startTour } from "../components/tour/startTour";
import { hasSeenTour } from "../components/tour/tourProgress";
import { consumePendingTour, registerTour, usePendingTour } from "../components/tour/tourStore";
import type { TourId } from "../components/tour/tourTypes";

const READY_POLL_MS = 300;
const READY_TIMEOUT_MS = 15000;
const SETTLE_DELAY_MS = 500;

export function usePageTour(id: TourId, enabled = true): void {
  const pendingTour = usePendingTour();

  useEffect(() => {
    if (!enabled) return;
    return registerTour(id);
  }, [id, enabled]);

  useEffect(() => {
    if (!enabled) return;
    const isRequested = pendingTour === id;
    if (!isRequested && hasSeenTour(id)) return;

    const startedAt = Date.now();
    let timer = window.setTimeout(function waitUntilReady() {
      if (isTourRunning() || Date.now() - startedAt > READY_TIMEOUT_MS) return;
      if (!isTourReady(id)) {
        timer = window.setTimeout(waitUntilReady, READY_POLL_MS);
        return;
      }
      if (isRequested) consumePendingTour(id);
      startTour(id);
    }, SETTLE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [id, enabled, pendingTour]);
}
