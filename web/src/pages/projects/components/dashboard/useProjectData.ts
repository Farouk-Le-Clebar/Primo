import { useQuery } from "@tanstack/react-query";
import { getPlotsOfProject } from "../../../../requests/projects";
import { getProjectNotes } from "../../../../requests/notes";
import type { ProjectPlotWithSummary } from "../../../../types/project/plots";
import type { ProjectNote } from "../../../../types/project/notes";

export function useProjectPlots(projectId: string | undefined) {
  return useQuery<ProjectPlotWithSummary[]>({
    queryKey: ["projectPlots", projectId],
    queryFn: () => getPlotsOfProject(projectId!),
    enabled: !!projectId,
  });
}

export function useProjectNotes(projectId: string | undefined) {
  return useQuery<ProjectNote[]>({
    queryKey: ["project", projectId, "notes"],
    queryFn: () => getProjectNotes(projectId!),
    enabled: !!projectId,
  });
}
