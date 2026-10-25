import { ChevronRightIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import { getAvatarComponent } from "../../../../../../components/avatar/Avatar";
import { readStoredUser } from "../../../../../../hooks/useStoredUser";

type UserMenuHeaderProps = {
  onOpenProfile: () => void;
};

export default function UserMenuHeader({ onOpenProfile }: UserMenuHeaderProps) {
  const user = readStoredUser();
  const profilePicture = user.profilePicture || "green.png";
  const isExternalUrl = profilePicture.startsWith("http");
  const AvatarComponent = getAvatarComponent(profilePicture);
  const fullName = `${user.firstName ?? ""} ${user.surName ?? ""}`.trim() || "Utilisateur";

  return (
    <div className="flex flex-col gap-3 px-3 pt-2 pb-3">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-black/5 dark:ring-white/10">
          {isExternalUrl ? (
            <img src={profilePicture} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <AvatarComponent className="h-full w-full" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight text-gray-900 dark:text-white">{fullName}</p>
          <p className="mt-0.5 truncate text-xs leading-tight text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
      </div>
      <button
        type="button"
        role="menuitem"
        onClick={onOpenProfile}
        className="group flex h-8 w-full items-center gap-2 rounded-lg bg-black/[0.04] px-2.5 text-xs font-medium text-gray-900 transition-colors hover:bg-black/[0.07] cursor-pointer dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.1]"
      >
        <UserCircleIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
        <span className="flex-1 text-left">Voir mon profil</span>
        <ChevronRightIcon className="h-4 w-4 text-gray-400 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
      </button>
    </div>
  );
}
