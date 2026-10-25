import { useState } from "react";

import PanelCard from "../shared/PanelCard";
import RecordPager from "../shared/RecordPager";
import AutorisationRow from "./AutorisationRow";
import { types, type Dossier } from "./data";

type AutorisationsExplorerProps = {
  dossiers: Dossier[];
  type: string | null;
  onClearType: () => void;
};

const PAGE_SIZE = 8;

export default function AutorisationsExplorer({ dossiers, type, onClearType }: AutorisationsExplorerProps) {
  const [page, setPage] = useState(0);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const current = Math.min(page, Math.max(0, Math.ceil(dossiers.length / PAGE_SIZE) - 1));

  const handlePage = (next: number) => {
    setPage(next);
    setOpenKey(null);
  };

  const handleToggle = (key: string) => setOpenKey((open) => (open === key ? null : key));

  return (
    <PanelCard flush title="Dossiers déposés" subtitle="Cliquez sur un dossier pour afficher le programme déclaré et son suivi.">
      <div className="mt-3 flex flex-wrap items-center gap-2 border-y border-gray-100 px-4 py-3 dark:border-white/5">
        {type && (
          <button onClick={onClearType} className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
            {types[type] || type} ✕
          </button>
        )}
        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
          {dossiers.length} dossier{dossiers.length > 1 ? "s" : ""} · du plus récent au plus ancien
        </span>
      </div>
      <ul key={`${current}-${type}`} className="primo-stagger">
        {dossiers.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE).map((dossier) => (
          <AutorisationRow key={dossier.key} dossier={dossier} open={openKey === dossier.key} onToggle={handleToggle} />
        ))}
      </ul>
      <div className="px-4 pb-4">
        <RecordPager page={current} total={dossiers.length} pageSize={PAGE_SIZE} onChange={handlePage} />
      </div>
    </PanelCard>
  );
}
