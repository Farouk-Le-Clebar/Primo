import type { ParcelWidgetComponent } from "../types";

// WIDGETS
import BuildingsWidget from "../widgets/buildings/BuildingsWidget";
import GpuUrbanAreasWidget from "../widgets/gpu/GpuWidget";
import DvfWidget from "../widgets/dvf/DvfWidget";

export const getWidgetsFromUserProfile = (): ParcelWidgetComponent[] => {
  return [
    BuildingsWidget,
    GpuUrbanAreasWidget,
    DvfWidget,
  ];
};