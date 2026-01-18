import { useSelector } from "react-redux";

// COMPONENTS
import type { RootState } from "../../store/store";

// ASSETS
import profilePlaceholder from "../../assets/profilePictures/green.png";

interface UserProfileProps {
  user?: any; 
}

export default function UserProfile({ user: userProp }: UserProfileProps) {
  const reduxUserInfo = useSelector((state: RootState) => state.user.userInfo);

  const activeUser = userProp || reduxUserInfo?.user || reduxUserInfo;

  const getAvatarUrl = (name: string | undefined) => {
    const fileName = name || "green.png";
    try {
      return new URL(`../../assets/profilePictures/${fileName}`, import.meta.url).href;
    } catch (e) {
      return profilePlaceholder;
    }
  };

  const truncate = (str: string, max: number) => {
    if (!str) return "";
    return str.length > max ? str.slice(0, max) + "..." : str;
  };

  return (
    <div className="flex h-full w-full items-center gap-3">
      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
        <img
          src={getAvatarUrl(activeUser?.profilePicture)}
          alt="User profile"
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = profilePlaceholder)}
        />
      </div>

      <div className="flex flex-col min-w-0">
        <div className="text-sm font-semibold text-gray-800 truncate">
          {activeUser?.firstName || activeUser?.surName 
            ? truncate(`${activeUser.firstName || ""} ${activeUser.surName || ""}`, 18)
            : "Utilisateur"}
        </div>

        <div className="text-xs text-gray-500 truncate">
          {activeUser?.email || "Pas d'email"}
        </div>
      </div>
    </div>
  );
}