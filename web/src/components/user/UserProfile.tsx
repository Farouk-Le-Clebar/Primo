// ASSETS
import { getAvatarComponent } from "../avatar/Avatar";

export default function UserProfile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const truncate = (str: string, max: number) => {
    if (!str) return "";
    return str.length > max ? str.slice(0, max) + "..." : str;
  };

  const fileName = user?.profilePicture || "green.png";
  const AvatarComponent = getAvatarComponent(fileName);

  return (
    <div className="flex h-full w-full items-center gap-3">
      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
        <AvatarComponent className="w-full h-full" />
      </div>

      <div className="flex flex-col min-w-0">
        <div className="text-sm font-semibold text-gray-800 truncate">
          {user.firstName || user.surName
            ? truncate(`${user.firstName || ""} ${user.surName || ""}`, 18)
            : "Utilisateur"}
        </div>

        <div className="text-xs text-gray-500 truncate">
          {user.email || "Pas d'email"}
        </div>
      </div>
    </div>
  );
}