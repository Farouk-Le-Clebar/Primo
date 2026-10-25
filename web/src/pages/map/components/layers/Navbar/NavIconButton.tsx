import type { FolderIcon } from "@heroicons/react/24/outline";

export type HeroIcon = typeof FolderIcon;

type NavIconButtonProps = {
  icon: HeroIcon;
  activeIcon?: HeroIcon;
  label: string;
  active?: boolean;
  controls?: string;
  onClick: () => void;
};

export default function NavIconButton({ icon, activeIcon, label, active = false, controls, onClick }: NavIconButtonProps) {
  const Icon = active && activeIcon ? activeIcon : icon;

  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      aria-controls={controls}
      className={`group relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600 ${active ? "bg-black/[0.06] text-gray-900 dark:bg-white/10 dark:text-white" : "text-gray-900 hover:bg-black/[0.04] dark:text-white dark:hover:bg-white/[0.06]"}`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 group-aria-pressed:hidden dark:bg-white dark:text-gray-900">
        {label}
      </span>
    </button>
  );
}
