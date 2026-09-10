import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  Folder,
  LayoutDashboard,
  Map,
  Plus,
  Star,
  Users,
} from "lucide-react";
import { getProjects } from "../../../requests/projects";
import type { ProjectResponse } from "../../../types/project/projects";
import CreateProjectModal from "../../../pages/projects/CreateProjectModal";

const pages = [
  { path: "dashboard", label: "Vue d’ensemble", icon: LayoutDashboard },
  { path: "plots", label: "Parcelles", icon: Map },
  { path: "members", label: "Membres", icon: Users },
];
export default function SidebarProjects() {
  const { pathname } = useLocation();
  const activeProject = pathname.match(/^\/projects\/([^/]+)\//)?.[1];
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [creating, setCreating] = useState(false);
  const {
    data: projects,
    isPending,
    isError,
    refetch,
  } = useQuery<ProjectResponse[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
  useEffect(() => {
    if (activeProject)
      setExpanded((previous) => ({ ...previous, [activeProject]: true }));
  }, [activeProject]);
  return (
    <section className="flex flex-col gap-2 pb-4" id="sidebar-projects-tour">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-inter text-[10px] font-medium tracking-[0.1em] text-[#757575] dark:text-[#999999]">
          PROJETS
        </h3>
        <button
          onClick={() => setCreating(true)}
          aria-label="Créer un projet"
          className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-200/50 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-emerald-600 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <Plus size={15} />
        </button>
      </div>
      {isPending ? (
        <div role="status" className="space-y-2 px-2">
          <span className="sr-only">Chargement des projets</span>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-8 animate-pulse rounded-lg bg-gray-200/60 motion-reduce:animate-none dark:bg-white/5"
            />
          ))}
        </div>
      ) : isError ? (
        <button
          onClick={() => void refetch()}
          className="px-2 py-3 text-left text-xs text-gray-500"
        >
          Projets indisponibles. Réessayer
        </button>
      ) : !projects?.length ? (
        <div className="px-2 py-3">
          <p className="text-xs leading-relaxed text-gray-500">
            Vos projets et leurs parcelles apparaîtront ici.
          </p>
          <button
            onClick={() => setCreating(true)}
            className="mt-3 text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400"
          >
            Créer un premier projet
          </button>
        </div>
      ) : (
        <div className="space-y-1">
          {projects.map((project) => {
            const open = expanded[project.id] ?? activeProject === project.id;
            const active = activeProject === project.id;
            return (
              <div key={project.id}>
                <button
                  onClick={() =>
                    setExpanded((previous) => ({
                      ...previous,
                      [project.id]: !open,
                    }))
                  }
                  aria-expanded={open}
                  aria-controls={`project-pages-${project.id}`}
                  title={project.name}
                  className={`flex w-full min-w-0 items-center gap-2 rounded-lg px-2 py-2 text-left text-xs transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600 ${active ? "bg-gray-200/60 text-gray-900 dark:bg-white/5 dark:text-white" : "text-gray-600 hover:bg-gray-200/40 dark:text-gray-300 dark:hover:bg-white/5"}`}
                >
                  <ChevronRight
                    size={13}
                    className={`shrink-0 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-90" : ""}`}
                  />
                  <Folder size={15} className="shrink-0 text-gray-400" />
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {project.name}
                  </span>
                  {project.isFavorite && (
                    <Star
                      size={11}
                      aria-label="Favori"
                      className="shrink-0 fill-current text-gray-400"
                    />
                  )}
                </button>
                <div
                  id={`project-pages-${project.id}`}
                  hidden={!open}
                  className="ml-5 mt-1 border-l border-gray-200 pl-2 dark:border-white/10"
                >
                  {pages.map(({ path, label, icon: Icon }) => (
                    <NavLink
                      key={path}
                      to={`/projects/${project.id}/${path}`}
                      className={({ isActive }) =>
                        `my-0.5 flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${isActive ? "bg-emerald-50 font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" : "text-gray-500 hover:bg-gray-200/40 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"}`
                      }
                    >
                      <Icon size={13} />
                      {label}
                      {path === "plots" && (
                        <span className="ml-auto tabular-nums text-[10px] opacity-70">
                          {project.numberOfPlots}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {creating && <CreateProjectModal onClose={() => setCreating(false)} />}
    </section>
  );
}
