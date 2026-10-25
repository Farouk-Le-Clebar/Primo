import ParcelAnalysisLayout from "../../ParcelAnalysisLayout";
import type { ParcelWidgetProps } from "../../types";
import { SourceNote } from "../shared/WidgetStatus";
import InfraCard, { InfraCardSkeleton } from "./InfraCard";
import InfraSelector from "./InfraSelector";
import PoisKpis from "./PoisKpis";
import PoisToolbar from "./PoisToolbar";
import { usePoisProximity } from "./usePoisProximity";
import type { FeatureLike } from "./utils";

const GRID_CLASS = "primo-stagger grid grid-cols-1 items-stretch gap-4 xl:grid-cols-2";

export default function PoisWidget({ feature }: ParcelWidgetProps) {
  const currentFeature = feature as FeatureLike | undefined;
  const proximity = usePoisProximity(currentFeature);
  const { loading, hasCalculated, selectedTypes, displayedCodes, computed, grayNotFound } = proximity;

  return (
    <div className="flex w-full flex-col gap-4 font-inter lg:gap-6">
      {hasCalculated && !loading && <PoisKpis {...proximity} />}
      <ParcelAnalysisLayout summary={<InfraSelector {...proximity} canCalculate={Boolean(currentFeature?.geometry)} />}>
        {loading ? (
          <div className={GRID_CLASS}>
            {selectedTypes.map((code) => (
              <InfraCardSkeleton key={code} />
            ))}
          </div>
        ) : !hasCalculated ? (
          <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center dark:border-white/10 dark:bg-[#171717]">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Découvrez les infrastructures à proximité</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Sélectionnez les types souhaités puis lancez le calcul.</p>
            </div>
          </div>
        ) : (
          <>
            <PoisToolbar {...proximity} />
            <div className={GRID_CLASS}>
              {displayedCodes.map((code) => (
                <InfraCard key={code} code={code} result={computed.get(code)} muted={grayNotFound && !computed.get(code)} />
              ))}
            </div>
            <SourceNote>
              Le score global est la moyenne des indices de proximité des types sélectionnés ; un type
              sans résultat compte pour 0.
            </SourceNote>
          </>
        )}
      </ParcelAnalysisLayout>
    </div>
  );
}
