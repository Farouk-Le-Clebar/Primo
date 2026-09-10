import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

// COMPONENTS
import SearchingBar from "../../../../../components/search/SearchBar";
import UserProfile from "./UserProfile";

// ICONS
import { LayoutDashboard } from "lucide-react";

type NavbarProps = {
  parcelleBounds?: any;
  onParcelleSelect?: (bounds: L.LatLngBounds, feature: any, layer: L.Path) => void;
};

export default function Navbar({ parcelleBounds, onParcelleSelect }: NavbarProps) {
  const map = useMap();
  const navigate = useNavigate();
  const [coordsSelected, setCoordsSelected] = useState<[number, number] | null>(null);
  const [newSearchSelected, setNewSearchSelected] = useState(true);

  useEffect(() => {
    if (!coordsSelected || !parcelleBounds || newSearchSelected || !onParcelleSelect) return;

    const timer = setTimeout(() => {
      let found = false;

      map.eachLayer((layer: any) => {
        if (layer instanceof L.Polygon && layer.getBounds().contains(coordsSelected)) {
          layer.setStyle({
            fillOpacity: 0.7,
            weight: 3
          });
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
  }, [parcelleBounds, coordsSelected, map, newSearchSelected, onParcelleSelect]);

  const handleAdressSelect = (coords: [number, number]) => {
    map.flyTo(coords, 18, { duration: 1.5 });
    setCoordsSelected(coords);
    setNewSearchSelected(false);
  };

  return (
    <nav className="relative flex left-0 right-0 w-full h-full items-center justify-between bg-white dark:bg-[#0A0A0A] border-b border-gray-100 dark:border-[#262626] z-[1010]">
      
      <div className="flex h-full w-102 items-center ml-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-white transition-all bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#262626] rounded-lg hover:bg-gray-50 dark:hover:bg-[#262626] hover:text-gray-900 dark:hover:text-gray-300 group shadow-sm cursor-pointer"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Tableau de bord</span>
        </button>
      </div>

      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-xl pointer-events-auto px-4">
          <SearchingBar onAdressSelect={handleAdressSelect} />
        </div>
      </div>

      <div className="flex h-full justify-end items-center min-w-[285px]">
        <div className="flex h-12 w-45 items-center justify-start mr-4">
          <UserProfile />
        </div>
      </div>

    </nav>
  );
}