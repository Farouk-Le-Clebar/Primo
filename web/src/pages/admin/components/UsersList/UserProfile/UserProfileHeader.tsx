import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge, Card } from "@tremor/react";
import Avatar from "../../../../../components/avatar/Avatar";
import type { UserType } from "../../../../../types/admin";
import { adminCardClass, formatDate } from "../../shared/statistics";

export default function UserProfileHeader({ user }: { user: UserType }) {
  const details = [
    ["Inscription", formatDate(user.createdAt)],
    ["Dernière connexion", formatDate(user.lastConnection)],
    ["Authentification", user.provider || "Non renseignée"],
    [
      "Adresse email",
      user.verified === undefined
        ? "Statut non renseigné"
        : user.verified
          ? "Vérifiée"
          : "Non vérifiée",
    ],
  ];
  return (
    <header>
      <Link
        to="/admin/dashboard"
        className="mb-5 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:hover:text-white"
      >
        <ArrowLeft size={16} /> Administration
      </Link>
      <Card className={`${adminCardClass} p-5 sm:p-6`}>
        <div className="flex flex-wrap items-center gap-4">
          <Avatar profilePicture={user.profilePicture} size="h-16 w-16" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Fiche utilisateur
            </p>
            <h1 className="mt-1 break-words text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {`${user.firstName} ${user.surName}`.trim() || "Utilisateur"}
            </h1>
            <p className="mt-1 break-all text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
          <Badge
            className="!bg-gray-100 !text-gray-700 dark:!bg-white/10 dark:!text-gray-200"
            color={user.isAdmin ? "emerald" : "gray"}
          >
            {user.isAdmin ? "Administrateur" : "Utilisateur"}
          </Badge>
        </div>
        <dl className="mt-6 grid grid-cols-1 gap-5 border-t border-gray-100 pt-5 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-4">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-gray-500 dark:text-gray-400">
                {label}
              </dt>
              <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 break-all text-xs text-gray-400">
          Identifiant : <span className="font-mono">{user.id}</span>
        </p>
      </Card>
    </header>
  );
}
