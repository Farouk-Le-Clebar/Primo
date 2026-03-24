import React, { useMemo } from "react";
import { History } from "lucide-react";
import { useActivityHistory } from "../../../../../hooks/useProjectHistory";
import { ActivityTimeline } from "./ActivityTimeline";
import { ActivityFeed } from "./ActivityFeed";
import { adaptProjectEvents } from "./components/feed/ActivityFeedAdapters";

type ActivitiesTabProps = {
    projectId?: string;
    projectName?: string;
};

const ActivitiesTab: React.FC<ActivitiesTabProps> = ({
    projectId,
    projectName,
}) => {
    const {
        timelineEvents,
        creationEvent,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isError,
        error,
    } = useActivityHistory({ projectId });

    const feedItems = useMemo(
        () =>
            projectId
                ? adaptProjectEvents(timelineEvents, projectId, projectName)
                : [],
        [timelineEvents, projectId, projectName],
    );

    if (isError) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <History className="w-10 h-10 text-red-300 mx-auto mb-3" />
                    <p className="text-sm text-red-600">
                        {error?.message ??
                            "Erreur lors du chargement de l'historique"}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-0 mb-5">
            <div className="flex flex-1 min-h-0 gap-3">
                <div className="basis-2/3 min-w-0 flex flex-col gap-3 min-h-0">
                    <div className="h-1/3 flex-shrink-0 rounded-xl bg-gray-200" />

                    <div className="flex-1 min-h-0 flex flex-col rounded-xl overflow-hidden border border-gray-200 p-4">
                        <ActivityFeed
                            items={feedItems}
                            variant="page"
                            allowedGranularities={["day", "week", "month"]}
                            defaultGranularity="day"
                            bucketWindow={7}
                            loading={isLoading}
                            className="h-full"
                        />
                    </div>
                </div>

                <ActivityTimeline
                    timelineEvents={timelineEvents}
                    creationEvent={creationEvent}
                    projectName={projectName}
                    isLoading={isLoading}
                    isFetchingNextPage={isFetchingNextPage}
                    hasNextPage={hasNextPage ?? false}
                    fetchNextPage={fetchNextPage}
                />
            </div>
        </div>
    );
};

export default ActivitiesTab;
