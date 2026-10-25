import GeorisqueCard from "./GeorisqueCard";
import type { GeorisquesData } from "./data";
import { prepareRiskCards } from "./riskCards";

export default function GeorisquesRisks({ data }: { data: GeorisquesData }) {
  const cards = prepareRiskCards(data);

  return (
    <section aria-label="Risques par thème" className="flex flex-col gap-3">
      {!data.risques?.length && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {data.risques === null
            ? "Le détail GASPAR est indisponible."
            : "Aucun risque recensé dans GASPAR pour cette commune ; cela ne signifie pas une absence de risque."}
        </p>
      )}
      <div className="primo-stagger grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        {cards.map((risk) => (
          <GeorisqueCard key={risk.id} risk={risk} />
        ))}
      </div>
    </section>
  );
}
