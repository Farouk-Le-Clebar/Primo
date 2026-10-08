import GeorisqueCard from "./GeorisqueCard";
import { prepareRiskCards } from "./riskCards";
import type { GeorisquesData } from "./data";

export default function GeorisquesRisks({ data }: { data: GeorisquesData }) {
  const cards = prepareRiskCards(data);
  return (
    <section aria-label="Risques par thème">
      {(!data.risques || !data.risques.length) && (
        <p className="mb-4 text-sm text-gray-500">
          {data.risques === null
            ? "Le détail GASPAR est indisponible."
            : "Aucun risque recensé dans le fichier GASPAR pour cette commune ; cela ne signifie pas une absence de risque."}
        </p>
      )}
      <div className="grid items-start gap-4 xl:grid-cols-2">
        {cards.map((risk) => (
          <GeorisqueCard key={risk.id} risk={risk} />
        ))}
      </div>
    </section>
  );
}
