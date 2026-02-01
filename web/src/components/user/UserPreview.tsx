import { useQuery } from "@tanstack/react-query";

// COMPONENTS
import { getUserByMail } from "../../requests/UserRequests";

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

export default function UserInfo({ email }: { email: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", email],
    queryFn: () => getUserByMail(email),
    enabled: !!email,
  });

  if (!email) return null;

  if (isLoading) {
    return (
      <div className="flex bg-[#EFEFF4] w-full px-4 py-3 border border-gray-200 rounded-xl animate-pulse">
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
        <div className="ml-3 flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/2" />
          <div className="h-3 bg-gray-300 rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="px-4 py-3 border border-red-100 bg-red-50 rounded-xl text-red-600 text-sm">
        Utilisateur introuvable ou erreur de chargement.
      </div>
    );
  }

  const fileName = data.profilePicture || "green.png";
  const AvatarComponent = AVATAR_COMPONENTS[fileName] || PPGreen;

  return (
    <div className="flex items-center bg-[#EFEFF4] w-full px-4 py-3 border border-transparent rounded-xl transition-all duration-200">
      <div className="w-10 h-10 rounded-full overflow-hidden border border-white shadow-sm flex-shrink-0">
        <AvatarComponent className="w-full h-full" />
      </div>

      <div className="ml-3 flex flex-col min-w-0">
        <div className="flex gap-1.5 font-semibold text-gray-900 leading-tight">
          <p className="text-sm truncate">{data.firstName || "Prénom"}</p>
          <p className="text-sm truncate">{data.surName || "Nom"}</p>
        </div>
        <p className="text-xs text-gray-500 truncate mt-0.5">{data.email}</p>
      </div>
    </div>
  );
}