// ASSETS
import PPGreen from "../../../../assets/profilePictures/green.svg?react";
import PPCyan from "../../../../assets/profilePictures/cyan.svg?react";
import PPBlue from "../../../../assets/profilePictures/blue.svg?react";
import PPOrange from "../../../../assets/profilePictures/orange.svg?react";
import PPpink from "../../../../assets/profilePictures/pink.svg?react";
import PPRed from "../../../../assets/profilePictures/red.svg?react";
import PPWhite from "../../../../assets/profilePictures/white.svg?react";
import PPWhitePink from "../../../../assets/profilePictures/whitepink.svg?react";
import PPYellow from "../../../../assets/profilePictures/yellow.svg?react";

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

export default function UserProfileDropdown() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const profilePictureValue = user?.profilePicture || "green.png";
  const isExternalUrl = profilePictureValue.startsWith("http");
  const AvatarComponent = AVATAR_COMPONENTS[profilePictureValue] || PPGreen;

  return (
    <div className="relative w-full flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-100 shadow-sm flex-shrink-0 bg-white">
        {isExternalUrl ? (
          <img 
            src={profilePictureValue} 
            alt={`Profil de ${user.firstName || 'utilisateur'}`} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <AvatarComponent className="w-full h-full" />
        )}
      </div>

      <div className="flex flex-col items-start text-left min-w-0 flex-1">
        <div className="font-inter font-medium text-sm text-gray-800 truncate leading-tight w-full">
          {user.firstName || "Utilisateur"}
        </div>
        <div className="font-inter font-normal text-xs text-gray-500 truncate leading-none w-full mt-0.5">
          {user.email || "email@exemple.com"}
        </div>
      </div>
    </div>
  );
}