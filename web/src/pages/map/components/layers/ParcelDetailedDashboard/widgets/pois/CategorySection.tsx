import { ChevronDown } from "lucide-react";

import type { InfraCategory } from "./constants";

type CategorySectionProps = {
  category: InfraCategory;
  selectedTypes: string[];
  isExpanded: boolean;
  onToggleExpanded: (label: string) => void;
  onToggleType: (code: string) => void;
  onSetTypes: (codes: string[], selected: boolean) => void;
};

export default function CategorySection({ category, selectedTypes, isExpanded, onToggleExpanded, onToggleType, onSetTypes }: CategorySectionProps) {
  const codes = category.types.map((type) => type.code);
  const selectedCount = codes.filter((code) => selectedTypes.includes(code)).length;
  const allSelected = codes.length > 0 && selectedCount === codes.length;

  return (
    <li className="py-2">
      <div className="flex items-center gap-3">
        <input
          aria-label={`Sélectionner toute la catégorie ${category.label}`}
          type="checkbox"
          checked={allSelected}
          ref={(element) => {
            if (element) element.indeterminate = selectedCount > 0 && !allSelected;
          }}
          onChange={() => onSetTypes(codes, !allSelected)}
          className="h-3.5 w-3.5 accent-emerald-600"
        />
        <button
          type="button"
          onClick={() => onToggleExpanded(category.label)}
          aria-expanded={isExpanded}
          className="flex flex-1 items-center justify-between gap-2 py-1 text-left text-sm font-medium text-gray-900 dark:text-white"
        >
          <span>{category.label}</span>
          <span className="flex items-center gap-2 text-xs font-normal text-gray-500 dark:text-gray-400">
            {selectedCount}/{codes.length}
            <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
          </span>
        </button>
      </div>
      {isExpanded && (
        <div className="primo-page-enter ml-6 mt-1 space-y-1.5 pb-1">
          {category.types.map((type) => (
            <label key={type.code} className="flex cursor-pointer items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type.code)}
                onChange={() => onToggleType(type.code)}
                className="h-3.5 w-3.5 accent-emerald-600"
              />
              {type.label}
            </label>
          ))}
        </div>
      )}
    </li>
  );
}
