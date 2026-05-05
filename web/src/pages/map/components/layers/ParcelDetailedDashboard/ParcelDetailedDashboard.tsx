import { useState } from "react";

// TABS
import { ParcelInfoCard } from "../ParcelPanel/ParcelleInfoCard";
import GpuUrbanAreasWidget from "./widgets/gpu/GpuWidget";
import BuildingsWidget from "./widgets/buildings/BuildingsWidget";
import DpeWidget from "./widgets/dpe/DpeWidget";
import DvfWidget from "./widgets/dvf/DvfWidget";

// COMPONENTS
import ParcelDetailedNavbar from "./ParcelDetailedNavbar";

type ParcelDetailedDashboardProps = {
  selectedParcelle: any;
  onClose: () => void;
};

export default function ParcelDetailedDashboard({ selectedParcelle, onClose }: ParcelDetailedDashboardProps) {
  const [activeTab, setActiveTab] = useState("general");

  const properties = selectedParcelle?.feature?.properties;
  const parcelId = properties?.id?.replace('Parcelle ', '') || "Inconnue";
  const address = selectedParcelle?.addokData?.features?.[0]?.properties?.label || "Adresse non renseignée";

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F8F9FB] animate-in fade-in duration-300">
      
      <ParcelDetailedNavbar 
        parcelId={parcelId}
        address={address}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onClose={onClose}
      />

      <div className="flex-1 w-full h-full overflow-y-auto p-8 custom-scrollbar">
        <div className="w-full h-full">
          {activeTab === "general" && <ParcelInfoCard properties={selectedParcelle?.feature?.properties} />}
          {activeTab === "plu" && <GpuUrbanAreasWidget feature={selectedParcelle?.feature} />}
          {activeTab === "batiments" && <BuildingsWidget feature={selectedParcelle?.feature} />}
          {activeTab === "dvf" && <DvfWidget feature={selectedParcelle?.feature} />}
          {activeTab === "dpe" && <DpeWidget selectedParcelle={selectedParcelle} />}
        </div>
      </div>

    </div>
  );
}