import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../constants/routes";
import type { NotificationResponse } from "../../../../requests/notificationRequests";
import type { NewsGroupData } from "./groupNews";
import { getNewsKind } from "./newsKinds";
import { getNewsTab } from "./newsHeadline";

type UseNewsNavigationOptions = { onRead: (id: string) => void; onClose: () => void };

export function useNewsNavigation({ onRead, onClose }: UseNewsNavigationOptions) {
  const navigate = useNavigate();

  const openNotification = (notification: NotificationResponse) => {
    if (!notification.isRead) onRead(notification.id);
    const projectId = notification.metadata?.projectId;
    if (!projectId) return;
    navigate(`${ROUTES.project(projectId)}/${notification.metadata?.tab ?? getNewsTab(getNewsKind(notification))}`);
    onClose();
  };

  const openGroup = (group: NewsGroupData) => {
    if (!group.projectId) return;
    group.items.filter((notification) => !notification.isRead).forEach((notification) => onRead(notification.id));
    navigate(`${ROUTES.project(group.projectId)}/dashboard`);
    onClose();
  };

  return { openNotification, openGroup };
}
