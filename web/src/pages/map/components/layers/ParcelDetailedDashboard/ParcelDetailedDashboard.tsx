import { useState } from "react";

// TABS
import GeneralTab from "./tabs/GeneralTab";
import BatimentsTab from "./tabs/BatimentsTab";
import UrbanismeTab from "./tabs/UrbanismeTab";
import DvfTab from "./tabs/DvfTab";
import DpeTab from "./tabs/DpeTab";

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
    <div className="flex flex-col h-full w-full bg-[#F8F9FB] animate-in fade-in duration-300">
      
      <ParcelDetailedNavbar 
        parcelId={parcelId}
        address={address}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onClose={onClose}
      />

      <div className="flex-1 w-full h-full overflow-y-auto p-8 custom-scrollbar relative">
        <div className="w-full max-w-[1600px] mx-auto">
          {activeTab === "general" && <GeneralTab feature={selectedParcelle?.feature} />}
          {activeTab === "urbanisme" && <UrbanismeTab feature={selectedParcelle?.feature} />}
          {activeTab === "batiments" && <BatimentsTab feature={selectedParcelle?.feature} />}
          {activeTab === "prescriptions" && <PrescriptionsTab feature={selectedParcelle?.feature} />}
          {activeTab === "informations" && <InformationsTab feature={selectedParcelle?.feature} />}
          {activeTab === "dvf" && <DvfTab feature={selectedParcelle?.feature} />}
          {activeTab === "dpe" && <DpeTab feature={selectedParcelle} />}
        </div>
      </div>

    </div>
  );
}