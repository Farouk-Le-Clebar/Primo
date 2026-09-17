import { useState } from "react";

// TABS
import ParcelSummary from "./ParcelSummary";
import AddPlotToProjectModal from "../ParcelPanel/AddPlotToProjectModal";
import GpuUrbanAreasWidget from "./widgets/plu/GpuWidget";
import BuildingsWidget from "./widgets/buildings/BuildingsWidget";
import DpeWidget from "./widgets/dpe/DpeWidget";
import DvfWidget from "./widgets/dvf/DvfWidget";

// COMPONENTS
import ParcelDetailedNavbar from "./ParcelDetailedNavbar";

type ParcelDetailedDashboardProps = {
  selectedParcelle: any;
  onClose: () => void;
};

export default function ParcelDetailedDashboard({
  selectedParcelle,
  onClose,
}: ParcelDetailedDashboardProps) {
  const [activeTab, setActiveTab] = useState("synthese");

  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const properties = selectedParcelle?.feature?.properties;
  const parcelId = properties?.id?.replace("Parcelle ", "") || "Inconnue";
  const address =
    selectedParcelle?.addokData?.features?.[0]?.properties?.label ||
    "Adresse non renseignée";

  return (
    <div className="flex flex-col h-full w-full bg-[#F8F9FB] dark:bg-[#0A0A0A] animate-in fade-in duration-300">
      <ParcelDetailedNavbar
        parcelId={parcelId}
        address={address}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onClose={onClose}
        onAddToProject={() => setIsSaveOpen(true)}
      />

      <div
        key={activeTab}
        className="min-h-0 flex-1 w-full overflow-y-auto px-4 py-4 sm:px-5 sm:py-5 lg:px-6 scrollbar-custom"
      >
        <div className="w-full">
          {activeTab !== "dvf" && (
            <div className="mb-6 flex shrink-0 flex-wrap items-start justify-between gap-4 font-inter">
              <div className="min-w-0">
                <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                  Parcelle {parcelId}
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {
                    {
                      synthese: "Vue d’ensemble",
                      batiments: "Bâtiments",
                      dpe: "Performance énergétique",
                      plu: "Urbanisme & réglementation",
                      dvf: "Transactions immobilières",
                    }[activeTab]
                  }
                </h1>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {address}
                </p>
              </div>
            </div>
          )}
          {activeTab === "synthese" && (
            <ParcelSummary
              feature={selectedParcelle?.feature}
              banId={selectedParcelle?.addokData?.features?.[0]?.properties?.id}
              onNavigate={setActiveTab}
            />
          )}
          {activeTab === "plu" && (
            <GpuUrbanAreasWidget feature={selectedParcelle?.feature} />
          )}
          {activeTab === "batiments" && (
            <BuildingsWidget feature={selectedParcelle?.feature} />
          )}
          {activeTab === "dvf" && (
            <DvfWidget feature={selectedParcelle?.feature} />
          )}
          {activeTab === "dpe" && (
            <DpeWidget selectedParcelle={selectedParcelle} />
          )}
        </div>
      </div>

      {isSaveOpen && (
        <AddPlotToProjectModal
          onClose={() => setIsSaveOpen(false)}
          plotData={{
            plotId: properties?.id,
            plotBanId:
              selectedParcelle?.addokData?.features?.[0]?.properties?.id || "",
            adress: address,
            coordinates: `${selectedParcelle.bounds.getCenter().lng},${selectedParcelle.bounds.getCenter().lat}`,
            geometry: selectedParcelle?.feature?.geometry,
          }}
        />
      )}
    </div>
  );
}
