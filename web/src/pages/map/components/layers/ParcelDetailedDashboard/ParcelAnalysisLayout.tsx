import type { ReactNode } from "react";

/** One page scroll, with a persistent summary on desktop and stacked content on mobile. */
export default function ParcelAnalysisLayout({
  summary,
  children,
}: {
  summary: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3 lg:gap-6">
      <aside
        aria-label="Résumé de l’analyse"
        className="min-w-0 md:sticky md:top-0 md:max-h-[calc(100dvh-12rem)] md:overflow-y-auto scrollbar-custom"
      >
        {summary}
      </aside>
      <div className="min-w-0 flex flex-col gap-4 md:col-span-2 lg:gap-6">
        {children}
      </div>
    </div>
  );
}
