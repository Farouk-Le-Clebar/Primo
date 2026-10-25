import { NavLink } from "react-router-dom";
import { StarIcon } from "@heroicons/react/20/solid";
import type { ProjectResponse } from "../../../../../types/project/projects";
import { ROUTES } from "../../../../../constants/routes";

type ProjectRailItemProps = {
  project: ProjectResponse;
};

const getInitials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

export default function ProjectRailItem({ project }: ProjectRailItemProps) {
  const plotsLabel = `${project.numberOfPlots} parcelle${project.numberOfPlots > 1 ? "s" : ""}`;

  return (
    <NavLink
      to={ROUTES.project(project.id)}
      title={project.name}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors duration-150 text-gray-900 dark:text-white ${isActive ? "glass-selected" : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"}`
      }
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/[0.05] text-xs font-semibold tracking-wide group-aria-[current=page]:bg-black/[0.08] dark:bg-white/10 dark:group-aria-[current=page]:bg-white/[0.14]">
        {getInitials(project.name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{project.name}</span>
        <span className="block text-xs text-gray-500 tabular-nums dark:text-gray-400">
          {plotsLabel}
        </span>
      </span>
      {project.isFavorite && <StarIcon className="h-3.5 w-3.5 shrink-0 text-amber-400" aria-label="Favori" />}
    </NavLink>
  );
}
