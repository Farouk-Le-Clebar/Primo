import type { Feature } from "geojson";

import ParcelSummary from "./ParcelSummary";
import AutorisationsWidget from "./widgets/autorisations/AutorisationsWidget";
import BuildingsWidget from "./widgets/buildings/BuildingsWidget";
import DpeWidget from "./widgets/dpe/DpeWidget";
import DvfWidget from "./widgets/dvf/DvfWidget";
import GeorisquesWidget from "./widgets/georisques/GeorisquesWidget";
import LogementWidget from "./widgets/logement/LogementWidget";
import type { LogementTarget } from "./widgets/logement/types";
import GpuWidget from "./widgets/plu/GpuWidget";
import PoisWidget from "./widgets/pois/PoisWidget";

type ParcelTabContentProps = {
  activeTab: string;
  feature: Feature;
  banId?: string;
  target: LogementTarget;
  onTargetChange: (target: LogementTarget) => void;
  onOpenTarget: (target: LogementTarget) => void;
  onNavigate: (tab: string) => void;
};

export default function ParcelTabContent({ activeTab, feature, banId, target, onTargetChange, onOpenTarget, onNavigate }: ParcelTabContentProps) {
  const targeting = { target, onOpenTarget, onShowTarget: () => onNavigate("logement") };

  switch (activeTab) {
    case "synthese":
      return <ParcelSummary feature={feature} banId={banId} onNavigate={onNavigate} />;
    case "logement":
      return <LogementWidget feature={feature} banId={banId} target={target} onTargetChange={onTargetChange} />;
    case "batiments":
      return <BuildingsWidget feature={feature} />;
    case "dpe":
      return <DpeWidget selectedParcelle={{ addokData: { features: [{ properties: { id: banId } }] } }} {...targeting} />;
    case "autorisations":
      return <AutorisationsWidget feature={feature} />;
    case "plu":
      return <GpuWidget feature={feature} />;
    case "dvf":
      return <DvfWidget feature={feature} {...targeting} />;
    case "georisques":
      return <GeorisquesWidget feature={feature} />;
    case "pois":
      return <PoisWidget feature={feature} />;
    default:
      return null;
  }
}
