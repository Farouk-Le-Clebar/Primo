import { Link } from "react-router-dom";
import { Card } from "@tremor/react";
import { Trash2 } from "lucide-react";
import Avatar from "../../../../components/avatar/Avatar";
import type { UserType } from "../../../../types/admin";
import { formatRelative, getActivityStatus } from "../shared/userActivity";
import { ROUTES } from "../../../../constants/routes";

type UserCardProps = {
  user: UserType;
  isDeletePending: boolean;
  onDelete: (userId: string) => void;
};

const CONFIRM_MESSAGE = "Êtes-vous sûr de vouloir supprimer cet utilisateur ?";

export default function UserCard({ user, isDeletePending, onDelete }: UserCardProps) {
  const status = getActivityStatus(user.lastConnection);
  const fullName = `${user.firstName} ${user.surName}`.trim() || "Utilisateur";

  const handleDelete = () => {
    if (window.confirm(CONFIRM_MESSAGE)) onDelete(user.id);
  };

  return (
    <Card className="group relative flex flex-col gap-4 rounded-xl border-gray-200 p-4 shadow-sm ring-0 transition-colors duration-150 hover:border-gray-300 dark:border-white/10 dark:hover:border-white/20">
      <div className="flex items-start gap-3">
        <Avatar profilePicture={user.profilePicture} size="h-10 w-10" />
        <div className="min-w-0 flex-1">
          <Link
            to={ROUTES.adminUser(user.id)}
            className="block truncate text-sm font-medium text-gray-900 after:absolute after:inset-0 after:content-[''] dark:text-white"
          >
            {fullName}
          </Link>
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeletePending}
          aria-label={`Supprimer ${fullName}`}
          className="relative z-10 rounded-lg p-1.5 text-gray-400 opacity-0 transition-all duration-150 hover:bg-red-50 hover:text-red-500 focus-visible:opacity-100 group-hover:opacity-100 cursor-pointer dark:hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-gray-200 pt-3 text-xs dark:border-white/10">
        <span className={`inline-flex items-center gap-1.5 font-medium ${status.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
          {status.label}
        </span>
        <span className="flex items-center gap-2 text-gray-500 dark:text-gray-500">
          {user.isAdmin && <span className="rounded-md bg-gray-100 px-1.5 py-0.5 dark:bg-white/5">Admin</span>}
          <span className="tabular-nums">{formatRelative(user.lastConnection)}</span>
        </span>
      </div>
    </Card>
  );
}
