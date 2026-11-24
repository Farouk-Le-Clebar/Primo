import { useState } from "react";
import { MousePointer2 } from "lucide-react";
import { MAP_BACKGROUNDS } from "../../../../../constants/mapColorPresets";
import type { ColorMode, MapPalette, ParcelState } from "../../../../../types/mapColors";
import { COLOR_MODE_LABELS, PARCEL_STATES, PARCEL_STATE_LABELS, SHAPE_STROKES } from "../../../../../utils/mapColors";

type MapPreviewProps = {
  palette: MapPalette;
  mode: ColorMode;
};

type PreviewParcel = {
  id: string;
  points: string;
  isSelected?: boolean;
  isHoverDemo?: boolean;
};

const PARCELS: PreviewParcel[] = [
  { id: "north-west", points: "24,20 112,14 120,78 30,86" },
  { id: "north-center", points: "128,14 214,20 208,84 136,78", isHoverDemo: true },
  { id: "north-east", points: "230,20 318,14 326,74 224,84", isSelected: true },
  { id: "north-edge", points: "334,14 380,18 385,72 342,74" },
  { id: "south-west", points: "30,118 118,110 126,176 22,180" },
  { id: "south-center", points: "134,110 228,116 236,180 142,176" },
  { id: "south-east", points: "244,116 330,108 338,180 252,180", isHoverDemo: true },
  { id: "south-edge", points: "346,108 400,112 400,180 354,180" },
];

const ROAD_COLORS: Record<ColorMode, string> = { light: "#e4e4e0", dark: "#3a3a3a" };

export default function MapPreview({ palette, mode }: MapPreviewProps) {
  const [isHoverForced, setIsHoverForced] = useState(false);
  const [pointedParcelId, setPointedParcelId] = useState<string | null>(null);

  const getParcelState = (parcel: PreviewParcel): ParcelState => {
    if (parcel.isSelected) return "selected";
    const isHovered = pointedParcelId === parcel.id || (isHoverForced && parcel.isHoverDemo);
    return isHovered ? "hover" : "default";
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      <svg
        viewBox="0 0 400 190"
        role="img"
        aria-label={`Aperçu des parcelles en thème ${COLOR_MODE_LABELS[mode].toLowerCase()}`}
        className="w-full rounded-xl transition-colors duration-200 motion-reduce:transition-none"
        style={{ backgroundColor: MAP_BACKGROUNDS[mode] }}
        onMouseLeave={() => setPointedParcelId(null)}
      >
        <path d="M0 96 L400 92" stroke={ROAD_COLORS[mode]} strokeWidth="10" fill="none" />
        {PARCELS.map((parcel) => {
          const state = getParcelState(parcel);
          return (
            <polygon
              key={parcel.id}
              points={parcel.points}
              fill={palette[state].fill}
              fillOpacity={palette[state].fillOpacity}
              stroke={palette[state].stroke}
              strokeOpacity={SHAPE_STROKES[state].opacity}
              strokeWidth={SHAPE_STROKES[state].weight}
              strokeLinejoin="round"
              className="transition-colors duration-200 motion-reduce:transition-none"
              onMouseEnter={() => setPointedParcelId(parcel.id)}
            />
          );
        })}
      </svg>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
          {PARCEL_STATES.map((state) => (
            <li key={state} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full ring-1 ring-black/15 dark:ring-white/20" style={{ backgroundColor: palette[state].stroke }} aria-hidden="true" />
              {PARCEL_STATE_LABELS[state]}
            </li>
          ))}
        </ul>
        <button
          type="button"
          aria-pressed={isHoverForced}
          onClick={() => setIsHoverForced((current) => !current)}
          className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${isHoverForced ? "bg-black/[0.08] text-gray-900 dark:bg-white/[0.14] dark:text-white" : "text-gray-600 hover:bg-black/[0.05] dark:text-gray-300 dark:hover:bg-white/[0.08]"}`}
        >
          <MousePointer2 className="h-3.5 w-3.5" aria-hidden="true" />
          Afficher le survol
        </button>
      </div>
    </div>
  );
}
