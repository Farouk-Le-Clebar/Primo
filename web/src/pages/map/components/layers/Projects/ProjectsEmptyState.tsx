import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, FolderPlus, MapPin, StickyNote, UsersRound } from "lucide-react";
import { getProjects } from "../../../../../requests/projects";
import type { ProjectResponse } from "../../../../../types/project/projects";
import CreateProjectModal from "../../../../projects/CreateProjectModal";

const FEATURES = [
  { icon: MapPin, label: "Parcelles enrichies", detail: "Prix DVF, DPE, PLU et risques" },
  { icon: UsersRound, label: "Travail d’équipe", detail: "Nouveautés à chaque connexion" },
  { icon: FileText, label: "Documents partagés", detail: "Mandats, diagnostics, plans" },
  { icon: StickyNote, label: "Notes de suivi", detail: "Visites, vendeurs, syndics" },
];

export default function ProjectsEmptyState() {
  const [creating, setCreating] = useState(false);
  const { data: projects = [] } = useQuery<ProjectResponse[]>({ queryKey: ["projects"], queryFn: getProjects });
  const hasProjects = projects.length > 0;

  return (
    <div className="flex flex-1 flex-col justify-center px-6 md:px-12">
      <p className="animate-rise-in text-[11px] font-medium uppercase tracking-[0.12em] text-[#82828c]">Espace projet</p>
      <h2 className="animate-rise-in mt-3 max-w-md text-2xl font-semibold tracking-tight text-[#1c1c1e] [animation-delay:60ms] dark:text-[#fafafa]">
        {hasProjects ? "Choisissez un projet pour l’ouvrir à côté de la carte." : "Créez votre premier projet."}
      </h2>
      <p className="animate-rise-in mt-3 max-w-md text-[13px] leading-relaxed text-[#82828c] [animation-delay:120ms]">
        Vue d’ensemble, parcelles, membres et documents restent accessibles sans quitter votre zone d’étude.
      </p>
      <div className="mt-6 grid max-w-xl grid-cols-2 gap-2.5">
        {FEATURES.map(({ icon: Icon, label, detail }, index) => (
          <div key={label} style={{ animationDelay: `${180 + index * 60}ms` }} className="primo-card animate-rise-in group flex items-center gap-3 p-3 transition-transform duration-200 hover:-translate-y-0.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1c1c1e]/6 text-[#1c1c1e] transition-transform duration-300 group-hover:-rotate-8 group-hover:scale-110 dark:bg-white/8 dark:text-white">
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="flex flex-col">
              <span className="text-[13px] font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{label}</span>
              <span className="text-[11px] text-[#82828c]">{detail}</span>
            </span>
          </div>
        ))}
      </div>
      <button onClick={() => setCreating(true)} className="animate-rise-in group mt-6 flex w-fit items-center gap-1.5 rounded-lg bg-[#1c1c1e] px-4 py-2.5 text-[13px] font-semibold text-white transition-transform [animation-delay:420ms] hover:scale-[1.02] active:scale-95 dark:bg-white dark:text-[#1c1c1e]">
        <FolderPlus className="h-4 w-4 transition-transform group-hover:scale-110" />
        {hasProjects ? "Nouveau projet" : "Créer un projet"}
      </button>
      {creating && <CreateProjectModal onClose={() => setCreating(false)} />}
    </div>
  );
}
