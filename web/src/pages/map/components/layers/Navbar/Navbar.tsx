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
      <nav className="fixed top-0 left-0 right-0 z-40 flex h-14 w-full items-center rounded-none border-b border-black/[0.08] px-6 pointer-events-auto dark:border-white/10">
        {!isOverlayOpen && <div aria-hidden="true" className="glass absolute inset-0 -z-10" />}
        <Link
          to={ROUTES.map}
          aria-label="Primo"
          className="flex shrink-0 items-center gap-2"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black dark:bg-white">
            <PrimoIcon className="h-4 w-4 fill-current text-white dark:invert" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            Primo
          </span>
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2">
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
