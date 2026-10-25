import PanelCard from "../shared/PanelCard";
import ShareList, { type ShareItem } from "../shared/ShareList";
import { text } from "../shared/format";
import { TONES } from "../shared/tones";
import { STATE_TONES, TYPE_TONES, countBy, dossierState, states, types, type Dossier } from "./data";

type AutorisationsOverviewProps = {
  dossiers: Dossier[];
  activeType: string | null;
  onSelectType: (type: string | null) => void;
};

const codeBadge = (code: string) => (
  <span className={`flex h-6 min-w-6 items-center justify-center rounded-md px-1 text-[10px] font-bold ${TONES[TYPE_TONES[code] ?? "gray"]}`}>
    {code}
  </span>
);

export default function AutorisationsOverview({ dossiers, activeType, onSelectType }: AutorisationsOverviewProps) {
  const typeItems: ShareItem[] = countBy(dossiers, (d) => d.type).map(({ key, count }) => ({
    key,
    label: types[key] || key,
    count,
    badge: codeBadge(key),
  }));
  const stateItems = countBy(dossiers, dossierState);
  const versions = [...new Set(dossiers.flatMap((d) => d.rows.map((r) => text(r.source_millesime, ""))))].filter(Boolean);

  return (
    <>
      <PanelCard title="Types d’autorisation" aside="Cliquer pour filtrer">
        <ShareList items={typeItems} active={activeType} onSelect={onSelectType} />
      </PanelCard>
      <PanelCard title="Avancement déclaré">
        <div className="flex flex-wrap gap-1.5">
          {stateItems.map(({ key, count }) => (
            <span key={key || "unknown"} className={`rounded-md px-2 py-1 text-xs ${TONES[STATE_TONES[key] ?? "gray"]}`}>
              {states[key] || "Non renseigné"} · <span className="font-semibold">{count}</span>
            </span>
          ))}
        </div>
        <p className="mt-4 border-t border-gray-100 pt-4 text-[11px] leading-relaxed text-gray-500 dark:border-white/5 dark:text-gray-400">
          Le préfixe cadastral n’est pas fourni : le rattachement par section et numéro reste à
          vérifier. Une autorisation ne garantit pas la réalisation des travaux.
          {versions.length > 0 && ` Millésime : ${versions.join(", ")}.`}
        </p>
      </PanelCard>
    </>
  );
}
