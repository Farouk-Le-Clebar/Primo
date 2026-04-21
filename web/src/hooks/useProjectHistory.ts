import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchActivityHistory } from "../requests/historyRequests";
import {
    ActivityEventType,
    type ActivityEventResponse,
    type ActivityHistoryPage,
} from "../types/project/projectHistoryTimeline";

export const activityHistoryKeys = {
    all: (projectId: string) => ["activityHistory", projectId] as const,
};

interface UseActivityHistoryOptions {
    projectId?: string;
    limit?: number;
}

export const useActivityHistory = ({
    projectId,
    limit = 20,
}: UseActivityHistoryOptions) => {
    const query = useInfiniteQuery<
        ActivityHistoryPage,
        Error,
        { pages: ActivityHistoryPage[] },
        ReturnType<typeof activityHistoryKeys.all>,
        string | undefined
    >({
        queryKey: activityHistoryKeys.all(projectId ?? ""),
        queryFn: ({ pageParam }) =>
            fetchActivityHistory(projectId!, pageParam, limit),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) =>
            lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
        enabled: !!projectId,
        staleTime: 30_000,
    });

    const events: ActivityEventResponse[] = [];
    const seen = new Set<string>();
    for (const page of query.data?.pages ?? []) {
        for (const item of page.items) {
            if (!seen.has(item.id)) {
                seen.add(item.id);
                events.push(item);
            }
        }
    }

    const creationEvent = events.find(
        (e) => e.eventType === ActivityEventType.PROJECT_CREATED,
    );

    const timelineEvents = events.filter(
        (e) => e.eventType !== ActivityEventType.PROJECT_CREATED,
    );

    return {
        timelineEvents,
        creationEvent,
        isLoading: query.isLoading,
        isFetchingNextPage: query.isFetchingNextPage,
        hasNextPage: query.hasNextPage,
        fetchNextPage: query.fetchNextPage,
        isError: query.isError,
        error: query.error,
    };
};
