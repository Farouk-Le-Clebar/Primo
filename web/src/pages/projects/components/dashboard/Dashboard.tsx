import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from '@tremor/react';

// Components
import LoadingPrimoLogo from "../../../../components/animations/LoadingPrimoLogo";
import { getProjectById } from "../../../../requests/projects";

// Dashboard components
import ProjectKPIs from "./components/ProjectKPIs";
import ValuationChart from "./components/ValuationChart";
import RecentPlots from "./components/RecentPlots";
import ZoningChart from "./components/ZoningChart";
import ProjectTeam from "./components/ProjectTeam";
import ProjectNotes from "./components/ProjectNotes";

export default function DashboardProjects() {
  const { projectId } = useParams<{ projectId: string }>();

  const { data: project, isPending: isProjectPending } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId!),
    enabled: !!projectId,
  });

  if (isProjectPending) {
    return (
      <div className="flex items-center justify-center w-full min-h-[600px] bg-transparent dark:bg-[#0A0A0A]">
        <LoadingPrimoLogo className="h-10 w-10 dark:invert" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-transparent dark:bg-[#0A0A0A] p-6 sm:p-10 font-inter overflow-y-auto scrollbar-custom">
      <main>

        <Card className="p-0 border-gray-200 dark:border-white/10 ring-0 shadow-sm overflow-hidden rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-white/5">
            <div className="p-5 md:col-span-4 flex flex-col justify-between gap-6 dark:bg-[#111111]/20">
              <ProjectKPIs 
                plotsCount={project?.numberOfPlots || 0} 
                membersCount={project?.numberOfMembers || 1} 
                createdAt={project?.createdAt} 
              />
            </div>
            <div className="p-5 md:col-span-8 min-h-[320px] flex flex-col justify-between dark:bg-[#111111]/40">
              <ValuationChart />
            </div>
          </div>
        </Card>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <RecentPlots />
          <ProjectNotes notes={project?.notes} />
          <ZoningChart plotsCount={project?.numberOfPlots || 0} />
          <ProjectTeam />
        </div>
      </main>
    </div>
  );
}