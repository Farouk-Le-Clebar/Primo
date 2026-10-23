import { useCallback, useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

const MAP_PATH = "/search";
const PROJECTS_PATH = "/search/projects";
const ADMIN_PATH = "/search/admin";

export function useMapPanels() {
  const navigate = useNavigate();
  const isProjectsOpen = !!useMatch(`${PROJECTS_PATH}/*`);
  const isAdminOpen = !!useMatch(`${ADMIN_PATH}/*`);
  const isRoutePanelOpen = isProjectsOpen || isAdminOpen;
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const closeDashboard = useCallback(() => setIsDashboardOpen(false), []);
  const closeProjects = useCallback(() => navigate(MAP_PATH), [navigate]);

  useEffect(() => {
    if (isRoutePanelOpen) closeDashboard();
  }, [isRoutePanelOpen, closeDashboard]);

  const toggleDashboard = () => {
    if (isRoutePanelOpen) closeProjects();
    setIsDashboardOpen(!isDashboardOpen);
  };

  const toggleProjects = () => {
    closeDashboard();
    navigate(isProjectsOpen ? MAP_PATH : PROJECTS_PATH);
  };

  const toggleAdmin = () => {
    closeDashboard();
    navigate(isAdminOpen ? MAP_PATH : ADMIN_PATH);
  };

  const showMap = () => {
    closeDashboard();
    if (isRoutePanelOpen) closeProjects();
  };

  return { showMap, isDashboardOpen, isProjectsOpen, isAdminOpen, toggleDashboard, toggleAdmin, toggleProjects, closeDashboard, closeProjects };
}
