import ParcelAnalysisLayout from "../../ParcelAnalysisLayout";

// COMPONENTS
import PluCard from "./PluCard";
import PrescriptionsCard from "./PrescriptionsCard";
import InformationsCard from "./InformationsCard";
import type { ParcelWidgetProps } from "../../types";

export default function GpuWidget({ feature }: ParcelWidgetProps) {
  return (
    <div className="font-inter w-full">
      <ParcelAnalysisLayout summary={<PluCard feature={feature} />}>
        <PrescriptionsCard feature={feature} />
        <InformationsCard feature={feature} />
      </ParcelAnalysisLayout>
    </div>
  );
}
