import { UserX } from "lucide-react";
import EmptyState from "../../../../ui/EmptyState";
import type { UserType } from "../../../../types/admin";
import UserCard from "./UserCard";

type UsersGridProps = {
  users: UserType[];
  isWorking: boolean;
  isDeletePending: boolean;
  onDelete: (userId: string) => void;
};

export default function UsersGrid({ users, isWorking, isDeletePending, onDelete }: UsersGridProps) {
  if (!users.length && !isWorking)
    return <EmptyState icon={UserX} title="Aucun utilisateur trouvé" description="Modifiez la recherche ou les filtres pour élargir la liste." />;

  return (
    <div className="primo-stagger grid grid-cols-1 gap-3 @xl:grid-cols-2 @4xl:grid-cols-3">
      {users.map((user) => (
        <UserCard key={user.id} user={user} isDeletePending={isDeletePending} onDelete={onDelete} />
      ))}
    </div>
  );
}
