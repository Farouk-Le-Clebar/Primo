import { HexColorPicker } from "react-colorful";
import { useRecentColors } from "../../../../../hooks/useRecentColors";
import HexInput from "./HexInput";

type ColorPickerProps = {
  label: string;
  value: string;
  onChange: (color: string) => void;
};

const PICKER_STYLE = { width: "100%", height: 168 };

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const { recentColors, addRecentColor } = useRecentColors();

  return (
    <div className="flex flex-col gap-3">
      <div data-map-passthrough>
        <HexColorPicker color={value} onChange={onChange} onChangeEnd={addRecentColor} style={PICKER_STYLE} aria-label={`Sélecteur, ${label}`} />
      </div>
      <div className="flex items-start gap-2">
        <span className="h-9 w-9 shrink-0 rounded-lg border border-black/10 dark:border-white/15" style={{ backgroundColor: value }} aria-hidden="true" />
        <HexInput label={label} value={value} onChange={onChange} onCommit={addRecentColor} />
      </div>
      {recentColors.length > 0 && (
        <div role="group" aria-label="Couleurs récentes" className="flex flex-wrap gap-1.5">
          {recentColors.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Utiliser ${color}`}
              onClick={() => onChange(color)}
              style={{ backgroundColor: color }}
              className="h-6 w-6 rounded-md border border-black/10 transition-transform hover:scale-110 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:border-white/15 motion-reduce:transition-none"
            />
          ))}
        </div>
      )}
    </div>
  );
}
