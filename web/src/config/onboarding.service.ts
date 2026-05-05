import { driver, type DriveStep, type AllowedButtons } from "driver.js"; // Import du type
import "driver.js/dist/driver.css";
import "../styles/onBoarding.css";

import { dashboardSteps } from "./onboardingTours/dashboard.steps";

const baseConfig = {
  popoverClass: 'driverjs-theme',
  showProgress: false,
  showButtons: ['next', 'previous', 'close'] as AllowedButtons[],
  animate: true,
  allowClose: true,
  overlayColor: '#000000',
  overlayOpacity: 0.5,
  prevBtnText: 'Précédent', 
  nextBtnText: 'Suivant',
  doneBtnText: 'Terminer',
  
};

export const startOnboarding = (path: string) => {
  let steps: DriveStep[] = [];

  if (path === "/dashboard" || path === "/") {
    steps = dashboardSteps;
  }

  if (steps.length > 0) {
    const onboardingDriver = driver({ ...baseConfig, steps });
    onboardingDriver.drive();
  } else {
    console.warn("Aucun tutoriel configuré pour cette route :", path);
  }
};