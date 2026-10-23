import { ChevronRightIcon } from "@heroicons/react/20/solid";
import type { ClockIcon } from "@heroicons/react/24/outline";

type SearchResultRowProps = {
  icon: typeof ClockIcon;
  label: string;
  onClick: () => void;
};

export function SearchSectionTitle({ children }: { children: string }) {
  return (
    <div className="mb-1 flex px-3">
      <span className="border-b-2 border-gray-900 pb-2 text-sm font-medium text-gray-900 select-none dark:border-white dark:text-white">
        {children}
      </span>
    </div>
  );
}

export default function SearchResultRow({ icon: Icon, label, onClick }: SearchResultRowProps) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-gray-900 transition-colors duration-150 hover:bg-black/[0.05] focus-visible:bg-black/[0.05] focus-visible:outline-none cursor-pointer dark:text-white dark:hover:bg-white/[0.07] dark:focus-visible:bg-white/[0.07]"
    >
      <Icon className="h-5 w-5 shrink-0 text-gray-700 dark:text-gray-300" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate text-sm">{label}</span>
      <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true" />
    </button>
  );
}
