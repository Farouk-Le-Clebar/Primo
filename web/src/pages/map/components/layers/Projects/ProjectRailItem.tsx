import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { StarIcon } from "@heroicons/react/20/solid";
import type { ProjectResponse } from "../../../../../types/project/projects";
import { ROUTES } from "../../../../../constants/routes";
import { TONES, initialsOf, toneFor } from "../../../../projects/components/ui/palette";

type ProjectRailItemProps = {
  project: ProjectResponse;
  unread: number;
};

export default function ProjectRailItem({ project, unread }: ProjectRailItemProps) {
  const plotsLabel = `${project.numberOfPlots} parcelle${project.numberOfPlots > 1 ? "s" : ""}`;
  const tone = TONES[toneFor(project.id)];

  return (
    <NavLink
      to={ROUTES.project(project.id)}
      title={project.name}
      className={({ isActive }) =>
        `group relative flex items-center gap-2.5 rounded-[10px] p-2 transition-colors duration-150 ${isActive ? "bg-[#1c1c1e]/9 dark:bg-white/10" : "hover:bg-[#1c1c1e]/5 dark:hover:bg-white/6"}`
      }
    >
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:-rotate-6 ${tone.soft} ${tone.text}`}>
        {initialsOf(project.name)}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-[13px] font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{project.name}</span>
        <span className="text-[11px] text-[#82828c] tabular-nums">{plotsLabel}</span>
      </span>
      {project.isFavorite && !unread && <StarIcon className="h-3.5 w-3.5 shrink-0 text-amber-400" aria-label="Favori" />}
      {unread > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 600, damping: 18 }}
          className="shrink-0 rounded-full bg-red-500 px-[7px] py-0.5 text-[10px] font-bold text-white"
          aria-label={`${unread} nouveautés`}
        >
          {unread}
        </motion.span>
      )}
    </NavLink>
  );
}
