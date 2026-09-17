import { Card, Title, List, ListItem } from "@tremor/react";
import { MapPin, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPlotsOfProject } from "../../../../../requests/projects";

export interface ProjectPlot {
  id: string;
  plotId: string;
  plotBanId: string;
  adress: string;
  aiNotes?: string;
  coordinates: string;
  geometry: string;
}

export default function RecentPlots() {
  const { projectId } = useParams<{ projectId: string }>();

  const { data: plots = [], isPending: isPlotsPending } = useQuery<ProjectPlot[]>({
    queryKey: ["projectPlots", projectId],
    queryFn: () => getPlotsOfProject(projectId!),
    enabled: !!projectId,
  });
  
  return (
    <Card className="p-0 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl overflow-hidden flex flex-col">
      <div className="border-b border-gray-100 dark:border-white/5 px-5 py-3">
        <Title className="text-sm font-semibold text-gray-900 dark:text-white">Dernières parcelles</Title>
      </div>
      <div className="p-5 flex-1 overflow-y-auto max-h-72 scrollbar-custom">
        {isPlotsPending ? (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-[#999999] text-xs">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Chargement...
          </div>
        ) : plots.length > 0 ? (
          <List>
            {plots.slice(0, 4).map((plot) => (
              <ListItem key={plot.id} className="dark:border-white/5 py-3">
                <div className="flex items-start gap-3 truncate pr-2">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <div className="truncate">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {plot.adress || "Adresse non spécifiée"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-[#999999] mt-0.5">
                      BAN: {plot.plotBanId || plot.plotId}
                    </p>
                  </div>
                </div>
              </ListItem>
            ))}
          </List>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-[#999999] text-xs">
            Aucune parcelle ciblée.
          </div>
        )}
      </div>
    </Card>
  );
}