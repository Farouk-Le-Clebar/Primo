import { useNavigate } from "react-router-dom"; // Import de useNavigate

// COMPONENTS
import SearchingBar from "../../../../../components/search/SearchBar";
import UserProfile from "./UserProfile";
import Button from "../../../../../ui/Button";

// ICONS / LOGOS
import ArrowLeft from "../../../../../assets/icons/arrowLeft.svg?react";
import { useMap } from "react-leaflet";

export default function Navbar() {
  const map = useMap();
  const navigate = useNavigate();

  const handleAdressSelect = (coords: [number, number]) => {
    map.flyTo(coords, 18, { duration: 1.5 });
  };

  return (
    <nav className="flex left-0 right-0 w-full h-full items-center justify-end bg-white border-b border-gray-100">
      
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
        <div className="flex-1 max-w-xl">
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