import { useCallback, useState } from "react";

import AddPlotToProjectModal from "../ParcelPanel/AddPlotToProjectModal";
import ParcelDetailedNavbar from "./ParcelDetailedNavbar";
import ParcelPageHeader from "./ParcelPageHeader";
import ParcelTabContent from "./ParcelTabContent";
import { useLogementTarget } from "./useLogementTarget";

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
    const banId: string | undefined =
        selectedParcelle?.addokData?.features?.[0]?.properties?.id;
    const openLogement = useCallback(() => setActiveTab("logement"), []);
    const { target, setTarget, openTarget } = useLogementTarget(parcelId, openLogement);

  return (
    <div className="flex min-h-0 flex-1 flex-col w-full animate-in fade-in duration-300">
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
                    <ParcelPageHeader parcelId={parcelId} address={address} activeTab={activeTab} />
                    <ParcelTabContent
                        activeTab={activeTab}
                        feature={selectedParcelle?.feature}
                        banId={banId}
                        target={target}
                        onTargetChange={setTarget}
                        onOpenTarget={openTarget}
                        onNavigate={setActiveTab}
                    />
                </div>
            </div>

            {isSaveOpen && (
                <AddPlotToProjectModal
                    onClose={() => setIsSaveOpen(false)}
                    plotData={{
                        plotId: properties?.id,
                        plotBanId:
                            selectedParcelle?.addokData?.features?.[0]
                                ?.properties?.id || "",
                        adress: address,
                        coordinates: `${selectedParcelle.bounds.getCenter().lng},${selectedParcelle.bounds.getCenter().lat}`,
                        geometry: selectedParcelle?.feature?.geometry,
                    }}
                />
            )}
        </div>
    );
}
