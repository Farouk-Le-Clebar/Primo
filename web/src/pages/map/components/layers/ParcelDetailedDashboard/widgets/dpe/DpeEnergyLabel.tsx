import { Card } from "@tremor/react";

import type { ClassShare } from "./data";
import { DPE_SEUILS, getDpeColors } from "./utils";

type DpeEnergyLabelProps = {
  distribution: ClassShare[];
  activeLabel: string | null;
  onSelect: (label: string | null) => void;
};

const BASE_WIDTH = 30;
const WIDTH_STEP = 10;

export default function DpeEnergyLabel({ distribution, activeLabel, onSelect }: DpeEnergyLabelProps) {
  const handleSelect = (label: string) => onSelect(activeLabel === label ? null : label);

  return (
    <Card className="rounded-xl border-gray-200 p-4 shadow-sm ring-0 dark:border-white/10 dark:bg-[#171717]">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Étiquette énergie</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">Cliquer pour filtrer</span>
      </div>
      <ul className="primo-stagger flex flex-col gap-1.5">
        {distribution.map(({ label, count }, index) => (
          <li key={label}>
            <button
              onClick={() => handleSelect(label)}
              aria-pressed={activeLabel === label}
              disabled={!count}
              className={`group flex w-full items-center gap-3 rounded-md text-left transition-opacity focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:cursor-default ${activeLabel && activeLabel !== label ? "opacity-40" : ""}`}
            >
              <span
                className={`flex h-7 items-center justify-between rounded-r-full pl-2 pr-3 text-xs font-bold transition-transform group-enabled:group-hover:translate-x-0.5 ${getDpeColors(label).bg} ${getDpeColors(label).text} ${count ? "" : "opacity-35"}`}
                style={{ width: `${BASE_WIDTH + index * WIDTH_STEP}%` }}
              >
                {label}
                <span className="hidden truncate pl-2 text-[10px] font-medium sm:inline">{DPE_SEUILS[label]}</span>
              </span>
              <span className={`ml-auto text-sm tabular-nums ${count ? "font-semibold text-gray-900 dark:text-white" : "text-gray-300 dark:text-gray-600"}`}>
                {count || "—"}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
