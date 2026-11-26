import type { ReactNode } from "react";

type PreviewMetricProps = {
  label: string;
  hint: string;
  loading: boolean;
  accent?: boolean;
  children: ReactNode;
};

export default function PreviewMetric({ label, hint, loading, accent, children }: PreviewMetricProps) {
  return (
    <div className="flex min-w-[8.5rem] shrink-0 snap-start flex-col gap-1 border-l border-black/[0.06] px-5 first:border-l-0 dark:border-white/[0.08]">
      <dt className="text-[10px] font-medium uppercase tracking-[0.06em] text-gray-500 dark:text-white/40">{label}</dt>
      <dd className="flex min-h-7 items-center">
        {loading ? (
          <span className="block h-5 w-20 animate-pulse rounded bg-black/5 motion-reduce:animate-none dark:bg-white/10" />
        ) : (
          children
        )}
      </dd>
      <dd className="flex items-center gap-1.5 truncate text-[11px] text-gray-500 dark:text-white/45">
        {accent && !loading && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />}
        <span className={`truncate ${accent && !loading ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
          {loading ? " " : hint}
        </span>
      </dd>
    </div>
  );
}
