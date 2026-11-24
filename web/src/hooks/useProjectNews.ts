import { useMemo } from "react";
import { useNotifications } from "./useNotifications";
import type { NotificationResponse } from "../requests/notificationRequests";

type ActivityKind = NonNullable<NonNullable<NotificationResponse["metadata"]>["kind"]>;

export function useProjectNews(projectId?: string) {
  const { notifications, markAsRead } = useNotifications();

  return useMemo(() => {
    const unreadByProject = new Map<string, number>();
    notifications.forEach((notification) => {
      const id = notification.metadata?.projectId;
      if (!notification.isRead && id && notification.type === "PROJECT_ACTIVITY")
        unreadByProject.set(id, (unreadByProject.get(id) ?? 0) + 1);
    });
    const projectActivity = notifications.filter(
      (notification) => notification.type === "PROJECT_ACTIVITY" && notification.metadata?.projectId === projectId,
    );
    const unreadByKind: Partial<Record<ActivityKind, number>> = {};
    projectActivity.forEach((notification) => {
      const kind = notification.metadata?.kind;
      if (!notification.isRead && kind) unreadByKind[kind] = (unreadByKind[kind] ?? 0) + 1;
    });
    const unreadIds = new Set(projectActivity.filter((notification) => !notification.isRead).map((notification) => notification.id));
    return { unreadByProject, projectActivity, unreadByKind, unreadIds, markAsRead };
  }, [notifications, projectId, markAsRead]);
}
