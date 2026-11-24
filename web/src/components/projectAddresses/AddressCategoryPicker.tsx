import type { AddressCategory } from "../../types/project/addresses";
import { ADDRESS_CATEGORIES, ADDRESS_CATEGORY_ORDER } from "../../pages/projects/components/addresses/addressMeta";
import { TONES } from "../../pages/projects/components/ui/palette";

type AddressCategoryPickerProps = { value: AddressCategory; onChange: (category: AddressCategory) => void };

export default function AddressCategoryPicker({ value, onChange }: AddressCategoryPickerProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ADDRESS_CATEGORY_ORDER.map((category) => {
        const { label, tone, icon: Icon } = ADDRESS_CATEGORIES[category];
        const isActive = category === value;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all active:scale-95 ${isActive ? `${TONES[tone].soft} ${TONES[tone].text} ring-1 ring-current` : "border border-[#1c1c1e]/12 text-[#52525b] hover:bg-[#1c1c1e]/4 dark:border-white/12 dark:text-[#d4d4d8]"}`}
          >
            <Icon className="h-3 w-3" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
