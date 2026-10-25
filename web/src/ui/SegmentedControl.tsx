import { motion } from "framer-motion";

type SegmentedOption<Value extends string> = {
  value: Value;
  label: string;
};

type SegmentedControlProps<Value extends string> = {
  id: string;
  label: string;
  value: Value;
  options: SegmentedOption<Value>[];
  onChange: (value: Value) => void;
  className?: string;
  size?: "sm" | "md";
};

const SIZES = {
  sm: { track: "p-0.5", item: "px-2 py-1 text-[10px]" },
  md: { track: "p-1", item: "px-3 py-1.5 text-xs" },
};

export default function SegmentedControl<Value extends string>({ id, label, value, options, onChange, className = "w-full sm:w-auto", size = "md" }: SegmentedControlProps<Value>) {
  return (
    <div role="radiogroup" aria-label={label} className={`flex gap-1 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] ${SIZES[size].track} ${className}`}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={`relative flex-1 rounded-md font-medium ${SIZES[size].item} transition-colors cursor-pointer ${isActive ? "text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}`}
          >
            {isActive && <motion.span layoutId={id} transition={{ duration: 0.2, ease: "easeOut" }} className="glass-selected absolute inset-0 rounded-md" />}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
