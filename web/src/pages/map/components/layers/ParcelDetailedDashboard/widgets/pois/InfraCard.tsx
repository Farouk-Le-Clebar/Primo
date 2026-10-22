import { memo } from "react";
import { Card } from "@tremor/react";
import { INFRA_TYPE_BY_CODE } from "./constants";
import ScoreRing from "./ScoreRing";
import {
    clampScore,
    formatDistance,
    getDistance,
    type ProximityResult,
} from "./utils";

type InfraCardProps = {
    code: string;
    result?: ProximityResult | null;
    muted?: boolean;
};

function InfraCard({ code, result, muted = false }: InfraCardProps) {
    const configured = INFRA_TYPE_BY_CODE.get(code);
    const found = Boolean(result);

    const title =
        result?.type_label ??
        result?.categorie ??
        result?.label ??
        configured?.label ??
        code;
    const name = result?.nom ?? result?.name ?? null;
    const infraAddress = result?.adresse ?? result?.address ?? null;
    const family =
        result?.famille ??
        result?.family ??
        configured?.family ??
        "Infrastructure";
    const score = clampScore(result?.score);
    const formattedDistance = formatDistance(getDistance(result));

    return (
        <Card
            className={`flex min-h-40 flex-col rounded-xl border border-slate-100 p-4 shadow-sm transition dark:border-slate-800 dark:ring-slate-800 ${
                muted
                    ? "bg-slate-100 opacity-60 grayscale dark:bg-slate-800/60"
                    : "bg-white dark:bg-slate-900"
            }`}
        >
            <h4 className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                {title}
            </h4>
            <p
                className="mt-0.5 min-h-5 truncate text-[13px] text-slate-500 dark:text-slate-400"
                title={name ?? undefined}
            >
                {found
                    ? (name ?? "Nom non renseigné")
                    : "Aucune infrastructure trouvée"}
            </p>
            <div className="mt-2 self-start rounded-[9px] bg-black px-2.5 py-1 text-xs font-semibold tracking-wide text-white dark:bg-white dark:text-black">
                {family}
            </div>
            <div className="flex flex-1 items-center justify-center py-3 pb-5">
                <ScoreRing
                    score={score}
                    ariaLabel={`Distance ${formattedDistance}, indice de proximité ${score}%`}
                    title={`Indice de proximité : ${score}%`}
                >
                    {formattedDistance}
                </ScoreRing>
            </div>
            {found && (
                <p
                    className="line-clamp-2 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400"
                    title={infraAddress ?? undefined}
                >
                    {infraAddress ?? "Adresse non renseignée"}
                </p>
            )}
        </Card>
    );
}

export default memo(InfraCard);

export function InfraCardSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="flex min-h-40 animate-pulse flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
            <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-2 h-4 w-3/4 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="mt-3 h-5 w-16 rounded-md bg-slate-200 dark:bg-slate-700" />
            <div className="flex flex-1 items-center justify-center py-3">
                <div className="h-[80px] w-[80px] rounded-full bg-slate-100 dark:bg-slate-800" />
            </div>
            <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
                <div className="h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
            </div>
        </div>
    );
}
