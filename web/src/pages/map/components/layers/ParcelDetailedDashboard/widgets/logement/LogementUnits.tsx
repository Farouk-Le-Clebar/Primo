import { getDpeColors } from "../dpe/utils";
import PanelCard from "../shared/PanelCard";
import { squareMeters } from "./normalize";
import type { LogementTarget } from "./types";
import { targetFromUnit, unitTitle, type LogementUnit } from "./units";

type LogementUnitsProps = {
  units: LogementUnit[];
  target: LogementTarget;
  onSelect: (target: LogementTarget) => void;
};

const isActive = (unit: LogementUnit, target: LogementTarget): boolean => {
  const candidate = targetFromUnit(unit);
  return candidate.type === target.type && candidate.etage === target.etage && candidate.porte === target.porte && candidate.surface === target.surface;
};

export default function LogementUnits({ units, target, onSelect }: LogementUnitsProps) {
  return (
    <PanelCard flush title="Logements repérés à l’adresse" subtitle="Déduits des DPE déposés · cliquez pour cibler" aside={String(units.length)}>
      {units.length ? (
        <ul className="primo-stagger mt-3 max-h-80 overflow-y-auto border-t border-gray-100 scrollbar-custom dark:border-white/5">
          {units.map((unit) => {
            const colors = getDpeColors(unit.latest.label);
            return (
              <li key={unit.key}>
                <button
                  onClick={() => onSelect(targetFromUnit(unit))}
                  aria-pressed={isActive(unit, target)}
                  className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-2.5 text-left transition-colors last:border-0 hover:bg-gray-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-emerald-600 dark:border-white/5 dark:hover:bg-white/[0.03] ${isActive(unit, target) ? "bg-emerald-50/70 dark:bg-emerald-500/10" : ""}`}
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${colors.bg} ${colors.text}`}>{unit.latest.label}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">{unitTitle(unit)}</span>
                    <span className="block text-[11px] text-gray-500 dark:text-gray-400">
                      {squareMeters(unit.surface)} · {unit.count} DPE
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="px-4 py-6 text-xs text-gray-500 dark:text-gray-400">
          Aucun logement identifiable dans les DPE de l’adresse. Saisissez les caractéristiques connues ci-dessus.
        </p>
      )}
    </PanelCard>
  );
}
