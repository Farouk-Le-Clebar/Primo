import { FolderPlus, SearchX } from "lucide-react";
import EmptyState from "../../../../../ui/EmptyState";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/20/solid";
import { getProjects } from "../../../../../requests/projects";
import type { ProjectResponse } from "../../../../../types/project/projects";
import CreateProjectModal from "../../../../projects/CreateProjectModal";
import ProjectRailItem from "./ProjectRailItem";
import { useProjectNews } from "../../../../../hooks/useProjectNews";

const MESSAGE = "px-2 py-6 text-center text-xs text-[#82828c]";

export default function ProjectsRail() {
  const [filter, setFilter] = useState("");
  const [creating, setCreating] = useState(false);
  const { unreadByProject } = useProjectNews();
  const { data: projects = [], isPending, isError, refetch } = useQuery<ProjectResponse[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
  const visibleProjects = projects
    .filter((project) => project.name.toLowerCase().includes(filter.trim().toLowerCase()))
    .sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite));

  return (
    <aside data-tour="projects-rail" className="primo-slide-enter flex w-full shrink-0 flex-col gap-1.5 md:w-64 md:border-r border-[#1c1c1e]/8 px-3 py-4 dark:border-white/10">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-[15px] font-bold text-[#1c1c1e] dark:text-[#fafafa]">Projets</h2>
          <p className="mt-0.5 text-xs text-[#82828c] tabular-nums">{projects.length} espace{projects.length > 1 ? "s" : ""}</p>
        </div>
        <button
          data-tour="projects-new"
          onClick={() => setCreating(true)}
          aria-label="Créer un projet"
          className="group flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-[#1c1c1e] text-white transition-transform duration-200 hover:scale-105 active:scale-95 dark:bg-white dark:text-[#1c1c1e]"
        >
          <PlusIcon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" aria-hidden="true" />
        </button>
      </div>
      <label data-tour="projects-filter" className="flex h-8 items-center gap-2 rounded-lg bg-[#1c1c1e]/6 px-2.5 text-[#82828c] transition-shadow focus-within:ring-1 focus-within:ring-[#1c1c1e]/20 dark:bg-white/6 dark:focus-within:ring-white/20">
        <MagnifyingGlassIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <input
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Filtrer"
          aria-label="Filtrer les projets"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-[#1c1c1e] outline-none placeholder:text-[#82828c] dark:text-white"
        />
      </label>
      <div className="primo-stagger scrollbar-glass -mx-1 flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-1 pb-3">
        {isPending ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-[10px] bg-black/[0.04] motion-reduce:animate-none dark:bg-white/[0.06]" />
          ))
        ) : isError ? (
          <button onClick={() => void refetch()} className={`${MESSAGE} w-full underline cursor-pointer`}>
            Projets indisponibles. Réessayer
          </button>
        ) : visibleProjects.length ? (
          visibleProjects.map((project) => <ProjectRailItem key={project.id} project={project} unread={unreadByProject.get(project.id) ?? 0} />)
        ) : (
          filter ? (
            <EmptyState icon={SearchX} title="Aucun projet ne correspond" size="sm" framed={false} secondaryAction={{ label: "Effacer le filtre", onClick: () => setFilter("") }} />
          ) : (
            <EmptyState icon={FolderPlus} title="Aucun projet" description="Créez un espace pour suivre vos parcelles en équipe." size="sm" action={{ label: "Créer un projet", onClick: () => setCreating(true) }} />
          )
        )}
      </div>
      {creating && <CreateProjectModal onClose={() => setCreating(false)} />}
    </aside>
  );
}
