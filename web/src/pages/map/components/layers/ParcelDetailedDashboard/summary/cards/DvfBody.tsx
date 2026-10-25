import { dateLabel } from "../../widgets/shared/format";
import type { summarizeDvf } from "../summaryData";
import SummaryFact from "../SummaryFact";

type DvfBodyProps = { dvf: ReturnType<typeof summarizeDvf> };

const euros = (value: number | null): string =>
  value == null
    ? "—"
    : value.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export default function DvfBody({ dvf }: DvfBodyProps) {
  const facts = [
    { label: "Dernière mutation", value: dateLabel(dvf.latestDate) },
    { label: "Prix de vente", value: euros(dvf.latestValue) },
    { label: "Ventes", value: String(dvf.count) },
  ];

  return (
    <>
      <p className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
        {euros(dvf.medianPrice)}
        <span className="ml-1 text-sm font-normal text-gray-500 dark:text-gray-400">/ m² bâti</span>
      </p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Médiane sur {dvf.ratiosCount} vente{dvf.ratiosCount > 1 ? "s" : ""} exploitable
        {dvf.ratiosCount > 1 ? "s" : ""} d’un seul bien
      </p>
      <dl className="mt-auto pt-4">
        {facts.map((fact) => (
          <SummaryFact key={fact.label} {...fact} />
        ))}
      </dl>
    </>
  );
}
