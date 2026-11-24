import { FolderIcon, MagnifyingGlassIcon, MapIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { LayoutGroup } from "framer-motion";
import type { useMapPanels } from "../../../../../hooks/useMapPanels";
import { ADMIN_PANEL_ID, PROJECTS_PANEL_ID } from "./panelIds";
import NavTab from "./NavTab";

type NavbarLinksProps = {
  panels: ReturnType<typeof useMapPanels>;
  isSearchOpen: boolean;
  onOpenSearch: () => void;
  stacked?: boolean;
};

export default function NavbarLinks({ panels, isSearchOpen, onOpenSearch, stacked = false }: NavbarLinksProps) {
  const isAdmin: boolean = JSON.parse(localStorage.getItem("user") || "null")?.isAdmin ?? false;

  return (
    <LayoutGroup id={stacked ? "navbar-bottom" : "navbar"}>
      <div className={`flex items-start ${stacked ? "w-full" : "gap-1"}`}>
        <NavTab icon={MapIcon} label="Carte" stacked={stacked} active={!panels.isAnyPanelOpen && !isSearchOpen} onClick={panels.showMap} />
        <NavTab
          icon={FolderIcon}
          label="Projets"
          tourId="nav-projects"
          stacked={stacked}
          active={panels.isProjectsOpen}
          controls={PROJECTS_PANEL_ID}
          onClick={panels.toggleProjects}
        />
        <NavTab icon={MagnifyingGlassIcon} label="Rechercher" stacked={stacked} active={isSearchOpen} onClick={onOpenSearch} />
        {isAdmin && (
          <NavTab
            icon={ShieldCheckIcon}
            label={stacked ? "Admin" : "Administration"}
            stacked={stacked}
            active={panels.isAdminOpen}
            controls={ADMIN_PANEL_ID}
            onClick={panels.toggleAdmin}
          />
        )}
      </div>
    </LayoutGroup>
  );
}
