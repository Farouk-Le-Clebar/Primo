import type { Feature } from "geojson";

export interface ParcelWidgetProps {
  feature: Feature;
}

export type ParcelWidgetComponent = React.FC<ParcelWidgetProps>;
