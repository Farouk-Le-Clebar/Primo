import { useCallback } from "react";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../../constants/routes";
import { usePageTour } from "../../../../../hooks/usePageTour";
import MapPanel from "../Navbar/MapPanel";
import { PROJECTS_PANEL_ID } from "../Navbar/panelIds";
import ProjectsRail from "./ProjectsRail";

export default function ProjectsPanel() {
  const navigate = useNavigate();
  const handleClose = useCallback(() => navigate(ROUTES.map), [navigate]);
  const hasOpenProject = useMatch("/projects/:projectId/*") !== null;
  usePageTour("projects", !hasOpenProject);

  return (
    <MapPanel id={PROJECTS_PANEL_ID} label="Projets" onClose={handleClose}>
      <div className="flex min-h-0 flex-1">
        <div className={hasOpenProject ? "hidden md:flex" : "flex w-full md:w-auto"}>
          <ProjectsRail />
        </div>
        <div className={`relative min-w-0 flex-1 flex-col ${hasOpenProject ? "flex" : "hidden md:flex"}`}>
          <Outlet />
        </div>
      </div>
    </MapPanel>
  );
}
