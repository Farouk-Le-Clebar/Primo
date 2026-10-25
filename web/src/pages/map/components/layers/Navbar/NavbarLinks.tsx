import { FolderIcon, MagnifyingGlassIcon, MapIcon, ShieldCheckIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import {
  FolderIcon as FolderSolidIcon,
  MagnifyingGlassIcon as MagnifyingGlassSolidIcon,
  MapIcon as MapSolidIcon,
  ShieldCheckIcon as ShieldCheckSolidIcon,
  Squares2X2Icon as Squares2X2SolidIcon,
} from "@heroicons/react/24/solid";
import type { useMapPanels } from "../../../../../hooks/useMapPanels";
import { ADMIN_PANEL_ID, DASHBOARD_PANEL_ID, PROJECTS_PANEL_ID } from "./panelIds";
import NavIconButton from "./NavIconButton";

type NavbarLinksProps = {
  panels: ReturnType<typeof useMapPanels>;
  isSearchOpen: boolean;
  onOpenSearch: () => void;
};

export default function NavbarLinks({ panels, isSearchOpen, onOpenSearch }: NavbarLinksProps) {
  const isAdmin: boolean = JSON.parse(localStorage.getItem("user") || "null")?.isAdmin ?? false;

  return (
    <div className="flex items-center gap-1">
      <NavIconButton
        icon={MapIcon}
        activeIcon={MapSolidIcon}
        label="Carte"
        active={!panels.isAnyPanelOpen}
        onClick={panels.showMap}
      />
      <NavIconButton
        icon={Squares2X2Icon}
        activeIcon={Squares2X2SolidIcon}
        label="Dashboard"
        active={panels.isDashboardOpen}
        controls={DASHBOARD_PANEL_ID}
        onClick={panels.toggleDashboard}
      />
      <NavIconButton
        icon={FolderIcon}
        activeIcon={FolderSolidIcon}
        label="Projets"
        active={panels.isProjectsOpen}
        controls={PROJECTS_PANEL_ID}
        onClick={panels.toggleProjects}
      />
      <NavIconButton icon={MagnifyingGlassIcon} activeIcon={MagnifyingGlassSolidIcon} label="Recherche" active={isSearchOpen} onClick={onOpenSearch} />
      {isAdmin && (
        <NavIconButton
          icon={ShieldCheckIcon}
          activeIcon={ShieldCheckSolidIcon}
          label="Administration"
          active={panels.isAdminOpen}
          controls={ADMIN_PANEL_ID}
          onClick={panels.toggleAdmin}
        />
      )}
    </div>
  );
}
