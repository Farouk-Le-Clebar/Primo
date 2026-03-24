import React, { useState, useMemo, useEffect, useCallback } from "react";
import type {
    ActivityFeedProps,
    Granularity,
} from "../../../../../types/project/projectHistoryFeed";
import { buildBuckets } from "../../../../../utils/history-feed";
import {
    DEFAULT_ALLOWED_GRANULARITIES,
    DEFAULT_BUCKET_WINDOW,
    DEFAULT_DAY_WINDOW,
    DEFAULT_GRANULARITY,
} from "../../../../../constants/history.constant";
import { ActivityItemRow } from "./components/feed/ActivityItemRow";
import { BucketNav } from "./components/feed/BucketNav";
import { GranularitySwitcher } from "./components/feed/GranularitySwitcher";

const FeedSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => (
    <div className="animate-pulse space-y-4 py-3">
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3.5 w-2/3 rounded bg-gray-200" />
                    <div className="h-3 w-1/4 rounded bg-gray-100" />
                </div>
            </div>
        ))}
    </div>
);

const DefaultEmptyState: React.FC = () => (
    <div className="py-8 text-center">
        <p className="text-sm text-gray-400">
            Aucune activité sur cette période
        </p>
    </div>
);

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
    items,
    variant,
    dayWindow,
    allowedGranularities,
    defaultGranularity,
    bucketWindow,
    onBucketChange,
    onItemClick,
    loading = false,
    emptyState,
    className = "",
}) => {
    const resolvedAllowed =
        allowedGranularities ?? DEFAULT_ALLOWED_GRANULARITIES;
    const resolvedDefault = defaultGranularity ?? DEFAULT_GRANULARITY;
    const [granularity, setGranularity] =
        useState<Granularity>(resolvedDefault);

    const resolvedBucketWindow =
        variant === "widget"
            ? (dayWindow ?? DEFAULT_DAY_WINDOW)
            : (bucketWindow ?? DEFAULT_BUCKET_WINDOW);

    const buckets = useMemo(
        () => buildBuckets(items, variant, granularity, resolvedBucketWindow),
        [items, variant, granularity, resolvedBucketWindow],
    );

    const defaultSelectedKey = useMemo(
        () =>
            buckets.find((b) => b.isCurrent)?.key ??
            buckets[buckets.length - 1]?.key ??
            "",
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [granularity, variant, resolvedBucketWindow],
    );

    const [selectedKey, setSelectedKey] = useState<string>(defaultSelectedKey);

    useEffect(() => {
        setSelectedKey(defaultSelectedKey);
    }, [defaultSelectedKey]);

    const handleSelectBucket = useCallback(
        (key: string) => {
            setSelectedKey(key);
            onBucketChange?.(key);
        },
        [onBucketChange],
    );

    const activeBucket = useMemo(
        () => buckets.find((b) => b.key === selectedKey),
        [buckets, selectedKey],
    );

    const showProject = useMemo(() => {
        const ids = new Set(items.map((i) => i.projectId).filter(Boolean));
        return ids.size > 1;
    }, [items]);

    const isWidget = variant === "widget";

    return (
        <div
            className={`flex flex-col min-h-0 ${
                isWidget ? "bg-gray-100 rounded-2xl p-3" : ""
            } ${className}`}
        >
            {/* header : bucket nav + granularity switcher */}
            <div
                className={`flex-shrink-0 flex items-center gap-3 ${
                    isWidget ? "mb-3" : "mb-4 pb-3 border-b border-gray-100"
                }`}
            >
                <BucketNav
                    buckets={buckets}
                    selectedKey={selectedKey}
                    onSelect={handleSelectBucket}
                />
                {!isWidget && (
                    <div className="self-start">
                        <GranularitySwitcher
                            allowed={resolvedAllowed}
                            active={granularity}
                            onChange={setGranularity}
                        />
                    </div>
                )}
            </div>

            {/* activity list */}
            <div
                className={`flex-1 overflow-y-auto min-h-0 ${
                    isWidget ? "bg-white rounded-xl px-3 py-1" : ""
                }`}
                style={{ scrollbarWidth: "thin" }}
                role="tabpanel"
                aria-label="Activités de la période sélectionnée"
            >
                {loading ? (
                    <FeedSkeleton rows={3} />
                ) : !activeBucket || activeBucket.items.length === 0 ? (
                    (emptyState ?? <DefaultEmptyState />)
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {activeBucket.items.map((item) => (
                            <ActivityItemRow
                                key={item.id}
                                item={item}
                                showProject={showProject}
                                onClick={onItemClick}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;
