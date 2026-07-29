import PPGreen from "../../../../../assets/profilePictures/green.svg?react";
import PPCyan from "../../../../../assets/profilePictures/cyan.svg?react";
import PPBlue from "../../../../../assets/profilePictures/blue.svg?react";
import PPOrange from "../../../../../assets/profilePictures/orange.svg?react";
import PPpink from "../../../../../assets/profilePictures/pink.svg?react";
import PPRed from "../../../../../assets/profilePictures/red.svg?react";
import PPWhite from "../../../../../assets/profilePictures/white.svg?react";
import PPWhitePink from "../../../../../assets/profilePictures/whitepink.svg?react";
import PPYellow from "../../../../../assets/profilePictures/yellow.svg?react";
import type { UserType } from "../../../../../types/admin";

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

export default function UserProfileHeader({ user }: { user: UserType }) {
  const profilePictureValue = user?.profilePicture || "green.png";
  const isExternalUrl = profilePictureValue.startsWith("http");
  const AvatarComponent = AVATAR_COMPONENTS[profilePictureValue] || PPGreen;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm flex-shrink-0 bg-white">
          {isExternalUrl ? (
            <img 
              src={profilePictureValue} 
              alt={`Profil de ${user.firstName}`} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <AvatarComponent className="w-full h-full" />
          )}
        </div>
        
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {user.firstName} {user.surName}
          </h1>
          <p className="text-sm font-normal text-gray-500 dark:text-[#999999] mt-1">
            {user.email}
          </p>
        </div>
      </div>

      
    </div>
  );
}