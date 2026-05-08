import { Grid, Col } from "@tremor/react";

// COMPONENTS
import PluCard from "./PluCard";
import PrescriptionsCard from "./PrescriptionsCard";
import InformationsCard from "./InformationsCard";
import type { ParcelWidgetProps } from "../../types";

export default function GpuWidget({ feature }: ParcelWidgetProps) {
  return (
    <div className="font-inter w-full h-full flex flex-col min-h-0">
      <Grid numItems={1} numItemsMd={3} className="gap-6 w-full flex-1 min-h-0">
        
        <Col numColSpan={1} className="h-auto md:h-full">
          <PluCard feature={feature} />
        </Col>

        <Col numColSpan={1} numColSpanMd={2} className="md:h-full md:overflow-y-auto pb-4 pr-1 flex flex-col gap-6 scrollbar-custom min-h-0">
          <PrescriptionsCard feature={feature} />
          <InformationsCard feature={feature} />
        </Col>

      </Grid>
    </div>
  );
}