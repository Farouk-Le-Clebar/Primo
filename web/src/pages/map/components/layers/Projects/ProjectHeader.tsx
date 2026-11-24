import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Share, Star, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { getProjects, toggleFavorite } from "../../../../../requests/projects";
import type { ProjectResponse } from "../../../../../types/project/projects";
import { formatRelativeTime } from "../../../../../utils/relativeTime";
import { openNewsPopup } from "../../../../../components/navbar/components/newsPopup/newsPreferences";
import InviteMembersModal from "../../../../projects/components/InviteMembersModal";
import { useProjectNews } from "../../../../../hooks/useProjectNews";

type ProjectHeaderProps = { project: ProjectResponse };

const plural = (count: number, word: string): string => `${count} ${word}${count > 1 ? "s" : ""}`;

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  const queryClient = useQueryClient();
  const [inviting, setInviting] = useState(false);
  const { projectActivity, unreadIds } = useProjectNews(project.id);
  const { data: projects = [] } = useQuery<ProjectResponse[]>({ queryKey: ["projects"], queryFn: getProjects });
  const isFavorite = projects.find((item) => item.id === project.id)?.isFavorite ?? false;
  const { mutate: toggle } = useMutation({
    mutationFn: () => toggleFavorite(project.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const lastActivity = projectActivity[0];
  const meta = [
    plural(project.numberOfPlots, "parcelle"),
    project.numberOfMembers ? plural(project.numberOfMembers, "membre") : null,
    lastActivity ? `modifié ${formatRelativeTime(lastActivity.createdAt).toLowerCase()} par ${lastActivity.metadata?.actorName ?? ""}` : null,
  ].filter(Boolean);

  const share = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Lien du projet copié");
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex w-full min-w-0 flex-col gap-1 md:w-auto">
        <div className="flex items-center gap-2.5">
          <h2 className="truncate text-xl font-bold md:text-2xl text-[#1c1c1e] dark:text-[#fafafa]">{project.name}</h2>
          <button onClick={() => toggle()} aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"} className="group">
            <Star className={`h-4 w-4 text-amber-400 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-125 group-hover:rotate-[72deg] group-active:scale-90 ${isFavorite ? "fill-amber-400" : ""}`} />
          </button>
        </div>
        <p className="truncate text-[13px] text-[#82828c]">{meta.join(" · ")}</p>
      </div>
      <span className="hidden flex-1 md:block" />
      {unreadIds.size > 0 && (
        <button onClick={openNewsPopup} className="group flex items-center gap-2 rounded-lg bg-red-500/8 px-3 py-2 text-[13px] font-semibold text-red-500 transition-colors hover:bg-red-500/14 dark:bg-red-500/15">
          <Bell className="h-3.5 w-3.5 origin-top group-hover:animate-[bell-ding_0.6s_ease-in-out]" />
          {plural(unreadIds.size, "nouveauté")}
        </button>
      )}
      <button data-tour="project-share" onClick={() => void share()} className="group flex items-center gap-1.5 rounded-lg border border-[#1c1c1e]/14 px-3.5 py-2 text-[13px] font-semibold text-[#1c1c1e] transition-colors hover:bg-[#1c1c1e]/4 dark:border-white/16 dark:text-[#fafafa] dark:hover:bg-white/6">
        <Share className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
        Partager
      </button>
      <button data-tour="project-invite" onClick={() => setInviting(true)} className="group flex items-center gap-1.5 rounded-lg bg-[#1c1c1e] px-3.5 py-2 text-[13px] font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 dark:bg-white dark:text-[#1c1c1e]">
        <UserPlus className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
        Inviter
      </button>
      {inviting && <InviteMembersModal projectId={project.id} onClose={() => setInviting(false)} />}
    </div>
  );
}
