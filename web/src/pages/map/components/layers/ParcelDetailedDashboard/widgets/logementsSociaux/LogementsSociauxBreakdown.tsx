import PanelCard from "../shared/PanelCard";
import ShareList from "../shared/ShareList";
import type { SocialStats } from "./data";

export default function LogementsSociauxBreakdown({ stats }: { stats: SocialStats }) {
  return (
    <div className="primo-stagger flex flex-col gap-4">
      <PanelCard title="Typologies" subtitle="Nombre de pièces principales">
        <ShareList items={stats.piecesShares} />
      </PanelCard>
      {stats.dpeShares.length > 0 && (
        <PanelCard title="Étiquettes énergie" subtitle="DPE déclarés par les bailleurs">
          <ShareList items={stats.dpeShares} barClass="bg-amber-500/15 dark:bg-amber-500/20" />
        </PanelCard>
      )}
    </div>
  );
}
