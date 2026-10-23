import { useQuery } from "@tanstack/react-query";
import { getAdmins, getAllAdminUsers } from "../requests/admin";
import { getAllFeedbacks } from "../requests/feedback";
import type { AdminSectionPath } from "../pages/admin/adminSections";

const plural = (count: number | undefined, word: string): string =>
  count === undefined ? "…" : `${count} ${word}${count > 1 ? "s" : ""}`;

export function useAdminCounts(): Record<AdminSectionPath, string> {
  const users = useQuery({ queryKey: ["usersChart"], queryFn: getAllAdminUsers });
  const admins = useQuery({ queryKey: ["users", "get", "admins"], queryFn: () => getAdmins() });
  const feedbacks = useQuery({ queryKey: ["feedbacks"], queryFn: getAllFeedbacks });

  return {
    overview: "Statistiques de la plateforme",
    users: plural(users.data?.length, "compte"),
    admins: plural(admins.data?.length, "administrateur"),
    feedbacks: plural(feedbacks.data?.length, "retour"),
  };
}
