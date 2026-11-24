import { driver, type DriveStep, type Driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./tour.css";
import { markTourSeen } from "./tourProgress";
import { notifyTourFinished } from "./tourStore";
import { TOURS } from "./tours";
import type { TourId, TourStep } from "./tourTypes";

let activeDriver: Driver | null = null;

const isVisible = (element: Element): boolean =>
  element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden";

const findTarget = (selector: string): Element | null => [...document.querySelectorAll(selector)].find(isVisible) ?? null;

const toDriveStep = (step: TourStep): DriveStep[] => {
  const popover = { title: step.title, description: step.description, side: step.side, align: step.align };
  if (!step.target) return [{ popover: { ...popover, popoverClass: "primo-tour primo-tour-centered" } }];
  const element = findTarget(step.target);
  return element ? [{ element, popover }] : [];
};

export const isTourRunning = (): boolean => activeDriver?.isActive() ?? false;

export const isTourReady = (id: TourId): boolean => {
  const firstTarget = TOURS[id].steps.find((step) => step.target)?.target;
  return !document.querySelector("[data-map-splash]") && (!firstTarget || !!findTarget(firstTarget));
};

export function startTour(id: TourId): void {
  activeDriver?.destroy();
  const steps = TOURS[id].steps.flatMap(toDriveStep);
  if (steps.length === 0) return;

  activeDriver = driver({
    steps,
    animate: true,
    smoothScroll: true,
    allowKeyboardControl: true,
    showProgress: steps.length > 1,
    progressText: "{{current}} sur {{total}}",
    nextBtnText: "Suivant",
    prevBtnText: "Retour",
    doneBtnText: "Terminer",
    popoverClass: "primo-tour",
    overlayColor: "#0a0a0a",
    overlayOpacity: 0.55,
    stagePadding: 6,
    stageRadius: 12,
    onDestroyed: () => {
      markTourSeen(id);
      activeDriver = null;
      notifyTourFinished();
    },
  });
  activeDriver.drive();
}
