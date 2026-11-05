import { MAP_COLOR_PRESETS } from "../../../../../constants/mapColorPresets";
import type { ColorMode, MapColorPreset, MapPalette } from "../../../../../types/mapColors";
import { getPaletteColors } from "../../../../../utils/mapColors";
import SelectionCard from "./SelectionCard";

type PresetListProps = {
  mode: ColorMode;
  palette: MapPalette;
  presetId: string | null;
  onSelect: (preset: MapColorPreset) => void;
};

export default function PresetList({ mode, palette, presetId, onSelect }: PresetListProps) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="grid grid-cols-2 gap-2 @2xl:grid-cols-4">
        {MAP_COLOR_PRESETS.map((preset) => (
          <SelectionCard
            key={preset.id}
            label={preset.label}
            colors={getPaletteColors(preset.colors[mode])}
            isActive={preset.id === presetId}
            onClick={() => onSelect(preset)}
          />
        ))}
        <SelectionCard label="Personnalisé" colors={getPaletteColors(palette)} isActive={presetId === null} />
      </div>
      <p role="status" className="text-xs text-gray-500 dark:text-gray-400">
        {presetId ? "Chaque préréglage remplit le thème clair et le thème sombre." : "Choisir un préréglage remplace vos couleurs personnalisées."}
      </p>
    </div>
  );
}
