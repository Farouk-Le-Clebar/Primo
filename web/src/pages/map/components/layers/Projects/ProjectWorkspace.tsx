import { useEffect } from "react";
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "../../../../../requests/projects";
import { rememberProjectPage } from "../../../../../utils/recentWork";

const TABS = [
  { path: "dashboard", label: "Vue d'ensemble" },
  { path: "plots", label: "Parcelles" },
  { path: "members", label: "Membres" },
  { path: "documents", label: "Documents" },
];

export default function ProjectWorkspace() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isPending } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId!),
    enabled: !!projectId,
  });
  const { pathname } = useLocation();

  useEffect(() => rememberProjectPage(pathname), [pathname]);

  return (
    <>
      <header className="primo-page-enter shrink-0 border-b border-black/[0.06] px-6 pt-5 pr-14 dark:border-white/10">
        {isPending ? (
          <div className="h-7 w-48 animate-pulse rounded-md bg-black/[0.05] motion-reduce:animate-none dark:bg-white/10" />
        ) : (
          <h2 className="truncate text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{project?.name}</h2>
        )}
        {project?.description && (
          <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">{project.description}</p>
        )}
        <div className="mt-4 flex gap-6">
          {TABS.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `-mb-px border-b-2 pb-3 text-sm transition-colors duration-150 ${isActive ? "border-gray-900 font-medium text-gray-900 dark:border-white dark:text-white" : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </header>
      <div key={pathname} className="primo-page-enter scrollbar-glass relative flex min-h-0 flex-1 flex-col overflow-y-auto">
        <Outlet />
      </div>
    </>
  );
}
