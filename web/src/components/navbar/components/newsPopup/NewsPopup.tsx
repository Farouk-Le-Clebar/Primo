import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCheck, ChevronRight, X } from "lucide-react";
import type { NotificationResponse } from "../../../../requests/notificationRequests";
import { formatVisitDate } from "../../../../utils/relativeTime";
import { getNewsKind, type NewsKind } from "./newsKinds";
import { groupNews } from "./groupNews";
import { newsPreferences } from "./newsPreferences";
import NewsFilters from "./NewsFilters";
import NewsGroup from "./NewsGroup";
import NewsEmpty from "./NewsEmpty";
import { useNewsNavigation } from "./useNewsNavigation";
import NewsAlertSettings from "./NewsAlertSettings";

type NewsPopupProps = {
  notifications: NotificationResponse[];
  unreadCount: number;
  onClose: () => void;
  onRead: (id: string) => void;
  onReadAll: () => void;
};

const PREVIEW_LIMIT = 20;

export default function NewsPopup({ notifications, unreadCount, onClose, onRead, onReadAll }: NewsPopupProps) {
  const [filter, setFilter] = useState<NewsKind | "all">("all");
  const [showHistory, setShowHistory] = useState(false);
  const [lastVisit] = useState(newsPreferences.lastVisit);
  const { openNotification, openGroup } = useNewsNavigation({ onRead, onClose });

  const counts = useMemo(() => {
    const result: Partial<Record<NewsKind, number>> = {};
    notifications.forEach((notification) => {
      const kind = getNewsKind(notification);
      result[kind] = (result[kind] ?? 0) + 1;
    });
    return result;
  }, [notifications]);

  const visible = notifications.filter((notification) => filter === "all" || getNewsKind(notification) === filter);
  const groups = groupNews(showHistory ? visible : visible.slice(0, PREVIEW_LIMIT));
  const offsets = groups.map((_, index) => groups.slice(0, index).reduce((sum, group) => sum + group.items.length, 0));

  const hideOnLogin = () => {
    newsPreferences.hideOnLogin();
    onClose();
  };

  return (
    <motion.div
      role="dialog"
      aria-label="Nouveautés"
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      style={{ transformOrigin: "top right" }}
      className="fixed right-2 top-[64px] z-[1100] flex max-h-[calc(100dvh-80px-4rem-env(safe-area-inset-bottom))] w-[min(460px,calc(100vw-1rem))] sm:right-4 md:max-h-[calc(100vh-80px)] flex-col overflow-hidden rounded-2xl border border-[#1c1c1e]/8 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.16)] dark:border-white/10 dark:bg-[#1c1c1e] dark:shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
    >
      <header className="flex flex-col gap-1 px-5 pb-3 pt-[18px]">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-[#1c1c1e] dark:text-[#fafafa]">Nouveautés</h2>
          {unreadCount > 0 && (
            <motion.span key={unreadCount} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="rounded-full bg-red-500/10 px-2.5 py-[5px] text-xs font-semibold text-red-500 dark:bg-red-500/20">
              {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
            </motion.span>
          )}
          <span className="flex-1" />
          <button onClick={onReadAll} disabled={unreadCount === 0} className="group flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#52525b] transition-colors hover:bg-[#1c1c1e]/5 disabled:opacity-40 dark:text-[#d4d4d8] dark:hover:bg-white/7">
            <CheckCheck className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
            Tout lire
          </button>
          <button onClick={onClose} aria-label="Fermer" className="group rounded-lg p-1.5 text-[#82828c] transition-colors hover:bg-[#1c1c1e]/5 dark:hover:bg-white/7">
            <X className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
          </button>
        </div>
        {lastVisit && <p className="text-xs text-[#82828c]">Depuis votre dernière visite · {formatVisitDate(lastVisit)}</p>}
      </header>
      {notifications.length > 0 && <NewsFilters counts={counts} total={notifications.length} active={filter} onChange={setFilter} />}
      <div className="h-px w-full bg-[#1c1c1e]/8 dark:bg-white/8" />
      <div className="scrollbar-glass flex-1 overflow-y-auto px-2 py-1.5">
        {groups.length === 0 ? (
          <NewsEmpty />
        ) : (
          groups.map((group, index) => (
            <NewsGroup key={group.id} group={group} offset={offsets[index]} onOpenGroup={openGroup} onOpen={openNotification} onRead={onRead} />
          ))
        )}
      </div>
      <NewsAlertSettings />
      <footer className="flex items-center gap-2 border-t border-[#1c1c1e]/8 px-5 py-3.5 dark:border-white/8">
        {visible.length > PREVIEW_LIMIT && !showHistory && (
          <button onClick={() => setShowHistory(true)} className="group flex items-center gap-2 text-[13px] font-semibold text-[#1c1c1e] dark:text-[#fafafa]">
            Voir tout l’historique
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
        <span className="flex-1" />
        <button onClick={hideOnLogin} className="text-xs font-medium text-[#82828c] transition-colors hover:text-[#1c1c1e] dark:hover:text-white">
          Ne plus afficher à la connexion
        </button>
      </footer>
    </motion.div>
  );
}
