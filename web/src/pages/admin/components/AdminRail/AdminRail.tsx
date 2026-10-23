import { useAdminCounts } from "../../../../hooks/useAdminCounts";
import { ADMIN_SECTIONS } from "../../adminSections";
import AdminRailItem from "./AdminRailItem";

export default function AdminRail() {
  const counts = useAdminCounts();

  return (
    <aside className="primo-slide-enter flex w-64 shrink-0 flex-col border-r border-black/[0.06] dark:border-white/10">
      <div id="admin-header-tour" className="px-4 pt-4 pb-3">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Administration</h2>
        <p className="text-xs text-gray-500">Espace réservé aux administrateurs</p>
      </div>
      <nav id="admin-tabs-tour" aria-label="Sections d'administration" className="primo-stagger scrollbar-glass min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 pb-3 text-gray-900 dark:text-white">
        {ADMIN_SECTIONS.map((section) => (
          <AdminRailItem key={section.path} section={section} subtitle={counts[section.path]} />
        ))}
      </nav>
    </aside>
  );
}
