import { useEffect } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { ROUTES } from "../../../../../constants/routes";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "../../../../../requests/projects";
import type { ProjectResponse } from "../../../../../types/project/projects";
import { rememberProjectPage } from "../../../../../utils/recentWork";
import { usePageTour } from "../../../../../hooks/usePageTour";
import ProjectHeader from "./ProjectHeader";
import ProjectTabs from "./ProjectTabs";

export default function ProjectWorkspace() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isPending } = useQuery<ProjectResponse>({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId!),
    enabled: !!projectId,
  });
  const { pathname } = useLocation();
  usePageTour("project", !!project);

  useEffect(() => rememberProjectPage(pathname), [pathname]);

  return (
    <div className="scrollbar-glass flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-4 pb-8 md:px-8 md:pt-6">
      <header className="primo-page-enter shrink-0">
        <Link to={ROUTES.projects} className="mb-3 flex w-fit items-center gap-1 text-[13px] font-medium text-[#82828c] md:hidden">
          <ChevronLeft className="h-4 w-4" />
          Projets
        </Link>
        {isPending || !project ? (
          <div className="h-[49px] w-72 animate-pulse rounded-lg bg-[#1c1c1e]/5 motion-reduce:animate-none dark:bg-white/10" />
        ) : (
          <ProjectHeader project={project} />
        )}
        {projectId && <ProjectTabs projectId={projectId} />}
      </header>
      <div key={pathname} className="primo-page-enter relative flex min-h-0 flex-1 flex-col pt-5">
        <Outlet />
      </div>
    </div>
  );
}
