import { Card } from "@tremor/react";

import RecordPager from "../shared/RecordPager";
import DpeRow from "./DpeRow";
import DpeToolbar from "./DpeToolbar";
import type { DpeExplorerState } from "./useDpeExplorer";

export default function DpeExplorer({ explorer }: { explorer: DpeExplorerState }) {
  return (
    <Card className="overflow-hidden rounded-xl border-gray-200 p-0 shadow-sm ring-0 dark:border-white/10 dark:bg-[#171717]">
      <div className="px-4 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Diagnostics à l’adresse</h3>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Cliquez sur un diagnostic pour afficher ses équipements et son enveloppe.</p>
      </div>
      <DpeToolbar {...explorer} />
      {explorer.visible.length ? (
        <ul key={`${explorer.page}-${explorer.label}-${explorer.sort}-${explorer.validOnly}`} className="primo-stagger">
          {explorer.visible.map((entry) => (
            <DpeRow key={entry.key} entry={entry} open={explorer.openKey === entry.key} onToggle={explorer.handleToggle} />
          ))}
        </ul>
      ) : (
        <p className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">Aucun diagnostic ne correspond à ces filtres.</p>
      )}
      <div className="px-4 pb-4">
        <RecordPager page={explorer.page} total={explorer.total} pageSize={explorer.pageSize} onChange={explorer.handlePage} />
      </div>
    </Card>
  );
}
