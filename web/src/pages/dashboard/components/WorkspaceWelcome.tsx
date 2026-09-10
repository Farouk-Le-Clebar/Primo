import { Card } from "@tremor/react";
import { ArrowUpRight, FolderOpen, Map, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import type { ProjectResponse } from "../../../types/project/projects";
import { getRecentWork } from "../../../utils/recentWork";

const action =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600";

export default function WorkspaceWelcome({
  projects,
  onCreate,
}: {
  projects: ProjectResponse[];
  onCreate: () => void;
}) {
  const recent = getRecentWork();
  const lastProject = projects.find(
    (project) => project.id === recent?.projectId,
  );
  const project = lastProject || projects[0];
  const page = lastProject ? recent!.page : "dashboard";
  const pageLabel = {
    dashboard: "Vue d’ensemble",
    plots: "Parcelles",
    members: "Membres",
  }[page];
  const empty = projects.length === 0;

  return (
    <Card className="mb-6 rounded-xl border-gray-200  p-5 shadow-sm ring-0 dark:border-white/10 dark:bg-[#171717] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Votre espace de travail
          </p>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {empty ? "Bienvenue sur Primo" : "Reprendre mon travail"}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            {empty
              ? "Tout commence par un lieu. Explorez la carte, créez votre premier projet et rassemblez les parcelles qui vous intéressent."
              : "Retrouvez vos projets et poursuivez votre exploration."}
          </p>
        </div>
        {!empty && (
          <button
            onClick={onCreate}
            className={`${action} border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5`}
          >
            <Plus size={16} />
            Nouveau projet
          </button>
        )}
      </div>
      {empty ? (
        <>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onCreate}
              className={`${action} bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-200`}
            >
              <Plus size={16} />
              Créer mon premier projet
            </button>
            <Link
              to="/search"
              className={`${action} border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5`}
            >
              <Map size={16} />
              Explorer la carte
            </Link>
          </div>
          <ol className="mt-8 grid gap-4 border-t border-gray-100 pt-5 dark:border-white/5 sm:grid-cols-3">
            {[
              "Créez un projet pour votre recherche",
              "Enregistrez vos parcelles favorites",
              "Invitez votre équipe à collaborer",
            ].map((text, index) => (
              <li
                key={text}
                className="flex items-center gap-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-600 dark:bg-white/5 dark:text-gray-300">
                  {index + 1}
                </span>
                {text}
              </li>
            ))}
          </ol>
        </>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link
            to={`/projects/${project.id}/${page}`}
            className="group flex min-w-0 items-center gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:border-emerald-400 hover:bg-emerald-50/30 focus-visible:outline-2 focus-visible:outline-emerald-600 dark:border-white/10 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20"
          >
            <FolderOpen
              size={22}
              className="shrink-0 text-emerald-600 dark:text-emerald-400"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">
                {lastProject ? "Dernier projet consulté" : "Votre projet"}
              </p>
              <p
                className="mt-1 truncate text-sm font-semibold text-gray-900 dark:text-white"
                title={project.name}
              >
                {project.name}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {pageLabel} · {project.numberOfPlots} parcelle
                {project.numberOfPlots !== 1 ? "s" : ""}
              </p>
            </div>
            <ArrowUpRight
              size={16}
              className="shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
            />
          </Link>
          <Link
            to="/search"
            className="group flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:border-emerald-400 hover:bg-emerald-50/30 focus-visible:outline-2 focus-visible:outline-emerald-600 dark:border-white/10 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20"
          >
            <Map size={22} className="shrink-0 text-gray-500" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Explorer la carte
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Une nouvelle adresse, une nouvelle possibilité.
              </p>
            </div>
            <ArrowUpRight size={16} className="text-gray-400" />
          </Link>
        </div>
      )}
    </Card>
  );
}
