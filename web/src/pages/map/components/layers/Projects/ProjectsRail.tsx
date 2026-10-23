import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/20/solid";
import { getProjects } from "../../../../../requests/projects";
import type { ProjectResponse } from "../../../../../types/project/projects";
import CreateProjectModal from "../../../../projects/CreateProjectModal";
import ProjectRailItem from "./ProjectRailItem";

const MESSAGE = "px-2 py-6 text-center text-xs text-gray-500";

export default function ProjectsRail() {
  const [filter, setFilter] = useState("");
  const [creating, setCreating] = useState(false);
  const { data: projects = [], isPending, isError, refetch } = useQuery<ProjectResponse[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
  const visibleProjects = projects
    .filter((project) => project.name.toLowerCase().includes(filter.trim().toLowerCase()))
    .sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite));

  return (
    <aside className="primo-slide-enter flex w-64 shrink-0 flex-col border-r border-black/[0.06] dark:border-white/10">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Projets</h2>
          <p className="text-xs text-gray-500 tabular-nums">{projects.length} espace{projects.length > 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          aria-label="Créer un projet"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white transition-opacity duration-150 hover:opacity-80 cursor-pointer dark:bg-white dark:text-black"
        >
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <label className="mx-3 mb-2 flex h-9 items-center gap-2 rounded-lg bg-black/[0.04] px-2.5 text-gray-500 focus-within:ring-1 focus-within:ring-black/20 dark:bg-white/[0.06] dark:focus-within:ring-white/20">
        <MagnifyingGlassIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <input
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Filtrer"
          aria-label="Filtrer les projets"
          className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
        />
      </label>
      <div className="primo-stagger scrollbar-glass min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
        {isPending ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-[52px] animate-pulse rounded-xl bg-black/[0.04] motion-reduce:animate-none dark:bg-white/[0.06]" />
          ))
        ) : isError ? (
          <button onClick={() => void refetch()} className={`${MESSAGE} w-full underline cursor-pointer`}>
            Projets indisponibles. Réessayer
          </button>
        ) : visibleProjects.length ? (
          visibleProjects.map((project) => <ProjectRailItem key={project.id} project={project} />)
        ) : (
          <p className={MESSAGE}>{filter ? "Aucun projet ne correspond." : "Aucun projet pour l'instant."}</p>
        )}
      </div>
      {creating && <CreateProjectModal onClose={() => setCreating(false)} />}
    </aside>
  );
}
