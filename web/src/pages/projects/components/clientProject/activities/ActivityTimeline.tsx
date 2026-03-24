import React, { memo, useCallback } from "react";
import type { ActivityEventResponse } from "../../../../../types/project/projectHistoryTimeline";
import { CreationAnchor } from "./components/timeline/CreationAnchor";
import { Sentinel } from "./components/timeline/Sentinel";
import { TimelineItem } from "./components/timeline/TimelineItem";
import { History } from "lucide-react";

export const TimelineSkeleton: React.FC = () => (
    <ul className="px-4 pt-2 animate-pulse" aria-label="Chargement…">
        {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="relative flex gap-3 pb-8">
                <span className="absolute left-[7px] top-[22px] bottom-0 w-[2px] border-l-2 border-dashed border-gray-100" />
                <span className="relative z-10 mt-1 flex-shrink-0 h-[18px] w-[18px] rounded-md bg-gray-200" />
                <div className="flex-1 pt-[1px] space-y-2">
                    <div className="h-3.5 w-3/4 rounded bg-gray-200" />
                    <div className="h-3 w-1/3 rounded bg-gray-100" />
                </div>
            </li>
        ))}
    </ul>
);

const FetchingMore: React.FC = () => (
    <div className="flex justify-center py-2" aria-label="Chargement…">
        <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-gray-200 border-t-[#388160] animate-spin" />
    </div>
);

const TimelineEmptyState: React.FC = () => (
    <div className="py-12 text-center text-gray-500">
        <History className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm">Aucune activité récente</p>
        <p className="text-xs text-gray-400 mt-1">
            Les actions sur ce projet apparaîtront ici
        </p>
    </div>
);

export type ActivityTimelineProps = {
    timelineEvents: ActivityEventResponse[];
    creationEvent: ActivityEventResponse | undefined;
    projectName?: string;
    className?: string;
    isLoading: boolean;
    isFetchingNextPage: boolean;
    hasNextPage: boolean;
    fetchNextPage: () => void;
};

export const ActivityTimeline = memo(
    ({
        timelineEvents,
        creationEvent,
        projectName,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    }: ActivityTimelineProps) => {
        const handleIntersect = useCallback(() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

        return (
            <div className="flex min-h-0 flex-col rounded-xl border border-gray-200 bg-white basis-1/3 min-w-[240px]">
                {/* Scrollable timeline list */}
                <div
                    className="relative flex-1 overflow-y-auto overscroll-contain min-h-0 pt-5 ml-4 mr-5"
                    style={{ scrollbarWidth: "none" }}
                    aria-label="Historique d'activité"
                >
                    {isLoading ? (
                        <TimelineSkeleton />
                    ) : timelineEvents.length === 0 && !hasNextPage ? (
                        <TimelineEmptyState />
                    ) : (
                        <>
                            {hasNextPage && (
                                <Sentinel
                                    onIntersect={handleIntersect}
                                    isFetching={isFetchingNextPage}
                                />
                            )}
                            {isFetchingNextPage && <FetchingMore />}

                            <ul className="relative px-4 pt-3" role="list">
                                {timelineEvents.map((event, index) => (
                                    <TimelineItem
                                        key={event.id}
                                        event={event}
                                        isLast={
                                            index === timelineEvents.length - 1
                                        }
                                    />
                                ))}
                            </ul>
                        </>
                    )}

                    {!isLoading && (
                        <div
                            aria-hidden="true"
                            className="sticky bottom-0 left-0 right-0 h-16 pointer-events-none"
                            style={{
                                background:
                                    "linear-gradient(to bottom, transparent, rgba(255,255,255,0.85) 60%, #f9fafb)",
                            }}
                        />
                    )}
                </div>

                {/* footer -> la date de création */}
                <CreationAnchor
                    event={creationEvent}
                    projectName={projectName}
                />
            </div>
        );
    },
);
ActivityTimeline.displayName = "ActivityTimeline";
