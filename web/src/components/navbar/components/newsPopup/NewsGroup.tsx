import { ChevronRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import type { NotificationResponse } from "../../../../requests/notificationRequests";
import type { NewsGroupData } from "./groupNews";
import NewsItem from "./NewsItem";

type NewsGroupProps = {
  group: NewsGroupData;
  offset: number;
  onOpenGroup: (group: NewsGroupData) => void;
  onOpen: (notification: NotificationResponse) => void;
  onRead: (id: string) => void;
};

export default function NewsGroup({ group, offset, onOpenGroup, onOpen, onRead }: NewsGroupProps) {
  return (
    <section className="flex flex-col border-t border-[#1c1c1e]/8 first:border-t-0 dark:border-white/8">
      <button onClick={() => onOpenGroup(group)} className="group flex w-full items-center gap-2 px-3 py-2.5 text-left">
        <span className={`h-2 w-2 rounded-full ${group.dot}`} />
        <span className="truncate text-[11px] font-bold uppercase text-[#52525b] dark:text-[#d4d4d8]">{group.title}</span>
        <span className="text-[11px] font-semibold text-[#82828c]">· {group.items.length}</span>
        <span className="flex-1" />
        {group.projectId && (
          <>
            <span className="text-[11px] font-semibold text-[#82828c] transition-colors group-hover:text-[#1c1c1e] dark:group-hover:text-white">Ouvrir</span>
            <ChevronRight className="h-3 w-3 text-[#82828c] transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
      <AnimatePresence initial={false}>
        {group.items.map((notification, index) => (
          <NewsItem key={notification.id} notification={notification} index={offset + index} onOpen={onOpen} onRead={onRead} />
        ))}
      </AnimatePresence>
    </section>
  );
}
