import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getUsersOfProject, inviteUserToProject, removeMemberFromProject } from "../../../../requests/projects";
import type { ProjectMember } from "../../../../types/project/members";

type RequestError = { message?: string };

export const memberName = (member: ProjectMember): string =>
  member.user ? `${member.user.firstName} ${member.user.surName}`.trim() || member.user.email : "Membre";

export function useMembers(projectId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = ["project", projectId, "members"];
  const { data: members = [], isPending } = useQuery<ProjectMember[]>({
    queryKey,
    queryFn: () => getUsersOfProject(projectId!),
    enabled: !!projectId,
  });
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({ queryKey: ["project", projectId] });
  };

  const invite = useMutation({
    mutationFn: (email: string) => inviteUserToProject(projectId!, email),
    onSuccess: () => {
      refresh();
      toast.success("Invitation envoyée");
    },
    onError: (error: RequestError) => toast.error(error?.message ?? "Invitation impossible"),
  });

  const remove = useMutation({
    mutationFn: (memberId: string) => removeMemberFromProject(projectId!, memberId),
    onSuccess: () => {
      refresh();
      toast.success("Membre retiré du projet");
    },
    onError: (error: RequestError) => toast.error(error?.message ?? "Action impossible"),
  });

  const active = members.filter((member) => !member.isPending);
  const pending = members.filter((member) => member.isPending);
  const canManage = members.find((member) => member.isCurrentUser)?.isAdmin ?? false;

  return { active, pending, isPending, canManage, invite, remove };
}
