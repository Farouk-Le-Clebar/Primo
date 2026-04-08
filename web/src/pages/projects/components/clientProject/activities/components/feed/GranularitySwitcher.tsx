import { memo, useRef } from "react";
import type { Granularity } from "../../../../../../../types/project/projectHistoryFeed";
import { useSlidingPill } from "../../../../../../../utils/history-feed";
import { GRANULARITY_LABELS } from "../../../../../../../constants/history.constant";

type GranularitySwitcherProps = {
    allowed: Granularity[];
    active: Granularity;
    onChange: (g: Granularity) => void;
};

export const GranularitySwitcher = memo(
    ({ allowed, active, onChange }: GranularitySwitcherProps) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const pill = useSlidingPill(containerRef, active);

        if (allowed.length <= 1) return null;

        return (
            <div
                ref={containerRef}
                className="relative flex gap-0.5 bg-gray-100 rounded-lg p-0.5 flex-shrink-0"
            >
                {/* white pill underlay */}
                <div
                    aria-hidden="true"
                    className="absolute top-0.5 bottom-0.5 rounded-md bg-white shadow-sm pointer-events-none"
                    style={{
                        left: pill.left,
                        width: pill.width,
                        opacity: pill.opacity,
                        transition:
                            "left 220ms cubic-bezier(0.4,0,0.2,1), width 220ms cubic-bezier(0.4,0,0.2,1), opacity 120ms ease",
                    }}
                />
                {allowed.map((g) => (
                    <button
                        key={g}
                        data-active={g === active ? "true" : "false"}
                        onClick={() => onChange(g)}
                        className={`relative z-10 px-3 py-1 text-xs font-medium rounded-md transition-colors duration-150 ${
                            g === active
                                ? "text-gray-800"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {GRANULARITY_LABELS[g]}
                    </button>
                ))}
            </div>
        );
    },
);
GranularitySwitcher.displayName = "GranularitySwitcher";
