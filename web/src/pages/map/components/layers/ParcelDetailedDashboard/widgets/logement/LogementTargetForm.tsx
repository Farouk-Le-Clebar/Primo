import PanelCard from "../shared/PanelCard";
import { chip } from "../shared/tones";
import { EMPTY_TARGET, type HousingType, type LogementTarget } from "./types";

type LogementTargetFormProps = {
  target: LogementTarget;
  onChange: (target: LogementTarget) => void;
};

const TYPES: { id: HousingType; label: string }[] = [
  { id: "appartement", label: "Appartement" },
  { id: "maison", label: "Maison" },
];

const FIELDS: { key: "surface" | "etage" | "porte"; label: string; placeholder: string; inputMode: "decimal" | "text" }[] = [
  { key: "surface", label: "Surface (m²)", placeholder: "45", inputMode: "decimal" },
  { key: "etage", label: "Étage", placeholder: "3 ou RDC", inputMode: "text" },
  { key: "porte", label: "Porte / n° de lot", placeholder: "12B", inputMode: "text" },
];

const INPUT_CLASS =
  "mt-1 w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-[#0A0A0A] dark:text-white";

export default function LogementTargetForm({ target, onChange }: LogementTargetFormProps) {
  const handleField = (key: keyof LogementTarget, value: string) => onChange({ ...target, [key]: value });

  return (
    <PanelCard title="Cibler un logement" subtitle="Renseignez ce que vous savez : plus il y a d’indices, plus la correspondance est fiable.">
      <div className="flex items-center gap-1 rounded-lg bg-gray-50 p-0.5 dark:bg-white/5">
        {TYPES.map(({ id, label }) => (
          <button key={id} onClick={() => handleField("type", id)} aria-pressed={target.type === id} className={`${chip(target.type === id)} flex-1`}>
            {label}
          </button>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {FIELDS.map(({ key, label, placeholder, inputMode }) => (
          <label key={key} className="min-w-0 text-[11px] text-gray-500 dark:text-gray-400">
            {label}
            <input
              value={target[key]}
              inputMode={inputMode}
              placeholder={placeholder}
              onChange={(event) => handleField(key, event.target.value)}
              className={INPUT_CLASS}
            />
          </label>
        ))}
      </div>
      <button onClick={() => onChange(EMPTY_TARGET)} className="mt-3 text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
        Effacer le ciblage
      </button>
    </PanelCard>
  );
}
