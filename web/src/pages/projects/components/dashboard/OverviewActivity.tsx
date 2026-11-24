import { Activity, ChevronRight, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../../../ui/EmptyState";
import { useProjectNews } from "../../../../hooks/useProjectNews";
import { formatRelativeTime } from "../../../../utils/relativeTime";
import { getNewsKind, NEWS_KINDS } from "../../../../components/navbar/components/newsPopup/newsKinds";
import { getNewsHeadline } from "../../../../components/navbar/components/newsPopup/newsHeadline";
import { openNewsPopup } from "../../../../components/navbar/components/newsPopup/newsPreferences";
import SectionCard from "../ui/SectionCard";
import Tag from "../ui/Tag";

const PREVIEW_COUNT = 5;

export default function OverviewActivity({ projectId }: { projectId: string }) {
  const navigate = useNavigate();
  const { projectActivity, unreadIds, markAsRead } = useProjectNews(projectId);
  const items = projectActivity.slice(0, PREVIEW_COUNT);

  return (
    <SectionCard
      title="Activité récente"
      subtitle="Ce qui a changé dans le projet"
      action={unreadIds.size > 0 ? <Tag tone="red" size="sm">{unreadIds.size} non lue{unreadIds.size > 1 ? "s" : ""}</Tag> : undefined}
    >
      <div className="mt-2 flex flex-col gap-1">
        {items.length === 0 && <EmptyState icon={Activity} title="Pas encore d’activité" description="Les ajouts de parcelles, notes et documents de l’équipe s’afficheront ici." action={{ label: "Inviter un membre", onClick: () => navigate("../members"), icon: UserPlus }} size="sm" framed={false} />}
        {items.map((notification, index) => {
          const kind = getNewsKind(notification);
          const style = NEWS_KINDS[kind];
          const Icon = style.icon;
          const { actor, action } = getNewsHeadline(notification, kind);
          const isUnread = !notification.isRead;
          return (
            <button
              key={notification.id}
              onClick={() => isUnread && markAsRead(notification.id)}
              style={{ animationDelay: `${index * 40}ms` }}
              className={`animate-fade-in group flex items-center gap-2.5 rounded-[10px] px-1.5 py-2 text-left transition-colors ${isUnread ? style.row : "hover:bg-[#1c1c1e]/[0.03] dark:hover:bg-white/[0.04]"}`}
            >
              <span className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] ${style.badge}`}>
                <Icon className={`h-[15px] w-[15px] ${style.text}`} strokeWidth={1.75} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-[13px] text-[#52525b] dark:text-[#d4d4d8]">
                  <span className="font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{actor}</span>
                  {action}
                </span>
                <span className="text-[11px] text-[#82828c]">{formatRelativeTime(notification.createdAt)}</span>
              </span>
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full bg-red-500 transition-transform duration-300 ${isUnread ? "scale-100" : "scale-0"}`} />
            </button>
          );
        })}
      </div>
      <button onClick={openNewsPopup} className="group mt-2 flex items-center gap-1.5 px-1.5 text-xs font-semibold text-[#1c1c1e] dark:text-[#fafafa]">
        Voir les nouveautés
        <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </button>
    </SectionCard>
  );
}
