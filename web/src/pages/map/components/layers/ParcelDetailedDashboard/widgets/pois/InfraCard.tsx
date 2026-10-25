import { memo } from "react";
import { Card } from "@tremor/react";

import { INFRA_TYPE_BY_CODE } from "./constants";
import ScoreRing from "./ScoreRing";
import { clampScore, formatDistance, getDistance, type ProximityResult } from "./utils";

type InfraCardProps = {
  code: string;
  result?: ProximityResult | null;
  muted?: boolean;
};

const CARD_CLASS = "flex flex-col rounded-xl border-gray-200 p-0 shadow-sm ring-0 dark:border-white/10 dark:bg-[#171717]";

function InfraCard({ code, result, muted = false }: InfraCardProps) {
  const configured = INFRA_TYPE_BY_CODE.get(code);
  const title = result?.type_label ?? result?.categorie ?? result?.label ?? configured?.label ?? code;
  const name = result?.nom ?? result?.name ?? null;
  const address = result?.adresse ?? result?.address ?? null;
  const family = result?.famille ?? result?.family ?? configured?.family ?? "Infrastructure";
  const score = clampScore(result?.score);
  const distance = formatDistance(getDistance(result));

  return (
    <Card className={`${CARD_CLASS} transition-opacity ${muted ? "opacity-50 grayscale" : ""}`}>
      <div className="flex items-center gap-3 p-4">
        <ScoreRing score={score} size={56} stroke={6} ariaLabel={`Distance ${distance}, indice de proximité ${score} %`} title={`Indice de proximité : ${score} %`} centerClassName="text-[10px] font-semibold tabular-nums">
          {distance}
        </ScoreRing>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{family}</span>
          <h4 className="truncate text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
          <p className="truncate text-xs text-gray-500 dark:text-gray-400" title={name ?? undefined}>
            {result ? (name ?? "Nom non renseigné") : "Aucune infrastructure trouvée"}
          </p>
        </div>
      </div>
      {result && (
        <p className="mt-auto truncate border-t border-gray-100 px-4 py-2.5 text-[11px] text-gray-500 dark:border-white/5 dark:text-gray-400" title={address ?? undefined}>
          {address ?? "Adresse non renseignée"}
        </p>
      )}
    </Card>
  );
}

export default memo(InfraCard);

export function InfraCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex animate-pulse items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#171717]">
      <div className="h-14 w-14 shrink-0 rounded-full bg-gray-100 dark:bg-white/5" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/3 rounded bg-gray-100 dark:bg-white/5" />
        <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-white/10" />
        <div className="h-3 w-1/2 rounded bg-gray-100 dark:bg-white/5" />
      </div>
    </div>
  );
}
