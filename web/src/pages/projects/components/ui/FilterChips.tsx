import { LayoutGroup, motion } from "framer-motion";
import { TONES, type Tone } from "./palette";

export type FilterChip<T extends string> = { id: T; label: string; count: number; tone?: Tone };

type FilterChipsProps<T extends string> = {
  chips: FilterChip<T>[];
  active: T;
  onChange: (id: T) => void;
  layoutId: string;
};

export default function FilterChips<T extends string>({ chips, active, onChange, layoutId }: FilterChipsProps<T>) {
  return (
    <LayoutGroup id={layoutId}>
      <div className="flex flex-wrap items-center gap-1.5">
        {chips.map((chip) => {
          const isActive = chip.id === active;
          return (
            <button
              key={chip.id}
              onClick={() => onChange(chip.id)}
              className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${isActive ? "text-white dark:text-[#1c1c1e]" : "border border-[#1c1c1e]/12 text-[#52525b] hover:bg-[#1c1c1e]/4 dark:border-white/12 dark:text-[#d4d4d8] dark:hover:bg-white/6"}`}
            >
              {isActive && (
                <motion.span layoutId="chip" transition={{ type: "spring", stiffness: 500, damping: 38 }} className="absolute inset-0 -z-10 rounded-full bg-[#1c1c1e] dark:bg-[#fafafa]" />
              )}
              {chip.tone && <span className={`h-[7px] w-[7px] rounded-full ${TONES[chip.tone].dot}`} />}
              {chip.label}
              <span className={isActive ? "" : "text-[#82828c]"}>{chip.count}</span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
