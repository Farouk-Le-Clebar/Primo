import { useState } from "react";

// TABS
import GeneralTab from "./tabs/GeneralTab";
import BatimentsTab from "./tabs/BatimentsTab";
import UrbanismeTab from "./tabs/UrbanismeTab";
import PrescriptionsTab from "./tabs/PrescriptionsTab";
import InformationsTab from "./tabs/InformationsTab";
import DvfTab from "./tabs/DvfTab";

// COMPONENTS
import TabLink from "../../../../../ui/TabLink";

// ICONS
import { ArrowLeft, Map as MapIcon, Building2, BookOpen, BarChart3, Info } from "lucide-react";

type ParcelDetailedDashboardProps = {
  selectedParcelle: any;
  onClose: () => void;
};

export default function ParcelDetailedDashboard({ selectedParcelle, onClose }: ParcelDetailedDashboardProps) {
  const [activeTab, setActiveTab] = useState("general");

  const properties = selectedParcelle?.feature?.properties;

  return (
    <div className="flex h-full w-full bg-[#F8F9FB] animate-in fade-in duration-300">
      <nav className="flex flex-col h-full w-[280px] bg-white border-r border-gray-200 shrink-0">
        
        <div className="p-6 pb-4 border-b border-gray-100 mb-2">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-5 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span className="text-sm font-medium">Retour à la carte</span>
          </button>
          
          <h1 className="font-inter font-bold text-lg text-[#111111] truncate">
            Parcelle {properties?.id?.replace('Parcelle ', '') || "Inconnue"}
          </h1>
          <p className="text-xs font-medium text-gray-500 mt-1 truncate">
            {properties?.address || "Adresse non renseignée"}
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-6 overflow-y-auto overflow-x-hidden p-4 custom-scrollbar">
          
          <section className="flex flex-col gap-1">
            <div className="h-4 flex items-center px-2 mb-2">
              <h3 className="font-inter font-medium text-[11px] uppercase tracking-[0.1em] text-[#757575]">
                Aperçu
              </h3>
            </div>
            <div className="space-y-1">
              <TabLink 
                id="general" 
                label="Synthèse générale" 
                icon={Info} 
                isActive={activeTab === "general"} 
                onClick={setActiveTab} 
              />
            </div>
          </section>
          
          <section className="flex flex-col gap-1">
            <div className="h-4 flex items-center px-2 mb-2">
              <h3 className="font-inter font-medium text-[11px] uppercase tracking-[0.1em] text-[#757575]">
                Modules SIG
              </h3>
            </div>
            <div className="space-y-1">

              <TabLink 
                id="batiments" 
                label="Bâtiments" 
                icon={Building2} 
                isActive={activeTab === "batiments"} 
                onClick={setActiveTab} 
              />
              <TabLink 
                id="urbanisme" 
                label="Urbanisme (PLU)" 
                icon={MapIcon} 
                isActive={activeTab === "urbanisme"} 
                onClick={setActiveTab} 
              />
              <TabLink 
                id="prescriptions" 
                label="Prescriptions" 
                icon={BookOpen} 
                isActive={activeTab === "prescriptions"} 
                onClick={setActiveTab} 
              />
              <TabLink 
                id="informations" 
                label="Informations" 
                icon={Info} 
                isActive={activeTab === "informations"} 
                onClick={setActiveTab} 
              />
              <TabLink 
                id="dvf" 
                label="Données DVF" 
                icon={BarChart3} 
                isActive={activeTab === "dvf"} 
                onClick={setActiveTab} 
              />
            </div>
          </section>

        </div>
      </nav>

      <div className="flex-1 h-full overflow-y-auto p-10 custom-scrollbar relative">
        <div className="flex w-full mx-auto">
          {activeTab === "general" && <GeneralTab feature={selectedParcelle?.feature} />}
          {activeTab === "urbanisme" && <UrbanismeTab feature={selectedParcelle?.feature} />}
          {activeTab === "batiments" && <BatimentsTab feature={selectedParcelle?.feature} />}
          {activeTab === "prescriptions" && <PrescriptionsTab feature={selectedParcelle?.feature} />}
          {activeTab === "informations" && <InformationsTab feature={selectedParcelle?.feature} />}
          {activeTab === "dvf" && <DvfTab feature={selectedParcelle?.feature} />}

        </div>
      </div>

    </div>
  );
}