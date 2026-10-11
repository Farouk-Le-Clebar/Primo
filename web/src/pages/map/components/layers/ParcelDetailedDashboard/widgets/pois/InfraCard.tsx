import { memo } from "react";
import { Card } from "@tremor/react";
import { INFRA_TYPE_BY_CODE } from "./constants";
import {
    clampScore,
    formatDistance,
    getDistance,
    scoreColor,
    type ProximityResult,
} from "./utils";

const RING_SIZE = 80;
const RING_STROKE = 8;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

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
    const color = scoreColor(score);
    const formattedDistance = formatDistance(getDistance(result));

    return (
        <Card
            className={`flex min-h-40 flex-col rounded-xl border border-slate-100 p-4 shadow-sm transition ${
                muted ? "bg-slate-100 opacity-60 grayscale" : "bg-white"
            }`}
        >
            <h4 className="text-[15px] font-semibold text-slate-800">{title}</h4>
            <p
                className="mt-0.5 min-h-5 truncate text-[13px] text-slate-500"
                title={name ?? undefined}
            >
                {found
                    ? (name ?? "Nom non renseigné")
                    : "Aucune infrastructure trouvée"}
            </p>
            <div className="mt-2 self-start rounded-[9px] bg-black px-2.5 py-1 text-xs font-semibold tracking-wide text-white">
                {family}
            </div>
            <div className="flex flex-1 items-center justify-center py-3 pb-5">
                <div
                    role="img"
                    aria-label={`Distance ${formattedDistance}, indice de proximité ${score}%`}
                    title={`Indice de proximité : ${score}%`}
                    className="relative flex items-center justify-center"
                    style={{ width: RING_SIZE, height: RING_SIZE }}
                >
                    <svg
                        width={RING_SIZE}
                        height={RING_SIZE}
                        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
                        className="-rotate-90"
                        aria-hidden="true"
                    >
                        <circle
                            cx={RING_SIZE / 2}
                            cy={RING_SIZE / 2}
                            r={RING_RADIUS}
                            fill="none"
                            stroke="#f5f5f5"
                            strokeWidth={RING_STROKE - 2 }
                        />
                        {score > 0 && (
                            <circle
                                cx={RING_SIZE / 2}
                                cy={RING_SIZE / 2}
                                r={RING_RADIUS}
                                fill="none"
                                stroke={color}
                                strokeWidth={RING_STROKE}
                                strokeLinecap="round"
                                strokeDasharray={RING_CIRCUMFERENCE}
                                strokeDashoffset={
                                    RING_CIRCUMFERENCE * (1 - score / 100)
                                }
                            />
                        )}
                    </svg>
                    <span className="absolute whitespace-nowrap text-xs font-semibold ">
                        {formattedDistance}
                    </span>
                </div>
            </div>
            {found && (
                <p
                    className="line-clamp-2 border-t border-slate-200 pt-4 text-xs text-slate-500"
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
            className="flex min-h-40 animate-pulse flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
            <div className="h-4 w-1/2 rounded bg-slate-200" />
            <div className="mt-2 h-4 w-3/4 rounded bg-slate-100" />
            <div className="mt-3 h-5 w-16 rounded-md bg-slate-200" />
            <div className="flex flex-1 items-center justify-center py-3">
                <div className="h-[80px] w-[80px] rounded-full bg-slate-100" />
            </div>
            <div className="border-t border-slate-200 pt-4">
                <div className="h-3 w-2/3 rounded bg-slate-100" />
            </div>
        </div>
    );
}