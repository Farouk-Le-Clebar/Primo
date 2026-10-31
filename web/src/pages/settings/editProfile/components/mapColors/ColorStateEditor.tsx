import { useId, useState } from "react";
import type { MapPalette, ParcelColors, ParcelState } from "../../../../../types/mapColors";
import { PARCEL_STATES, PARCEL_STATE_LABELS } from "../../../../../utils/mapColors";
import ColorPicker from "./ColorPicker";
import SelectionCard from "./SelectionCard";

type ColorStateEditorProps = {
  palette: MapPalette;
  onChange: (state: ParcelState, patch: Partial<ParcelColors>) => void;
};

type ColorTarget = "fill" | "stroke";

const COLOR_TARGETS: ColorTarget[] = ["fill", "stroke"];

const TARGET_LABELS: Record<ColorTarget, string> = { fill: "Remplissage", stroke: "Contour" };

const LEGEND = "mb-2 text-xs font-medium text-gray-500 dark:text-gray-400";

export default function ColorStateEditor({ palette, onChange }: ColorStateEditorProps) {
  const opacityId = useId();
  const [state, setState] = useState<ParcelState>("default");
  const [target, setTarget] = useState<ColorTarget>("fill");
  const colors = palette[state];
  const stateLabel = PARCEL_STATE_LABELS[state];
  const opacityPercent = Math.round(colors.fillOpacity * 100);

  const handleColorChange = (color: string) => onChange(state, { [target]: color });

  return (
    <div className="flex flex-col gap-4 p-4">
      <div role="group" aria-label="État de la parcelle">
        <p className={LEGEND} aria-hidden="true">Sélection actuelle</p>
        <div className="grid grid-cols-3 gap-2">
          {PARCEL_STATES.map((parcelState) => (
            <SelectionCard
              key={parcelState}
              label={PARCEL_STATE_LABELS[parcelState]}
              colors={[palette[parcelState].fill, palette[parcelState].stroke]}
              isActive={parcelState === state}
              ariaLabel={`${PARCEL_STATE_LABELS[parcelState]} : remplissage ${palette[parcelState].fill}, contour ${palette[parcelState].stroke}`}
              onClick={() => setState(parcelState)}
            />
          ))}
        </div>
      </div>
      <div role="group" aria-label={`Couleur modifiée, état ${stateLabel.toLowerCase()}`}>
        <p className={LEGEND} aria-hidden="true">Couleur modifiée : {stateLabel}</p>
        <div className="grid grid-cols-2 gap-2">
          {COLOR_TARGETS.map((colorTarget) => (
            <SelectionCard
              key={colorTarget}
              label={TARGET_LABELS[colorTarget]}
              detail={colors[colorTarget]}
              colors={[colors[colorTarget]]}
              isActive={colorTarget === target}
              onClick={() => setTarget(colorTarget)}
            />
          ))}
        </div>
      </div>
      <ColorPicker
        label={`${TARGET_LABELS[target].toLowerCase()}, état ${stateLabel.toLowerCase()}`}
        value={colors[target]}
        onChange={handleColorChange}
      />
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor={opacityId} className="text-sm font-medium text-gray-900 dark:text-white">Opacité du remplissage</label>
          <output htmlFor={opacityId} className="text-xs tabular-nums text-gray-500 dark:text-gray-400">{opacityPercent} %</output>
        </div>
        <input
          id={opacityId}
          type="range"
          min={0}
          max={100}
          step={1}
          value={opacityPercent}
          onChange={(event) => onChange(state, { fillOpacity: Number(event.target.value) / 100 })}
          className="w-full cursor-pointer accent-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        />
      </div>
    </div>
  );
}
