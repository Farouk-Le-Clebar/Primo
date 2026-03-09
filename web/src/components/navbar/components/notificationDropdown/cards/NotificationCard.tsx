import type { NotificationResponse } from "../../../../../requests/notificationRequests";
import SystemCard from "./SystemCard";
import ProjectInvitationCard from "./ProjectInvitationCard";
import ProjectUpdateCard from "./ProjectUpdateCard";
import ProjectActivityCard from "./ProjectActivityCard";
import DocumentUpdateCard from "./DocumentUpdateCard";
import type { NotificationCardProps } from "../NotificationsDropdown";

function timeAgo(dateStr: string): string {
    const now = new Date();
    const normalized = dateStr.endsWith("Z") ? dateStr : dateStr + "Z";
    const date = new Date(normalized);
    const diffMs = now.getTime() - date.getTime();

    if (diffMs < 0) return "À l'instant";

    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "À l'instant";

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60)
        return `Il y a ${diffMin} minute${diffMin > 1 ? "s" : ""}`;

    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `Il y a ${diffH} heure${diffH > 1 ? "s" : ""}`;

    const diffD = Math.floor(diffH / 24);
    return `Il y a ${diffD} jour${diffD > 1 ? "s" : ""}`;
}

const CARD_MAP: Record<string, React.ComponentType<NotificationCardProps>> = {
    SYSTEM: SystemCard,
    PROJECT_INVITATION: ProjectInvitationCard,
    PROJECT_UPDATE: ProjectUpdateCard,
    PROJECT_ACTIVITY: ProjectActivityCard,
    DOCUMENT_UPDATE: DocumentUpdateCard,
};

interface Props {
    notification: NotificationResponse;
    onMarkAsRead: (id: string) => void;
}

export default function NotificationCard({
    notification,
    onMarkAsRead,
}: Props) {
    const Card = CARD_MAP[notification.type] ?? SystemCard;

    return (
        <Card
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            timeAgo={timeAgo(notification.createdAt)}
        />
    );
}
