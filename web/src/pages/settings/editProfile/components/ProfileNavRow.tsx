import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

type ProfileNavRowProps = {
  label: string;
  hint?: string;
  autoFocus?: boolean;
  onClick: () => void;
  children?: ReactNode;
};

export default function ProfileNavRow({ label, hint, autoFocus = false, onClick, children }: ProfileNavRowProps) {
  return (
    <button
      type="button"
      autoFocus={autoFocus}
      onClick={onClick}
      className="flex w-full items-center justify-between gap-6 px-5 py-4 text-left transition-colors hover:bg-black/[0.03] cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-emerald-600 dark:hover:bg-white/[0.05]"
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium text-gray-900 dark:text-white">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{hint}</span>}
      </span>
      <span className="flex shrink-0 items-center gap-3">
        {children}
        <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
      </span>
    </button>
  );
}
