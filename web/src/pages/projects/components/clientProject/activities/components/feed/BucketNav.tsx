import { memo, useEffect, useRef } from "react";
import type { TimeBucket } from "../../../../../../../types/project/projectHistoryFeed";
import { useSlidingPill } from "../../../../../../../utils/history-feed";

type BucketNavProps = {
    buckets: TimeBucket[];
    selectedKey: string;
    onSelect: (key: string) => void;
};

export const BucketNav = memo(
    ({ buckets, selectedKey, onSelect }: BucketNavProps) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const scrollRef = useRef<HTMLDivElement>(null);
        const pill = useSlidingPill(containerRef, selectedKey);

        useEffect(() => {
            const container = scrollRef.current;
            if (!container) return;
            const active = container.querySelector<HTMLElement>(
                '[data-active="true"]',
            );
            if (!active) return;
            const { left, right } = active.getBoundingClientRect();
            const { left: cLeft, right: cRight } =
                container.getBoundingClientRect();
            if (left < cLeft || right > cRight) {
                active.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center",
                });
            }
        }, [selectedKey]);

        return (
            <div
                ref={scrollRef}
                className="flex-1 min-w-0 overflow-x-auto"
                style={{ scrollbarWidth: "none" }}
            >
                <div
                    ref={containerRef}
                    className="relative inline-flex gap-1"
                    role="tablist"
                    aria-label="Sélection de la période"
                >
                    {/* dark pill underlay */}
                    <div
                        aria-hidden="true"
                        className="absolute top-0 bottom-0 rounded-xl bg-gray-900 pointer-events-none"
                        style={{
                            left: pill.left,
                            width: pill.width,
                            opacity: pill.opacity,
                            transition:
                                "left 250ms cubic-bezier(0.4,0,0.2,1), width 250ms cubic-bezier(0.4,0,0.2,1), opacity 120ms ease",
                        }}
                    />

                    {buckets.map((bucket) => {
                        const isSelected = bucket.key === selectedKey;
                        return (
                            <button
                                key={bucket.key}
                                data-active={isSelected ? "true" : "false"}
                                role="tab"
                                aria-selected={isSelected}
                                onClick={() => onSelect(bucket.key)}
                                className={`
                                relative z-10 flex-shrink-0 flex flex-col items-center justify-center
                                rounded-xl transition-colors duration-150
                                min-w-[44px] min-h-[52px] px-3 py-2
                                ${
                                    isSelected
                                        ? "text-white"
                                        : "text-gray-400 hover:text-gray-700"
                                }
                            `}
                            >
                                {bucket.sublabel && (
                                    <span
                                        className={`text-[10px] font-medium leading-none mb-1 ${isSelected ? "text-gray-300" : "text-gray-400"}`}
                                    >
                                        {bucket.sublabel}
                                    </span>
                                )}
                                <span className="leading-none font-semibold tabular-nums text-base">
                                    {bucket.label}
                                </span>
                                {/* Activity dot */}
                                <span
                                    className={`mt-1.5 h-[5px] w-[5px] rounded-full transition-colors duration-150 ${
                                        bucket.items.length > 0
                                            ? isSelected
                                                ? "bg-white/50"
                                                : "bg-[#388160]"
                                            : "bg-transparent"
                                    }`}
                                />
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    },
);
BucketNav.displayName = "BucketNav";
