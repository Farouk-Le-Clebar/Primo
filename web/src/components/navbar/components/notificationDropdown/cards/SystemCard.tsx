import { Sparkles } from "lucide-react";
import type { NotificationCardProps } from "../NotificationsDropdown";

export default function SystemCard({
    notification,
    onMarkAsRead,
    timeAgo,
}: NotificationCardProps) {
    return (
        <div
            onClick={() =>
                !notification.isRead && onMarkAsRead(notification.id)
            }
            className={`p-3 rounded-xl transition-colors ${
                !notification.isRead
                    ? "bg-emerald-50/60 hover:bg-emerald-50"
                    : "hover:bg-gray-50 opacity-60"
            }`}
        >
            <div className="flex items-start gap-2.5">
                <div className="mt-0.5 p-1.5 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
                    <Sparkles size={14} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">
                        <span className="font-UberMoveBold">
                            {notification.title}
                        </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1.5">{timeAgo}</p>
                </div>
                {!notification.isRead && (
                    <span className="mt-1.5 w-2 h-2 bg-emerald-500 rounded-full shrink-0"></span>
                )}
            </div>
        </div>
    );
}
