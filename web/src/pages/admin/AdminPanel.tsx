import { useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import MapPanel from "../map/components/layers/Navbar/MapPanel";
import { ADMIN_PANEL_ID } from "../map/components/layers/Navbar/panelIds";
import AdminRail from "./components/AdminRail/AdminRail";
import { findAdminSection } from "./adminSections";

export default function AdminPanel() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const section = findAdminSection(pathname);
  const handleClose = useCallback(() => navigate(ROUTES.map), [navigate]);

  return (
    <MapPanel id={ADMIN_PANEL_ID} label="Administration" onClose={handleClose}>
      <div className="flex min-h-0 flex-1">
        <AdminRail />
        <div className="relative flex min-w-0 flex-1 flex-col">
          <header key={section.path} className="primo-page-enter shrink-0 border-b border-black/[0.06] px-6 pt-5 pb-5 dark:border-white/10">
            <h2 className="truncate text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{section.label}</h2>
            <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">{section.description}</p>
          </header>
          <div key={pathname} className="scrollbar-glass @container min-h-0 flex-1 overflow-y-auto p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </MapPanel>
  );
}
