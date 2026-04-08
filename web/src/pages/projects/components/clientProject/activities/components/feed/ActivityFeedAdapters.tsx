import type { ActivityDisplayItem } from "../../../../../../../types/project/projectHistoryFeed";
import type { ActivityEventResponse } from "../../../../../../../types/project/projectHistoryTimeline";
import { getEventLabel } from "../../../../../../../utils/history";

/**
 * Converts a raw ActivityEventResponse[] (from useActivityHistory) into
 * normalized ActivityDisplayItem[] ready for <ActivityFeed />.
 *
 * Usage:
 *   const feedItems = useMemo(
 *     () => adaptProjectEvents(timelineEvents, projectId, projectName),
 *     [timelineEvents, projectId, projectName],
 *   );
 *   <ActivityFeed items={feedItems} variant="widget" dayWindow={7} />
 */
export function adaptProjectEvents(
    events: ActivityEventResponse[],
    projectId: string,
    projectName?: string,
): ActivityDisplayItem[] {
    return events.map((event) => ({
        id: `${projectId}::${event.id}`,
        occurredAt: event.createdAt,
        actorName: event.actorDisplayName || "Système",
        actorAvatarUrl: event.actorProfilePicture,
        message: getEventLabel(
            event.eventType,
            event.payload,
            event.actorDisplayName,
        ),
        projectId,
        projectName,
        meta: {
            eventType: event.eventType,
            payload: event.payload,
            rawId: event.id,
        },
    }));
}

/**
 * Merges feeds from multiple projects into one sorted array.
 * ActivityFeed automatically shows the projectName badge when it detects
 * items from more than one distinct projectId.
 *
 * Usage:
 *   const items = mergeActivityFeeds([
 *     adaptProjectEvents(eventsA, "id-a", "Projet Alpha"),
 *     adaptProjectEvents(eventsB, "id-b", "Projet Beta"),
 *   ]);
 *   <ActivityFeed variant="widget" dayWindow={7} items={items} />
 */
export function mergeActivityFeeds(
    feeds: ActivityDisplayItem[][],
): ActivityDisplayItem[] {
    return feeds
        .flat()
        .sort(
            (a, b) =>
                new Date(b.occurredAt).getTime() -
                new Date(a.occurredAt).getTime(),
        );
}
