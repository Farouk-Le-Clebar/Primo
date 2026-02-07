// ASSETS
import PPGreen from "../../assets/profilePictures/green.svg?react";
import PPCyan from "../../assets/profilePictures/cyan.svg?react";
import PPBlue from "../../assets/profilePictures/blue.svg?react";
import PPOrange from "../../assets/profilePictures/orange.svg?react";
import PPpink from "../../assets/profilePictures/pink.svg?react";
import PPRed from "../../assets/profilePictures/red.svg?react";
import PPWhite from "../../assets/profilePictures/white.svg?react";
import PPWhitePink from "../../assets/profilePictures/whitepink.svg?react";
import PPYellow from "../../assets/profilePictures/yellow.svg?react";

// Dictionnaire des avatars
const AVATAR_COMPONENTS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  "green.png": PPGreen,
  "cyan.png": PPCyan,
  "blue.png": PPBlue,
  "orange.png": PPOrange,
  "pink.png": PPpink,
  "red.png": PPRed,
  "white.png": PPWhite,
  "whitepink.png": PPWhitePink,
  "yellow.png": PPYellow,
};

export default function UserProfile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const truncate = (str: string, max: number) => {
    if (!str) return "";
    return str.length > max ? str.slice(0, max) + "..." : str;
  };

  const fileName = user?.profilePicture || "green.png";
  const AvatarComponent = AVATAR_COMPONENTS[fileName] || PPGreen;

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