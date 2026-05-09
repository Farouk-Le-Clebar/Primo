import { driver, type DriveStep, type AllowedButtons } from "driver.js";
import "driver.js/dist/driver.css";
import "../styles/onBoarding.css";

import { dashboardSteps } from "./onboardingTours/dashboard.steps";
import { adminSteps } from "./onboardingTours/admin.steps";

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

const onboardingTours = [
  {
    paths: ["/dashboard", "/"],
    steps: dashboardSteps
  },
  {
    paths: ["/admin/dashboard"],
    steps: adminSteps
  }
];

export const startOnboarding = (path: string) => {
  const activeTour = onboardingTours.find(tour => tour.paths.includes(path));

  if (activeTour && activeTour.steps.length > 0) {
    const onboardingDriver = driver({ ...baseConfig, steps: activeTour.steps });
    onboardingDriver.drive();
  } else {
    console.warn("Aucun tutoriel configuré pour cette route :", path);
  }
};