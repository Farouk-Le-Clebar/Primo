import type { NotificationResponse } from "../../../../requests/notificationRequests";
import { getNewsKind } from "./newsKinds";

export type NewsGroupData = {
  id: string;
  title: string;
  projectId: string | null;
  dot: string;
  items: NotificationResponse[];
};

const PROJECT_DOTS = ["bg-violet-500", "bg-blue-500", "bg-amber-500", "bg-emerald-500", "bg-rose-500"];

export function groupNews(notifications: NotificationResponse[]): NewsGroupData[] {
  const groups = new Map<string, NewsGroupData>();
  notifications.forEach((notification) => {
    const kind = getNewsKind(notification);
    const projectId = notification.metadata?.projectId ?? null;
    const key = kind === "invitation" ? "invitations" : kind === "system" || !projectId ? "primo" : projectId;
    if (!groups.has(key)) {
      groups.set(key, {
        id: key,
        title: key === "invitations" ? "Invitations" : key === "primo" ? "Primo" : notification.metadata?.projectName ?? notification.title,
        projectId: key === projectId ? projectId : null,
        dot: key === "invitations" ? "bg-pink-500" : key === "primo" ? "bg-zinc-400" : PROJECT_DOTS[groups.size % PROJECT_DOTS.length],
        items: [],
      });
    }
    groups.get(key)?.items.push(notification);
  });
  return [...groups.values()];
}
