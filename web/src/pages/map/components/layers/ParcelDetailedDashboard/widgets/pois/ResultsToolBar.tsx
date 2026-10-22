// import { memo, type ReactNode } from "react";
// import type { SortOrder } from "./constants";

// const SORT_ARROW: Record<SortOrder, ReactNode> = {
//     asc: (
//         <svg
//             aria-hidden="true"
//             viewBox="0 0 16 16"
//             className="h-4 w-4 fill-none stroke-current stroke-2"
//         >
//             <path d="M8 13V3m0 0L4.5 6.5M8 3l3.5 3.5" />
//         </svg>
//     ),
//     desc: (
//         <svg
//             aria-hidden="true"
//             viewBox="0 0 16 16"
//             className="h-4 w-4 fill-none stroke-current stroke-2"
//         >
//             <path d="M8 3v10m0 0 3.5-3.5M8 13 4.5 9.5" />
//         </svg>
//     ),
//     none: (
//         <svg
//             aria-hidden="true"
//             viewBox="0 0 16 16"
//             className="h-4 w-4 fill-none stroke-current stroke-2"
//         >
//             <path d="M8 2v12M8 2 5 5M8 2l3 3M8 14l-3-3M8 14l3-3" />
//         </svg>
//     ),
// };

// const SORT_HINT: Record<SortOrder, string> = {
//     asc: "croissant (le plus proche en premier)",
//     desc: "décroissant (le plus éloigné en premier)",
//     none: "désactivé",
// };

// type ResultsToolbarProps = {
//     sortOrder: SortOrder;
//     onCycleSort: () => void;
//     grayNotFound: boolean;
//     onToggleGrayNotFound: () => void;
// };

// function ResultsToolbar({
//     sortOrder,
//     onCycleSort,
//     grayNotFound,
//     onToggleGrayNotFound,
// }: ResultsToolbarProps) {
//     const sortActive = sortOrder !== "none";

//     return (
//         <div className="mb-5 flex flex-wrap items-center gap-4">
//             <button
//                 type="button"
//                 onClick={onCycleSort}
//                 aria-label={`Trier par proximité, tri ${SORT_HINT[sortOrder]}`}
//                 aria-pressed={sortActive}
//                 title={`Tri ${SORT_HINT[sortOrder]}`}
//                 className="group inline-flex items-center gap-2 rounded-sm py-2 text-sm font-medium text-[#1D1D1F] transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-100 dark:hover:text-white"
//             >
//                 <span>Proximité</span>
//                 <span className="text-[#86868B] transition-colors group-hover:text-[#1D1D1F] group-focus-visible:text-[#1D1D1F] dark:text-slate-400 dark:group-hover:text-slate-100 dark:group-focus-visible:text-slate-100">
//                     {SORT_ARROW[sortActive ? sortOrder : "none"]}
//                 </span>
//             </button>

//             <span
//                 aria-hidden="true"
//                 className="h-5 w-px bg-[#D2D2D7] dark:bg-slate-700"
//             />

//             <label
//                 title="Grise les types sans résultat et les place en fin de liste"
//                 className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-[#6E6E73] dark:text-slate-400"
//             >
//                 <input
//                     type="checkbox"
//                     checked={grayNotFound}
//                     onChange={onToggleGrayNotFound}
//                     className="h-4 w-4 cursor-pointer accent-[#1D1D1F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:accent-slate-200"
//                 />
//                 <span className="hover:text-[#1D1D1F] dark:hover:text-slate-100">
//                     Griser les introuvables
//                 </span>
//             </label>
//         </div>
//     );
// }

// export default memo(ResultsToolbar);


import { memo, type ReactNode } from "react";
import type { SortOrder } from "./constants";
import ScoreRing from "./ScoreRing";
import { getScoreLabel, type GlobalScoreSummary } from "./utils";

const SORT_ARROW: Record<SortOrder, ReactNode> = {
    asc: (
        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 fill-none stroke-current stroke-2">
            <path d="M8 13V3m0 0L4.5 6.5M8 3l3.5 3.5" />
        </svg>
    ),
    desc: (
        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 fill-none stroke-current stroke-2">
            <path d="M8 3v10m0 0 3.5-3.5M8 13 4.5 9.5" />
        </svg>
    ),
    none: (
        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 fill-none stroke-current stroke-2">
            <path d="M8 2v12M8 2 5 5M8 2l3 3M8 14l-3-3M8 14l3-3" />
        </svg>
    ),
};

const SORT_HINT: Record<SortOrder, string> = {
    asc: "croissant (le plus proche en premier)",
    desc: "décroissant (le plus éloigné en premier)",
    none: "désactivé",
};

type ResultsToolbarProps = {
    globalScore: GlobalScoreSummary | null;
    sortOrder: SortOrder;
    onCycleSort: () => void;
    grayNotFound: boolean;
    onToggleGrayNotFound: () => void;
};

function GlobalScoreSummaryBlock({ score, total, found }: GlobalScoreSummary) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <ScoreRing
                score={score}
                size={56}
                stroke={6}
                ariaLabel={`Score global ${score} sur 100`}
                title={`Score global : ${score}/100`}
                centerClassName="text-sm font-semibold tabular-nums"
            >
                {(animated) => Math.round(animated)}
            </ScoreRing>
            <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Score global · {getScoreLabel(score)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Moyenne des {total} infrastructure{total > 1 ? "s" : ""}{" "}
                    sélectionnée{total > 1 ? "s" : ""} ({found} trouvée
                    {found > 1 ? "s" : ""}
                    {found < total ? ", les introuvables comptent pour 0" : ""})
                </p>
            </div>
        </div>
    );
}

function ResultsToolbar({
    globalScore,
    sortOrder,
    onCycleSort,
    grayNotFound,
    onToggleGrayNotFound,
}: ResultsToolbarProps) {
    const sortActive = sortOrder !== "none";

    return (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            {globalScore ? <GlobalScoreSummaryBlock {...globalScore} /> : <span />}

            <div className="ml-auto flex flex-wrap items-center gap-4">
                <button
                    type="button"
                    onClick={onCycleSort}
                    aria-label={`Trier par proximité, tri ${SORT_HINT[sortOrder]}`}
                    aria-pressed={sortActive}
                    title={`Tri ${SORT_HINT[sortOrder]}`}
                    className="group inline-flex items-center gap-2 rounded-sm py-2 text-sm font-medium text-[#1D1D1F] transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-100 dark:hover:text-white"
                >
                    <span>Proximité</span>
                    <span className="text-[#86868B] transition-colors group-hover:text-[#1D1D1F] group-focus-visible:text-[#1D1D1F] dark:text-slate-400 dark:group-hover:text-slate-100 dark:group-focus-visible:text-slate-100">
                        {SORT_ARROW[sortActive ? sortOrder : "none"]}
                    </span>
                </button>

                <span
                    aria-hidden="true"
                    className="h-5 w-px bg-[#D2D2D7] dark:bg-slate-700"
                />

                <label
                    title="Grise les types sans résultat et les place en fin de liste"
                    className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-[#6E6E73] dark:text-slate-400"
                >
                    <input
                        type="checkbox"
                        checked={grayNotFound}
                        onChange={onToggleGrayNotFound}
                        className="h-4 w-4 cursor-pointer accent-[#1D1D1F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:accent-slate-200"
                    />
                    <span className="hover:text-[#1D1D1F] dark:hover:text-slate-100">
                        Griser les introuvables
                    </span>
                </label>
            </div>
        </div>
    );
}

export default memo(ResultsToolbar);