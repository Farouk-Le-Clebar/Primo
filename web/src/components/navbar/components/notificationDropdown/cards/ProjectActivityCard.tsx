import { Activity } from "lucide-react";
import type { NotificationCardProps } from "../NotificationsDropdown";

export default function ProjectActivityCard({
    notification,
    onMarkAsRead,
    timeAgo,
}: NotificationCardProps) {
    return (
        <div
            onClick={() =>
                !notification.isRead && onMarkAsRead(notification.id)
            }
            className={`p-3 rounded-xl cursor-pointer transition-colors ${
                !notification.isRead
                    ? "bg-violet-50/60 hover:bg-violet-50"
                    : "hover:bg-gray-50 opacity-60"
            }`}
        >
            <div className="flex items-start gap-2.5">
                <div className="mt-0.5 p-1.5 bg-violet-100 text-violet-600 rounded-lg shrink-0">
                    <Activity size={14} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">
                        {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                        {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1.5">{timeAgo}</p>
                </div>
                {!notification.isRead && (
                    <span className="mt-1.5 w-2 h-2 bg-violet-500 rounded-full shrink-0"></span>
                )}
            </div>
        </div>
    );
}
