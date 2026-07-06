import { Card, Title, List, ListItem } from "@tremor/react";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUsersOfProject } from "../../../../../requests/projects";

export interface ProjectMember {
  id: string;
  role: string;
  isAdmin: boolean;
  joinedAt: string;
  user: {
    firstName: string;
    surName: string;
    email: string;
  };
}

export default function ProjectTeam() {
  const { projectId } = useParams<{ projectId: string }>();

  const { data: members = [], isPending: isMembersPending } = useQuery<ProjectMember[]>({
    queryKey: ["project", projectId, "members"],
    queryFn: () => getUsersOfProject(projectId!),
    enabled: !!projectId,
  });

  return (
    <Card className="p-0 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl overflow-hidden flex flex-col">
      <div className="border-b border-gray-100 dark:border-white/5 px-5 py-3">
        <Title className="text-sm font-semibold text-gray-900 dark:text-white">Équipe</Title>
      </div>
      <div className="p-5 flex-1 overflow-y-auto max-h-72 scrollbar-custom">
        {isMembersPending ? (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-[#999999] text-xs">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Chargement...
          </div>
        ) : members.length > 0 ? (
          <List>
            {members.slice(0, 4).map((member) => (
              <ListItem key={member.id} className="dark:border-white/5 py-3">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 flex items-center justify-center font-medium text-xs shrink-0 border border-gray-200 dark:border-white/10">
                    {member.user?.firstName?.[0] || ""}{member.user?.surName?.[0] || ""}
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                      {member.user?.firstName} {member.user?.surName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-[#999999] truncate">
                      {member.user?.email}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-[#999999]">
                  {member.isAdmin ? "Admin" : "Membre"}
                </span>
              </ListItem>
            ))}
          </List>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-[#999999] text-xs">
            Aucun membre.
          </div>
        )}
      </div>
    </Card>
  );
}