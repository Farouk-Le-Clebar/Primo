import { useAdminCounts } from "../../../../hooks/useAdminCounts";
import { ADMIN_SECTIONS } from "../../adminSections";
import AdminRailItem from "./AdminRailItem";

export default function AdminRail() {
  const counts = useAdminCounts();

  return (
    <aside className="primo-slide-enter flex w-full shrink-0 flex-col border-b border-black/[0.06] md:w-64 md:border-r md:border-b-0 dark:border-white/10">
      <div id="admin-header-tour" className="hidden px-4 pt-4 pb-3 md:block">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Administration</h2>
        <p className="text-xs text-gray-500">Espace réservé aux administrateurs</p>
      </div>
      <nav id="admin-tabs-tour" aria-label="Sections d'administration" className="primo-stagger scrollbar-none flex min-h-0 flex-1 gap-1 overflow-x-auto px-2 py-2 md:scrollbar-glass md:block md:space-y-0.5 md:overflow-x-visible md:overflow-y-auto md:py-0 md:pb-3 text-gray-900 dark:text-white">
        {ADMIN_SECTIONS.map((section) => (
          <AdminRailItem key={section.path} section={section} subtitle={counts[section.path]} />
        ))}
      </nav>
    </aside>
  );
}
