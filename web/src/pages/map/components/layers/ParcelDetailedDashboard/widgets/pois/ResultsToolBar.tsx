
import { memo, type ReactNode } from "react";
import type { SortOrder } from "./constants";

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
    sortOrder: SortOrder;
    onCycleSort: () => void;
    grayNotFound: boolean;
    onToggleGrayNotFound: () => void;
};

function ResultsToolbar({
    sortOrder,
    onCycleSort,
    grayNotFound,
    onToggleGrayNotFound,
}: ResultsToolbarProps) {
    const sortActive = sortOrder !== "none";

    return (
        <div className="mb-5 flex flex-wrap items-center gap-4">
            <button
                type="button"
                onClick={onCycleSort}
                aria-label={`Trier par proximité, tri ${SORT_HINT[sortOrder]}`}
                aria-pressed={sortActive}
                title={`Tri ${SORT_HINT[sortOrder]}`}
                className="group inline-flex items-center gap-2 py-2 text-sm font-medium text-[#1D1D1F] transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
            >
                <span>Proximité</span>
                <span className="text-[#86868B] transition-colors group-hover:text-[#1D1D1F] group-focus-visible:text-[#1D1D1F]">
                    {SORT_ARROW[sortActive ? sortOrder : "none"]}
                </span>
            </button>

            <span
                aria-hidden="true"
                className="h-5 w-px bg-[#D2D2D7]"
            />

            <label
                title="Grise les types sans résultat et les place en fin de liste"
                className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-[#6E6E73]"
            >
                <input
                    type="checkbox"
                    checked={grayNotFound}
                    onChange={onToggleGrayNotFound}
                    className="h-4 w-4 cursor-pointer accent-[#1D1D1F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                />
                <span className="text-[#6E6E73] hover:text-[#1D1D1F]">Griser les introuvables</span>
            </label>
        </div>
    );
}

export default memo(ResultsToolbar);
