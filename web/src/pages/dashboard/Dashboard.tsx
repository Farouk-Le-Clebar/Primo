import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../../requests/projects";
import type { ProjectResponse } from "../../types/project/projects";
import CreateProjectModal from "../projects/CreateProjectModal";
import WorkspaceWelcome from "./components/WorkspaceWelcome";
import { Card } from "@tremor/react";
import StatsCards from "./components/StatsCards";
import PriceEvolutionChart from "./components/PriceEvolutionChart";
import UrbanZonesDonut from "./components/UrbanZonesDonut";
import BuildingTypologyChart from "./components/BuildingTypologyChart";
import RecentParcels from "./components/RecentParcels";
import RecentActivity from "./components/RecentActivity";

export default function Dashboard() {
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
  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#0A0A0A] px-4 pb-6 sm:px-6 font-inter">
      <main>
        {isPending ? (
          <div
            role="status"
            className="mb-6 h-52 animate-pulse rounded-xl bg-gray-100 motion-reduce:animate-none dark:bg-white/5"
          >
            <span className="sr-only">
              Chargement de votre espace de travail
            </span>
          </div>
        ) : isError ? (
          <div className="mb-6 rounded-xl border border-gray-200 p-6 text-sm text-gray-500 dark:border-white/10">
            Votre espace de travail est momentanément indisponible.{" "}
            <button
              onClick={() => void refetch()}
              className="font-medium text-emerald-700 underline dark:text-emerald-400"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <WorkspaceWelcome
            projects={projects || []}
            onCreate={() => setCreating(true)}
          />
        )}
        {!!projects?.length && (
          <div className="primo-dashboard-reveal">
            <Card className="p-0 border-gray-200 dark:border-white/10 ring-0 shadow-sm overflow-hidden rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-white/10">
                <div className="p-4 md:col-span-4 flex flex-col gap-4">
                  <StatsCards />
                </div>

                <div className="p-4 md:col-span-8 min-h-[300px] flex flex-col">
                  <PriceEvolutionChart />
                </div>
              </div>
            </Card>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Card className="p-0 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl overflow-hidden">
                <div className="border-b border-gray-200 dark:border-white/10 px-6 py-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Répartition des zones d'urbanisme
                  </h3>
                </div>
                <div className="h-64 p-4">
                  <UrbanZonesDonut />
                </div>
              </Card>

              <Card className="p-0 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl overflow-hidden">
                <div className="border-b border-gray-200 dark:border-white/10 px-6 py-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Typologie des bâtiments (BdTopo)
                  </h3>
                </div>
                <div className="h-64 p-4">
                  <BuildingTypologyChart />
                </div>
              </Card>

              <Card className="p-0 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl overflow-hidden">
                <div className="border-b border-gray-200 dark:border-white/10 px-6 py-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Dernières parcelles ajoutées
                  </h3>
                </div>
                <div className="h-72 p-4">
                  <RecentParcels />
                </div>
              </Card>

              <Card className="p-0 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl overflow-hidden ">
                <div className="border-b border-gray-200 dark:border-white/10 px-6 py-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Activité récente
                  </h3>
                </div>
                <div className="h-72 p-4">
                  <RecentActivity />
                </div>
              </Card>
            </div>
          </div>
        )}
        {creating && <CreateProjectModal onClose={() => setCreating(false)} />}
      </main>
    </div>
  );
}
