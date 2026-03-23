import type { NotificationResponse } from "../../../../../requests/notificationRequests";
import { Loader2, Trash2 } from "lucide-react";
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

type Props = {
    notification: NotificationResponse;
    onMarkAsRead: (id: string) => void;
    onDeleteNotification: (id: string) => void;
    deletingNotificationId: string | null;
};

export default function NotificationCard({
    notification,
    onMarkAsRead,
    onDeleteNotification,
    deletingNotificationId,
}: Props) {
    const Card = CARD_MAP[notification.type] ?? SystemCard;
    const isDeletingThisNotification =
        deletingNotificationId === notification.id;

    const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onDeleteNotification(notification.id);
    };

    return (
        <div className="relative group">
            <Card
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onDeleteNotification={onDeleteNotification}
                deletingNotificationId={deletingNotificationId}
                timeAgo={timeAgo(notification.createdAt)}
            />

            <button
                type="button"
                onClick={handleDelete}
                disabled={isDeletingThisNotification}
                aria-label="Supprimer la notification"
                className="absolute bottom-2 right-2 p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isDeletingThisNotification ? (
                    <Loader2 size={14} className="animate-spin" />
                ) : (
                    <Trash2 size={14} />
                )}
            </button>
        </div>
    );
}
