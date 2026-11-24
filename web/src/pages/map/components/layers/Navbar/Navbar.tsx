import { Link, useOutlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import type { Feature, FeatureCollection } from "geojson";

// COMPONENTS
import NavbarLinks from "./NavbarLinks";
import NavbarActions from "./NavbarActions";
import MapSearch from "../Search/MapSearch";
import { useMapPanels } from "../../../../../hooks/useMapPanels";
import { usePageTour } from "../../../../../hooks/usePageTour";
import { ROUTES } from "../../../../../constants/routes";

// ICONS
import { getShapeStyles } from "../../../../../utils/map";
import PrimoIcon from "../../../../../assets/logos/logoPrimoWhite.svg?react";



type NavbarProps = {
  parcelleBounds?: FeatureCollection | null;
  onParcelleSelect?: (
    bounds: L.LatLngBounds,
    feature: Feature | undefined,
    layer: L.Path,
  ) => void;
  onPanelsOpenChange?: (isOpen: boolean) => void;
  isParcelDashboardOpen?: boolean;
};

export default function Navbar({
  parcelleBounds,
  onParcelleSelect,
  onPanelsOpenChange,
  isParcelDashboardOpen = false,
}: NavbarProps) {
  const map = useMap();
  const [coordsSelected, setCoordsSelected] = useState<[number, number] | null>(
    null,
  );
  const [newSearchSelected, setNewSearchSelected] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const panels = useMapPanels();
  const routePanel = useOutlet();
  const { isAnyPanelOpen } = panels;
  const isOverlayOpen = isAnyPanelOpen || isParcelDashboardOpen;
  usePageTour("map", !isOverlayOpen);

  useEffect(() => {
    onPanelsOpenChange?.(isAnyPanelOpen);
  }, [isAnyPanelOpen, onPanelsOpenChange]);

  useEffect(() => {
    if (isOverlayOpen) setIsSearchOpen(false);
  }, [isOverlayOpen]);

  const handleOpenSearch = () => {
    panels.showMap();
    setIsSearchOpen(true);
  };

  useEffect(() => {
    if (
      !coordsSelected ||
      !parcelleBounds ||
      newSearchSelected ||
      !onParcelleSelect
    )
      return;

    const timer = setTimeout(() => {
      let found = false;

      map.eachLayer((layer: L.Layer) => {
        if (
          layer instanceof L.Polygon &&
          layer.getBounds().contains(coordsSelected)
        ) {
          layer.setStyle(getShapeStyles().selected);
          layer.bringToFront();
          found = true;
          onParcelleSelect(layer.getBounds(), layer.feature, layer);
          setNewSearchSelected(true);
        }
      });

      if (found) {
        setCoordsSelected(null);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [
    parcelleBounds,
    coordsSelected,
    map,
    newSearchSelected,
    onParcelleSelect,
  ]);


  const handleAdressSelect = (coords: [number, number]) => {
    map.flyTo(coords, 18, { duration: 1.5 });
    setCoordsSelected(coords);
    setNewSearchSelected(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex h-14 w-full items-center rounded-none border-b border-[#1c1c1e]/10 px-3 pointer-events-auto sm:px-6 dark:border-transparent">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-white dark:bg-[#1c1c1e]/82 dark:backdrop-blur-[24px]" />
        <Link
          to={ROUTES.map}
          aria-label="Primo"
          className="group flex shrink-0 items-center gap-2"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1c1c1e] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-45 dark:bg-white">
            <PrimoIcon className="h-4 w-4 fill-current text-white dark:invert" />
          </span>
          <span className="hidden text-lg tracking-[-0.45px] text-[#1c1c1e] sm:inline dark:text-white">
            Primo
          </span>
        </Link>
        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <NavbarLinks
            panels={panels}
            isSearchOpen={isSearchOpen}
            onOpenSearch={handleOpenSearch}
          />
        </div>
        <div className="ml-auto">
          <NavbarActions />
        </div>
      </nav>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[#1c1c1e]/10 bg-white pb-[env(safe-area-inset-bottom)] pointer-events-auto md:hidden dark:border-white/10 dark:bg-[#1c1c1e]">
        <NavbarLinks panels={panels} isSearchOpen={isSearchOpen} onOpenSearch={handleOpenSearch} stacked />
      </nav>
      {!isParcelDashboardOpen && (
        <MapSearch
          isOpen={isSearchOpen}
          onOpenChange={setIsSearchOpen}
          onAdressSelect={handleAdressSelect}
        />
      )}
      {routePanel}
    </>
  );
}
