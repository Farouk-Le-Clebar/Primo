import type { useParcelPreview } from "./useParcelPreview";
import DpeScale from "./DpeScale";
import PreviewMetric from "./PreviewMetric";

type PreviewMetricsProps = Omit<ReturnType<typeof useParcelPreview>, "area">;

const VALUE_CLASS = "truncate text-lg font-semibold tabular-nums tracking-tight text-gray-900 dark:text-white";

const plural = (count: number, word: string): string => `${count} ${word}${count > 1 ? "s" : ""}`;

export default function PreviewMetrics({ metrics, dpe, risks }: PreviewMetricsProps) {
  const dominant = dpe.data.dominant[0];
  const dpeHint = dpe.data.count
    ? `${plural(dpe.data.count, "diagnostic")} à l’adresse`
    : dpe.hasAddress ? "Aucun diagnostic" : "Adresse requise";
  const riskList = risks.data?.risks ?? [];
  const riskValue = risks.data ? plural(riskList.length, "risque") : "—";
  const riskHint = riskList.length ? riskList.slice(0, 2).join(", ") : risks.data ? "Aucun recensé" : "Non disponible";

  return (
    <dl className="scrollbar-none flex snap-x overflow-x-auto">
      {metrics.map(({ label, value, hint, loading, accent }) => (
        <PreviewMetric key={label} label={label} hint={hint} loading={loading} accent={accent}>
          <span className={VALUE_CLASS}>{value}</span>
        </PreviewMetric>
      ))}
      <PreviewMetric label="DPE" hint={dpeHint} loading={dpe.loading}>
        <DpeScale active={dominant} />
      </PreviewMetric>
      <PreviewMetric label="Risques commune" hint={riskHint} loading={risks.loading}>
        <span className={VALUE_CLASS}>{riskValue}</span>
      </PreviewMetric>
    </dl>
  );
}
