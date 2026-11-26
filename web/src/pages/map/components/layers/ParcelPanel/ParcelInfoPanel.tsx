import { lazy, Suspense, useState } from "react";

import type { SelectedParcelle } from "../../../../../hooks/useParcelSelection";
import PreviewActions from "./preview/PreviewActions";
import PreviewMetrics from "./preview/PreviewMetrics";
import { useParcelPreview } from "./preview/useParcelPreview";

const AddPlotToProjectModal = lazy(() => import("./AddPlotToProjectModal"));

type ParcelInfoPanelProps = {
  selectedParcelle: SelectedParcelle | null;
  onOpenDashboard: () => void;
};

export default function ParcelInfoPanel({ selectedParcelle, onOpenDashboard }: ParcelInfoPanelProps) {
  const [addPlotModalOpen, setAddPlotModalOpen] = useState(false);
  const feature = selectedParcelle?.feature;
  const properties = feature?.properties;
  const addressFeature = selectedParcelle?.addokData?.features?.[0];
  const addressGeometry = addressFeature?.geometry;
  const addressCoordinates = addressGeometry?.type === "Point" ? addressGeometry.coordinates : [];
  const banId: string | undefined = addressFeature?.properties?.id;
  const parcelId: string = properties?.id || "Parcelle inconnue";
  const address: string = addressFeature?.properties?.label || "Adresse non renseignée";
  const { area, ...preview } = useParcelPreview(feature, banId);
  const handleOpenAddPlot = () => setAddPlotModalOpen(true);
  const handleCloseAddPlot = () => setAddPlotModalOpen(false);
  if (!feature) return null;

  return (
    <aside className="pointer-events-auto flex font-inter w-full flex-wrap items-center gap-x-2 gap-y-3 px-4 py-3.5 md:flex-nowrap md:py-4 md:pl-6 md:pr-4">
      <div className="order-1 min-w-0 flex-1 md:w-56 md:flex-none md:pr-4">
        <h2 className="truncate font-inter text-lg font-semibold tracking-tight text-[#111111] dark:text-white">
          {parcelId.replace("Parcelle ", "")}
        </h2>
        <p className="truncate font-inter text-xs text-gray-500 dark:text-white/50">
          {address} · {area}
        </p>
      </div>
      <div className="order-3 -mx-4 w-[calc(100%+2rem)] border-t border-black/[0.06] pt-3 md:order-2 md:mx-0 md:w-auto md:min-w-0 md:flex-1 md:border-l md:border-t-0 md:pt-0 dark:border-white/[0.08]">
        <PreviewMetrics {...preview} />
      </div>
      <div className="order-2 md:order-3 md:pl-2">
        <PreviewActions onAddToProject={handleOpenAddPlot} onOpenDashboard={onOpenDashboard} />
      </div>
      {addPlotModalOpen && (
        <Suspense fallback={null}>
          <AddPlotToProjectModal
            onClose={handleCloseAddPlot}
            plotData={{
              plotId: parcelId,
              plotBanId: banId ?? "",
              adress: address,
              coordinates: `${addressCoordinates[0]},${addressCoordinates[1]}`,
              geometry: feature.geometry,
              parcelProperties: properties ?? undefined,
              addressProperties: addressFeature?.properties ?? undefined,
            }}
          />
        </Suspense>
      )}
    </aside>
  );
}
