import { useState, useEffect } from "react";
import profilePlaceholder from "../../assets/images/profile.png";

interface UserProfileProps {
  user: {
    email?: string;
    profilePicture?: string;
    firstName?: string;
    surName?: string;
  } | null;
}

export default function UserProfile({ user }: UserProfileProps) {
  const [userData, setUserData] = useState(user);

  useEffect(() => {
    if (user) setUserData(user);
  }, [user]);

  function truncate(str: string, max: number) {
    if (!str) return "";
    return str.length > max ? str.slice(0, max) + "..." : str;
  }

  return (
    <div className="flex h-full w-full items-center gap-2">
      <img
        src={userData?.profilePicture || profilePlaceholder}
        alt="User profile"
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <div className="text-sm font-semibold text-gray-800">
          {truncate(`${userData?.firstName || ""} ${userData?.surName || ""}`, 18)}
        </div>

        <div className="text-xs text-gray-500">{userData?.email}</div>
      </div>
    </div>
  );
}
