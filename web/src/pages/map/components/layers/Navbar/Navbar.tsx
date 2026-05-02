import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

// COMPONENTS
import SearchingBar from "../../../../../components/search/SearchBar";
import Button from "../../../../../ui/Button";
import UserProfile from "./UserProfile";

// ICONS
import ArrowLeft from "../../../../../assets/icons/arrowLeft.svg?react";

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
    <nav className="flex left-0 right-0 w-full h-full items-center justify-between bg-white border-b border-gray-100 z-[1010]">
      <div className="flex h-full w-102 items-center ml-4">
        <Button
          onClick={() => navigate("/dashboard")}
          backgroundColor="bg-transparent"
          backgroundHoverColor="hover:bg-gray-100"
          textHoverColor="hover:text-gray-800"
          textColor="text-black"
          shadowHover="shadow-none"
          width="w-28"
          height="h-7"
          className="py-3 transition-all"
        >
          <div className="flex items-center gap-1">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-inter font-medium text-xs tracking-tight">
              Dashboard
            </span>
          </div>
        </Button>
      </div>

      <div className="flex h-full flex-1 items-center gap-20 px-8">
        <div className="flex-1 max-w-xl mx-auto">
          <SearchingBar onAdressSelect={handleAdressSelect} />
        </div>
      </div>

      <div className="flex h-full justify-end min-w-[285px]">
        <div className="flex h-full w-3/4 items-center justify-end ">
          <UserProfile />
        </div>
      </div>

    </nav>
  );
}