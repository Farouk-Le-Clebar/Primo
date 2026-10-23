import { NavLink } from "react-router-dom";
import type { AdminSection } from "../../adminSections";

type AdminRailItemProps = {
  section: AdminSection;
  subtitle: string;
};

export default function AdminRailItem({ section, subtitle }: AdminRailItemProps) {
  const Icon = section.icon;

  return (
    <NavLink
      id={section.tourId}
      to={`/search/admin/${section.path}`}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors duration-150 text-gray-900 dark:text-white ${isActive ? "glass-selected" : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"}`
      }
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/[0.05] group-aria-[current=page]:bg-black/[0.08] dark:bg-white/10 dark:group-aria-[current=page]:bg-white/[0.14]">
        <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{section.label}</span>
        <span className="block truncate text-xs text-gray-500 tabular-nums dark:text-gray-400">{subtitle}</span>
      </span>
    </NavLink>
  );
}
