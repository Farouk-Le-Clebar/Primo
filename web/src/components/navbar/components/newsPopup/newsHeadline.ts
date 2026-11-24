import type { NotificationResponse } from "../../../../requests/notificationRequests";
import type { NewsKind } from "./newsKinds";

export type NewsHeadline = { actor: string; action: string };

export function getNewsHeadline(notification: NotificationResponse, kind: NewsKind): NewsHeadline {
  const metadata = notification.metadata ?? {};
  if (kind === "invitation") {
    const actor = metadata.inviterName ?? "Quelqu’un";
    return { actor, action: ` vous invite dans « ${metadata.projectName ?? "un projet"} »` };
  }
  if (kind === "system") return { actor: notification.title, action: "" };
  const actor = metadata.actorName ?? "";
  const action = actor && notification.message.startsWith(actor) ? notification.message.slice(actor.length) : ` ${notification.message}`;
  return { actor, action };
}

const PROJECT_TABS: Partial<Record<NewsKind, string>> = {
  plot: "plots",
  note: "notes",
  document: "documents",
  member: "members",
  milestone: "milestones",
};

export function getNewsTab(kind: NewsKind): string {
  return PROJECT_TABS[kind] ?? "dashboard";
}
