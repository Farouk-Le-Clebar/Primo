import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createProjectMilestone,
  deleteProjectMilestone,
  getProjectMilestones,
  updateProjectMilestone,
} from "../../../../requests/milestones";
import type { CreateMilestonePayload, ProjectMilestone } from "../../../../types/project/milestones";

type RequestError = { message?: string | string[] };

export const MILESTONE_TEMPLATES = ["Repérage des parcelles", "Visite sur place", "Offre envoyée au vendeur", "Compromis signé", "Acte notarié signé"];

const errorMessage = (error: RequestError): string =>
  (Array.isArray(error?.message) ? error.message[0] : error?.message) ?? "Action impossible";

export function useMilestones(projectId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = ["project", projectId, "milestones"];
  const { data: milestones = [], isPending } = useQuery<ProjectMilestone[]>({
    queryKey,
    queryFn: () => getProjectMilestones(projectId!),
    enabled: !!projectId,
  });
  const refresh = () => queryClient.invalidateQueries({ queryKey });
  const onError = (error: RequestError) => toast.error(errorMessage(error));

  const create = useMutation({
    mutationFn: (payload: CreateMilestonePayload) => createProjectMilestone(projectId!, payload),
    onSuccess: () => {
      refresh();
      toast.success("Jalon ajouté");
    },
    onError,
  });

  const addTemplates = useMutation({
    mutationFn: async () => {
      for (const title of MILESTONE_TEMPLATES) await createProjectMilestone(projectId!, { title });
    },
    onSettled: refresh,
    onError,
  });

  const toggle = useMutation({
    mutationFn: (milestone: ProjectMilestone) => updateProjectMilestone(projectId!, milestone.id, { isCompleted: !milestone.isCompleted }),
    onSuccess: (saved) => {
      refresh();
      if (saved.isCompleted) toast.success("Jalon validé");
    },
    onError,
  });

  const remove = useMutation({
    mutationFn: (milestoneId: string) => deleteProjectMilestone(projectId!, milestoneId),
    onSuccess: refresh,
    onError,
  });

  const completed = milestones.filter((milestone) => milestone.isCompleted).length;

  return {
    milestones,
    isPending,
    completed,
    progress: milestones.length ? Math.round((completed / milestones.length) * 100) : 0,
    nextMilestone: milestones.find((milestone) => !milestone.isCompleted) ?? null,
    create,
    addTemplates,
    toggle,
    remove,
  };
}
