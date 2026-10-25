import { useMatch, useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export function useMapPanels() {
  const navigate = useNavigate();
  const isDashboardOpen = !!useMatch(ROUTES.dashboard);
  const isProjectsOpen = !!useMatch(`${ROUTES.projects}/*`);
  const isAdminOpen = !!useMatch(`${ROUTES.admin}/*`);
  const isFeedbackOpen = !!useMatch(ROUTES.feedback);
  const isProfileOpen = !!useMatch(ROUTES.profile);
  const isAnyPanelOpen = isDashboardOpen || isProjectsOpen || isAdminOpen || isFeedbackOpen || isProfileOpen;

  const showMap = () => {
    if (isAnyPanelOpen) navigate(ROUTES.map);
  };
  const toggle = (path: string, isOpen: boolean) => navigate(isOpen ? ROUTES.map : path);

  return {
    showMap,
    isAnyPanelOpen,
    isDashboardOpen,
    isProjectsOpen,
    isAdminOpen,
    isFeedbackOpen,
    isProfileOpen,
    toggleDashboard: () => toggle(ROUTES.dashboard, isDashboardOpen),
    toggleProjects: () => toggle(ROUTES.projects, isProjectsOpen),
    toggleAdmin: () => toggle(ROUTES.admin, isAdminOpen),
  };
}
