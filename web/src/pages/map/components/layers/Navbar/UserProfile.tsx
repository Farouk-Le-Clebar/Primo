// ASSETS
import PPGreen from "../../../../../assets/profilePictures/green.svg?react";
import PPCyan from "../../../../../assets/profilePictures/cyan.svg?react";
import PPBlue from "../../../../../assets/profilePictures/blue.svg?react";
import PPOrange from "../../../../../assets/profilePictures/orange.svg?react";
import PPpink from "../../../../../assets/profilePictures/pink.svg?react";
import PPRed from "../../../../../assets/profilePictures/red.svg?react";
import PPWhite from "../../../../../assets/profilePictures/white.svg?react";
import PPWhitePink from "../../../../../assets/profilePictures/whitepink.svg?react";
import PPYellow from "../../../../../assets/profilePictures/yellow.svg?react";

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
    <div className="flex h-full w-full items-center justify-end gap-2 mr-10">
      <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
        <AvatarComponent className="w-full h-full" />
      </div>

      <div className="flex flex-col min-w-0">
        {/* Faudras le changer par le psuedo plus tard */}
        <div className="font-inter font-bold text-xs text-gray-800 truncate leading-none">
          {user.firstName || "Pas de pseudo"}
        </div>

        <div className="font-inter font-medium text-xs text-gray-500 truncate leading-none mt-0.5">
          {user.firstName && user.surName 
            ? truncate(`${user.firstName} ${user.surName}`, 15) 
            : "Pas de nom"}
        </div>
      </div>
    </div>
  );
}