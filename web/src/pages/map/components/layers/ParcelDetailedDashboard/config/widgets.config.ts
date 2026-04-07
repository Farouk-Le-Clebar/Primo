import type { ParcelWidgetComponent } from "../types";

// WIDGETS
import BuildingsWidget from "../widgets/buildings/BuildingsWidget";
import MeteoWidget from "../widgets/meteo/MeteoWidget";
import GpuUrbanAreasWidget from "../widgets/gpu/UrbanAreas/GpuUrbanAreasWidget";
import GpuPrescriptionsWidget from "../widgets/gpu/Prescriptions/GpuPrescriptionsWidget";
import GpuInformationsWidget from "../widgets/gpu/Informations/GpuInformationsWidget";
import DvfWidget from "../widgets/dvf/DvfWidget";

export const getWidgetsFromUserProfile = (): ParcelWidgetComponent[] => {
  return [
    BuildingsWidget,
    GpuUrbanAreasWidget,
    GpuPrescriptionsWidget,
    GpuInformationsWidget,
    DvfWidget,
  ];
};