import { FileText } from "lucide-react";
import type { NotificationCardProps } from "../NotificationsDropdown";

export default function DocumentUpdateCard({
    notification,
    onMarkAsRead,
    timeAgo,
}: NotificationCardProps) {
    const { userName, documentName } = notification.metadata ?? {};

    return (
        <div
            onClick={() =>
                !notification.isRead && onMarkAsRead(notification.id)
            }
            className={`p-3 rounded-xl cursor-pointer transition-colors ${
                !notification.isRead
                    ? "bg-cyan-50/60 hover:bg-cyan-50"
                    : "hover:bg-gray-50 opacity-60"
            }`}
        >
            <div className="flex items-start gap-2.5">
                <div className="mt-0.5 p-1.5 bg-cyan-100 text-cyan-600 rounded-lg shrink-0">
                    <FileText size={14} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">
                        <span className="font-UberMoveBold">
                            {userName ?? "Un membre"}
                        </span>{" "}
                        a mis à jour le document{" "}
                        <span className="font-UberMoveBold">
                            {documentName ?? "un document"}
                        </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1.5">{timeAgo}</p>
                </div>
                {!notification.isRead && (
                    <span className="mt-1.5 w-2 h-2 bg-cyan-500 rounded-full shrink-0"></span>
                )}
            </div>
        </div>
    );
}
