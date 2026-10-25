import { useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../../constants/routes";
import MapPanel from "../Navbar/MapPanel";
import { PROJECTS_PANEL_ID } from "../Navbar/panelIds";
import ProjectsRail from "./ProjectsRail";

export default function ProjectsPanel() {
  const navigate = useNavigate();
  const handleClose = useCallback(() => navigate(ROUTES.map), [navigate]);

  return (
    <MapPanel id={PROJECTS_PANEL_ID} label="Projets" onClose={handleClose}>
      <div className="flex min-h-0 flex-1">
        <ProjectsRail />
        <div className="relative flex min-w-0 flex-1 flex-col">
          <Outlet />
        </div>
      </div>
    </MapPanel>
  );
}
