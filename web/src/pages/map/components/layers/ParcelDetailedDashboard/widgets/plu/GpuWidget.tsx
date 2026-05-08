import { Grid, Col } from "@tremor/react";

// COMPONENTS
import PluCard from "./PluCard";
import PrescriptionsCard from "./PrescriptionsCard";
import InformationsCard from "./InformationsCard";
import type { ParcelWidgetProps } from "../../types";

export default function GpuWidget({ feature }: ParcelWidgetProps) {
  return (
    <div className="font-inter w-full">
      <Grid numItems={1} numItemsMd={3} className="gap-6 w-full relative">
        <Col numColSpan={1}>
          <div className="sticky top-0 h-182 flex flex-col">
            <PluCard feature={feature} />
          </div>
        </Col>

        <Col numColSpan={1} numColSpanMd={2} className="pb-10">
          <div className="flex flex-col gap-6">
            <PrescriptionsCard feature={feature} />
            <InformationsCard feature={feature} />
          </div>
        </Col>

      </Grid>
    </div>
  );
}