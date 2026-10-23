import type { summarizeRisks } from "../summaryData";
import SummaryFact from "../SummaryFact";

type RisksBodyProps = { risks: NonNullable<ReturnType<typeof summarizeRisks>> };

const VISIBLE_RISKS = 4;

export default function RisksBody({ risks }: RisksBodyProps) {
  const hidden = risks.risks.length - VISIBLE_RISKS;
  const facts = [
    { label: "Zone de sismicité", value: risks.seismic },
    { label: "Potentiel radon", value: risks.radon },
    { label: "Arrêtés CatNat", value: String(risks.catnat) },
  ];

  return (
    <>
      <p className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
        {risks.risks.length}
        <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
          risque{risks.risks.length > 1 ? "s" : ""} recensé{risks.risks.length > 1 ? "s" : ""} · {risks.commune}
        </span>
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {risks.risks.slice(0, VISIBLE_RISKS).map((risk) => (
          <span
            key={risk}
            className="max-w-full truncate rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-500/10 dark:text-amber-300"
          >
            {risk}
          </span>
        ))}
        {hidden > 0 && (
          <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-white/5 dark:text-gray-300">
            +{hidden}
          </span>
        )}
      </div>
      <dl className="mt-auto pt-4">
        {facts.map((fact) => (
          <SummaryFact key={fact.label} {...fact} />
        ))}
      </dl>
    </>
  );
}
