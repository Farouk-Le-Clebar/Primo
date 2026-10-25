import { BuildingCard } from "../buildings/BuildingCard";
import { sortByCompleteness } from "../buildings/stats";
import type { BuildingFeature } from "../buildings/types";
import type { DpeEntry } from "../dpe/data";
import { text } from "../shared/format";

type LogementBuildingProps = {
  buildings: BuildingFeature[];
  dpeEntries: DpeEntry[];
};

const rnbIds = (value: unknown): string[] => text(value, "").split(/[\s,;/|]+/).filter(Boolean);

export default function LogementBuilding({ buildings: source, dpeEntries }: LogementBuildingProps) {
  const buildings = sortByCompleteness(source);
  const targetIds = new Set(dpeEntries.flatMap((entry) => rnbIds(entry.raw.id_rnb)));
  const linked = buildings.findIndex((b) => rnbIds(b.properties.ids_rnb).some((id) => targetIds.has(id)));
  const index = linked >= 0 ? linked : buildings.length === 1 ? 0 : -1;
  if (index < 0) return null;

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Bâtiment du logement</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {linked >= 0 ? "Relié par l’identifiant RNB du DPE" : "Seul bâtiment de la parcelle"}
        </span>
      </div>
      <BuildingCard index={index} building={buildings[index]} active={false} onHover={() => undefined} />
    </section>
  );
}
