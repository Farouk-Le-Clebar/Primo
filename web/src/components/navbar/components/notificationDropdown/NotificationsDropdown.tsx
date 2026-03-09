import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../../../hooks/useNotifications";
import NotificationCard from "./cards/NotificationCard";

import type { NotificationResponse } from "../../../../requests/notificationRequests";

export interface NotificationCardProps {
    notification: NotificationResponse;
    onMarkAsRead: (id: string) => void;
    timeAgo: string;
}


export default function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } =
        useNotifications();

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all group"
            >
                <Bell
                    size={20}
                    className={`transition-transform ${isOpen ? "scale-110" : "group-hover:rotate-12"}`}
                />
                {unreadCount > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                )}
            </button>

            {/* Notifications menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-[120] overflow-hidden"
                    >
                        <div className="p-4 border-b border-gray-50">
                            <h3 className="font-UberMoveBold text-gray-800">
                                Notifications
                            </h3>
                        </div>
                        <div className="max-h-80 overflow-y-auto p-2">
                            {isLoading && notifications.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-6">
                                    Chargement…
                                </p>
                            ) : notifications.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-6">
                                    Aucune notification
                                </p>
                            ) : (
                                notifications.map((notif) => (
                                    <NotificationCard
                                        key={notif.id}
                                        notification={notif}
                                        onMarkAsRead={markAsRead}
                                    />
                                ))
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <div className="p-3 bg-gray-50 text-center">
                                <button
                                    onClick={() => markAllAsRead()}
                                    className="text-xs font-UberMoveBold text-[#388160] hover:underline"
                                >
                                    Tout marquer comme lu
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
