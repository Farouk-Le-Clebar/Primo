import { motion } from "framer-motion";
import type { NotificationResponse } from "../../../../requests/notificationRequests";
import { formatRelativeTime } from "../../../../utils/relativeTime";
import { getNewsKind, NEWS_KINDS } from "./newsKinds";
import { getNewsHeadline } from "./newsHeadline";
import { DocumentBody, MemberBody, MilestoneBody, NoteBody, PlotBody } from "./NewsBodies";
import InvitationBody from "./InvitationBody";

type NewsItemProps = {
  notification: NotificationResponse;
  index: number;
  onRead: (id: string) => void;
  onOpen: (notification: NotificationResponse) => void;
};

export default function NewsItem({ notification, index, onRead, onOpen }: NewsItemProps) {
  const kind = getNewsKind(notification);
  const style = NEWS_KINDS[kind];
  const Icon = style.icon;
  const metadata = notification.metadata ?? {};
  const { actor, action } = getNewsHeadline(notification, kind);
  const isUnread = !notification.isRead;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index, 8) * 0.035, ease: "easeOut" }}
      onClick={() => kind !== "invitation" && onOpen(notification)}
      className={`group flex w-full items-start gap-3 rounded-[10px] px-3 py-2.5 transition-colors ${kind !== "invitation" ? "cursor-pointer hover:bg-[#1c1c1e]/[0.04] dark:hover:bg-white/[0.04]" : ""} ${isUnread ? style.row : ""}`}
    >
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-8 group-hover:scale-110 ${style.badge}`}>
        <Icon className={`h-4 w-4 ${style.text}`} strokeWidth={1.75} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="text-[13px] text-[#52525b] dark:text-[#d4d4d8]">
          <span className="font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{actor}</span>
          {action}
        </p>
        {kind === "system" && <p className="text-xs text-[#52525b] dark:text-[#d4d4d8]">{notification.message}</p>}
        {kind === "plot" && <PlotBody metadata={metadata} />}
        {kind === "note" && <NoteBody metadata={metadata} />}
        {kind === "document" && <DocumentBody metadata={metadata} />}
        {kind === "member" && <MemberBody metadata={metadata} />}
        {kind === "milestone" && <MilestoneBody metadata={metadata} />}
        {kind === "invitation" && <InvitationBody notification={notification} onAnswered={() => onRead(notification.id)} />}
        <p className="text-[11px] font-medium text-[#82828c]">{formatRelativeTime(notification.createdAt)}</p>
      </div>
      <span
        className={`mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500 transition-all duration-300 ${isUnread ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
        aria-label={isUnread ? "Non lue" : undefined}
      />
    </motion.div>
  );
}
