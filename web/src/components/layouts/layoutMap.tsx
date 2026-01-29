import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import ParcelInfoPanel from "../../components/ParcelPanel/ParcelInfoPanel";
import { ParcelleProvider } from "../../context/ParcelleContext";

const MapLayoutInner = () => {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-white font-sans">
      {/* 1. NAVBAR : Reste fixe en haut */}
      <header className="relative z-[1010] w-full h-20 flex items-center bg-white border-b border-gray-200 flex-shrink-0">
        <Navbar />
      </header>

      {/* 2. ZONE DE CONTENU : Carte + Panel */}
      <div className="relative flex-1 overflow-hidden bg-gray-50">
        
        {/* LA CARTE : Occupe tout le fond */}
        <main className="absolute inset-0 z-0">
          <Outlet />
        </main>

        {/* LE PANEL  */}
        <div className="absolute inset-y-0 left-0 z-[500] pointer-events-none w-full sm:w-[350px] lg:w-[400px]">
            <ParcelInfoPanel />
        </div>
        
      </div>
    </div>
  );
};

export default function LayoutMap() {
  return (
    <ParcelleProvider>
      <MapLayoutInner />
    </ParcelleProvider>
  );
}