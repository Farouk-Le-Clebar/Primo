import type { ComponentType, SVGProps } from "react";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";

type UserMenuItemProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  onClick: () => void;
  isExternal?: boolean;
  isDanger?: boolean;
};

export default function UserMenuItem({ icon: Icon, label, onClick, isExternal = false, isDanger = false }: UserMenuItemProps) {
  const tone = isDanger
    ? "text-red-600 hover:bg-red-500/10 dark:text-red-400"
    : "text-gray-700 hover:bg-black/[0.05] hover:text-gray-900 dark:text-gray-200 dark:hover:bg-white/[0.08] dark:hover:text-white";

  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`group mx-1 flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-xs font-medium transition-colors cursor-pointer ${tone}`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${isDanger ? "" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`} aria-hidden="true" />
      <span className="flex-1 truncate text-left">{label}</span>
      {isExternal && <ArrowUpRightIcon className="h-3.5 w-3.5 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />}
    </button>
  );
}
