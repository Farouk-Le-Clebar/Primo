import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

// UTILS
import { checkAuth } from "../../../../../utils/auth";

// COMPONENTS
import SearchingBar from "../../../../../components/search/SearchBar";
import Button from "../../../../../ui/Button";

// COMPONENTS AUTH DE LA BRANCHE DEV
import LoginButton from "../../../../../components/navbar/components/LoginButton";
import NotificationsDropdown from "../../../../../components/navbar/components/notificationDropdown/NotificationsDropdown";
import ProfileDropdown from "../../../../../components/navbar/components/profileDropdown/ProfileDropdown";
// Ton composant d'origine si tu veux le garder à la place de ProfileDropdown :
// import UserProfile from "./UserProfile"; 

// ICONS
import ArrowLeft from "../../../../../assets/icons/arrowLeft.svg?react";

type NavbarProps = {
  parcelleBounds?: any; // Optionnel car tu ne l'avais pas dans ta version
  onParcelleSelect?: (bounds: L.LatLngBounds, feature: any, layer: L.Path) => void;
};

export default function Navbar({ parcelleBounds, onParcelleSelect }: NavbarProps) {
  const map = useMap();
  const navigate = useNavigate();
  
  // LOGIQUE DE LA BRANCHE DEV
  const [isUserConnected, setIsUserConnected] = useState<boolean | null>(null);
  const [coordsSelected, setCoordsSelected] = useState<[number, number] | null>(null);
  const [newSearchSelected, setNewSearchSelected] = useState(true);

  // Vérification de l'authentification au montage
  useEffect(() => {
    const verify = async () => {
      const isConnected = await checkAuth();
      setIsUserConnected(isConnected);
    };
    verify();
  }, []);

  // LOGIQUE DE SÉLECTION AUTOMATIQUE DE PARCELLE (Issue de Dev)
  useEffect(() => {
    if (!coordsSelected || !parcelleBounds || newSearchSelected || !onParcelleSelect) return;
    
    const timer = setTimeout(() => {
      let found = false;

      map.eachLayer((layer: any) => {
        // Si le layer est un polygone (une parcelle) et contient les coordonnées cherchées
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

  // COMBINAISON DE TA FONCTION ET CELLE DE DEV
  const handleAdressSelect = (coords: [number, number]) => {
    map.flyTo(coords, 18, { duration: 1.5 });
    setCoordsSelected(coords);
    setNewSearchSelected(false);
  };

  // Rendu en attente d'authentification
  if (isUserConnected === null) {
    return <nav className="flex left-0 right-0 w-full h-full bg-white border-b border-gray-100 z-[1010]" />;
  }

  // TON RENDU VISUEL + LES ACTIONS DE DEV
  return (
    <nav className="flex left-0 right-0 w-full h-full items-center justify-between bg-white border-b border-gray-100 z-[1010]">
      
      {/* GAUCHE : Bouton Retour Dashboard (Ton design) */}
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

      {/* CENTRE : Barre de recherche */}
      <div className="flex h-full flex-1 items-center gap-20 px-8">
        <div className="flex-1 max-w-xl mx-auto">
          <SearchingBar onAdressSelect={handleAdressSelect} />
        </div>
      </div>

      {/* DROITE : Authentification / Profil (Logique Dev) */}
      <div className="flex h-full justify-end min-w-[285px] mr-6">
        {!isUserConnected ? (
          <div className="flex h-full items-center justify-end">
            <LoginButton />
          </div>
        ) : (
          <div className="flex h-full items-center justify-end gap-4">
            {/* Si tu veux utiliser leur version avec dropdowns */}
            <NotificationsDropdown />
            <ProfileDropdown />
            
            {/* Si tu voulais absolument garder ton composant <UserProfile /> :
                Commente les 2 lignes au dessus et décommente celle en dessous 
            */}
            {/* <UserProfile /> */}
          </div>
        )}
      </div>
      
    </nav>
  );
}