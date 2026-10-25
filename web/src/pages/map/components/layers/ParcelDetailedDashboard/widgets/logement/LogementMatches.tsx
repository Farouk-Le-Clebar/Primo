import { useState } from "react";

import type { DvfRecord } from "../dvf/data";
import DvfRow from "../dvf/DvfRow";
import type { DpeEntry } from "../dpe/data";
import DpeRow from "../dpe/DpeRow";
import PanelCard from "../shared/PanelCard";
import MatchBadge from "./MatchBadge";
import type { Match } from "./types";

type LogementMatchesProps = {
  dpeMatches: Match<DpeEntry>[];
  dvfMatches: Match<DvfRecord>[];
};

const MatchHeader = ({ match }: { match: Match<unknown> }) => (
  <div className="flex flex-wrap items-center gap-2 px-4 pt-3 text-[11px] text-gray-500 dark:text-gray-400">
    <MatchBadge level={match.level} />
    {match.reasons.join(" · ")}
  </div>
);

const Empty = ({ children }: { children: string }) => (
  <p className="border-t border-gray-100 px-4 py-6 text-center text-xs text-gray-500 dark:border-white/5 dark:text-gray-400">{children}</p>
);

export default function LogementMatches({ dpeMatches, dvfMatches }: LogementMatchesProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const handleToggle = (key: string) => setOpenKey((current) => (current === key ? null : key));

  return (
    <>
      <PanelCard flush title="Diagnostics de ce logement" subtitle="DPE rattachés par la porte, l’étage et la surface" aside={String(dpeMatches.length)}>
        {dpeMatches.length ? (
          <ul className="primo-stagger mt-3 border-t border-gray-100 dark:border-white/5">
            {dpeMatches.map((match) => (
              <li key={match.item.key} className="border-b border-gray-100 last:border-0 dark:border-white/5">
                <MatchHeader match={match} />
                <ul>
                  <DpeRow entry={match.item} open={openKey === match.item.key} onToggle={handleToggle} />
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>Aucun DPE ne correspond à ces critères. Essayez sans la porte ou avec une surface arrondie.</Empty>
        )}
      </PanelCard>
      <PanelCard flush title="Ventes possiblement liées" subtitle="DVF ne précise ni l’étage ni la porte : rapprochement par type et surface" aside={String(dvfMatches.length)}>
        {dvfMatches.length ? (
          <ul className="primo-stagger mt-3 border-t border-gray-100 dark:border-white/5">
            {dvfMatches.map((match) => (
              <li key={match.item.key} className="border-b border-gray-100 last:border-0 dark:border-white/5">
                <MatchHeader match={match} />
                <ul>
                  <DvfRow record={match.item} />
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>Aucune vente de surface comparable sur cette parcelle.</Empty>
        )}
      </PanelCard>
    </>
  );
}
