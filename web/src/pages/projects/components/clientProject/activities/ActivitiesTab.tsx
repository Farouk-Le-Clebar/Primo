import React from "react";
import { History } from "lucide-react";
import { useActivityHistory } from "../../../../../hooks/useHistory";
import { ActivityTimeline } from "./ActivityTimeline";

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
                {/* 2 blocs temp */}
                <div className="basis-2/3 min-w-0 flex flex-col gap-3">
                    <div className="h-1/3 rounded-xl bg-gray-200" />
                    <div className="flex-1 rounded-xl bg-gray-200" />
                </div>

                {/*timeline */}
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
