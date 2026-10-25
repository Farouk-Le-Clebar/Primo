import { motion } from "framer-motion";
import { FEEDBACK_CATEGORIES } from "../feedbackCategories";
import type { FeedbackCategory } from "../feedbackCategories";

type FeedbackCategoryPickerProps = {
  value: FeedbackCategory;
  onChange: (category: FeedbackCategory) => void;
};

export default function FeedbackCategoryPicker({ value, onChange }: FeedbackCategoryPickerProps) {
  return (
    <div role="radiogroup" aria-label="Type de retour" className="flex flex-wrap gap-1 rounded-lg bg-black/[0.04] p-1 dark:bg-white/[0.06]">
      {FEEDBACK_CATEGORIES.map((category) => {
        const isActive = category.id === value.id;
        const Icon = category.icon;
        return (
          <button
            key={category.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(category)}
            className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${isActive ? "text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}`}
          >
            {isActive && (
              <motion.span layoutId="feedback-category" transition={{ duration: 0.2, ease: "easeOut" }} className="glass-selected absolute inset-0 rounded-md" />
            )}
            <Icon className="relative h-3.5 w-3.5" aria-hidden="true" />
            <span className="relative">{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}
