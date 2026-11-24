import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useNotificationAlerts } from "../../../../hooks/useNotificationAlerts";
import { useNotifications } from "../../../../hooks/useNotifications";
import { useOutsideClick } from "../../../../hooks/useOutsideClick";
import { newsPreferences, OPEN_NEWS_EVENT } from "./newsPreferences";
import NewsPopup from "./NewsPopup";

export default function NewsBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();
  useNotificationAlerts(notifications, isLoading);

  const close = () => {
    setIsOpen(false);
    newsPreferences.saveVisit();
  };
  const containerRef = useOutsideClick(() => isOpen && close());

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener(OPEN_NEWS_EVENT, open);
    return () => window.removeEventListener(OPEN_NEWS_EVENT, open);
  }, []);

  useEffect(() => {
    if (isLoading || unreadCount === 0 || newsPreferences.wasShownThisSession() || newsPreferences.isHiddenOnLogin()) return;
    newsPreferences.markShownThisSession();
    setIsOpen(true);
  }, [isLoading, unreadCount]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        data-tour="news-bell"
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        aria-label={unreadCount ? `Nouveautés, ${unreadCount} non lues` : "Nouveautés"}
        aria-expanded={isOpen}
        className={`group relative flex h-9 w-9 items-center justify-center rounded-[10px] text-[#1c1c1e]/78 transition-colors duration-150 hover:bg-[#1c1c1e]/[0.07] dark:text-white/78 dark:hover:bg-white/[0.07] ${isOpen ? "bg-[#1c1c1e]/[0.07] dark:bg-white/[0.07]" : ""}`}
      >
        <Bell className="h-4 w-4 origin-top group-hover:animate-[bell-ding_0.6s_ease-in-out]" strokeWidth={1.5} aria-hidden="true" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key={unreadCount}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 18 }}
              className="absolute left-5 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-[9px] border-2 border-white bg-red-500 px-[3px] text-[10px] font-bold text-white dark:border-[#1c1c1e]"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      <AnimatePresence>
        {isOpen && (
          <NewsPopup notifications={notifications} unreadCount={unreadCount} onClose={close} onRead={markAsRead} onReadAll={markAllAsRead} />
        )}
      </AnimatePresence>
    </div>
  );
}
