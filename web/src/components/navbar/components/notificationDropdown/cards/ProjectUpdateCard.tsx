import { FolderEdit } from "lucide-react";
import type { NotificationCardProps } from "../NotificationsDropdown";

export default function ProjectUpdateCard({
    notification,
    onMarkAsRead,
    timeAgo,
}: NotificationCardProps) {
    const { userName, projectName } = notification.metadata ?? {};

    return (
        <div
            onClick={() =>
                !notification.isRead && onMarkAsRead(notification.id)
            }
            className={`p-3 rounded-xl cursor-pointer transition-colors ${
                !notification.isRead
                    ? "bg-amber-50/60 hover:bg-amber-50"
                    : "hover:bg-gray-50 opacity-60"
            }`}
        >
            <div className="flex items-start gap-2.5">
                <div className="mt-0.5 p-1.5 bg-amber-100 text-amber-600 rounded-lg shrink-0">
                    <FolderEdit size={14} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">
                        <span className="font-UberMoveBold">
                            {userName ?? "Un membre"}
                        </span>{" "}
                        a modifié le projet{" "}
                        <span className="font-UberMoveBold">
                            {projectName ?? "un projet"}
                        </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1.5">{timeAgo}</p>
                </div>
                {!notification.isRead && (
                    <span className="mt-1.5 w-2 h-2 bg-amber-500 rounded-full shrink-0"></span>
                )}
            </div>
        </div>
    );
}
